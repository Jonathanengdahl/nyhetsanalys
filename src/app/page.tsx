import Link from "next/link";
import type { CSSProperties } from "react";
import { AskForm } from "@/components/home/AskForm";
import { ClusterField } from "@/components/home/ClusterField";
import { DecodeHeadline } from "@/components/home/DecodeHeadline";
import { Ticker } from "@/components/home/Ticker";
import { FeaturedTopic, TopicTile } from "@/components/home/TopicCards";
import { SignupForm } from "@/components/signup/SignupForm";
import { AskFab } from "@/components/ui/AskFab";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { outlets } from "@/content/outlets";
import { countTopics, formatDayAndTime } from "@/lib/format";
import { categoryLabels, getLatestUpdate, getPublishedTopics, getTeasers, topicPath } from "@/lib/topics";
import type { TopicCategory } from "@/lib/topics/types";
import styles from "./page.module.css";

const HERO_LINES = ["Vi analyserar", "dagens heta", "nyhetsämnen."];
const SUGGESTIONS = ["Vad är viktigast i dag?", "Varför stiger inflationen?"];
const FILTERS: ("alla" | TopicCategory)[] = ["alla", "inrikes", "utrikes", "ekonomi", "politik"];

const STEPS = [
  { title: "Vi hittar ämnena", text: "som många medier skriver om just nu.", accent: "lime" },
  { title: "Vi jämför", text: "hur medierna beskriver dem, artikel för artikel.", accent: "pink" },
  { title: "Du får helheten", text: "med källor och osäkerheter tydligt märkta.", accent: "mint" },
] as const;

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

  const allCategories = [...topics.map((topic) => topic.categories), ...teasers.map((teaser) => teaser.categories)];
  const countFor = (filter: "alla" | TopicCategory) =>
    filter === "alla" ? allCategories.length : allCategories.filter((categories) => categories.includes(filter)).length;
  const headline = HERO_LINES.join(" ") === site.shortDescription ? HERO_LINES : [site.shortDescription];

  return (
    <div className={styles.home}>
      <section className={`container ${styles.hero}`} aria-label="Om tjänsten">
        {latest && (
          <p className={`rise ${styles.live}`} style={{ animationDelay: "60ms" }}>
            <span className={styles.livePill}>
              <span className="pulse" aria-hidden="true" />
              Live
            </span>
            <time dateTime={latest}>{formatDayAndTime(latest)}</time>
          </p>
        )}
        <DecodeHeadline text={site.shortDescription} lines={headline} />
        <p className={`rise ${styles.lead}`} style={{ animationDelay: "900ms" }}>
          Vi samlar artiklarna om samma händelse, jämför hur medierna beskriver den och visar vad som saknas. Neutralt
          och alltid med källor.
        </p>
        <AskForm suggestions={SUGGESTIONS} />
        <ClusterField />
        <Ticker outlets={outlets} />
      </section>

      <section className={`container ${styles.topics}`} aria-labelledby="dagens-amnen">
        <div className={styles.topicsHead}>
          <SectionHeading id="dagens-amnen">Dagens ämnen</SectionHeading>
          <p className={styles.count} aria-live="polite">
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
                <span className={styles.filterCount}>{countFor(filter)}</span>
              </label>
            </span>
          ))}
        </fieldset>

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
        <Link href="/amnen" className={styles.archiveLink}>
          Alla ämnen vi har analyserat
        </Link>
      </section>

      <section className={`container ${styles.how}`} aria-labelledby="sa-funkar-det">
        <SectionHeading id="sa-funkar-det">Så funkar det</SectionHeading>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span
                className={`num-flip ${styles.stepNumber}`}
                style={{ "--step": `var(--color-${step.accent})` } as CSSProperties}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className={styles.stepText}>
                <strong>{step.title}</strong> {step.text}
              </span>
            </li>
          ))}
        </ol>
        <p className={styles.rules}>
          Ett ämne kommer med när minst fem oberoende källor från minst tre mediehus skriver om det inom två dygn, och
          minst ett rikstäckande medium bevakar det.
        </p>
        <Link href="/metod" className={styles.textLink}>
          Läs hur vi arbetar
        </Link>
      </section>

      <section className={`container ${styles.signup}`} aria-labelledby="betan">
        <div className={styles.betaCard}>
          <SectionHeading id="betan" size="medium">
            Var med i betan
          </SectionHeading>
          <p className={styles.signupLead}>
            Vi testar tjänsten med en mindre grupp läsare. Anmäl dig så hör vi av oss.
          </p>
          <SignupForm kind="beta" tone="dark" />
        </div>
      </section>

      <section className={`container ${styles.signup}`} aria-labelledby="veckobrevet">
        <div className={`on-accent ${styles.newsletterCard}`}>
          <h2 id="veckobrevet" className={styles.newsletterTitle}>
            Veckans viktigaste, på fem minuter.
          </h2>
          <p className={styles.newsletterLead}>Varje söndag: fem ämnen, hur de beskrevs och vad som saknades.</p>
          <SignupForm kind="newsletter" tone="light" />
        </div>
      </section>

      <AskFab label="Fråga nyheterna" appearAt="start" />
    </div>
  );
}
