import Link from "next/link";
import { ViewTransition } from "react";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { AskForm } from "@/components/home/AskForm";
import { ClusterField } from "@/components/home/ClusterField";
import { DecodeHeadline } from "@/components/home/DecodeHeadline";
import { Ticker, type TickerItem } from "@/components/home/Ticker";
import { FeaturedTopic, TopicTile } from "@/components/home/TopicCards";
import { TopicIndex, type TopicIndexItem } from "@/components/home/TopicIndex";
import { SignupForm } from "@/components/signup/SignupForm";
import { AskFab } from "@/components/ui/AskFab";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { startMaterial } from "@/lib/chat/material";
import { countTopics, formatDayAndTime } from "@/lib/format";
import { categoryLabels, getLatestUpdate, getPublishedTopics, getTeasers, topicPath } from "@/lib/topics";
import type { Topic, TopicCategory } from "@/lib/topics/types";
import styles from "./page.module.css";

const HERO_LINES = ["Vi analyserar", "dagens heta", "nyhetsämnen."];
const SUGGESTIONS = ["Vad är viktigast i dag?", "Vem leder regeringsbildningen?", "Varför stiger inflationen?"];
const FILTERS: ("alla" | TopicCategory)[] = ["alla", "inrikes", "utrikes", "ekonomi", "politik"];

const STEPS = [
  { title: "Vi hittar ämnena", text: "som många medier skriver om just nu." },
  { title: "Vi jämför", text: "hur medierna beskriver dem, artikel för artikel." },
  { title: "Du får helheten", text: "med källor och osäkerheter tydligt märkta." },
] as const;

/** Every topic takes turns, so the ticker mixes outlets and topics. */
function tickerItems(topics: Topic[]): TickerItem[] {
  const queues = topics.map((topic) => topic.articles.map((article) => ({ outlet: article.outlet, title: article.title })));
  const items: TickerItem[] = [];
  for (let round = 0; queues.some((queue) => queue[round]); round += 1) {
    for (const queue of queues) if (queue[round]) items.push(queue[round]);
  }
  return items;
}

const TRANSITION = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
} as const;

export default async function HomePage() {
  const [topics, teasers, latest] = await Promise.all([getPublishedTopics(), getTeasers(), getLatestUpdate()]);
  const [featured, ...others] = topics;

  const tiles = [
    ...others.map((topic) => ({
      id: topic.slug,
      rank: topic.rank,
      title: topic.title,
      accent: topic.accent,
      card: topic.card,
      categories: topic.categories,
      href: topicPath(topic.slug),
    })),
    ...teasers.map((teaser) => ({
      id: teaser.key,
      rank: teaser.rank,
      title: teaser.title,
      accent: teaser.accent,
      card: teaser.card,
      categories: teaser.categories,
      href: undefined,
    })),
  ].sort((a, b) => a.rank - b.rank);

  const index: TopicIndexItem[] = [
    ...topics.map((topic) => ({
      id: topic.slug,
      rank: topic.rank,
      title: topic.title,
      href: topicPath(topic.slug),
      accent: topic.accent,
      categories: topic.categories,
      tags: topic.card.tags,
      status: topic.status,
      detail: topic.counts,
    })),
    ...teasers.map((teaser) => ({
      id: teaser.key,
      rank: teaser.rank,
      title: teaser.title,
      accent: teaser.accent,
      categories: teaser.categories,
      tags: teaser.card.tags,
      detail: "Exempel. Ämnet har ingen egen sida i betan.",
    })),
  ].sort((a, b) => a.rank - b.rank);

  const allCategories = index.map((item) => item.categories);
  const countFor = (filter: "alla" | TopicCategory) =>
    filter === "alla" ? allCategories.length : allCategories.filter((categories) => categories.includes(filter)).length;
  const headline = HERO_LINES.join(" ") === site.shortDescription ? HERO_LINES : [site.shortDescription];
  const chat = startMaterial(topics);

  return (
    <ChatProvider scope="start" label={chat.label} suggestions={SUGGESTIONS} sources={chat.sources}>
      <ViewTransition enter={TRANSITION.enter} exit={TRANSITION.exit} default="none">
        <div className={styles.home} data-motion="running">
          <div className={styles.backdrop} aria-hidden="true">
            <span className={styles.grid} />
            <span className={`anim-aurora ${styles.light} ${styles.lightOne}`} />
            <span className={`anim-aurora ${styles.light} ${styles.lightTwo}`} />
            <span className={`anim-aurora ${styles.light} ${styles.lightThree}`} />
          </div>

          <div className={`container-wide ${styles.hero}`}>
            <section className={styles.heroMain} aria-label="Om tjänsten">
              {latest && (
                <p className={`rise ${styles.live}`} style={{ animationDelay: "60ms" }}>
                  <span className={styles.livePill}>
                    <span className="pulse" aria-hidden="true" />
                    Live
                  </span>
                  <time dateTime={latest} className="mono">
                    {formatDayAndTime(latest)}
                  </time>
                </p>
              )}
              <DecodeHeadline text={site.shortDescription} lines={headline} />
              <p className={`rise ${styles.lead}`} style={{ animationDelay: "900ms" }}>
                Vi samlar artiklarna om samma händelse, jämför hur medierna beskriver den och visar vad som saknas.
                Neutralt och alltid med källor.
              </p>
              <AskForm suggestions={SUGGESTIONS} />
            </section>

            <section className={`rise ${styles.index}`} style={{ animationDelay: "300ms" }} aria-labelledby="dagens-amnen">
              <div className={styles.indexHead}>
                <h2 id="dagens-amnen" className={styles.indexTitle}>
                  Dagens ämnen
                </h2>
                <p className={`mono ${styles.count}`} aria-live="polite">
                  {FILTERS.map((filter) => (
                    <span key={filter} className={styles.countLabel} data-count={filter}>
                      {countTopics(countFor(filter))}
                    </span>
                  ))}
                </p>
              </div>

              <fieldset className={`shelf ${styles.filters}`}>
                <legend className="sr-only">Visa ämnen</legend>
                {FILTERS.map((filter) => (
                  <span key={filter} className={styles.filter}>
                    <input
                      type="radio"
                      name="kategori"
                      value={filter}
                      id={`kategori-${filter}`}
                      defaultChecked={filter === "alla"}
                      className={styles.filterInput}
                    />
                    <label htmlFor={`kategori-${filter}`} className={styles.filterLabel}>
                      {filter === "alla" ? "Alla" : categoryLabels[filter]}
                      <span className={`mono ${styles.filterCount}`}>{countFor(filter)}</span>
                    </label>
                  </span>
                ))}
              </fieldset>

              <TopicIndex items={index} />

              <Link href="/amnen" className={styles.archiveLink}>
                Alla ämnen vi har analyserat
              </Link>
            </section>
          </div>

          <div className="container-wide">
            <Ticker items={tickerItems(topics)} />
          </div>

          <section className={`container-wide ${styles.topics}`} aria-labelledby="storst-i-dag">
            <SectionHeading id="storst-i-dag">Dagens största ämne</SectionHeading>
            {featured && <FeaturedTopic topic={featured} />}

            <div className={styles.moreHead}>
              <SectionHeading size="medium" id="fler-amnen">
                Fler ämnen
              </SectionHeading>
              <span className={styles.hint}>Svep för fler</span>
            </div>
            <div className={`shelf ${styles.shelf}`} role="region" aria-labelledby="fler-amnen" tabIndex={0}>
              {tiles.map((tile) => (
                <TopicTile key={tile.id} {...tile} />
              ))}
            </div>
          </section>

          <section className={`container-wide ${styles.how}`} aria-labelledby="sa-funkar-det">
            <div className={styles.howText}>
              <SectionHeading id="sa-funkar-det">Så funkar det</SectionHeading>
              <ol className={styles.steps}>
                {STEPS.map((step, index) => (
                  <li key={step.title} className={`reveal ${styles.step}`}>
                    <span className={`mono ${styles.stepNumber}`} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.stepText}>
                      <strong>{step.title}</strong> {step.text}
                    </span>
                  </li>
                ))}
              </ol>
              <p className={styles.rules}>
                Ett ämne kommer med när minst fem oberoende källor från minst tre mediehus skriver om det inom två
                dygn, och minst ett rikstäckande medium bevakar det.
              </p>
              <Link href="/metod" className={styles.textLink}>
                Läs hur vi arbetar
              </Link>
            </div>
            <ClusterField />
          </section>

          <div className={`container-wide ${styles.signupRow}`}>
            <section className={styles.betaCard} aria-labelledby="betan">
              <SectionHeading id="betan" size="medium">
                Var med i betan
              </SectionHeading>
              <p className={styles.signupLead}>
                Vi testar tjänsten med en mindre grupp läsare. Anmäl dig så hör vi av oss.
              </p>
              <SignupForm kind="beta" />
            </section>

            <section className={styles.newsletterCard} aria-labelledby="veckobrevet">
              <h2 id="veckobrevet" className={styles.newsletterTitle}>
                Veckans viktigaste, på fem minuter.
              </h2>
              <p className={styles.newsletterLead}>Varje söndag: fem ämnen, hur de beskrevs och vad som saknades.</p>
              <SignupForm kind="newsletter" />
            </section>
          </div>

          <AskFab label="Fråga nyheterna" appearAt="start" />
        </div>
      </ViewTransition>
    </ChatProvider>
  );
}
