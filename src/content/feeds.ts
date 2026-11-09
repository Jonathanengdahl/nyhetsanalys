import type { FeedConfig } from "@/lib/collect/types";

/*
 * The feeds the pilot reads (decision 5 November 2026: about ten Swedish
 * outlets). Only headline, lead and link are kept. Before every fetch the
 * collector checks robots.txt and reservations against text and data mining,
 * and outlets that do not allow us are skipped and shown as such.
 *
 * `house` groups outlets by owner, so outlets in the same group count as one
 * media house in the threshold for a topic: Bonnier News (DN, Expressen,
 * Sydsvenskan), Schibsted Media (SvD, Aftonbladet, TV4), public service (SVT,
 * Sveriges Radio), Stampen (GP) and Altinget. TV4's owner is sourced in
 * src/content/media.ts. The others should be added there with sources before
 * their articles appear on topic pages.
 *
 * The addresses were found in public feed lists (`foundAt`) and are checked by
 * the first run: a wrong address shows up as an error in the table feed_status.
 */

const news = { kind: "news", national: true, language: "sv", active: true } as const;
const opinion = { kind: "opinion", national: true, language: "sv", active: true } as const;

export const feeds: FeedConfig[] = [
  { ...news, source: "svt", name: "SVT Nyheter", house: "public-service", url: "https://www.svt.se/nyheter/rss.xml", foundAt: "feeder.co" },
  { ...news, source: "sveriges-radio", name: "Sveriges Radio Ekot", house: "public-service", url: "https://api.sr.se/api/rss/program/83", foundAt: "feeder.co" },
  { ...news, source: "dn", name: "Dagens Nyheter", house: "bonnier-news", url: "https://www.dn.se/rss/", foundAt: "feedspot.com" },
  { ...news, source: "expressen", name: "Expressen", house: "bonnier-news", url: "https://www.expressen.se/rss/nyheter", foundAt: "feeder.co" },
  { ...news, source: "sydsvenskan", name: "Sydsvenskan", house: "bonnier-news", national: false, url: "https://www.sydsvenskan.se/rss.xml?latest", foundAt: "feeder.co" },
  { ...news, source: "svd", name: "Svenska Dagbladet", house: "schibsted-media", url: "https://www.svd.se/feed/articles.rss", foundAt: "feeder.co" },
  { ...news, source: "aftonbladet", name: "Aftonbladet", house: "schibsted-media", url: "https://rss.aftonbladet.se/rss2/small/pages/sections/nyheter/", foundAt: "feeder.co" },
  { ...news, source: "tv4", name: "TV4", house: "schibsted-media", url: "https://www.tv4.se/rss", foundAt: "feedspot.com" },
  { ...news, source: "gp", name: "Göteborgs-Posten", house: "stampen", national: false, url: "https://www.gp.se/rss", foundAt: "codeberg.org/solarchemist/svenska-tidskrifter-rss" },
  { ...news, source: "altinget", name: "Altinget", house: "altinget", url: "https://www.altinget.se/rss", foundAt: "codeberg.org/solarchemist/svenska-tidskrifter-rss" },
  // Opinion feeds. Political placement is only ever made for opinion texts, never for news.
  // The two editorial pages are off until we also read editorial pages from other directions
  // (for example Aftonbladet Ledare), so the opinion texts we read stay balanced.
  { ...opinion, active: false, source: "svd", name: "SvD Ledare", house: "schibsted-media", url: "https://www.svd.se/feed/articles/category/ledare.rss", foundAt: "feeder.co" },
  { ...opinion, active: false, source: "expressen", name: "Expressen Ledare", house: "bonnier-news", url: "https://feeds.expressen.se/ledare/", foundAt: "feeder.co" },
  { ...opinion, source: "aftonbladet", name: "Aftonbladet Debatt", house: "schibsted-media", url: "https://rss.aftonbladet.se/rss2/small/pages/sections/debatt", foundAt: "feedspot.com" },
];
