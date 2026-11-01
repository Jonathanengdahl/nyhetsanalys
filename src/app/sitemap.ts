import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getLatestUpdate, getPublishedTopics, topicPath } from "@/lib/topics";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topics, latest] = await Promise.all([getPublishedTopics(), getLatestUpdate()]);
  const lastModified = latest ?? undefined;
  const pages = ["/", "/amnen", "/metod", "/medier", "/om", "/rattelser", "/integritet", "/kakor"];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: path === "/" || path === "/amnen" ? lastModified : undefined,
    })),
    ...topics.map((topic) => ({ url: `${site.url}${topicPath(topic.slug)}`, lastModified: topic.updatedAt })),
  ];
}
