import { site } from "@/config/site";
import styles from "./BetaBar.module.css";

export function BetaBar() {
  return (
    <aside className={styles.bar} aria-label="Om betan">
      <p className={`container ${styles.inner}`}>{site.beta.notice}</p>
    </aside>
  );
}
