import { analysisConfig } from "@/config/analysis";
import { sortConfig } from "@/config/sort";
import { safeErrorMessage } from "@/lib/secrets";
import type { Topic } from "@/lib/topics/types";
import { topicProblems } from "@/lib/topics/validate";
import { assembleTopic, draftProblems, draftSchema, slugify, swedishDay, type ArticleInput, type PrimarySource } from "./draft";
import { writeMessage } from "./prompt";

/*
 * One analysis run: the next approved topic without a page gets a draft.
 * 1. The research call searches primary sources and returns cited excerpts.
 * 2. The writing call turns articles and excerpts into a draft (JSON).
 * 3. The server builds the Topic, runs every check and saves it as a draft.
 * Nothing is published here. Jonathan publishes from /admin/utkast.
 * Network and database come in as `deps`, so the run can be tested without them.
 */

export interface ArticleRow {
  id: number;
  title: string;
  lead: string | null;
  url: string;
  source: string;
  published_at: string | null;
  fetched_at: string;
}

export interface NextTopic {
  clusterId: number;
  label: string;
}

export interface DraftRow {
  clusterId: number;
  slug: string;
  status: "draft" | "failed";
  data: Topic | null;
  problems: string[];
  costSek: number;
}

export interface AnalysisStore {
  spentToday(): Promise<number>;
  /** The approved topic that has waited longest for a page, or null. */
  nextTopic(): Promise<NextTopic | null>;
  articles(clusterId: number, sinceIso: string, limit: number): Promise<ArticleRow[]>;
  /** Addresses already used by pages in the database. */
  takenSlugs(): Promise<Set<string>>;
  saveDraft(row: DraftRow, nowIso: string): Promise<void>;
}

export interface AnalysisDeps {
  store: AnalysisStore;
  /** Searches primary sources. Returns the cited sources (numbered from `firstNumber`) and the cost in kronor, already logged. */
  research(label: string, articles: ArticleInput[], firstNumber: number): Promise<{ primary: PrimarySource[]; costSek: number }>;
  /** Writes the draft. Returns the raw JSON text and the cost in kronor, already logged. */
  write(message: string): Promise<{ text: string; costSek: number }>;
  outletName(source: string): string;
  /** Slugs of the hand-written topics, which a draft must not take. */
  localSlugs: Set<string>;
  now?: () => Date;
}

export interface AnalysisStats {
  analysed: number;
  clusterId: number | null;
  slug: string | null;
  problems: number;
  costSek: number;
  paused: boolean;
  skipped: string | null;
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  const start = base || "amne";
  if (!taken.has(start)) return start;
  for (let n = 2; ; n++) if (!taken.has(`${start}-${n}`)) return `${start}-${n}`;
}

/** Newest first, one article per headline, at most `limit`, numbered from 1. */
export function pickArticles(rows: ArticleRow[], outletName: (source: string) => string, limit: number): ArticleInput[] {
  const seen = new Set<string>();
  const time = (row: ArticleRow) => Date.parse(row.published_at ?? row.fetched_at);
  return [...rows]
    .sort((a, b) => time(b) - time(a))
    .filter((row) => {
      const key = row.title.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((row, index) => ({ n: index + 1, outlet: outletName(row.source), title: row.title, lead: row.lead, url: row.url, publishedAt: row.published_at ?? row.fetched_at }));
}

export async function analysisRun(deps: AnalysisDeps): Promise<AnalysisStats> {
  const now = (deps.now ?? (() => new Date()))();
  const nowIso = now.toISOString();
  const stats: AnalysisStats = { analysed: 0, clusterId: null, slug: null, problems: 0, costSek: 0, paused: false, skipped: null };

  for (let round = 0; round < analysisConfig.topicsPerRun; round++) {
    if ((await deps.store.spentToday()) + analysisConfig.maxCostPerTopicSek > sortConfig.dailyBudgetSek) {
      stats.paused = true;
      break;
    }
    const topic = await deps.store.nextTopic();
    if (!topic) break;
    stats.clusterId = topic.clusterId;

    const since = new Date(now.getTime() - analysisConfig.articleWindowHours * 3_600_000).toISOString();
    const articles = pickArticles(await deps.store.articles(topic.clusterId, since, 200), deps.outletName, analysisConfig.maxArticles);
    const taken = new Set([...deps.localSlugs, ...(await deps.store.takenSlugs())]);
    const slug = uniqueSlug(slugify(topic.label), taken);
    stats.slug = slug;

    if (articles.length < 3) {
      stats.skipped = "För få artiklar de senaste dygnen.";
      await deps.store.saveDraft({ clusterId: topic.clusterId, slug, status: "failed", data: null, problems: [stats.skipped], costSek: 0 }, nowIso);
      continue;
    }

    let cost = 0;
    try {
      const research = await deps.research(topic.label, articles, articles.length + 1);
      cost += research.costSek;
      const written = await deps.write(writeMessage({ label: topic.label, today: swedishDay(nowIso), articles, primary: research.primary }));
      cost += written.costSek;

      const draft = draftSchema.parse(JSON.parse(written.text));
      const context = { articles, primary: research.primary, now, slug };
      const page = assembleTopic(draft, context);
      const problems = [...draftProblems(draft, context), ...topicProblems(page)];
      await deps.store.saveDraft({ clusterId: topic.clusterId, slug, status: "draft", data: page, problems, costSek: cost }, nowIso);
      stats.analysed += 1;
      stats.problems += problems.length;
    } catch (error) {
      const problem = `Utkastet kunde inte skrivas: ${safeErrorMessage(error, 300)}`;
      await deps.store.saveDraft({ clusterId: topic.clusterId, slug, status: "failed", data: null, problems: [problem], costSek: cost }, nowIso);
      stats.skipped = problem;
    } finally {
      stats.costSek += cost;
    }
  }
  stats.costSek = Math.round(stats.costSek * 10_000) / 10_000;
  return stats;
}
