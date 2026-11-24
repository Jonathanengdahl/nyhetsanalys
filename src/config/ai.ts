/**
 * Settings for the AI chat. Limits and budget were decided by Jonathan on
 * 31 October 2026 for the beta. Change them here only.
 */
export const chatConfig = {
  model: "claude-haiku-5-5",
  /** Low effort keeps answers fast and cheap; the material already has the analysis. */
  effort: "low",
  maxOutputTokens: 700,
  /** Own questions per visitor and day (resets at midnight Swedish time). */
  questionsPerDay: 10,
  /** The chat pauses for the rest of the day when this is spent. */
  dailyBudgetSek: 20,
  maxQuestionLength: 500,
  maxAnswerLength: 4000,
  /** Earlier messages sent along for follow-up questions. */
  maxHistoryMessages: 6,
} as const;

/**
 * List prices in US dollars per million tokens, for prompts under 100 000
 * tokens. Source: Anthropic's price lists for Claude Haiku 5.5 and Sonnet
 * 5.5, the same numbers as in docs/kalkyl.html and docs/teknik.md. Cache
 * writes cost 1.25 times input and cache reads 0.1 times input.
 */
export const aiPricesUsd = {
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheWrite: 0.125, cacheRead: 0.01 },
  "claude-sonnet-5-5": { input: 2, output: 10, cacheWrite: 2.5, cacheRead: 0.2 },
} as const;

/** Web search in the Claude API: 10 dollars per 1 000 searches (docs/teknik.md). */
export const webSearchUsdPerSearch = 0.01;

/** Kronor per dollar. Rounded up from docs/kalkyl.html, so the budget errs on the safe side. */
export const usdToSek = 10;
