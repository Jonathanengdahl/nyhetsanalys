import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Daily question quota and AI cost log. In production they live in Supabase
 * (tables chat_quota and ai_usage), so every server instance sees the same
 * numbers. Without Supabase (local development) they are kept in memory.
 */

export type UsageRow = {
  job: "chat";
  scope: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_write_tokens: number;
  cost_sek: number;
};

const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

// Local fallback.
const memoryQuota = new Map<string, number>();
const memoryUsage: { at: number; cost: number }[] = [];

/** Kronor spent on AI since the given moment. */
export async function spentSince(sinceIso: string): Promise<number> {
  if (!hasSupabase()) {
    const since = Date.parse(sinceIso);
    return memoryUsage.filter((row) => row.at >= since).reduce((sum, row) => sum + row.cost, 0);
  }
  const { data, error } = await getSupabaseAdmin().rpc("ai_cost_sek_since", { p_since: sinceIso });
  if (error) throw new Error(`ai_cost_sek_since failed: ${error.message}`);
  return Number(data ?? 0);
}

/** Uses one question from the visitor's quota. Returns the number left, or -1 when none are left. */
export async function takeQuestion(day: string, visitor: string, limit: number): Promise<number> {
  if (!hasSupabase()) {
    const key = `${day}|${visitor}`;
    const used = memoryQuota.get(key) ?? 0;
    if (used >= limit) return -1;
    memoryQuota.set(key, used + 1);
    return limit - used - 1;
  }
  const { data, error } = await getSupabaseAdmin().rpc("chat_take_quota", { p_day: day, p_visitor: visitor, p_limit: limit });
  if (error) throw new Error(`chat_take_quota failed: ${error.message}`);
  return Number(data);
}

/** Logs the token use and cost of one AI call. Never throws: logging must not break an answer. */
export async function logUsage(row: UsageRow): Promise<void> {
  if (!hasSupabase()) {
    memoryUsage.push({ at: Date.now(), cost: row.cost_sek });
    return;
  }
  const { error } = await getSupabaseAdmin().from("ai_usage").insert(row);
  if (error) console.error("ai_usage insert failed:", error.message);
}
