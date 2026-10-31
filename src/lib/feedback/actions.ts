"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createRateLimiter } from "@/lib/signup/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getTopic } from "@/lib/topics";
import { parseHelpful, parseSuggestion } from "./schema";

/*
 * Reader feedback on a topic page. Nothing is published automatically: a
 * person reads every suggestion and checks its source. No names, e-mail or
 * IP addresses are stored.
 */

export type FeedbackState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string | undefined>;
      // Echoed back so the form keeps what the visitor wrote. `attempt` is
      // unique per response so the form remounts with these values.
      values: Record<string, string>;
      attempt: string;
    };

const isAllowed = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

/** Saves a row. Locally without Supabase it only logs, so the forms can be tried out. */
async function save(table: "topic_feedback" | "topic_suggestions", row: Record<string, unknown>) {
  if (!hasSupabase() && !process.env.VERCEL) {
    console.info(`[local] would save to ${table}`);
    return;
  }
  const { error } = await getSupabaseAdmin().from(table).insert(row);
  if (error) throw error;
}

/** What the visitor wrote, cut to the allowed lengths. */
function submitted(formData: FormData, fields: Record<string, number>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields).map(([name, max]) => {
      const value = formData.get(name);
      return [name, typeof value === "string" ? value.slice(0, max) : ""];
    }),
  );
}

const HELPFUL_FIELDS = { helpful: 3, comment: 1000 };
const SUGGESTION_FIELDS = { perspective: 1000, source: 500 };

const failure = (
  message: string,
  values: Record<string, string>,
  fieldErrors?: Record<string, string | undefined>,
): FeedbackState => ({
  status: "error",
  message,
  fieldErrors,
  values,
  attempt: crypto.randomUUID(),
});

function logError(kind: string, error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";
  console.error(`${kind} failed (code=${code})`);
}

export async function submitHelpful(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const values = submitted(formData, HELPFUL_FIELDS);
  const parsed = parseHelpful(formData);
  if (!parsed.success) {
    // A filled honeypot is treated as success so bots learn nothing.
    if (formData.get("website")) return { status: "success", message: "Tack för att du tyckte till!" };
    const fields = z.flattenError(parsed.error).fieldErrors;
    return failure("Något i formuläret behöver rättas.", values, {
      helpful: fields.helpful?.[0],
      comment: fields.comment?.[0],
    });
  }
  if (!(await getTopic(parsed.data.topic))) return failure("Ämnet finns inte.", values);
  if (!isAllowed(await clientKey())) return failure("För många försök. Vänta en stund och försök igen.", values);

  try {
    await save("topic_feedback", { topic: parsed.data.topic, helpful: parsed.data.helpful, comment: parsed.data.comment });
  } catch (error) {
    logError("topic_feedback", error);
    return failure("Det gick inte att spara just nu. Försök igen om en stund.", values);
  }
  return { status: "success", message: "Tack för att du tyckte till! En människa läser alla svar." };
}

export async function submitSuggestion(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const values = submitted(formData, SUGGESTION_FIELDS);
  const parsed = parseSuggestion(formData);
  if (!parsed.success) {
    if (formData.get("website")) return { status: "success", message: "Tack för förslaget!" };
    const fields = z.flattenError(parsed.error).fieldErrors;
    return failure("Något i formuläret behöver rättas.", values, {
      perspective: fields.perspective?.[0],
      source: fields.source?.[0],
    });
  }
  if (!(await getTopic(parsed.data.topic))) return failure("Ämnet finns inte.", values);
  if (!isAllowed(await clientKey())) return failure("För många försök. Vänta en stund och försök igen.", values);

  try {
    await save("topic_suggestions", {
      topic: parsed.data.topic,
      perspective: parsed.data.perspective,
      source_url: parsed.data.source,
    });
  } catch (error) {
    logError("topic_suggestions", error);
    return failure("Det gick inte att spara just nu. Försök igen om en stund.", values);
  }
  return {
    status: "success",
    message: "Tack för förslaget! En människa granskar det och källan. Inget läggs till automatiskt, och vi kan inte lova att sidan ändras.",
  };
}
