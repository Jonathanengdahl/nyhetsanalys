import type { CSSProperties, ReactNode } from "react";
import { glossaryPattern } from "@/lib/topics/glossary";
import type { Topic } from "@/lib/topics/types";
import styles from "./Glossary.module.css";

/**
 * A word with a dotted underline. Pressing it shows the explanation in a
 * popover. The popover is plain HTML (popovertarget), so it works without
 * JavaScript. Ids include the topic, since Next.js keeps earlier pages in the DOM.
 */
export function Term({ id, word, term, explanation }: { id: string; word: string; term: string; explanation: string }) {
  // Anchor names tie the popover to its word where the browser supports it.
  const anchor = `--${id}`;
  return (
    <>
      <button type="button" popoverTarget={id} className={styles.term} style={{ anchorName: anchor } as CSSProperties}>
        {word}
      </button>
      <span id={id} popover="auto" className={styles.popover} style={{ positionAnchor: anchor } as CSSProperties}>
        <strong className={styles.popoverTerm}>{term}</strong>
        <span className={styles.popoverText}>{explanation}</span>
      </span>
    </>
  );
}

/** Returns a function that marks the first use of each glossary word in one part of the page. */
export function glosser(topic: Topic, part: string) {
  const used = new Set<number>();
  const patterns = topic.glossary.map((item, index) => ({
    item,
    index,
    pattern: glossaryPattern(item.match ?? item.term),
  }));

  return function gloss(text: string): ReactNode {
    const out: ReactNode[] = [];
    let rest = text;
    for (;;) {
      let best: { index: number; term: string; explanation: string; at: number; word: string } | null = null;
      for (const { item, index, pattern } of patterns) {
        if (used.has(index)) continue;
        const match = pattern.exec(rest);
        if (match && (!best || match.index < best.at)) {
          best = { index, term: item.term, explanation: item.explanation, at: match.index, word: match[0] };
        }
      }
      if (!best) break;
      used.add(best.index);
      if (best.at > 0) out.push(rest.slice(0, best.at));
      out.push(
        <Term
          key={`${part}-${best.index}`}
          id={`ord-${topic.slug}-${part}-${best.index}`}
          word={best.word}
          term={best.term}
          explanation={best.explanation}
        />,
      );
      rest = rest.slice(best.at + best.word.length);
    }
    if (rest) out.push(rest);
    return out.length === 1 ? out[0] : out;
  };
}

/** All explained words in a list, so they can be read without pressing anything. */
export function GlossaryList({ topic }: { topic: Topic }) {
  if (topic.glossary.length === 0) return null;
  return (
    <section className={styles.section}>
      <h2 id="ordlista" className="sr-only">
        Ordlista
      </h2>
      <details className={styles.details}>
        <summary className={styles.summary}>
          Ordlista ({topic.glossary.length} ord)
          <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>
        <dl className={styles.list}>
          {topic.glossary.map((item) => (
            <div key={item.term} className={styles.entry}>
              <dt className={styles.entryTerm}>{item.term}</dt>
              <dd className={styles.entryText}>{item.explanation}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
