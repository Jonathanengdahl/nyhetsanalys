import type { PrimarySource } from "./draft";

/*
 * Reads the answer from the research call: the text with its citations.
 * Only pages the model actually cited become sources, each with the
 * excerpts it cited. Pages outside the allowed domains are dropped, in case
 * the API ever returns one.
 */

interface CitationLike {
  type: string;
  url?: string;
  title?: string | null;
  cited_text?: string;
}

interface BlockLike {
  type: string;
  text?: string;
  citations?: CitationLike[] | null;
}

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export function allowedUrl(url: string, domains: readonly string[]): boolean {
  if (!url.startsWith("https://")) return false;
  const name = host(url);
  return domains.some((domain) => name === domain || name.endsWith(`.${domain}`));
}

/** A readable name for a source from its address, for example "scb.se" becomes "SCB". */
const knownNames: Record<string, string> = {
  "regeringen.se": "Regeringskansliet",
  "riksdagen.se": "Riksdagen",
  "scb.se": "SCB",
  "riksbank.se": "Riksbanken",
  "konj.se": "Konjunkturinstitutet",
  "esv.se": "Ekonomistyrningsverket",
  "arbetsformedlingen.se": "Arbetsförmedlingen",
  "forsakringskassan.se": "Försäkringskassan",
  "polisen.se": "Polisen",
  "msb.se": "MSB",
  "folkhalsomyndigheten.se": "Folkhälsomyndigheten",
  "migrationsverket.se": "Migrationsverket",
  "val.se": "Valmyndigheten",
  "europa.eu": "EU",
  "eurostat.ec.europa.eu": "Eurostat",
  "un.org": "FN",
  "oecd.org": "OECD",
  "imf.org": "IMF",
};

export function sourceName(url: string): string {
  const name = host(url);
  const match = Object.keys(knownNames)
    .sort((a, b) => b.length - a.length)
    .find((domain) => name === domain || name.endsWith(`.${domain}`));
  return match ? knownNames[match] : name;
}

export function readResearch(blocks: BlockLike[], firstNumber: number, domains: readonly string[], maxExcerpts = 3): { primary: PrimarySource[]; notes: string } {
  const byUrl = new Map<string, PrimarySource>();
  const notes: string[] = [];
  for (const block of blocks) {
    if (block.type !== "text" || !block.text) continue;
    notes.push(block.text.trim());
    for (const citation of block.citations ?? []) {
      if (citation.type !== "web_search_result_location" || !citation.url || !allowedUrl(citation.url, domains)) continue;
      const url = citation.url;
      const source = byUrl.get(url) ?? { n: 0, name: sourceName(url), title: citation.title?.trim() || sourceName(url), url, excerpts: [] };
      const excerpt = citation.cited_text?.trim().replace(/\s+/g, " ").slice(0, 400);
      if (excerpt && !source.excerpts.includes(excerpt) && source.excerpts.length < maxExcerpts) source.excerpts.push(excerpt);
      byUrl.set(url, source);
    }
  }
  const primary = [...byUrl.values()].map((source, index) => ({ ...source, n: firstNumber + index }));
  return { primary, notes: notes.filter(Boolean).join("\n").slice(0, 6000) };
}
