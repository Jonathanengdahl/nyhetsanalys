import type { Metadata } from "next";
import { ViewTransition } from "react";
import { TopicTile } from "@/components/home/TopicCards";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedTopics, getTeasers, topicPath } from "@/lib/topics";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Alla ämnen",
  description: "Alla nyhetsämnen vi har analyserat, med länk till varje ämnessida.",
  alternates: { canonical: "/amnen" },
};

export default async function TopicsArchivePage() {
  const [topics, teasers] = await Promise.all([getPublishedTopics(), getTeasers()]);
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <div className={`container-wide ${styles.page}`}>
        <header className={styles.head}>
          <h1 className={styles.title}>Alla ämnen</h1>
          <p className={styles.lead}>Här finns alla ämnen vi har analyserat. Under betan är det exempel från 24 oktober.</p>
        </header>

        <section className={styles.section} aria-labelledby="aktiva">
          <SectionHeading id="aktiva" size="medium">
            Ämnen med analys
          </SectionHeading>
          <div className={styles.grid}>
            {topics.map((topic) => (
              <TopicTile
                key={topic.slug}
                id={topic.slug}
                title={topic.title}
                accent={topic.accent}
                card={topic.card}
                categories={topic.categories}
                href={topicPath(topic.slug)}
              />
            ))}
          </div>
        </section>

        {teasers.length > 0 && (
          <section className={styles.section} aria-labelledby="exempel">
            <SectionHeading id="exempel" size="medium">
              Exempel utan egen sida
            </SectionHeading>
            <p className={styles.lead}>De här ämnena visas bara som kort under betan.</p>
            <div className={styles.grid}>
              {teasers.map((teaser) => (
                <TopicTile
                  key={teaser.key}
                  id={teaser.key}
                  title={teaser.title}
                  accent={teaser.accent}
                  card={teaser.card}
                  categories={teaser.categories}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </ViewTransition>
  );
}
