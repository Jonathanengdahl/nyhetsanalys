import Anthropic from "@anthropic-ai/sdk";
import { chatConfig } from "@/config/ai";
import { costSek } from "@/lib/chat/cost";
import { startOfSwedishDay, swedishDay } from "@/lib/chat/day";
import { logUsage, spentSince, takeQuestion } from "@/lib/chat/limits";
import { startMaterial, topicMaterial, type ChatMaterial } from "@/lib/chat/material";
import { chatInstructions } from "@/lib/chat/prompt";
import { chatRequestSchema, trimHistory } from "@/lib/chat/schema";
import { clientIp, visitorId } from "@/lib/chat/visitor";
import { getPublishedTopics, getTopic } from "@/lib/topics";

/*
 * The AI chat. Answers only from the material on our pages, with a daily
 * quota per visitor and a daily budget for the whole site. The answer is
 * streamed as plain text. Errors are JSON with a Swedish message.
 */

type ErrorCode = "invalid" | "not_found" | "not_configured" | "paused" | "limit" | "unavailable";

const fail = (status: number, code: ErrorCode, message: string, headers?: HeadersInit) =>
  Response.json({ code, message }, { status, headers: { "Cache-Control": "no-store", ...headers } });

const INTERRUPTED = "\n\n(Svaret avbröts. Försök igen om en stund.)";

/** Local test mode without an API key. Never active on Vercel. */
const mockMode = () => process.env.CHAT_MOCK === "1" && !process.env.VERCEL;

async function materialFor(scope: string): Promise<ChatMaterial | null> {
  if (scope === "start") return startMaterial(await getPublishedTopics());
  const topic = await getTopic(scope);
  return topic ? topicMaterial(topic) : null;
}

function mockStream(material: ChatMaterial): ReadableStream<Uint8Array> {
  const words = `Det här är ett testsvar om ${material.label}, utan AI. Underlaget anger källor som [1] och [2]. Riktiga svar kommer när API-nyckeln finns på servern.`.split(" ");
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(`${word} `));
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      controller.close();
    },
  });
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 40_000) {
    return fail(413, "invalid", "Frågan är för lång.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid", "Frågan kunde inte läsas.");
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "invalid", parsed.error.issues[0]?.message ?? "Frågan kunde inte läsas.");
  }

  const material = await materialFor(parsed.data.scope);
  if (!material) return fail(404, "not_found", "Vi har inte analyserat det ämnet.");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey && !mockMode()) {
    return fail(503, "not_configured", "Chatten är inte påslagen än. Prova igen senare.");
  }

  const now = new Date();
  const day = swedishDay(now);
  let remaining: number;
  try {
    const spent = await spentSince(startOfSwedishDay(now));
    if (spent >= chatConfig.dailyBudgetSek) {
      return fail(503, "paused", "Chatten har pausats för i dag eftersom dagens gräns för kostnader är nådd. Den öppnar igen vid midnatt.");
    }
    remaining = await takeQuestion(day, visitorId(clientIp(request.headers), day), chatConfig.questionsPerDay);
  } catch (error) {
    console.error("Chat limits unavailable:", error instanceof Error ? error.message : error);
    return fail(503, "unavailable", "Chatten fungerar inte just nu. Prova igen senare.");
  }
  if (remaining < 0) {
    return fail(
      429,
      "limit",
      `Du har ställt dagens ${chatConfig.questionsPerDay} frågor. Under betan får varje besökare ${chatConfig.questionsPerDay} frågor per dag. De nollställs vid midnatt.`,
      { "X-Chat-Remaining": "0" },
    );
  }

  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Chat-Remaining": String(remaining),
  };

  if (!apiKey) return new Response(mockStream(material), { headers });

  const scope = parsed.data.scope === "start" ? "start" : "topic";
  const client = new Anthropic({ apiKey });
  const stream = client.messages.stream(
    {
      model: chatConfig.model,
      max_tokens: chatConfig.maxOutputTokens,
      thinking: { type: "disabled" },
      output_config: { effort: chatConfig.effort },
      system: [{ type: "text", text: chatInstructions(material, scope), cache_control: { type: "ephemeral" } }],
      messages: trimHistory(parsed.data.messages),
    },
    { signal: request.signal },
  );

  // Wait for the first piece of text, so an API error can still become a proper error response.
  let started = false;
  let resolveFirst: (outcome: "text" | "error") => void = () => {};
  const first = new Promise<"text" | "error">((resolve) => (resolveFirst = resolve));
  const encoder = new TextEncoder();

  const answer = new ReadableStream<Uint8Array>({
    start(controller) {
      const close = () => {
        try {
          controller.close();
        } catch {
          // Already closed because the reader left.
        }
      };
      stream.on("text", (delta) => {
        started = true;
        resolveFirst("text");
        try {
          controller.enqueue(encoder.encode(delta));
        } catch {
          // The reader has left; the cancel handler stops the request.
        }
      });
      stream
        .finalMessage()
        .then(async (message) => {
          resolveFirst("text");
          await logUsage({
            job: "chat",
            scope: parsed.data.scope,
            model: chatConfig.model,
            input_tokens: message.usage.input_tokens,
            output_tokens: message.usage.output_tokens,
            cache_read_tokens: message.usage.cache_read_input_tokens ?? 0,
            cache_write_tokens: message.usage.cache_creation_input_tokens ?? 0,
            cost_sek: costSek(chatConfig.model, message.usage),
          });
          close();
        })
        .catch((error: unknown) => {
          if (!stream.aborted) {
            console.error("Chat answer failed:", error instanceof Error ? error.message : error);
          }
          resolveFirst("error");
          if (started && !stream.aborted) {
            try {
              controller.enqueue(encoder.encode(INTERRUPTED));
            } catch {
              // The reader has left.
            }
          }
          close();
        });
    },
    cancel() {
      stream.abort();
    },
  });

  if ((await first) === "error" && !started) {
    return fail(502, "unavailable", "Chatten kunde inte svara just nu. Prova igen om en stund.");
  }
  return new Response(answer, { headers });
}
