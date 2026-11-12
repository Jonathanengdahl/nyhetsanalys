import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sortConfig, type TopicCategory } from "@/config/sort";
import { startOfSwedishDay } from "@/lib/chat/day";
import type { OpenTopic, SortArticle } from "./classify";
import type { HeatRow, SortStore, TopicState } from "./run";

/** The sorting's tables in Supabase: articles and topic_clusters. Server only. */

/** Supabase returns at most 1 000 rows per request, so long lists are read in pages. */
async function allPages<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>, what: string): Promise<T[]> {
  const size = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += size) {
    const { data, error } = await page(from, from + size - 1);
    if (error) throw new Error(`${what} kunde inte läsas: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < size) return rows;
  }
}

export function supabaseSortStore(db: SupabaseClient): SortStore {
  return {
    async unsortedArticles(sinceIso, limit) {
      const { data, error } = await db
        .from("articles")
        .select("id, title, lead, source")
        .is("sorted_at", null)
        .gte("fetched_at", sinceIso)
        .order("fetched_at", { ascending: true })
        .limit(limit);
      if (error) throw new Error(`articles kunde inte läsas: ${error.message}`);
      return (data ?? []) as SortArticle[];
    },

    async openTopics(sinceIso, limit) {
      const { data, error } = await db
        .from("topic_clusters")
        .select("id, label, category, examples")
        .gte("last_article_at", sinceIso)
        .order("score", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`topic_clusters kunde inte läsas: ${error.message}`);
      return (data ?? []) as OpenTopic[];
    },

    async createTopics(topics, nowIso) {
      const ids = new Map<string, number>();
      if (topics.length === 0) return ids;
      const { data, error } = await db
        .from("topic_clusters")
        .insert(
          topics.map((topic) => ({
            label: topic.label,
            category: topic.category as TopicCategory,
            created_at: nowIso,
            updated_at: nowIso,
            // When we first saw the topic. The heat window says when its articles were published.
            first_article_at: nowIso,
          })),
        )
        .select("id");
      if (error) throw new Error(`topic_clusters kunde inte skapas: ${error.message}`);
      // Rows come back in the order they were sent.
      (data as { id: number }[]).forEach((row, index) => ids.set(topics[index].key, row.id));
      return ids;
    },

    async saveAssignments(rows, nowIso) {
      // One update per topic (and one for the articles outside our field) instead of one per article.
      const groups = new Map<string, number[]>();
      for (const row of rows) {
        const key = row.inScope ? `in:${row.clusterId}` : "out";
        groups.set(key, [...(groups.get(key) ?? []), row.articleId]);
      }
      for (const [key, articleIds] of groups) {
        const values = key === "out" ? { sorted_at: nowIso, in_scope: false, cluster_id: null } : { sorted_at: nowIso, in_scope: true, cluster_id: Number(key.slice(3)) };
        const { error } = await db.from("articles").update(values).in("id", articleIds);
        if (error) throw new Error(`articles kunde inte uppdateras: ${error.message}`);
      }
    },

    async heatRows(sinceIso) {
      return allPages<HeatRow>(
        (from, to) =>
          db
            .from("articles")
            .select("cluster_id, title, source, fingerprint, published_at, fetched_at")
            .not("cluster_id", "is", null)
            .gte("fetched_at", sinceIso)
            .order("id", { ascending: true })
            .range(from, to),
        "articles",
      );
    },

    async topicsToMeasure(sinceIso) {
      const { data, error } = await db
        .from("topic_clusters")
        .select("id, status, hot_since")
        .or(`last_article_at.gte.${sinceIso},status.eq.hot`);
      if (error) throw new Error(`topic_clusters kunde inte läsas: ${error.message}`);
      return (data ?? []) as TopicState[];
    },

    async saveTopics(updates, nowIso) {
      // A handful of topics per run, so one update each is fine and keeps every value exact.
      for (const update of updates) {
        const values: Record<string, unknown> = {
          status: update.status,
          heat: update.heat,
          score: update.score,
          hot_since: update.hot_since,
          updated_at: nowIso,
        };
        if (update.last_article_at) values.last_article_at = update.last_article_at;
        if (update.examples.length) values.examples = update.examples;
        const { error } = await db.from("topic_clusters").update(values).eq("id", update.id);
        if (error) throw new Error(`topic_clusters ${update.id} kunde inte sparas: ${error.message}`);
      }
    },

    async spentToday() {
      const { data, error } = await db.rpc("ai_cost_sek_for_jobs", { p_since: startOfSwedishDay(), p_jobs: [...sortConfig.budgetJobs] });
      if (error) throw new Error(`ai_cost_sek_for_jobs failed: ${error.message}`);
      return Number(data ?? 0);
    },
  };
}
