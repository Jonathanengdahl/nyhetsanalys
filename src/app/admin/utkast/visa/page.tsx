import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense, type CSSProperties } from "react";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { AnglesSection } from "@/components/topic/AnglesSection";
import { FaqSection } from "@/components/topic/Faq";
import { GlossaryList } from "@/components/topic/Glossary";
import { MediaSection } from "@/components/topic/MediaSection";
import { OpenQuestionsSection } from "@/components/topic/OpenQuestions";
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
import { getPage } from "@/lib/admin/pages";
import { tidyTopic } from "@/lib/topics";
import styles from "../../kandidater/page.module.css";
import topicStyles from "../../../amne/[slug]/page.module.css";

export const metadata: Metadata = { title: "Förhandsvisning" };

/** Every section at full depth, so the whole draft can be read in one go. */
async function Preview({ searchParams }: { searchParams: Promise<{ id?: string | string[] }> }) {
  await connection();
  const { id } = await searchParams;
  const number = Number(Array.isArray(id) ? id[0] : id);
  if (!Number.isInteger(number) || number < 1) notFound();
  const page = await getPage(number);
  if (!page?.data) notFound();
  const topic = tidyTopic(page.data);
  const accent = { "--topic-accent": `var(--color-${topic.accent})` } as CSSProperties;

  return (
    <ChatProvider scope={`utkast-${page.id}`} label={topic.title} suggestions={[]} readyAnswers={{}} sources={[]}>
      <div className="container-wide">
        <p className={styles.notice}>
          Förhandsvisning av ett utkast. Läsarna ser inget av det här förrän du publicerar. <Link href="/admin/utkast">Tillbaka till utkasten</Link>
        </p>
        {page.problems.length > 0 && (
          <ul className={styles.problems} aria-label="Det kontrollerna hittade">
            {page.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        )}
      </div>
      <article className={topicStyles.topic} style={accent}>
        <TopicHero topic={topic} />
        <div className={`container-wide ${topicStyles.layout}`}>
          <div className={topicStyles.body}>
            <SummarySection topic={topic} />
            <AnglesSection topic={topic} />
            <UpdatesSection topic={topic} more={topic.openQuestions.length === 0} />
            <OpenQuestionsSection topic={topic} />
            <TimelineSection topic={topic} />
            <FactsSection topic={topic} />
            <MediaSection topic={topic} />
            <BlameSection topic={topic} />
            <ModelsSection topic={topic} />
            <NumbersSection topic={topic} />
            <MissingSection topic={topic} />
            <PanelSection topic={topic} />
            <FaqSection topic={topic} />
            <MethodSection topic={topic} />
            <div className={topicStyles.lists}>
              <GlossaryList topic={topic} />
              <SourcesSection topic={topic} />
            </div>
          </div>
        </div>
      </article>
    </ChatProvider>
  );
}

export default function DraftPreviewPage({ searchParams }: { searchParams: Promise<{ id?: string | string[] }> }) {
  return (
    <Suspense fallback={<p className="container-wide">Hämtar …</p>}>
      <Preview searchParams={searchParams} />
    </Suspense>
  );
}
