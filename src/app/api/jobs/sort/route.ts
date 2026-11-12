import Anthropic from "@anthropic-ai/sdk";
import { sortConfig } from "@/config/sort";
import { feeds } from "@/content/feeds";
import { costSek } from "@/lib/chat/cost";
import { logUsage } from "@/lib/chat/limits";
import { finishRun, startRun } from "@/lib/collect/store";
import { hasJobSecret } from "@/lib/jobs/auth";
import { looksLikeAnthropicKey, safeErrorMessage } from "@/lib/secrets";
import { sortAnswer, sortInstructions, sortMessage, sortOutputSchema } from "@/lib/sort/classify";
import type { Outlet } from "@/lib/sort/heat";
import { sortRun } from "@/lib/sort/run";
import { supabaseSortStore } from "@/lib/sort/store";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/*
 * Sorts new articles into topics and measures the heat of every open topic.
 * Called every 15 minutes by Supabase Cron with the secret CRON_SECRET (see
 * README, "Sorteringen"). Nobody else can start it.
 */

export const maxDuration = 60;

const json = (status: number, body: unknown) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Outlet facts per source, for the rule about media houses and national outlets. */
const outlets = new Map<string, Outlet>(feeds.map((feed) => [feed.source, { house: feed.house, national: feed.national }]));

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return json(503, { ok: false, message: "Sorteringen är inte påslagen: CRON_SECRET saknas." });
  if (!hasJobSecret(request, secret)) return json(401, { ok: false, message: "Ingen behörighet." });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey || !looksLikeAnthropicKey(apiKey)) return json(503, { ok: false, message: "Sorteringen är inte påslagen: ANTHROPIC_API_KEY saknas." });

  let db: ReturnType<typeof getSupabaseAdmin>;
  try {
    db = getSupabaseAdmin();
  } catch {
    return json(503, { ok: false, message: "Sorteringen är inte påslagen: Supabase saknas." });
  }

  const client = new Anthropic({ apiKey });
  const runId = await startRun(db, "sort");
  try {
    const stats = await sortRun({
      store: supabaseSortStore(db),
      outlets,
      async classify(topics, articles) {
        const message = await client.messages.create({
          model: sortConfig.model,
          max_tokens: sortConfig.maxOutputTokens,
          thinking: { type: "disabled" },
          output_config: { effort: "low", format: { type: "json_schema", schema: sortOutputSchema } },
          // The instructions are the same every time, so they are cached.
          system: [{ type: "text", text: sortInstructions, cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: sortMessage(topics, articles) }],
        });
        const cost = costSek(sortConfig.model, message.usage);
        await logUsage({
          job: "sort",
          scope: "articles",
          model: sortConfig.model,
          input_tokens: message.usage.input_tokens,
          output_tokens: message.usage.output_tokens,
          cache_read_tokens: message.usage.cache_read_input_tokens ?? 0,
          cache_write_tokens: message.usage.cache_creation_input_tokens ?? 0,
          cost_sek: cost,
        });
        const text = message.content.flatMap((block) => (block.type === "text" ? [block.text] : [])).join("");
        if (message.stop_reason === "max_tokens") throw new Error("Svaret blev för långt. Minska batchSize i src/config/sort.ts.");
        return { answer: sortAnswer.parse(JSON.parse(text)), costSek: cost };
      },
    });
    await finishRun(db, runId, { stats });
    return json(200, { ok: true, stats });
  } catch (error) {
    const message = safeErrorMessage(error, 500);
    console.error(`sort: ${message}`);
    await finishRun(db, runId, { error: message });
    return json(500, { ok: false, message: "Sorteringen misslyckades. Se job_runs." });
  }
}
