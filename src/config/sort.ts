/**
 * Settings for sorting articles into topics. The threshold for a hot topic
 * follows docs/produkt.md ("Vilka ämnen vi tar upp"). Change them here only.
 */
export const sortConfig = {
  model: "claude-haiku-5-5",
  /** Articles sent to the model in one call. */
  batchSize: 50,
  /** Calls per run. Runs every 15 minutes, so this catches up on a backlog within hours. */
  maxBatchesPerRun: 2,
  maxOutputTokens: 6000,
  /** Only articles this new are sorted. Older ones can no longer make a topic hot. */
  sortWindowHours: 48,
  /** Topics with an article this recent are shown to the model as existing topics. */
  openTopicHours: 72,
  /** The longest list of existing topics the model sees, hottest first. */
  maxOpenTopics: 120,
  /** Headlines kept per topic so the model can recognise it. */
  examplesPerTopic: 3,
  /** A topic is hot when all of these hold within the window (decision 2026-10-29, docs/produkt.md). */
  threshold: { windowHours: 48, sources: 5, houses: 3, national: 1 },
  /** Articles within this many hours count as fresh in the score. */
  freshHours: 6,
  /** Daily budget for the background AI jobs (decision 2026-10-31), shared with the analysis later. */
  dailyBudgetSek: 40,
  /** Jobs that share that budget. The chat has its own. */
  budgetJobs: ["sort", "analysis"],
} as const;

export const topicCategories = ["politik", "ekonomi", "samhalle", "utrikes"] as const;
export type TopicCategory = (typeof topicCategories)[number];

/** How the categories are written for readers. */
export const categoryLabels: Record<TopicCategory, string> = {
  politik: "Politik",
  ekonomi: "Ekonomi",
  samhalle: "Samhälle",
  utrikes: "Utrikes",
};
