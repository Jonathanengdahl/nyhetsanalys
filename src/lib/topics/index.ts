import { teasers as teaserData } from "@/content/teasers";
import { topics as topicData } from "@/content/topics";
import { keepNumbersTogether } from "@/lib/format";
import type { Topic, TopicCategory, TopicTeaser } from "./types";

/*
 * Data layer for topics. Reads the example data in src/content/ for now.
 * The functions are async and return the same shapes the Supabase version
 * will return, so the pages do not change when the data source does.
 */

/** Runs every string in a value through `fn`, keeping the shape. */
function mapStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, fn)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapStrings(item, fn)])) as T;
  }
  return value;
}

/** Text tidying that applies to all content, whatever the source. */
const tidy = <T>(value: T) => mapStrings(value, keepNumbersTogether);

const topics: Topic[] = topicData.map(tidy);
const teasers: TopicTeaser[] = teaserData.map(tidy);

const byRank = <T extends { rank: number }>(a: T, b: T) => a.rank - b.rank;

export async function getPublishedTopics(): Promise<Topic[]> {
  return [...topics].sort(byRank);
}

export async function getTopic(slug: string): Promise<Topic | null> {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export async function getTopicSlugs(): Promise<string[]> {
  return topics.map((topic) => topic.slug);
}

export async function getTeasers(): Promise<TopicTeaser[]> {
  return [...teasers].sort(byRank);
}

/** Most recent update across all published topics. */
export async function getLatestUpdate(): Promise<string | null> {
  const dates = topics.map((topic) => topic.updatedAt).sort();
  return dates.at(-1) ?? null;
}

export const categoryLabels: Record<TopicCategory, string> = {
  inrikes: "Inrikes",
  utrikes: "Utrikes",
  ekonomi: "Ekonomi",
  politik: "Politik",
};

export function topicPath(slug: string) {
  return `/amne/${slug}`;
}
