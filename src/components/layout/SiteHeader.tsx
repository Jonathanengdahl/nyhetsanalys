import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

const navItems = [
  { href: "/", label: "I dag" },
  { href: "/amnen", label: "Ämnen" },
  { href: "/metod", label: "Så arbetar vi" },
  { href: "/om", label: "Om oss" },
] as const;

export function SiteHeader() {
  return (
    <header className={styles.header}>
      {site.beta.enabled && (
        <p className={styles.betaBar}>
          <span className={styles.betaTag}>{site.beta.label}</span>
          {site.beta.notice}
        </p>
      )}
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <Logo />
          <span>{site.name}</span>
          <span className="sr-only">, till startsidan</span>
        </Link>
        <nav aria-label="Huvudmeny" className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
