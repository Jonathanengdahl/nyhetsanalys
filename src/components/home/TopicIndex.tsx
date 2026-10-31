import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import type { Accent, TopicCategory } from "@/lib/topics/types";
import styles from "./TopicIndex.module.css";

export type TopicIndexItem = {
  id: string;
  rank: number;
  title: string;
  /** Topic page, when the topic has one. Example topics have none. */
  href?: string;
  accent: Accent;
  categories: TopicCategory[];
  tags: string[];
  status?: string;
  detail: string;
};

/** Name shared by a topic's title in this list and on its page, so the title can fly between them. */
export const topicTitleTransition = (id: string) => `topic-title-${id}`;

const rankLabel = (rank: number) => String(rank).padStart(2, "0");

/** All of today's topics as a compact ranked list. */
export function TopicIndex({ items }: { items: TopicIndexItem[] }) {
  return (
    <ol className={styles.list}>
      {items.map((item, index) => {
        const style = {
          "--row-accent": `var(--color-${item.accent})`,
          animationDelay: `${420 + index * 70}ms`,
        } as CSSProperties;
        const meta = (
          <span className={styles.meta}>
            <span className={styles.dot} aria-hidden="true" />
            {item.tags.join(", ")}
            {item.status && <span className={styles.status}> · {item.status}</span>}
          </span>
        );
        return (
          <li key={item.id} className={`rise ${styles.item}`} style={style} data-categories={item.categories.join(" ")}>
            {item.href ? (
              <Link href={item.href} className={styles.row} transitionTypes={["nav-forward"]} data-spotlight>
                <span className={`mono ${styles.rank}`} aria-hidden="true">
                  {rankLabel(item.rank)}
                </span>
                <span className={styles.main}>
                  {meta}
                  <ViewTransition name={topicTitleTransition(item.id)} share="morph" default="none">
                    <span className={styles.title}>{item.title}</span>
                  </ViewTransition>
                  <span className={styles.detail}>{item.detail}</span>
                </span>
                <svg className={styles.arrow} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ) : (
              <div className={`${styles.row} ${styles.static}`}>
                <span className={`mono ${styles.rank}`} aria-hidden="true">
                  {rankLabel(item.rank)}
                </span>
                <span className={styles.main}>
                  {meta}
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.detail}>{item.detail}</span>
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
