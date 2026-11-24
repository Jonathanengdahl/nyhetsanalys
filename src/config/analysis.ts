/**
 * Settings for the analysis job, which turns an approved candidate topic
 * into a draft topic page. Change them here only.
 */
export const analysisConfig = {
  model: "claude-sonnet-5-5",
  /** One topic per run keeps each run short and the cost predictable. */
  topicsPerRun: 1,
  /** The most articles from the topic that the model reads (headline and lead only). */
  maxArticles: 24,
  /** Articles this old are left out. */
  articleWindowHours: 72,
  /** Searches the research step may make. Each costs a cent (see webSearchUsdPerSearch). */
  maxSearches: 6,
  /** Times the research step may continue after the API pauses a long turn. */
  maxResearchTurns: 3,
  researchMaxTokens: 6000,
  writeMaxTokens: 20000,
  /**
   * Primary sources the research may search, so facts and figures come from
   * authorities and not from other media (CLAUDE.md, "Juridik att bygga in").
   */
  primaryDomains: [
    "regeringen.se",
    "riksdagen.se",
    "scb.se",
    "riksbank.se",
    "konj.se",
    "esv.se",
    "arbetsformedlingen.se",
    "forsakringskassan.se",
    "polisen.se",
    "msb.se",
    "folkhalsomyndigheten.se",
    "migrationsverket.se",
    "val.se",
    "europa.eu",
    "eurostat.ec.europa.eu",
    "un.org",
    "oecd.org",
    "imf.org",
  ],
  /** The analysis shares the 40 kr daily budget with the sorting (sortConfig.budgetJobs). */
  budgetJob: "analysis",
  /** Rough upper bound for one draft. A run starts only when this much is left of the daily budget. */
  maxCostPerTopicSek: 8,
} as const;

/** The job runs only when the environment variable ANALYSIS_ENABLED is "true" (default off). */
export function analysisEnabled(): boolean {
  return process.env.ANALYSIS_ENABLED === "true";
}
