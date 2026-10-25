import Link from "next/link";
import { site } from "@/config/site";
import styles from "./SiteFooter.module.css";

const footerLinks = [
  { href: "/metod", label: "Så arbetar vi" },
  { href: "/om", label: "Om oss och kontakt" },
  { href: "/rattelser", label: "Rättelser" },
  { href: "/integritet", label: "Integritetspolicy" },
  { href: "/kakor", label: "Kakor" },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.about}>
          <p className={styles.name}>{site.name}</p>
          <p>
            Texterna på ämnessidorna är skrivna av AI och granskas av redaktionen. Vi sammanfattar och
            länkar, vi återpublicerar inte artiklar.
          </p>
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
        <nav aria-label="Sidfot">
          <ul className={styles.links}>
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
