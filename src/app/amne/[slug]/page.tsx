import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { ChatButton } from "@/components/chat/ChatButton";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { AnglesSection } from "@/components/topic/AnglesSection";
import { DepthSwitch } from "@/components/topic/DepthSwitch";
import { FaqSection } from "@/components/topic/Faq";
import { GlossaryList } from "@/components/topic/Glossary";
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
import { TopicFeedback } from "@/components/topic/TopicFeedback";
import { TopicHero } from "@/components/topic/TopicHero";
import { TopicNav } from "@/components/topic/TopicNav";
import { AskFab } from "@/components/ui/AskFab";
import { topicMaterial } from "@/lib/chat/material";
import { topicReadyAnswers, topicSuggestions } from "@/lib/chat/ready";
import { topicJsonLd } from "@/lib/seo/json-ld";
import { getTopic, getTopicSlugs, topicPath } from "@/lib/topics";
import { topicOutline } from "@/lib/topics/outline";
import type { Topic } from "@/lib/topics/types";
import styles from "./page.module.css";

// Topic pages must stay fully static. Unknown slugs are then rendered before
// the response starts, so notFound() can still answer with a real 404.
export const ensureStatic = "navigation";

const SUGGESTIONS = ["Sammanfatta läget", "Vad är osäkert eller omstritt?", "Hur skiljer sig medierna åt?", "Vad saknas i debatten?"];

/** Suggested chat questions. Those from the page (Frågor och svar, the media) are answered right away, without AI. */
function chatSuggestions(topic: Topic) {
  const suggestions = topicSuggestions(topic);
  return { suggestions: suggestions.length >= 2 ? suggestions : SUGGESTIONS, readyAnswers: topicReadyAnswers(topic) };
}

const TRANSITION = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

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

  const accent = { "--topic-accent": `var(--color-${topic.accent})` } as CSSProperties;
  const outline = topicOutline(topic);
  const chat = topicMaterial(topic);
  const { suggestions, readyAnswers } = chatSuggestions(topic);

  return (
    <ChatProvider
      scope={topic.slug}
      label={chat.label}
      suggestions={suggestions}
      readyAnswers={readyAnswers}
      sources={chat.sources}
    >
      <ViewTransition enter={TRANSITION.enter} exit={TRANSITION.exit} default="none">
        <article className={styles.topic} style={accent}>
          <TopicHero topic={topic} />
          <DepthSwitch scope={topic.slug} />
          <div className={`container-wide ${styles.layout}`}>
            <aside className={styles.rail} aria-label="Innehåll och frågor">
              <TopicNav items={outline} variant="rail" />
              <ChatButton className={styles.railAsk}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 18.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H9z" />
                </svg>
                Fråga om ämnet
              </ChatButton>
            </aside>
            <div className={styles.body}>
              <div className={styles.overview}>
                <TopicNav items={outline} variant="overview" />
              </div>
              <SummarySection topic={topic} />
              <AnglesSection topic={topic} />
              <UpdatesSection topic={topic} />
              <TimelineSection topic={topic} data-depth="1" />
              <FactsSection topic={topic} data-depth="1" />
              <MediaSection topic={topic} data-depth="1" />
              <BlameSection topic={topic} data-depth="2" />
              <ModelsSection topic={topic} data-depth="1" />
              <NumbersSection topic={topic} data-depth="1" />
              <MissingSection topic={topic} data-depth="1" />
              <PanelSection topic={topic} data-depth="2" />
              <FaqSection topic={topic} />
              <MethodSection topic={topic} />
              <div className={styles.lists}>
                <GlossaryList topic={topic} />
                <SourcesSection topic={topic} />
              </div>
              <TopicFeedback topic={topic.slug} />
              <Link href="/amnen" className={styles.back} transitionTypes={["nav-back"]}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
                Till alla ämnen
              </Link>
            </div>
          </div>
          <AskFab label="Fråga om ämnet" />
          <JsonLd data={topicJsonLd(topic)} />
        </article>
      </ViewTransition>
    </ChatProvider>
  );
}
