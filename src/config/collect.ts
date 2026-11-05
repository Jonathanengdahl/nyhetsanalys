import { site } from "@/config/site";

/**
 * Settings for collecting articles from the outlets' RSS feeds (phase 2,
 * the pilot). We only keep the headline, the lead (ingress) and the link,
 * as decided in CLAUDE.md until a lawyer says otherwise.
 */
export const collectConfig = {
  /**
   * Our own user agent, so that outlets can see who we are and block us in
   * robots.txt if they want to. The token before the slash is what robots.txt
   * rules are matched against.
   */
  userAgentToken: `${site.name.replace(/[^A-Za-z]/g, "")}Bot`,
  userAgent: `${site.name.replace(/[^A-Za-z]/g, "")}Bot/1.0 (+${site.url}/om)`,
  /** Each request may take at most this long. */
  timeoutMs: 10_000,
  /** Feeds fetched at the same time, never more than one at a time per outlet. */
  concurrency: 4,
  /** Older items in a feed are skipped. */
  maxAgeDays: 3,
  /** At most this many items per feed and run. */
  maxItemsPerFeed: 60,
  /** The lead is cut at about this many characters. Full article text is never kept. */
  maxLeadLength: 400,
  /** After this many failed runs in a row a feed is only tried once a day. */
  failuresBeforeBackoff: 3,
  backoffHours: 24,
  /** Largest feed or robots.txt we read, in bytes. */
  maxResponseBytes: 2_000_000,
} as const;
