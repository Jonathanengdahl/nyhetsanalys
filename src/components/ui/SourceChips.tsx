import type { Source, SourceRef } from "@/lib/topics/types";
import styles from "./SourceChips.module.css";

/**
 * Source names for a claim, each linking to the original. When one outlet has
 * several articles in the same list, the chips are numbered so they can be told
 * apart. The full headline is in the link text for screen readers and shows on hover.
 */
export function SourceChips({ refs, sources }: { refs: SourceRef[]; sources: Source[] }) {
  const items = refs.map((ref) => ({ ref, source: sources[ref - 1] })).filter((item) => item.source);
  if (items.length === 0) return null;
  const total = new Map<string, number>();
  for (const { source } of items) total.set(source.name, (total.get(source.name) ?? 0) + 1);
  const seen = new Map<string, number>();
  const numbered = items.map((item) => {
    if ((total.get(item.source.name) ?? 0) < 2) return { ...item, nth: undefined };
    const nth = (seen.get(item.source.name) ?? 0) + 1;
    seen.set(item.source.name, nth);
    return { ...item, nth };
  });

  return (
    <ul className={styles.list} aria-label="Källor">
      {numbered.map(({ ref, source, nth }) => {
        const chip = (
          <span className={styles.chip}>
            {source.name}
            {nth !== undefined && (
              <span className={styles.nth} aria-hidden="true">
                {nth}
              </span>
            )}
          </span>
        );
        return (
          <li key={ref}>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noopener" className={styles.link} title={source.title}>
                {chip}
                <span className="sr-only">: {source.title} (öppnas i ny flik)</span>
              </a>
            ) : (
              <span className={styles.static} title={source.title}>
                {chip}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
