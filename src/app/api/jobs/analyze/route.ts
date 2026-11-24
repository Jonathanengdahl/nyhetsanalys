import Anthropic from "@anthropic-ai/sdk";
import { webSearchUsdPerSearch, usdToSek } from "@/config/ai";
import { analysisConfig, analysisEnabled } from "@/config/analysis";
import { topics as localTopics } from "@/content/topics";
import { feeds } from "@/content/feeds";
import { draftJsonSchema } from "@/lib/analysis/draft";
import { researchInstructions, researchMessage, writeInstructions } from "@/lib/analysis/prompt";
import { readResearch } from "@/lib/analysis/research";
import { analysisRun } from "@/lib/analysis/run";
import { supabaseAnalysisStore } from "@/lib/analysis/store";
import { costSek } from "@/lib/chat/cost";
import { logUsage } from "@/lib/chat/limits";
import { finishRun, startRun } from "@/lib/collect/store";
import { hasJobSecret } from "@/lib/jobs/auth";
import { looksLikeAnthropicKey, safeErrorMessage } from "@/lib/secrets";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/*
 * Writes a draft topic page for the next approved topic. Called by Supabase
 * Cron with CRON_SECRET once ANALYSIS_ENABLED is "true" (see README,
 * "Analysen"). Drafts are never published here.
 */

export const maxDuration = 300;

const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const outletNames = new Map(feeds.map((feed) => [feed.source, feed.name.replace(/ (Nyheter|Ekot)$/, "")]));

type Usage = { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null; server_tool_use?: { web_search_requests?: number } | null };

async function logCall(scope: string, usage: Usage): Promise<number> {
  const searches = usage.server_tool_use?.web_search_requests ?? 0;
  const cost = costSek(analysisConfig.model, usage) + searches * webSearchUsdPerSearch * usdToSek;
  await logUsage({
    job: "analysis",
    scope,
    model: analysisConfig.model,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    cache_read_tokens: usage.cache_read_input_tokens ?? 0,
    cache_write_tokens: usage.cache_creation_input_tokens ?? 0,
    cost_sek: cost,
  });
  return cost;
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json(503, { ok: false, message: "Analysen är inte påslagen: CRON_SECRET saknas." });
  if (!hasJobSecret(request, secret)) return json(401, { ok: false, message: "Ingen behörighet." });
  if (!analysisEnabled()) return json(503, { ok: false, message: "Analysen är avstängd. Sätt ANALYSIS_ENABLED till true för att slå på den." });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey || !looksLikeAnthropicKey(apiKey)) return json(503, { ok: false, message: "Analysen är inte påslagen: ANTHROPIC_API_KEY saknas." });

  let db: ReturnType<typeof getSupabaseAdmin>;
  try {
    db = getSupabaseAdmin();
  } catch {
    return json(503, { ok: false, message: "Analysen är inte påslagen: Supabase saknas." });
  }

  const client = new Anthropic({ apiKey });
  const runId = await startRun(db, "analysis");
  try {
    const stats = await analysisRun({
      store: supabaseAnalysisStore(db),
      outletName: (source) => outletNames.get(source) ?? source,
      localSlugs: new Set(localTopics.map((topic) => topic.slug)),

      async research(label, articles, firstNumber) {
        type Param = Anthropic.MessageParam;
        const messages: Param[] = [{ role: "user", content: researchMessage(label, articles) }];
        const blocks: Anthropic.ContentBlock[] = [];
        let cost = 0;
        // The API may pause a long search turn; it is then continued with what came back.
        for (let turn = 0; turn < analysisConfig.maxResearchTurns; turn++) {
          const message = await client.messages.create({
            model: analysisConfig.model,
            max_tokens: analysisConfig.researchMaxTokens,
            system: [{ type: "text", text: researchInstructions, cache_control: { type: "ephemeral" } }],
            tools: [
              {
                type: "web_search_20260318",
                name: "web_search",
                max_uses: analysisConfig.maxSearches,
                allowed_domains: [...analysisConfig.primaryDomains],
                user_location: { type: "approximate", country: "SE", timezone: "Europe/Stockholm" },
              },
            ],
            messages,
          });
          cost += await logCall("research", message.usage);
          blocks.push(...message.content);
          if (message.stop_reason !== "pause_turn") break;
          messages.push({ role: "assistant", content: message.content });
        }
        const { primary } = readResearch(blocks, firstNumber, analysisConfig.primaryDomains);
        return { primary, costSek: cost };
      },

      async write(text) {
        const message = await client.messages.create({
          model: analysisConfig.model,
          max_tokens: analysisConfig.writeMaxTokens,
          output_config: { format: { type: "json_schema", schema: draftJsonSchema } },
          system: [{ type: "text", text: writeInstructions, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: text }],
        });
        const cost = await logCall("write", message.usage);
        if (message.stop_reason === "max_tokens") throw new Error("Utkastet blev för långt. Höj writeMaxTokens i src/config/analysis.ts.");
        if (message.stop_reason === "refusal") throw new Error("Modellen avböjde att skriva utkastet.");
        return { text: message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join(""), costSek: cost };
      },
    });
    await finishRun(db, runId, { stats });
    return json(200, { ok: true, stats });
  } catch (error) {
    const message = safeErrorMessage(error, 500);
    console.error(`analysis: ${message}`);
    await finishRun(db, runId, { error: message });
    return json(500, { ok: false, message });
  }
}
