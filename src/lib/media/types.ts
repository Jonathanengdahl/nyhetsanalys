import type { Source, SourceRef, UncertaintyLabel } from "@/lib/topics/types";

/**
 * A medium whose articles are in our material, with facts about who owns it
 * and how it is financed. Every fact points at its sources. We never write
 * about owners' opinions or intentions. The same shape will be used by the
 * Supabase table `sources` in phase 2.
 */

/** One fact about a medium. `sources` are 1-based numbers in `MediaOutlet.sources`. */
export interface MediaFact {
  text: string;
  sources: SourceRef[];
  /** Set when the fact is not confirmed, for example an owner we only know from an old source. */
  label?: UncertaintyLabel;
}

export interface MediaOutlet {
  slug: string;
  name: string;
  /** Other names for the medium in the article data, for example "TV4 Nyheterna". */
  aliases: string[];
  country: string;
  /** What kind of medium it is, never a political label: "Public service", "Nyhetsbyrå" and so on. */
  kind: string;
  /** The company or organisation that publishes it. */
  publisher: MediaFact;
  owner: MediaFact;
  /** Left out when we do not know who the owner is. */
  ownerType?: MediaFact;
  funding: MediaFact;
  /** Swedish state media support (mediestöd) from Mediemyndigheten. Only for Swedish media. */
  mediaSupport?: MediaFact;
  /** The editorial page's own political label, in the medium's own words. Never applies to the news. */
  editorialLabel?: MediaFact;
  /** Ownership changes worth knowing about. */
  changes?: MediaFact;
  sources: Source[];
  /** When the facts were last checked, ISO date. */
  checked: string;
}
