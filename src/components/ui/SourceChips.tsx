import type { Source, SourceRef } from "@/lib/topics/types";
import styles from "./SourceChips.module.css";

/** Source names for a claim, each linking to the original. */
export function SourceChips({
  refs,
  sources,
  tone = "dark",
}: {
  refs: SourceRef[];
  sources: Source[];
  tone?: "dark" | "accent";
}) {
  const items = refs.map((ref) => ({ ref, source: sources[ref - 1] })).filter((item) => item.source);
  if (items.length === 0) return null;
  return (
    <ul className={styles.list} data-tone={tone} aria-label="Källor">
      {items.map(({ ref, source }) => (
        <li key={ref}>
          {source.url ? (
            <a href={source.url} target="_blank" rel="noopener" className={styles.link}>
              <span className={styles.chip}>{source.name}</span>
              <span className="sr-only">: {source.title} (öppnas i ny flik)</span>
            </a>
          ) : (
            <span className={styles.static}>
              <span className={styles.chip}>{source.name}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
