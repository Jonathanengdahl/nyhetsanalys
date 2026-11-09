import { createHash } from "node:crypto";

/*
 * Cleaning what the feeds give us: one address per article, plain text
 * without HTML, a short lead and a fingerprint that is the same when the same
 * TT text appears in several outlets.
 */

const TRACKING = /^(utm_[a-z]+|fbclid|gclid|mc_cid|mc_eid|ref|cmpid|xtor)$/i;

/** The article's address without tracking parameters and fragment, so the same article is stored once. */
export function canonicalUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();
  for (const key of [...url.searchParams.keys()]) if (TRACKING.test(key)) url.searchParams.delete(key);
  url.search = url.searchParams.toString() ? `?${url.searchParams.toString()}` : "";
  return url.toString();
}

const NAMED: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  laquo: "«",
  raquo: "»",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  aring: "å",
  Aring: "Å",
  auml: "ä",
  Auml: "Ä",
  ouml: "ö",
  Ouml: "Ö",
  eacute: "é",
  Eacute: "É",
  uuml: "ü",
  Uuml: "Ü",
};

/** Entities that are still left once the XML parser has done its work, for example in HTML inside a description. */
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === "#") {
      const value = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) && value > 0 && value < 0x110000 ? String.fromCodePoint(value) : whole;
    }
    return NAMED[code] ?? whole;
  });
}

/** Plain text: no HTML tags or scripts, entities decoded and white space collapsed. */
export function cleanText(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return "";
  return decodeEntities(
    String(value)
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      // Block tags separate words, inline tags (b, a, span) do not.
      .replace(/<\/?(p|div|li|ul|ol|h[1-6]|br|tr|td|blockquote|figure|figcaption)\b[^>]*>/gi, " ")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}

/** The lead, cut at a word near `max` characters with an ellipsis. Never the full text. */
export function shortLead(text: string, max: number): string | null {
  const clean = text.trim();
  if (!clean) return null;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  // Keep the last word when the cut already falls between two words.
  const space = /\s/.test(clean[max] ?? "") ? max : cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:–-]+$/, "")} …`;
}

/** The same text gives the same fingerprint, regardless of case, punctuation and spacing. */
export function fingerprint(title: string, lead: string | null): string {
  const normalized = `${title} ${lead ?? ""}`
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(" ")
    .slice(0, 40)
    .join(" ");
  return createHash("sha256").update(normalized).digest("hex").slice(0, 32);
}

/** An ISO time from the dates feeds use (RFC 822 in RSS, RFC 3339 in Atom), or null. */
export function parseDate(value: string | undefined): string | null {
  if (!value) return null;
  const time = Date.parse(value.trim());
  return Number.isFinite(time) ? new Date(time).toISOString() : null;
}
