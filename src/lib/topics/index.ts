import { teasers } from "@/content/teasers";
import { topics } from "@/content/topics";
import type { Topic, TopicCategory, TopicTeaser } from "./types";

/*
 * Data layer for topics. Reads the example data in src/content/ for now.
 * The functions are async and return the same shapes the Supabase version
 * will return, so the pages do not change when the data source does.
 */

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
