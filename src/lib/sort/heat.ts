import { sortConfig } from "@/config/sort";
import type { MediaHouse } from "@/lib/collect/types";

/*
 * Heat is counted by the server from the articles, never guessed by the AI.
 * The rules are in docs/produkt.md: at least 5 independent sources within
 * 48 hours, from at least 3 media houses, and at least one national outlet.
 * The same TT text in several papers counts as one source (same fingerprint).
 */

export interface HeatArticle {
  source: string;
  fingerprint: string;
  published_at: string | null;
  fetched_at: string;
}

export interface Outlet {
  house: MediaHouse;
  national: boolean;
}

export interface Heat {
  /** Independent sources: articles with different text. */
  sources: number;
  /** Outlets that wrote about the topic. */
  outlets: number;
  houses: number;
  national: number;
  /** Articles in the last few hours. */
  fresh: number;
  hot: boolean;
  score: number;
  /** When the newest and oldest article in the window were published. */
  first: string | null;
  last: string | null;
}

const timeOf = (article: HeatArticle) => Date.parse(article.published_at ?? article.fetched_at);

/** The heat of one topic from its articles, at the moment `now`. */
export function measureHeat(articles: HeatArticle[], outlets: Map<string, Outlet>, now: Date, config = sortConfig): Heat {
  const windowStart = now.getTime() - config.threshold.windowHours * 3_600_000;
  const freshStart = now.getTime() - config.freshHours * 3_600_000;
  // A published time in the future is a feed error; it counts as now.
  const inWindow = articles.filter((article) => Math.min(timeOf(article), now.getTime()) >= windowStart);

  const fingerprints = new Set(inWindow.map((article) => article.fingerprint));
  const sources = new Set(inWindow.map((article) => article.source));
  const houses = new Set<MediaHouse>();
  const national = new Set<string>();
  for (const source of sources) {
    const outlet = outlets.get(source);
    if (!outlet) continue;
    houses.add(outlet.house);
    if (outlet.national) national.add(source);
  }
  const fresh = inWindow.filter((article) => timeOf(article) >= freshStart).length;
  const times = inWindow.map(timeOf).filter(Number.isFinite).sort((a, b) => a - b);

  const { threshold } = config;
  const hot = fingerprints.size >= threshold.sources && houses.size >= threshold.houses && national.size >= threshold.national;
  // Breadth weighs most: many houses matter more than many articles from one.
  const score = fingerprints.size + sources.size * 2 + houses.size * 4 + fresh * 2;

  return {
    sources: fingerprints.size,
    outlets: sources.size,
    houses: houses.size,
    national: national.size,
    fresh,
    hot,
    score,
    first: times.length ? new Date(times[0]).toISOString() : null,
    last: times.length ? new Date(Math.min(times[times.length - 1], now.getTime())).toISOString() : null,
  };
}

/** The topic's status after a new measurement. Jonathan's decisions are never overwritten. */
export function nextStatus(current: string, heat: Heat): "watching" | "hot" | "approved" | "rejected" {
  if (current === "approved" || current === "rejected") return current;
  return heat.hot ? "hot" : "watching";
}
