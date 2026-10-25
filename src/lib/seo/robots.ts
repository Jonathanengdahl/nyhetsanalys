import type { Metadata } from "next";

export const NOINDEX_VALUE = "noindex, nofollow";

/** Robots meta tag for the whole site, driven by SITE_INDEXABLE. */
export function robotsMetadata(indexable: boolean): Metadata["robots"] {
  if (indexable) {
    return { index: true, follow: true };
  }
  return { index: false, follow: false };
}

/** Response headers for every route. Empty when the site is indexable. */
export function robotsHeaders(indexable: boolean): { key: string; value: string }[] {
  return indexable ? [] : [{ key: "X-Robots-Tag", value: NOINDEX_VALUE }];
}
