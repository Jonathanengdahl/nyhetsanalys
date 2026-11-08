import { symbol } from "@/lib/brand/symbol";
import styles from "./Logo.module.css";

/**
 * Two overlapping cards: two articles read side by side. In the header the
 * front card slides out from behind the back card once, when the page loads.
 */
export function Logo({ animated = false }: { animated?: boolean }) {
  const { back, front } = symbol;
  return (
    <svg className={styles.mark} viewBox={symbol.viewBox} aria-hidden="true" focusable="false">
      <rect className={styles.back} {...back} />
      <g className={animated ? "deal" : undefined}>
        <rect className={styles.front} {...front} />
        <path className={styles.overlap} d={symbol.overlap} />
      </g>
    </svg>
  );
}
