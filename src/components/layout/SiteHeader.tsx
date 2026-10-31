import Link from "next/link";
import { site } from "@/config/site";
import { HeaderNav } from "./HeaderNav";
import { Logo } from "./Logo";
import { SiteMenu } from "./SiteMenu";
import { mainNavigation } from "./navigation";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    // Named, so the header stays still while pages slide during navigation.
    <header className={styles.header} style={{ viewTransitionName: "site-header" }}>
      <div className={`container-wide ${styles.inner}`}>
        <div className={styles.start}>
          <Link href="/" className={styles.brand} transitionTypes={["nav-back"]}>
            <Logo animated />
            <span className={styles.name}>{site.name}</span>
            <span className="sr-only">, till startsidan</span>
          </Link>
          {site.beta.enabled && <span className={styles.beta}>{site.beta.label}</span>}
        </div>
        <HeaderNav items={mainNavigation.slice(0, 4)} />
        <div className={styles.menu}>
          <SiteMenu items={mainNavigation} />
        </div>
      </div>
      <span className={`progress ${styles.progress}`} aria-hidden="true" />
    </header>
  );
}
