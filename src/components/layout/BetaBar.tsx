import { site } from "@/config/site";
import styles from "./BetaBar.module.css";

export function BetaBar() {
  return (
    <div className={styles.bar}>
      <p className={`container ${styles.inner}`}>
        <span className={styles.tag}>{site.beta.label}</span>
        <span className={styles.text}>{site.beta.notice}</span>
      </p>
    </div>
  );
}
