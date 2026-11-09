import { describe, expect, it } from "vitest";
import { feeds } from "@/content/feeds";
import { collectConfig } from "@/config/collect";
import { collect, type CollectStore } from "./run";
import type { ArticleRow, FeedConfig, FeedState } from "./types";

const NOW = new Date("2026-11-05T12:00:00Z");

const feed = (patch: Partial<FeedConfig> = {}): FeedConfig => ({
  url: "https://www.exempel.se/rss.xml",
  source: "exempel",
  name: "Exempel",
  house: "public-service",
  kind: "news",
  national: true,
  language: "sv",
  foundAt: "test",
  active: true,
  ...patch,
});

const item = (title: string, link: string, date = "Thu, 05 Nov 2026 10:00:00 +0100", description = "Ingressen.") =>
  `<item><title>${title}</title><link>${link}</link><pubDate>${date}</pubDate><description>${description}</description></item>`;
const rss = (...items: string[]) => `<?xml version="1.0"?><rss version="2.0"><channel><title>T</title>${items.join("")}</channel></rss>`;

type Route = { status?: number; body?: string; headers?: Record<string, string> } | "network";

/** A fake web: a map from address to answer, recording every request. */
function web(routes: Record<string, Route>) {
  const requests: { url: string; headers: Record<string, string> }[] = [];
  const fetchFake = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, headers: (init?.headers as Record<string, string>) ?? {} });
    const route = routes[url] ?? { status: 404, body: "" };
    if (route === "network") throw new Error("connect ECONNREFUSED");
    const status = route.status ?? 200;
    // Responses such as 304 may not have a body.
    return new Response([204, 304].includes(status) ? null : (route.body ?? ""), { status, headers: route.headers });
  }) as typeof fetch;
  return { fetch: fetchFake, requests };
}

function memoryStore(initial: FeedState[] = []) {
  const states = new Map(initial.map((state) => [state.url, state]));
  const articles = new Map<string, ArticleRow>();
  const store: CollectStore = {
    async getStates(urls) {
      return new Map(urls.flatMap((url) => (states.has(url) ? [[url, states.get(url) as FeedState]] : [])));
    },
    async saveStates(list) {
      for (const state of list) states.set(state.url, state);
    },
    async saveArticles(rows) {
      let added = 0;
      for (const row of rows) {
        if (articles.has(row.url)) continue;
        articles.set(row.url, row);
        added += 1;
      }
      return added;
    },
  };
  return { store, states, articles };
}

const ROBOTS_OK = { body: "User-agent: *\nDisallow: /admin\n" };

describe("collecting", () => {
  it("stores headline, lead and link, without tracking and old items", async () => {
    const { fetch, requests } = web({
      "https://www.exempel.se/robots.txt": ROBOTS_OK,
      "https://www.exempel.se/rss.xml": {
        body: rss(
          item("Riksbanken höjer räntan", "https://www.exempel.se/a?utm_source=rss", undefined, "&lt;p&gt;Styrräntan höjs.&lt;/p&gt;"),
          item("Gammal nyhet", "https://www.exempel.se/b", "Mon, 26 Oct 2026 10:00:00 +0100"),
          item("Samma igen", "https://www.exempel.se/a#kommentarer"),
        ),
        headers: { etag: '"v1"' },
      },
    });
    const { store, articles, states } = memoryStore();
    const stats = await collect({ fetch, store, feeds: [feed()], now: () => NOW });

    expect(stats).toMatchObject({ feeds: 1, ok: 1, items: 3, newArticles: 1 });
    expect([...articles.values()]).toEqual([
      expect.objectContaining({ url: "https://www.exempel.se/a", title: "Riksbanken höjer räntan", lead: "Styrräntan höjs.", feed_kind: "news" }),
    ]);
    expect(states.get("https://www.exempel.se/rss.xml")).toMatchObject({ status: "ok", etag: '"v1"', failures: 0 });
    // Our own user agent on every request.
    expect(requests.every((request) => request.headers["User-Agent"]?.startsWith(collectConfig.userAgentToken))).toBe(true);
  });

  it("never fetches a feed that robots.txt closes to us", async () => {
    const { fetch, requests } = web({
      "https://www.exempel.se/robots.txt": { body: "User-agent: NyhetsanalysBot\nDisallow: /\n" },
      "https://www.exempel.se/rss.xml": { body: rss(item("X", "https://www.exempel.se/x")) },
    });
    const { store, articles, states } = memoryStore();
    const stats = await collect({ fetch, store, feeds: [feed()], now: () => NOW });
    expect(stats.blocked).toBe(1);
    expect(articles.size).toBe(0);
    expect(requests.map((request) => request.url)).not.toContain("https://www.exempel.se/rss.xml");
    expect(states.get("https://www.exempel.se/rss.xml")?.status).toBe("blocked_robots");
  });

  it("treats an unreachable robots.txt as closed, and a missing one as open", async () => {
    const closed = web({ "https://www.exempel.se/robots.txt": { status: 503 }, "https://www.exempel.se/rss.xml": { body: rss() } });
    expect((await collect({ fetch: closed.fetch, store: memoryStore().store, feeds: [feed()], now: () => NOW })).blocked).toBe(1);
    const open = web({ "https://www.exempel.se/robots.txt": { status: 404 }, "https://www.exempel.se/rss.xml": { body: rss() } });
    expect((await collect({ fetch: open.fetch, store: memoryStore().store, feeds: [feed()], now: () => NOW })).ok).toBe(1);
  });

  it("respects a reservation in the response header and in tdmrep.json", async () => {
    const header = web({
      "https://www.exempel.se/robots.txt": ROBOTS_OK,
      "https://www.exempel.se/rss.xml": { body: rss(item("X", "https://www.exempel.se/x")), headers: { "tdm-reservation": "1" } },
    });
    const first = memoryStore();
    expect((await collect({ fetch: header.fetch, store: first.store, feeds: [feed()], now: () => NOW })).reserved).toBe(1);
    expect(first.articles.size).toBe(0);

    const file = web({
      "https://www.exempel.se/robots.txt": ROBOTS_OK,
      "https://www.exempel.se/.well-known/tdmrep.json": { body: JSON.stringify([{ location: "/", "tdm-reservation": 1 }]) },
      "https://www.exempel.se/rss.xml": { body: rss(item("X", "https://www.exempel.se/x")) },
    });
    const second = memoryStore();
    expect((await collect({ fetch: file.fetch, store: second.store, feeds: [feed()], now: () => NOW })).reserved).toBe(1);
    expect(file.requests.map((request) => request.url)).not.toContain("https://www.exempel.se/rss.xml");
  });

  it("asks only for changes, and backs off from a feed that keeps failing", async () => {
    const previous: FeedState = {
      url: "https://www.exempel.se/rss.xml",
      source: "exempel",
      checked_at: "2026-11-05T11:45:00Z",
      status: "ok",
      http_status: 200,
      etag: '"v1"',
      last_modified: null,
      items: 12,
      failures: 0,
      error: null,
    };
    const unchanged = web({ "https://www.exempel.se/robots.txt": ROBOTS_OK, "https://www.exempel.se/rss.xml": { status: 304 } });
    const memory = memoryStore([previous]);
    expect((await collect({ fetch: unchanged.fetch, store: memory.store, feeds: [feed()], now: () => NOW })).notModified).toBe(1);
    expect(unchanged.requests.find((request) => request.url.endsWith("rss.xml"))?.headers["If-None-Match"]).toBe('"v1"');
    expect(memory.states.get(previous.url)).toMatchObject({ status: "not_modified", items: 12, etag: '"v1"' });

    const broken = web({ "https://www.exempel.se/robots.txt": ROBOTS_OK, "https://www.exempel.se/rss.xml": { status: 500 } });
    const failing = memoryStore([{ ...previous, failures: 2, etag: null }]);
    await collect({ fetch: broken.fetch, store: failing.store, feeds: [feed()], now: () => NOW });
    expect(failing.states.get(previous.url)).toMatchObject({ status: "http_error", http_status: 500, failures: 3 });

    const later = web({ "https://www.exempel.se/robots.txt": ROBOTS_OK, "https://www.exempel.se/rss.xml": { status: 500 } });
    const stats = await collect({ fetch: later.fetch, store: failing.store, feeds: [feed()], now: () => new Date("2026-11-05T18:00:00Z") });
    expect(stats.skipped).toBe(1);
    expect(later.requests.map((request) => request.url)).not.toContain("https://www.exempel.se/rss.xml");
  });

  it("records network errors and feeds that cannot be read", async () => {
    const { fetch } = web({
      "https://www.exempel.se/robots.txt": ROBOTS_OK,
      "https://www.exempel.se/rss.xml": "network",
      "https://www.exempel.se/trasig.xml": { body: "<html>Inte ett flöde</html>" },
    });
    const { store, states } = memoryStore();
    const stats = await collect({ fetch, store, feeds: [feed(), feed({ url: "https://www.exempel.se/trasig.xml" })], now: () => NOW });
    expect(stats.failed).toBe(2);
    expect(states.get("https://www.exempel.se/rss.xml")).toMatchObject({ status: "fetch_error", failures: 1 });
    expect(states.get("https://www.exempel.se/trasig.xml")?.status).toBe("parse_error");
  });

  it("marks an article from both the news and the opinion feed as opinion", async () => {
    const { fetch } = web({
      "https://www.exempel.se/robots.txt": ROBOTS_OK,
      "https://www.exempel.se/rss.xml": { body: rss(item("Ledare: budgeten", "https://www.exempel.se/ledare/1")) },
      "https://www.exempel.se/ledare.xml": { body: rss(item("Ledare: budgeten", "https://www.exempel.se/ledare/1")) },
    });
    const { store, articles } = memoryStore();
    await collect({ fetch, store, feeds: [feed(), feed({ url: "https://www.exempel.se/ledare.xml", kind: "opinion" })], now: () => NOW });
    expect(articles.get("https://www.exempel.se/ledare/1")?.feed_kind).toBe("opinion");
  });

  it("skips feeds that are switched off", async () => {
    const { fetch, requests } = web({});
    const stats = await collect({ fetch, store: memoryStore().store, feeds: [feed({ active: false })], now: () => NOW });
    expect(stats.feeds).toBe(0);
    expect(requests).toHaveLength(0);
  });
});

describe("the feed list", () => {
  it("has unique https addresses and outlets with clean slugs", () => {
    expect(new Set(feeds.map((item) => item.url)).size).toBe(feeds.length);
    for (const item of feeds) {
      expect(new URL(item.url).protocol, item.url).toBe("https:");
      expect(item.source).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.foundAt.length).toBeGreaterThan(0);
    }
  });

  it("reads at least three media houses, so a topic can reach the threshold", () => {
    const houses = new Set(feeds.filter((item) => item.active && item.kind === "news").map((item) => item.house));
    expect(houses.size).toBeGreaterThanOrEqual(3);
  });
});
