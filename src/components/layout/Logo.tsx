import styles from "./Logo.module.css";

/** Prism mark from the prototype: one input, three refracted rays. */
export function Logo() {
  return (
    <svg
      className={styles.mark}
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.ink} d="M5 24 L13 6 L21 24 Z" strokeWidth="2" strokeLinejoin="round" />
      <path className={styles.ink} d="M1 15 H9" strokeWidth="2" strokeLinecap="round" />
      <path className={styles.ray} d="M16.5 13 L29 8" strokeWidth="2" strokeLinecap="round" />
      <path className={styles.ray} d="M17.6 16 H29" strokeWidth="2" strokeLinecap="round" />
      <path className={styles.ray} d="M18.8 19 L29 24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
