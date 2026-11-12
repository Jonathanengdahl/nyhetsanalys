import "server-only";
import { sortConfig, type TopicCategory } from "@/config/sort";
import { feeds } from "@/content/feeds";
import { startOfSwedishDay } from "@/lib/chat/day";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Heat } from "./heat";

/** What Jonathan sees on /admin/kandidater: the topics the sorting found, hottest first. */

export interface CandidateArticle {
  id: number;
  title: string;
  url: string;
  source: string;
  sourceName: string;
  published_at: string | null;
  fetched_at: string;
}

export interface Candidate {
  id: number;
  label: string;
  category: TopicCategory;
  status: "watching" | "hot" | "approved" | "rejected";
  heat: Partial<Heat>;
  score: number;
  hot_since: string | null;
  first_article_at: string | null;
  last_article_at: string | null;
  articles: CandidateArticle[];
}

export interface CandidateOverview {
  hot: Candidate[];
  watching: Candidate[];
  lastRun: { started_at: string; ok: boolean | null; stats: Record<string, unknown>; error: string | null } | null;
  spentTodaySek: number;
  articlesLast24h: number;
  unsorted: number;
}

const names = new Map(feeds.map((feed) => [feed.source, feed.name.replace(/ (Nyheter|Ekot)$/, "")]));

export async function getCandidates(): Promise<CandidateOverview> {
  const db = getSupabaseAdmin();
  const since = new Date(Date.now() - sortConfig.openTopicHours * 3_600_000).toISOString();
  const day = new Date(Date.now() - 24 * 3_600_000).toISOString();

  const [topics, lastRun, spent, recent, unsorted] = await Promise.all([
    db
      .from("topic_clusters")
      .select("id, label, category, status, heat, score, hot_since, first_article_at, last_article_at")
      .or(`last_article_at.gte.${since},status.eq.hot`)
      .neq("status", "rejected")
      .order("score", { ascending: false })
      .limit(60),
    db.from("job_runs").select("started_at, ok, stats, error").eq("job", "sort").order("started_at", { ascending: false }).limit(1).maybeSingle(),
    db.rpc("ai_cost_sek_for_jobs", { p_since: startOfSwedishDay(), p_jobs: [...sortConfig.budgetJobs] }),
    db.from("articles").select("id", { count: "exact", head: true }).gte("fetched_at", day),
    db.from("articles").select("id", { count: "exact", head: true }).is("sorted_at", null).gte("fetched_at", since),
  ]);
  if (topics.error) throw new Error(`topic_clusters: ${topics.error.message}`);

  const rows = (topics.data ?? []) as Omit<Candidate, "articles">[];
  const ids = rows.map((row) => row.id);
  const articles = ids.length
    ? await db
        .from("articles")
        .select("id, title, url, source, published_at, fetched_at, cluster_id")
        .in("cluster_id", ids)
        .gte("fetched_at", since)
        .order("fetched_at", { ascending: false })
        .limit(1000)
    : { data: [], error: null };
  if (articles.error) throw new Error(`articles: ${articles.error.message}`);

  const byTopic = new Map<number, CandidateArticle[]>();
  for (const row of (articles.data ?? []) as (CandidateArticle & { cluster_id: number })[]) {
    const list = byTopic.get(row.cluster_id) ?? [];
    list.push({ ...row, sourceName: names.get(row.source) ?? row.source });
    byTopic.set(row.cluster_id, list);
  }
  const candidates = rows.map((row) => ({ ...row, articles: byTopic.get(row.id) ?? [] }));

  return {
    hot: candidates.filter((candidate) => candidate.status === "hot" || candidate.status === "approved"),
    watching: candidates.filter((candidate) => candidate.status === "watching").slice(0, 30),
    lastRun: (lastRun.data as CandidateOverview["lastRun"]) ?? null,
    spentTodaySek: Number(spent.data ?? 0),
    articlesLast24h: recent.count ?? 0,
    unsorted: unsorted.count ?? 0,
  };
}
