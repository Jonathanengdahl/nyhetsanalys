import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { SiteMenu } from "./SiteMenu";
import { mainNavigation } from "./navigation";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.start}>
          <Link href="/" className={styles.brand}>
            <Logo animated />
            <span className={styles.name}>{site.name}</span>
            <span className="sr-only">, till startsidan</span>
          </Link>
          {site.beta.enabled && <span className={styles.beta}>{site.beta.label}</span>}
        </div>
        <SiteMenu items={mainNavigation} />
      </div>
      <span className={`progress ${styles.progress}`} aria-hidden="true" />
    </header>
  );
}
