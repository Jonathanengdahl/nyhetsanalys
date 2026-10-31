import Link from "next/link";
import type { CSSProperties } from "react";
import { frameSeries } from "@/components/topic/MediaSection";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import { Odometer } from "@/components/ui/Odometer";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { topicPath } from "@/lib/topics";
import type { Accent, Topic, TopicCard, TopicCategory } from "@/lib/topics/types";
import styles from "./TopicCards.module.css";

const accentVars = (accent: Accent) => ({ "--card-accent": `var(--color-${accent})` }) as CSSProperties;

// Staggered scroll ranges make the segments of the bar grow one after another.
const SEGMENT_RANGES = ["entry 40% cover 36%", "entry 50% cover 39%", "entry 60% cover 42%", "entry 70% cover 44%", "entry 80% cover 46%", "entry 90% cover 48%"];

/** The day's main topic as a large card. */
export function FeaturedTopic({ topic }: { topic: Topic }) {
  const frames = frameSeries(topic.media.frames);
  return (
    <article className={`settle ${styles.featured}`} style={accentVars(topic.accent)} data-categories={topic.categories.join(" ")}>
      <div className={styles.tags}>
        <span className={styles.tag}>
          <span className={styles.dot} aria-hidden="true" />
          {topic.card.tags.join(", ")}
        </span>
        <span className={styles.status}>{topic.status}</span>
      </div>
      <h3 className={styles.featuredTitle}>{topic.title}</h3>
      <p className={styles.featuredText}>{topic.card.summary}</p>

      <div className={styles.frames}>
        <p className={styles.framesTitle}>Det här lyfter artiklarna fram</p>
        <div className={styles.frameBar} aria-hidden="true">
          {frames
            .filter((frame) => frame.weight > 0)
            .map((frame, index) => (
              <div
                key={frame.name}
                className={`seg ${styles.frameSeg}`}
                style={{ flexGrow: frame.weight, animationRange: SEGMENT_RANGES[index % SEGMENT_RANGES.length], ...frame.style }}
              />
            ))}
        </div>
        <ul className={`legend-rise ${styles.legend}`}>
          {frames.map((frame) => (
            <li key={frame.name} style={frame.style}>
              <span className={styles.swatch} aria-hidden="true" />
              <span>
                <strong>{frame.percent} %</strong> {frame.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {topic.card.highlights && (
        <dl className={`odo-scroll ${styles.highlights}`}>
          {topic.card.highlights.map((item) => (
            <div key={item.value} className={styles.highlight}>
              <dt className={styles.highlightLabel}>{item.label}</dt>
              <dd className={styles.highlightValue}>
                <Odometer value={item.value} />
              </dd>
              <dd className={styles.highlightBadge}>
                <UncertaintyBadge label={item.uncertainty} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className={styles.actions}>
        <Link href={topicPath(topic.slug)} className={styles.primary}>
          Läs analysen<span className="sr-only">: {topic.title}</span>
        </Link>
        <ComingSoonButton feature="chat" className={styles.secondary}>
          Fråga om ämnet
        </ComingSoonButton>
      </div>
      <p className={styles.counts}>{topic.counts}</p>
    </article>
  );
}

/** A smaller card in the sideways shelf. Topics without a page have no link. */
export function TopicTile({
  id,
  title,
  accent,
  card,
  categories,
  href,
}: {
  id: string;
  title: string;
  accent: Accent;
  card: TopicCard & { badge?: string };
  categories: TopicCategory[];
  href?: string;
}) {
  return (
    <article className={`slide-in ${styles.tile}`} style={accentVars(accent)} data-categories={categories.join(" ")} data-key={id}>
      <span className={styles.tag}>
        <span className={styles.dot} aria-hidden="true" />
        {card.tags.join(", ")}
      </span>
      <h3 className={styles.tileTitle}>{title}</h3>
      {card.figure && (
        <p className={`odo-scroll ${styles.figure}`}>
          <Odometer value={card.figure} />
        </p>
      )}
      <p className={styles.tileText}>{card.summary}</p>
      {card.uncertainty && <UncertaintyBadge label={card.uncertainty} className={styles.pushDown} />}
      {card.badge && <span className={`${styles.badge} ${styles.pushDown}`}>{card.badge}</span>}
      {card.sourceLine && <p className={styles.sourceLine}>{card.sourceLine}</p>}
      {href ? (
        <Link href={href} className={styles.tileLink}>
          Läs analysen<span className="sr-only">: {title}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      ) : (
        <p className={styles.noPage}>Exempel. Ämnet har ingen egen sida i betan.</p>
      )}
    </article>
  );
}
