import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { DepthSwitch } from "@/components/topic/DepthSwitch";
import { MediaSection } from "@/components/topic/MediaSection";
import {
  BlameSection,
  FactsSection,
  MethodSection,
  MissingSection,
  ModelsSection,
  NumbersSection,
  PanelSection,
  SourcesSection,
  SummarySection,
  TimelineSection,
  UpdatesSection,
} from "@/components/topic/sections";
import { TopicHero } from "@/components/topic/TopicHero";
import { AskFab } from "@/components/ui/AskFab";
import { topicJsonLd } from "@/lib/seo/json-ld";
import { getTopic, getTopicSlugs, topicPath } from "@/lib/topics";
import styles from "./page.module.css";

// Topic pages must stay fully static. Unknown slugs are then rendered before
// the response starts, so notFound() can still answer with a real 404.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const slugs = await getTopicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/amne/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return { title: "Ämnet finns inte" };
  return {
    title: topic.title,
    description: topic.dek,
    alternates: { canonical: topicPath(topic.slug) },
    openGraph: {
      type: "article",
      title: topic.title,
      description: topic.dek,
      url: topicPath(topic.slug),
      publishedTime: topic.publishedAt,
      modifiedTime: topic.updatedAt,
    },
  };
}

export default async function TopicPage({ params }: PageProps<"/amne/[slug]">) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const accent = {
    "--topic-accent": `var(--color-${topic.accent})`,
    "--topic-glow": `var(--glow-${topic.accent})`,
  } as CSSProperties;

  return (
    <article className={styles.topic} style={accent}>
      <TopicHero topic={topic} />
      <DepthSwitch scope={topic.slug} />
      <div className={`container ${styles.body}`}>
        <SummarySection topic={topic} />
        <UpdatesSection topic={topic} />
        <TimelineSection topic={topic} data-depth="1" />
        <FactsSection topic={topic} data-depth="1" />
        <MediaSection topic={topic} data-depth="1" />
        <BlameSection topic={topic} data-depth="2" />
        <ModelsSection topic={topic} data-depth="1" />
        <NumbersSection topic={topic} data-depth="1" />
        <MissingSection topic={topic} data-depth="1" />
        <PanelSection topic={topic} data-depth="2" />
        <MethodSection topic={topic} />
        <SourcesSection topic={topic} />
        <Link href="/amnen" className={styles.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Till alla ämnen
        </Link>
      </div>
      <AskFab label="Fråga om ämnet" />
      <JsonLd data={topicJsonLd(topic)} />
    </article>
  );
}
