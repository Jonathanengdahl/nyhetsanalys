import { teasers as teaserData } from "@/content/teasers";
import { topics as topicData } from "@/content/topics";
import { keepNumbersTogether } from "@/lib/format";
import type { Topic, TopicCategory, TopicTeaser } from "./types";

/*
 * Data layer for topics: the hand-written topics in src/content/ plus the
 * pages the analysis job wrote and Jonathan published (Supabase, see
 * remote.ts). Both have the same shape, so the pages do not care where a
 * topic comes from. Published pages from Supabase come first, newest first.
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

/** The same tidying for a topic shown outside the data layer, such as a draft in admin. */
export const tidyTopic = (topic: Topic): Topic => tidy(topic);

const localTopics: Topic[] = topicData.map(tidy);
const teasers: TopicTeaser[] = teaserData.map(tidy);

const byRank = <T extends { rank: number }>(a: T, b: T) => a.rank - b.rank;

const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

/** Published pages from Supabase, ranked before the local topics. A local topic keeps its address if both have it. */
async function allTopics(): Promise<Topic[]> {
  const local = [...localTopics].sort(byRank);
  if (!hasSupabase()) return local;
  const { publishedPages } = await import("./remote");
  const localSlugs = new Set(local.map((topic) => topic.slug));
  const remote = (await publishedPages()).filter((topic) => !localSlugs.has(topic.slug)).map(tidy);
  return [...remote.map((topic, index) => ({ ...topic, rank: index + 1 })), ...local.map((topic) => ({ ...topic, rank: topic.rank + remote.length }))];
}

export async function getPublishedTopics(): Promise<Topic[]> {
  return allTopics();
}

export async function getTopic(slug: string): Promise<Topic | null> {
  return (await allTopics()).find((topic) => topic.slug === slug) ?? null;
}

export async function getTopicSlugs(): Promise<string[]> {
  return (await allTopics()).map((topic) => topic.slug);
}

export async function getTeasers(): Promise<TopicTeaser[]> {
  return [...teasers].sort(byRank);
}

/** Most recent update across all published topics. */
export async function getLatestUpdate(): Promise<string | null> {
  const dates = (await allTopics()).map((topic) => topic.updatedAt).sort();
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

/** The topic in five cards: a short version to swipe through. */
export function topicCardsPath(slug: string) {
  return `${topicPath(slug)}/kort`;
}
