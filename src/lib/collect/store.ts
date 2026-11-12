import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CollectStore } from "./run";
import type { FeedState } from "./types";

/** The collector's tables in Supabase: feed_status, articles and job_runs. Server only. */
export function supabaseCollectStore(db: SupabaseClient): CollectStore {
  return {
    async getStates(urls) {
      if (urls.length === 0) return new Map();
      const { data, error } = await db.from("feed_status").select("*").in("url", urls);
      if (error) throw new Error(`feed_status kunde inte läsas: ${error.message}`);
      return new Map((data as FeedState[]).map((row) => [row.url, row]));
    },
    async saveStates(states) {
      if (states.length === 0) return;
      const { error } = await db.from("feed_status").upsert(states, { onConflict: "url" });
      if (error) throw new Error(`feed_status kunde inte sparas: ${error.message}`);
    },
    async saveArticles(rows) {
      // Articles we already have are left as they are. Only new rows come back.
      const { data, error } = await db.from("articles").upsert(rows, { onConflict: "url", ignoreDuplicates: true }).select("id");
      if (error) throw new Error(`articles kunde inte sparas: ${error.message}`);
      return data?.length ?? 0;
    },
  };
}

/** Starts a row in job_runs. A log that cannot be written never stops the job. */
export async function startRun(db: SupabaseClient, job: string): Promise<number | null> {
  const { data, error } = await db.from("job_runs").insert({ job }).select("id").single();
  if (error) {
    console.error(`job_runs (${job}): ${error.message}`);
    return null;
  }
  return (data as { id: number }).id;
}

export async function finishRun(db: SupabaseClient, id: number | null, result: { stats?: object; error?: string }) {
  if (id === null) return;
  const { error } = await db
    .from("job_runs")
    .update({ finished_at: new Date().toISOString(), ok: !result.error, stats: result.stats ?? {}, error: result.error ?? null })
    .eq("id", id);
  if (error) console.error(`job_runs ${id}: ${error.message}`);
}
