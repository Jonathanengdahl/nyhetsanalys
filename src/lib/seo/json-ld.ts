import { site } from "@/config/site";
import type { Topic } from "@/lib/topics/types";
import { topicPath } from "@/lib/topics";

const absolute = (path: string) => `${site.url}${path}`;

const organizationRef = () => ({ "@type": "NewsMediaOrganization", name: site.name, url: absolute("/") });

/** The publisher, with links to the pages that explain how we work. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: site.name,
    url: absolute("/"),
    email: site.contact.email,
    publishingPrinciples: absolute("/metod"),
    verificationFactCheckingPolicy: absolute("/metod#osakerhet"),
    actionableFeedbackPolicy: absolute("/metod#feedback"),
    correctionsPolicy: absolute("/rattelser"),
    ownershipFundingInfo: absolute("/om"),
    parentOrganization: { "@type": "Organization", name: site.owner.name },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absolute("/"),
    inLanguage: site.language,
  };
}

export function topicJsonLd(topic: Topic) {
  const url = absolute(topicPath(topic.slug));
  return [
    {
      "@context": "https://schema.org",
      "@type": "AnalysisNewsArticle",
      headline: topic.title,
      description: topic.dek,
      url,
      mainEntityOfPage: url,
      inLanguage: site.language,
      datePublished: topic.publishedAt,
      dateModified: topic.updatedAt,
      author: organizationRef(),
      publisher: organizationRef(),
      citation: topic.articles
        .filter((article) => article.url)
        .map((article) => ({ "@type": "CreativeWork", name: article.title, url: article.url, publisher: article.outlet })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ämnen", item: absolute("/amnen") },
        { "@type": "ListItem", position: 2, name: topic.title, item: url },
      ],
    },
  ];
}
