import Link from "next/link";
import type { CSSProperties } from "react";
import { ComingSoonButton } from "@/components/ui/ComingSoonButton";
import { Odometer } from "@/components/ui/Odometer";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { topicPath } from "@/lib/topics";
import type { Accent, Topic, TopicCard, TopicCategory } from "@/lib/topics/types";
import styles from "./TopicCards.module.css";

const accentVars = (accent: Accent) =>
  ({ "--card-accent": `var(--color-${accent})` }) as CSSProperties;

// Staggered scroll ranges make the segments of the bar grow one after another.
const SEGMENT_RANGES = ["entry 40% cover 36%", "entry 50% cover 39%", "entry 60% cover 42%", "entry 70% cover 44%", "entry 80% cover 46%", "entry 90% cover 48%"];

/** The day's main topic as a large card. */
export function FeaturedTopic({ topic }: { topic: Topic }) {
  const frames = topic.media.frames.filter((frame) => frame.weight > 0);
  return (
    <article
      className={`crt on-accent ${styles.featured}`}
      style={accentVars(topic.accent)}
      data-categories={topic.categories.join(" ")}
    >
      <div className={styles.tags}>
        {topic.card.tags.map((tag) => (
          <span key={tag} className={styles.tagDark}>
            {tag}
          </span>
        ))}
        <span className={styles.tagLight}>
          <span className="pulse pulse-dark" aria-hidden="true" />
          {topic.status}
        </span>
      </div>
      <h3 className={styles.featuredTitle}>
        {topic.title}
      </h3>
      <p className={styles.featuredText}>{topic.card.summary}</p>

      <div className={styles.frames}>
        <p className={styles.framesTitle}>Det här lyfter artiklarna fram</p>
        <div className={styles.frameBar} aria-hidden="true">
          {frames.map((frame, index) => (
            <div
              key={frame.name}
              className={`seg ${styles.frameSeg}`}
              style={{
                flexGrow: frame.weight,
                animationRange: SEGMENT_RANGES[index % SEGMENT_RANGES.length],
                ...({ "--seg": `var(--color-${frame.accent})` } as CSSProperties),
              }}
            />
          ))}
        </div>
        <ul className={`legend-rise ${styles.legend}`}>
          {topic.media.frames.map((frame) => (
            <li key={frame.name}>
              <span className={styles.swatch} style={{ "--seg": `var(--color-${frame.accent})` } as CSSProperties} aria-hidden="true" />
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
                <UncertaintyBadge label={item.uncertainty} tone="accent" />
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
    <article
      className={`tile-swing on-accent ${styles.tile}`}
      style={accentVars(accent)}
      data-categories={categories.join(" ")}
      data-key={id}
    >
      <div className={styles.tags}>
        {card.tags.map((tag) => (
          <span key={tag} className={styles.tagDarkSmall}>
            {tag}
          </span>
        ))}
      </div>
      <h3 className={styles.tileTitle}>
        {title}
      </h3>
      {card.figure && (
        <p className={`odo-scroll ${styles.figure}`}>
          <Odometer value={card.figure} />
        </p>
      )}
      <p className={styles.tileText}>{card.summary}</p>
      {card.uncertainty && <UncertaintyBadge label={card.uncertainty} tone="accent" className={styles.pushDown} />}
      {card.badge && <span className={`${styles.badge} ${styles.pushDown}`}>{card.badge}</span>}
      {card.sourceLine && <p className={styles.sourceLine}>{card.sourceLine}</p>}
      {href ? (
        <Link href={href} className={styles.tileLink}>
          Läs analysen<span className="sr-only">: {title}</span>
        </Link>
      ) : (
        <p className={styles.noPage}>Exempel. Ämnet har ingen egen sida i betan.</p>
      )}
    </article>
  );
}
