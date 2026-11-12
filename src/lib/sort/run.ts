import { sortConfig } from "@/config/sort";
import { planAssignments, type NewTopic, type OpenTopic, type SortAnswer, type SortArticle } from "./classify";
import { measureHeat, nextStatus, type Heat, type HeatArticle, type Outlet } from "./heat";

/*
 * One sorting run: new articles are sorted into topics by the model, then
 * the heat of every open topic is measured again. Everything that talks to
 * the network or the database comes in as `deps`, so the run can be tested
 * without either.
 */

export interface HeatRow extends HeatArticle {
  cluster_id: number;
  title: string;
}

export interface TopicState {
  id: number;
  status: string;
  hot_since: string | null;
}

export interface TopicUpdate {
  id: number;
  status: "watching" | "hot" | "approved" | "rejected";
  heat: Heat;
  score: number;
  hot_since: string | null;
  first_article_at: string | null;
  /** Left out when no article is left in the window, so the topic keeps its last known time. */
  last_article_at?: string;
  examples: string[];
}

export interface SortStore {
  /** Articles not yet sorted, fetched after `sinceIso`, oldest first. */
  unsortedArticles(sinceIso: string, limit: number): Promise<SortArticle[]>;
  /** Topics with an article after `sinceIso`, highest score first. */
  openTopics(sinceIso: string, limit: number): Promise<OpenTopic[]>;
  /** Creates the topics and returns their ids by key. */
  createTopics(topics: NewTopic[], nowIso: string): Promise<Map<string, number>>;
  saveAssignments(rows: { articleId: number; inScope: boolean; clusterId: number | null }[], nowIso: string): Promise<void>;
  /** Sorted articles in a topic, fetched after `sinceIso`. */
  heatRows(sinceIso: string): Promise<HeatRow[]>;
  /** Topics to measure again: those with recent articles and those still marked hot. */
  topicsToMeasure(sinceIso: string): Promise<TopicState[]>;
  saveTopics(updates: TopicUpdate[], nowIso: string): Promise<void>;
  /** Kronor spent today on the background AI jobs. */
  spentToday(): Promise<number>;
}

export interface SortDeps {
  store: SortStore;
  /** Asks the model. Returns the answer and what it cost in kronor (already logged). */
  classify(topics: OpenTopic[], articles: SortArticle[]): Promise<{ answer: SortAnswer; costSek: number }>;
  outlets: Map<string, Outlet>;
  now?: () => Date;
  config?: typeof sortConfig;
}

export interface SortStats {
  batches: number;
  sorted: number;
  inScope: number;
  outOfScope: number;
  /** Articles the answer did not cover; they are tried again next run. */
  skipped: number;
  newTopics: number;
  measured: number;
  hot: number;
  becameHot: number;
  costSek: number;
  paused: boolean;
}

const hoursAgo = (now: Date, hours: number) => new Date(now.getTime() - hours * 3_600_000).toISOString();

export async function sortRun(deps: SortDeps): Promise<SortStats> {
  const config = deps.config ?? sortConfig;
  const now = (deps.now ?? (() => new Date()))();
  const nowIso = now.toISOString();
  const stats: SortStats = {
    batches: 0,
    sorted: 0,
    inScope: 0,
    outOfScope: 0,
    skipped: 0,
    newTopics: 0,
    measured: 0,
    hot: 0,
    becameHot: 0,
    costSek: 0,
    paused: false,
  };

  for (let batch = 0; batch < config.maxBatchesPerRun; batch++) {
    if ((await deps.store.spentToday()) >= config.dailyBudgetSek) {
      stats.paused = true;
      break;
    }
    const articles = await deps.store.unsortedArticles(hoursAgo(now, config.sortWindowHours), config.batchSize);
    if (articles.length === 0) break;

    const topics = await deps.store.openTopics(hoursAgo(now, config.openTopicHours), config.maxOpenTopics);
    const { answer, costSek } = await deps.classify(topics, articles);
    stats.batches += 1;
    stats.costSek += costSek;

    const { assignments, newTopics } = planAssignments(answer, articles, topics);
    const ids = newTopics.length ? await deps.store.createTopics(newTopics, nowIso) : new Map<string, number>();
    const rows = assignments.flatMap((assignment) => {
      const clusterId = assignment.topicId ?? (assignment.newKey ? ids.get(assignment.newKey) : undefined);
      // A new topic that could not be created leaves the article for the next run.
      if (assignment.inScope && clusterId === undefined) return [];
      return [{ articleId: assignment.articleId, inScope: assignment.inScope, clusterId: clusterId ?? null }];
    });
    await deps.store.saveAssignments(rows, nowIso);

    stats.sorted += rows.length;
    stats.inScope += rows.filter((row) => row.inScope).length;
    stats.outOfScope += rows.filter((row) => !row.inScope).length;
    stats.skipped += articles.length - rows.length;
    stats.newTopics += ids.size;
    // A batch where nothing could be used would only repeat itself.
    if (rows.length === 0) break;
  }

  // Heat is measured for every open topic, also when nothing new was sorted, so topics cool down.
  const since = hoursAgo(now, config.openTopicHours);
  const [rows, topics] = await Promise.all([deps.store.heatRows(since), deps.store.topicsToMeasure(since)]);
  const byTopic = new Map<number, HeatRow[]>();
  for (const row of rows) byTopic.set(row.cluster_id, [...(byTopic.get(row.cluster_id) ?? []), row]);

  const updates: TopicUpdate[] = topics.map((topic) => {
    const articles = byTopic.get(topic.id) ?? [];
    const heat = measureHeat(articles, deps.outlets, now, config);
    const status = nextStatus(topic.status, heat);
    const newest = [...articles].sort((a, b) => Date.parse(b.published_at ?? b.fetched_at) - Date.parse(a.published_at ?? a.fetched_at));
    const examples = [...new Set(newest.map((article) => article.title))].slice(0, config.examplesPerTopic);
    const wasHot = topic.status === "hot" && topic.hot_since !== null;
    if (status === "hot" && !wasHot) stats.becameHot += 1;
    return {
      id: topic.id,
      status,
      heat,
      score: heat.score,
      hot_since: status === "hot" ? (wasHot ? topic.hot_since : nowIso) : topic.status === "approved" ? topic.hot_since : null,
      first_article_at: heat.first,
      ...(newest.length
        ? { last_article_at: new Date(Math.min(Date.parse(newest[0].published_at ?? newest[0].fetched_at), now.getTime())).toISOString() }
        : {}),
      examples,
    };
  });
  await deps.store.saveTopics(updates, nowIso);
  stats.measured = updates.length;
  stats.hot = updates.filter((update) => update.status === "hot").length;
  stats.costSek = Math.round(stats.costSek * 10_000) / 10_000;
  return stats;
}

