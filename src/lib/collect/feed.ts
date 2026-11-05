import { XMLParser } from "fast-xml-parser";
import type { FeedItem } from "./types";

/*
 * RSS 2.0, RSS 1.0 (RDF) and Atom. We take the headline, the link, the date
 * and the short description. Full text fields such as content:encoded are
 * never read, since we only keep the headline, the lead and the link.
 */

const LIST_TAGS = new Set(["item", "entry", "link"]);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Keep values as text, so a headline like "2026" stays a string.
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  htmlEntities: true,
  isArray: (name) => LIST_TAGS.has(name),
});

type Node = Record<string, unknown>;

const asNode = (value: unknown): Node | null => (typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Node) : null);

/** Text of an element that may have attributes or be a list. */
function text(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return text(value[0]);
  const node = asNode(value);
  if (node && "#text" in node) return text(node["#text"]);
  return undefined;
}

/** RSS has the link as text. Atom has link elements with href, where rel="alternate" (or no rel) is the article. */
function linkOf(value: unknown): string | undefined {
  const links = Array.isArray(value) ? value : value === undefined ? [] : [value];
  for (const link of links) {
    const node = asNode(link);
    if (!node) {
      const plain = text(link);
      if (plain) return plain;
      continue;
    }
    const rel = typeof node["@_rel"] === "string" ? node["@_rel"] : "alternate";
    if (rel === "alternate" && typeof node["@_href"] === "string") return node["@_href"];
    const plain = text(node);
    if (plain) return plain;
  }
  return undefined;
}

function rssItem(item: Node): FeedItem | null {
  const title = text(item.title);
  const link = linkOf(item.link) ?? (asNode(item.guid)?.["@_isPermaLink"] !== "false" ? text(item.guid) : undefined);
  if (!title || !link) return null;
  return {
    title,
    link,
    guid: text(item.guid),
    published: text(item.pubDate) ?? text(item["dc:date"]),
    summary: text(item.description),
  };
}

function atomEntry(entry: Node): FeedItem | null {
  const title = text(entry.title);
  const link = linkOf(entry.link);
  if (!title || !link) return null;
  return {
    title,
    link,
    guid: text(entry.id),
    published: text(entry.published) ?? text(entry.updated),
    summary: text(entry.summary),
  };
}

export class FeedParseError extends Error {}

/** The items in a feed, in the order the feed lists them. */
export function parseFeed(xml: string): FeedItem[] {
  let data: Node;
  try {
    data = parser.parse(xml) as Node;
  } catch (error) {
    throw new FeedParseError(`Kunde inte läsa flödet: ${(error as Error).message}`);
  }

  const rss = asNode(data.rss);
  if (rss) {
    const channel = asNode(Array.isArray(rss.channel) ? rss.channel[0] : rss.channel);
    const items = (channel?.item as unknown[] | undefined) ?? [];
    return items.flatMap((item) => {
      const node = asNode(item);
      const parsed = node ? rssItem(node) : null;
      return parsed ? [parsed] : [];
    });
  }

  const rdf = asNode(data["rdf:RDF"]);
  if (rdf) {
    const items = (rdf.item as unknown[] | undefined) ?? [];
    return items.flatMap((item) => {
      const node = asNode(item);
      const parsed = node ? rssItem(node) : null;
      return parsed ? [parsed] : [];
    });
  }

  const feed = asNode(data.feed);
  if (feed) {
    const entries = (feed.entry as unknown[] | undefined) ?? [];
    return entries.flatMap((entry) => {
      const node = asNode(entry);
      const parsed = node ? atomEntry(node) : null;
      return parsed ? [parsed] : [];
    });
  }

  throw new FeedParseError("Svaret är varken RSS eller Atom.");
}
