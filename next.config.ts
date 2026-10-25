import type { NextConfig } from "next";
import { site } from "./src/config/site";
import { robotsHeaders } from "./src/lib/seo/robots";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    const headers = robotsHeaders(site.indexable);
    return headers.length > 0 ? [{ source: "/:path*", headers }] : [];
  },
};

export default nextConfig;
