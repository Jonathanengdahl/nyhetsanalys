import type { MetadataRoute } from "next";

// During the beta nothing is blocked here, otherwise crawlers would never
// see the noindex tag and header. Bot rules and the sitemap come in step 3.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
  };
}
