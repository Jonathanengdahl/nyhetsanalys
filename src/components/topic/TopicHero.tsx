import Link from "next/link";
import type { CSSProperties } from "react";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import { Odometer } from "@/components/ui/Odometer";
import { formatDateTime } from "@/lib/format";
import type { Topic } from "@/lib/topics/types";
import styles from "./TopicHero.module.css";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

export function TopicHero({ topic }: { topic: Topic }) {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <nav aria-label="Brödsmulor" className="rise">
          <Link href="/amnen" className={styles.back}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Alla ämnen
          </Link>
        </nav>

        <div className={`rise ${styles.tags}`} style={delay(60)}>
          {topic.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
          <span className={styles.status}>
            <span className={styles.statusDot} aria-hidden="true" />
            {topic.status}
          </span>
        </div>

        <h1 className={styles.title} data-size={topic.titleSize}>
          <span className="sr-only">{topic.title}</span>
          {topic.titleLines.map((line, index) => (
            <span key={line} className={styles.line} aria-hidden="true">
              <span className="lineup" style={delay(140 + index * 130)}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className={`rise ${styles.dek}`} style={delay(480)}>
          {topic.dek}
        </p>

        <p className={`rise ${styles.meta}`} style={delay(580)}>
          <span>
            Uppdaterad <time dateTime={topic.updatedAt}>{formatDateTime(topic.updatedAt)}</time>
          </span>
          <span>{topic.counts}</span>
        </p>

        <div className={`rise ${styles.actions}`} style={delay(680)}>
          <ComingSoonButton feature="chat" className={styles.ask}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 18.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H9z" />
            </svg>
            Fråga om ämnet
          </ComingSoonButton>
          <ComingSoonButton feature="follow" className={styles.follow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Följ ämnet
          </ComingSoonButton>
        </div>

        <dl className={`odo-load rise ${styles.stats}`} style={delay(760)}>
          {topic.stats.map((stat, index) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>
                <Odometer value={stat.value} delay={`${700 + index * 140}ms`} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
