import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { footerNavigation } from "./navigation";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container-wide ${styles.inner}`}>
        <p className={styles.brand}>
          <Logo />
          <span>{site.name}</span>
        </p>
        <p className={styles.text}>
          Vi sammanfattar och länkar till originalen. Vi återpublicerar aldrig artiklar. Texterna på
          ämnessidorna är skrivna av AI.
        </p>
        <nav aria-label="Om tjänsten">
          <ul className={styles.links}>
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <dl className={styles.facts}>
          <div>
            <dt>{site.responsiblePublisher.title}</dt>
            <dd>{site.responsiblePublisher.name}</dd>
          </div>
          <div>
            <dt>Ägare</dt>
            <dd>{site.owner.name}</dd>
          </div>
          <div>
            <dt>Kontakt</dt>
            <dd>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
