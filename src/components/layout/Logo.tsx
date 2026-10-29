import styles from "./Logo.module.css";

/** Three bars of falling length, like a ranked bar chart. Animated in the header. */
export function Logo({ animated = false }: { animated?: boolean }) {
  const bar = animated ? "bar" : undefined;
  return (
    <span className={styles.mark} aria-hidden="true">
      <span className={`${styles.bar} ${styles.one} ${bar ?? ""}`} />
      <span className={`${styles.bar} ${styles.two} ${bar ?? ""}`} />
      <span className={`${styles.bar} ${styles.three} ${bar ?? ""}`} />
    </span>
  );
}
