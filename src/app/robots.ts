import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// During the beta nothing is blocked here, otherwise crawlers would never
// see the noindex tag and header. Rules for AI bots come in step 3.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
