import { collectConfig } from "@/config/collect";
import { FeedParseError, parseFeed } from "./feed";
import { canonicalUrl, cleanText, fingerprint, parseDate, shortLead } from "./normalize";
import { isAllowed, parseRobots, robotsFromStatus, type RobotsRules } from "./robots";
import { isReserved, parseTdmRep, reservationFromHeader, reservedByFile } from "./tdm";
import type { ArticleRow, CollectStats, FeedConfig, FeedState, FeedStatusCode } from "./types";

/*
 * One collection run: for every active feed, check robots.txt and any
 * reservation against text and data mining, fetch the feed if it has
 * changed, and store new articles (headline, lead and link). Everything that
 * talks to the network or the database comes in as `deps`, so the whole run
 * can be tested without either.
 */

export interface CollectStore {
  getStates(urls: string[]): Promise<Map<string, FeedState>>;
  saveStates(states: FeedState[]): Promise<void>;
  /** Stores the rows that are not already stored and returns how many were new. */
  saveArticles(rows: ArticleRow[]): Promise<number>;
}

export interface CollectDeps {
  fetch: typeof fetch;
  store: CollectStore;
  feeds: FeedConfig[];
  now?: () => Date;
  config?: typeof collectConfig;
}

type Config = typeof collectConfig;

/** Reads at most `max` bytes of a response, in the charset the response or the XML declaration names. */
async function readText(response: Response, max: number): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.byteLength;
    if (size >= max) {
      await reader.cancel();
      break;
    }
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk.subarray(0, Math.min(chunk.byteLength, size - offset)), offset);
    offset += chunk.byteLength;
    if (offset >= size) break;
  }
  const declared =
    response.headers.get("content-type")?.match(/charset="?([\w-]+)/i)?.[1] ??
    new TextDecoder("latin1").decode(bytes.subarray(0, 200)).match(/encoding=["']([\w-]+)["']/i)?.[1] ??
    "utf-8";
  try {
    return new TextDecoder(declared.toLowerCase()).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

interface OriginRules {
  robots: RobotsRules | "allow-all" | "disallow-all";
  tdm: ReturnType<typeof parseTdmRep>;
}

async function originRules(origin: string, deps: CollectDeps, config: Config): Promise<OriginRules> {
  const headers = { "User-Agent": config.userAgent };
  let robots: OriginRules["robots"];
  try {
    const response = await deps.fetch(`${origin}/robots.txt`, { headers, signal: AbortSignal.timeout(config.timeoutMs) });
    const fallback = robotsFromStatus(response.status);
    robots = fallback ?? parseRobots(await readText(response, config.maxResponseBytes));
  } catch {
    // An unreachable robots.txt means nothing may be fetched (RFC 9309, 2.3.1.4).
    robots = "disallow-all";
  }

  let tdm: OriginRules["tdm"] = [];
  try {
    const response = await deps.fetch(`${origin}/.well-known/tdmrep.json`, {
      headers: { ...headers, Accept: "application/json" },
      signal: AbortSignal.timeout(config.timeoutMs),
    });
    if (response.ok) tdm = parseTdmRep(JSON.parse(await readText(response, 200_000)));
  } catch {
    // No file, or not valid JSON: no site-wide reservation.
  }
  return { robots, tdm };
}

const pathOf = (url: URL) => `${url.pathname}${url.search}`;

function toRows(feed: FeedConfig, xml: string, now: Date, config: Config): { rows: ArticleRow[]; items: number } {
  const items = parseFeed(xml).slice(0, config.maxItemsPerFeed);
  const oldest = now.getTime() - config.maxAgeDays * 86_400_000;
  const rows: ArticleRow[] = [];
  for (const item of items) {
    let absolute: string;
    try {
      absolute = new URL(item.link, feed.url).toString();
    } catch {
      continue;
    }
    const url = canonicalUrl(absolute);
    // The table allows 500 characters. A headline longer than that is broken, so it is cut.
    const title = cleanText(item.title).slice(0, 300);
    if (!url || !title) continue;
    const publishedAt = parseDate(item.published);
    if (publishedAt && Date.parse(publishedAt) < oldest) continue;
    const lead = shortLead(cleanText(item.summary), config.maxLeadLength);
    rows.push({
      url,
      source: feed.source,
      feed_url: feed.url,
      title,
      lead: lead && lead !== title ? lead : null,
      published_at: publishedAt,
      fingerprint: fingerprint(title, lead),
      feed_kind: feed.kind,
      language: feed.language,
    });
  }
  return { rows, items: items.length };
}

type FeedResult = { state: FeedState; rows: ArticleRow[]; outcome: FeedStatusCode | "skipped" };

function nextState(previous: FeedState | undefined, feed: FeedConfig, now: Date, patch: Partial<FeedState>): FeedState {
  return {
    url: feed.url,
    source: feed.source,
    checked_at: now.toISOString(),
    status: "new",
    http_status: null,
    etag: previous?.etag ?? null,
    last_modified: previous?.last_modified ?? null,
    items: 0,
    failures: 0,
    error: null,
    ...patch,
  };
}

async function collectFeed(
  feed: FeedConfig,
  previous: FeedState | undefined,
  rules: OriginRules,
  deps: CollectDeps,
  now: Date,
  config: Config,
): Promise<FeedResult> {
  // A feed that keeps failing is only tried again after the backoff time.
  if (previous && previous.failures >= config.failuresBeforeBackoff && previous.checked_at) {
    const since = now.getTime() - Date.parse(previous.checked_at);
    if (since < config.backoffHours * 3_600_000) return { state: previous, rows: [], outcome: "skipped" };
  }

  const url = new URL(feed.url);
  const allowed =
    rules.robots === "allow-all" ? true : rules.robots === "disallow-all" ? false : isAllowed(rules.robots, config.userAgentToken, pathOf(url));
  if (!allowed) {
    return { state: nextState(previous, feed, now, { status: "blocked_robots" }), rows: [], outcome: "blocked_robots" };
  }
  const fileReservation = reservedByFile(rules.tdm, pathOf(url));
  if (fileReservation === true) {
    return { state: nextState(previous, feed, now, { status: "reserved_tdm" }), rows: [], outcome: "reserved_tdm" };
  }

  const headers: Record<string, string> = {
    "User-Agent": config.userAgent,
    Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
  };
  if (previous?.etag) headers["If-None-Match"] = previous.etag;
  if (previous?.last_modified) headers["If-Modified-Since"] = previous.last_modified;

  let response: Response;
  try {
    response = await deps.fetch(feed.url, { headers, signal: AbortSignal.timeout(config.timeoutMs) });
  } catch (error) {
    const failures = (previous?.failures ?? 0) + 1;
    return {
      state: nextState(previous, feed, now, { status: "fetch_error", failures, error: (error as Error).message.slice(0, 300) }),
      rows: [],
      outcome: "fetch_error",
    };
  }

  if (response.status === 304) {
    await response.body?.cancel();
    return { state: nextState(previous, feed, now, { status: "not_modified", http_status: 304, items: previous?.items ?? 0 }), rows: [], outcome: "not_modified" };
  }
  if (!response.ok) {
    await response.body?.cancel();
    const failures = (previous?.failures ?? 0) + 1;
    return {
      state: nextState(previous, feed, now, { status: "http_error", http_status: response.status, failures, etag: null, last_modified: null }),
      rows: [],
      outcome: "http_error",
    };
  }
  // The response header is more specific than the site-wide file, so it decides when it is set.
  if (isReserved(reservationFromHeader(response.headers.get("tdm-reservation")), fileReservation)) {
    await response.body?.cancel();
    return { state: nextState(previous, feed, now, { status: "reserved_tdm", http_status: response.status }), rows: [], outcome: "reserved_tdm" };
  }

  const cache = { etag: response.headers.get("etag"), last_modified: response.headers.get("last-modified") };
  try {
    const { rows, items } = toRows(feed, await readText(response, config.maxResponseBytes), now, config);
    return { state: nextState(previous, feed, now, { status: "ok", http_status: response.status, items, ...cache }), rows, outcome: "ok" };
  } catch (error) {
    const failures = (previous?.failures ?? 0) + 1;
    const message = error instanceof FeedParseError ? error.message : `Oväntat fel: ${(error as Error).message}`;
    return {
      state: nextState(previous, feed, now, { status: "parse_error", http_status: response.status, failures, error: message.slice(0, 300) }),
      rows: [],
      outcome: "parse_error",
    };
  }
}

/** Runs `tasks` with at most `limit` at a time. */
async function pool<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  });
  await Promise.all(workers);
  return results;
}

export async function collect(deps: CollectDeps): Promise<CollectStats> {
  const config = deps.config ?? collectConfig;
  const now = (deps.now ?? (() => new Date()))();
  const feeds = deps.feeds.filter((feed) => feed.active);
  const states = await deps.store.getStates(feeds.map((feed) => feed.url));

  // One outlet's feeds are fetched one after the other, outlets in parallel.
  const byOrigin = new Map<string, FeedConfig[]>();
  for (const feed of feeds) {
    const origin = new URL(feed.url).origin;
    byOrigin.set(origin, [...(byOrigin.get(origin) ?? []), feed]);
  }

  const perOrigin = await pool(
    [...byOrigin.entries()].map(([origin, list]) => async () => {
      const rules = await originRules(origin, deps, config);
      const results: FeedResult[] = [];
      for (const feed of list) results.push(await collectFeed(feed, states.get(feed.url), rules, deps, now, config));
      return results;
    }),
    config.concurrency,
  );
  const results = perOrigin.flat();

  // The same article can be in two feeds from one outlet. An opinion feed says more, so it wins.
  const unique = new Map<string, ArticleRow>();
  for (const row of results.flatMap((result) => result.rows)) {
    const seen = unique.get(row.url);
    if (!seen || (seen.feed_kind === "news" && row.feed_kind === "opinion")) unique.set(row.url, row);
  }
  const newArticles = unique.size ? await deps.store.saveArticles([...unique.values()]) : 0;
  await deps.store.saveStates(results.filter((result) => result.outcome !== "skipped").map((result) => result.state));

  const count = (...outcomes: FeedResult["outcome"][]) => results.filter((result) => outcomes.includes(result.outcome)).length;
  return {
    feeds: feeds.length,
    ok: count("ok"),
    notModified: count("not_modified"),
    blocked: count("blocked_robots"),
    reserved: count("reserved_tdm"),
    skipped: count("skipped"),
    failed: count("http_error", "parse_error", "fetch_error"),
    items: results.reduce((sum, result) => sum + (result.outcome === "ok" ? result.state.items : 0), 0),
    newArticles,
  };
}
