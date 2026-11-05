import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties, type ReactNode } from "react";
import { CardDeck } from "@/components/cards/CardDeck";
import { DateCountdown } from "@/components/topic/DateCountdown";
import { FollowButton } from "@/components/topic/FollowButton";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { site } from "@/config/site";
import { formatDateTime } from "@/lib/format";
import { getTopic, getTopicSlugs, topicCardsPath, topicPath } from "@/lib/topics";
import { leadQuestion } from "@/lib/topics/cards";
import { sortQuestions } from "@/lib/topics/questions";
import type { Topic } from "@/lib/topics/types";
import styles from "./page.module.css";

// Like the topic page: fully static, and a real 404 for unknown topics.
export const ensureStatic = "navigation";

const TRANSITION = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export async function generateStaticParams() {
  const slugs = await getTopicSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/amne/[slug]/kort">): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return { title: "Ämnet finns inte" };
  return {
    title: `${topic.title} i fem kort`,
    description: `Läget, säkert och osäkert, mediebilden, det som saknas och det vi väntar på. ${topic.title} i korthet.`,
    // The same analysis as the topic page, in short. The topic page is the address to link to.
    alternates: { canonical: topicPath(topic.slug) },
    openGraph: {
      type: "article",
      title: `${topic.title} i fem kort`,
      url: topicCardsPath(topic.slug),
      // The topic's own share image. Share images in a folder only apply to that page, not to the pages under it.
      images: [{ url: `${topicPath(topic.slug)}/opengraph-image`, width: 1200, height: 630, alt: `${topic.title} på ${site.name}` }],
    },
  };
}

type Card = { key: string; title: string; more: { href: string; label: string }; body: ReactNode };

/** The five cards, each with a link to the full part on the topic page. */
function cards(topic: Topic): Card[] {
  const page = topicPath(topic.slug);
  const { open } = sortQuestions(topic.openQuestions);
  const sure = topic.facts.filter((fact) => fact.label === "Bekräftat").length;

  return [
    {
      key: "laget",
      title: "Läget",
      more: { href: `${page}#pa-30-sekunder`, label: "Läs på ämnessidan" },
      body: (
        <dl className={styles.summary}>
          {topic.summary.map((row) => (
            <div key={row.key} className={styles.summaryRow}>
              <dt>{row.key}</dt> <dd>{row.text}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      key: "sakert",
      title: "Säkert och osäkert",
      more: { href: `${page}#fakta`, label: "Se uppgifterna med källor" },
      body: (
        <>
          <p className={styles.lead}>
            {sure} av {topic.facts.length} uppgifter är bekräftade. Märkningen visar hur säker varje uppgift är.
          </p>
          <ul className={styles.facts}>
            {topic.facts.map((fact) => (
              <li key={fact.title} className={styles.fact}>
                <UncertaintyBadge label={fact.label} />
                <span>{fact.title}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      key: "medierna",
      title: "Här skiljer sig medierna",
      more: { href: `${page}#sa-vinklade-medierna`, label: "Se artikel för artikel" },
      body: (
        <>
          <p className={styles.lead}>{topic.counts}.</p>
          <ul className={styles.points}>
            {topic.media.differ.map((text) => (
              <li key={text}>{leadQuestion(text)}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      key: "saknas",
      title: "Det här saknas i debatten",
      more: { href: `${page}#det-som-saknas`, label: "Läs varför" },
      body: (
        <ul className={styles.missing}>
          {topic.missing.map((item) => (
            <li key={item.title}>{item.title}</li>
          ))}
        </ul>
      ),
    },
    {
      key: "vantar",
      title: open.length ? "Det här väntar vi på" : "Läs vidare",
      more: { href: open.length ? `${page}#vantar-svar` : page, label: open.length ? "Se läget för varje fråga" : "Läs hela analysen" },
      body: (
        <>
          {open.length > 0 && (
            <ul className={styles.waiting}>
              {open.map((question) => (
                <li key={question.id} className={styles.waitingItem}>
                  {question.expected ? (
                    <DateCountdown date={question.expected.date} event={question.question} updatedAt={topic.updatedAt} compact />
                  ) : (
                    <>
                      <p className={styles.question}>{question.question}</p>
                      <p className={styles.noDate}>Det finns inget datum för svaret än.</p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.follow}>
            <FollowButton slug={topic.slug} updatedAt={topic.updatedAt} className={styles.followButton} />
            <p className={styles.followText}>Följ ämnet, så ser du på startsidan när det har uppdaterats.</p>
          </div>
        </>
      ),
    },
  ];
}

export default async function TopicCardsPage({ params }: PageProps<"/amne/[slug]/kort">) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();

  const list = cards(topic);
  // Unique per topic, since Next.js keeps earlier pages in the DOM.
  const id = (index: number) => `kort-${topic.slug}-${index + 1}`;
  const accent = { "--topic-accent": `var(--color-${topic.accent})` } as CSSProperties;

  return (
    <ViewTransition enter={TRANSITION.enter} exit={TRANSITION.exit} default="none">
      <article className={styles.page} style={accent}>
        <header className={`container ${styles.head}`}>
          <Link href={topicPath(topic.slug)} className={styles.back} transitionTypes={["nav-back"]}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Hela analysen
          </Link>
          <p className={`mono ${styles.kicker}`}>Fem kort</p>
          <h1 className={styles.title}>{topic.title}</h1>
          <p className={styles.meta}>
            Uppdaterad <time dateTime={topic.updatedAt}>{formatDateTime(topic.updatedAt)}</time>
          </p>
        </header>

        <CardDeck titles={list.map((card) => card.title)} label={`${topic.title} i fem kort`}>
          {list.map((card, index) => (
            <section key={card.key} id={id(index)} className={styles.card} aria-labelledby={`${id(index)}-rubrik`} data-card>
              <h2 id={`${id(index)}-rubrik`} className={styles.cardTitle}>
                {card.title}
              </h2>
              <div className={styles.body}>{card.body}</div>
              <p className={styles.cardFoot}>
                <Link href={card.more.href} className={styles.more}>
                  {card.more.label}
                </Link>
              </p>
            </section>
          ))}
        </CardDeck>

        <footer className={`container ${styles.foot}`}>
          <p>
            Korten är en kort version av analysen. Texterna är skrivna av AI utifrån artiklarna i underlaget.{" "}
            <Link href={`${topicPath(topic.slug)}#sa-ar-sidan-gjord`}>Så är sidan gjord</Link>
          </p>
        </footer>
      </article>
    </ViewTransition>
  );
}
