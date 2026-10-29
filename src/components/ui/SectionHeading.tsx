import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

/** Section title with the short accent line under it. The id makes the section linkable. */
export function SectionHeading({
  id,
  children,
  size = "large",
  level = 2,
}: {
  id?: string;
  children: ReactNode;
  size?: "large" | "medium";
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={styles.wrap}>
      <Heading id={id} className={styles.heading} data-size={size}>
        {children}
      </Heading>
      <span className={`uline ${styles.line}`} data-size={size} aria-hidden="true" />
    </div>
  );
}
