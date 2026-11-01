import { media } from "@/content/media";
import { keepNumbersTogether } from "@/lib/format";
import type { Topic } from "@/lib/topics/types";
import type { MediaFact, MediaOutlet } from "./types";

export type { MediaFact, MediaOutlet } from "./types";

const byName = new Map<string, MediaOutlet>();
for (const outlet of media) {
  for (const name of [outlet.name, ...outlet.aliases]) byName.set(name.toLowerCase(), outlet);
}

function together<T extends MediaFact | undefined>(fact: T): T {
  return (fact ? { ...fact, text: keepNumbersTogether(fact.text) } : fact) as T;
}

/** The register as the page shows it. Numbers like 70 000 never split across two lines. */
const prepared: MediaOutlet[] = media.map((outlet) => ({
  ...outlet,
  publisher: together(outlet.publisher),
  owner: together(outlet.owner),
  ownerType: together(outlet.ownerType),
  funding: together(outlet.funding),
  mediaSupport: together(outlet.mediaSupport),
  editorialLabel: together(outlet.editorialLabel),
  changes: together(outlet.changes),
}));

export async function getMediaOutlets(): Promise<MediaOutlet[]> {
  return prepared;
}

/** The medium behind an outlet name in the article data, if we have it. */
export function outletFor(name: string): MediaOutlet | undefined {
  return byName.get(name.toLowerCase());
}

/** Which topics use articles from each medium, and how many. */
export function mediaUsage(topics: Topic[]): Map<string, { topic: Topic; articles: number }[]> {
  const usage = new Map<string, { topic: Topic; articles: number }[]>();
  for (const topic of topics) {
    const counts = new Map<string, number>();
    for (const article of topic.articles) {
      const outlet = outletFor(article.outlet);
      if (outlet) counts.set(outlet.slug, (counts.get(outlet.slug) ?? 0) + 1);
    }
    for (const [slug, articles] of counts) usage.set(slug, [...(usage.get(slug) ?? []), { topic, articles }]);
  }
  return usage;
}

/** How many different media a topic's articles come from. */
export function countMedia(topic: Topic): number {
  return new Set(topic.articles.map((article) => outletFor(article.outlet)?.slug ?? article.outlet.toLowerCase())).size;
}
