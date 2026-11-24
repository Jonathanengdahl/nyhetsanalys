import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Topic } from "./types";
import { topicProblems } from "./validate";

/*
 * Published topic pages from Supabase (table topic_pages), written by the
 * analysis job and published by Jonathan. Cached under the tag "topics",
 * which admin expires when a page is published or taken down. If the table
 * is missing or Supabase cannot be reached, the site keeps working with the
 * local topics only.
 */

export const TOPICS_TAG = "topics";

export async function publishedPages(): Promise<Topic[]> {
  "use cache";
  cacheTag(TOPICS_TAG);
  cacheLife("hours");
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("topic_pages")
      .select("data, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error(`topic_pages: ${error.message}`);
      return [];
    }
    // A page is shown only if it still passes every check, in case the shape changed after it was published.
    return ((data ?? []) as { data: Topic | null }[]).flatMap((row) => (row.data && topicProblems(row.data).length === 0 ? [row.data] : []));
  } catch (error) {
    console.error(`topic_pages: ${(error as Error).message}`);
    return [];
  }
}
