import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sortConfig } from "@/config/sort";
import { startOfSwedishDay } from "@/lib/chat/day";
import type { AnalysisStore, ArticleRow, DraftRow } from "./run";

/** The analysis job's tables in Supabase: topic_clusters, articles and topic_pages. Server only. */

/** Pages in these states keep their topic out of the queue. "retry" puts it back. */
const blocking = ["draft", "published", "withdrawn", "failed"];

export function supabaseAnalysisStore(db: SupabaseClient): AnalysisStore {
  return {
    async spentToday() {
      const { data, error } = await db.rpc("ai_cost_sek_for_jobs", { p_since: startOfSwedishDay(), p_jobs: [...sortConfig.budgetJobs] });
      if (error) throw new Error(`ai_cost_sek_for_jobs failed: ${error.message}`);
      return Number(data ?? 0);
    },

    async nextTopic() {
      const approved = await db
        .from("topic_clusters")
        .select("id, label")
        .eq("status", "approved")
        .order("updated_at", { ascending: true })
        .limit(50);
      if (approved.error) throw new Error(`topic_clusters kunde inte läsas: ${approved.error.message}`);
      const rows = (approved.data ?? []) as { id: number; label: string }[];
      if (rows.length === 0) return null;
      const pages = await db
        .from("topic_pages")
        .select("cluster_id, status")
        .in(
          "cluster_id",
          rows.map((row) => row.id),
        );
      if (pages.error) throw new Error(`topic_pages kunde inte läsas: ${pages.error.message}`);
      const busy = new Set(((pages.data ?? []) as { cluster_id: number; status: string }[]).filter((page) => blocking.includes(page.status)).map((page) => page.cluster_id));
      const next = rows.find((row) => !busy.has(row.id));
      return next ? { clusterId: next.id, label: next.label } : null;
    },

    async articles(clusterId, sinceIso, limit) {
      const { data, error } = await db
        .from("articles")
        .select("id, title, lead, url, source, published_at, fetched_at")
        .eq("cluster_id", clusterId)
        .gte("fetched_at", sinceIso)
        .order("fetched_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`articles kunde inte läsas: ${error.message}`);
      return (data ?? []) as ArticleRow[];
    },

    async takenSlugs() {
      const { data, error } = await db.from("topic_pages").select("slug, cluster_id");
      if (error) throw new Error(`topic_pages kunde inte läsas: ${error.message}`);
      return new Set(((data ?? []) as { slug: string }[]).map((row) => row.slug));
    },

    async saveDraft(row: DraftRow, nowIso: string) {
      // A retried topic keeps its row (and address), so the upsert is on the topic.
      const existing = await db.from("topic_pages").select("slug").eq("cluster_id", row.clusterId).maybeSingle();
      if (existing.error) throw new Error(`topic_pages kunde inte läsas: ${existing.error.message}`);
      const slug = (existing.data as { slug: string } | null)?.slug ?? row.slug;
      const data = row.data ? { ...row.data, slug } : null;
      const { error } = await db.from("topic_pages").upsert(
        { cluster_id: row.clusterId, slug, status: row.status, data, problems: row.problems, cost_sek: row.costSek, updated_at: nowIso },
        { onConflict: "cluster_id" },
      );
      if (error) throw new Error(`topic_pages kunde inte sparas: ${error.message}`);
    },
  };
}
