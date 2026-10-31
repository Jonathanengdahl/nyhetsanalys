import { site } from "@/config/site";
import styles from "./BetaBar.module.css";

export function BetaBar() {
  return (
    <div className={styles.bar}>
      <p className={`container ${styles.inner}`}>{site.beta.notice}</p>
    </div>
  );
}
