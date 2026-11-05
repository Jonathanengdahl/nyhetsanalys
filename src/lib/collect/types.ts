/** Types for collecting articles from RSS and Atom feeds. */

/**
 * The owner group, used for the rule that a topic needs sources from at
 * least three media houses. Outlets in the same group count as one house.
 */
export type MediaHouse = "public-service" | "bonnier-news" | "schibsted-media" | "stampen" | "altinget";

/** One feed we read. The list is in src/content/feeds.ts. */
export interface FeedConfig {
  /** The feed address. Also the key for the feed's status in the database. */
  url: string;
  /** The outlet, for example "svt" or "aftonbladet". */
  source: string;
  /** The outlet's name as readers know it. */
  name: string;
  house: MediaHouse;
  /** Opinion feeds (ledare, debatt) are kept apart, since only opinion texts are ever placed politically. */
  kind: "news" | "opinion";
  national: boolean;
  language: "sv";
  /** Where we found the address, so that it can be checked. */
  foundAt: string;
  active: boolean;
}

/** One item from a feed, before it becomes an article. */
export interface FeedItem {
  title: string;
  link: string;
  guid?: string;
  published?: string;
  /** The description or summary. Never the full text (content:encoded and the like). */
  summary?: string;
}

/** An article as we store it: headline, lead and link only. */
export interface ArticleRow {
  url: string;
  source: string;
  feed_url: string;
  title: string;
  lead: string | null;
  published_at: string | null;
  fingerprint: string;
  /** The kind of feed the article came from. A hint only: the genre is set when the articles are sorted. */
  feed_kind: FeedConfig["kind"];
  language: string;
}

export type FeedStatusCode =
  | "ok"
  | "not_modified"
  | "blocked_robots"
  | "reserved_tdm"
  | "http_error"
  | "parse_error"
  | "fetch_error";

/** What we remember about a feed between runs. */
export interface FeedState {
  url: string;
  source: string;
  checked_at: string | null;
  status: FeedStatusCode | "new";
  http_status: number | null;
  etag: string | null;
  last_modified: string | null;
  items: number;
  failures: number;
  error: string | null;
}

export interface CollectStats {
  feeds: number;
  ok: number;
  notModified: number;
  blocked: number;
  reserved: number;
  skipped: number;
  failed: number;
  items: number;
  newArticles: number;
}
