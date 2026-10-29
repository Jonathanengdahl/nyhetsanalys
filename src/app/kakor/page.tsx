import type { Metadata } from "next";
import Link from "next/link";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Kakor",
  description: "Vilka kakor sajten använder. Under betan sätter vi inga kakor.",
  alternates: { canonical: "/kakor" },
};

export default function CookiesPage() {
  return (
    <article className={`container ${styles.prose}`}>
      <h1>Kakor</h1>
      <p className={styles.lead}>Sajten sätter inga kakor under betan.</p>

      <h2 id="nu">Just nu</h2>
      <p>
        Vi använder varken kakor för statistik, annonser eller inloggning. Typsnitten ligger hos oss, så ingen annan tjänst
        får veta att du besöker sajten.
      </p>

      <h2 id="senare">Senare</h2>
      <p>
        När konton kommer behövs en nödvändig kaka för att hålla dig inloggad. Om vi börjar mäta besök med ett verktyg som
        sätter kakor frågar vi först, och du kan alltid säga nej.
      </p>
      <p>
        Hur vi hanterar personuppgifter står i <Link href="/integritet">integritetspolicyn</Link>.
      </p>
    </article>
  );
}
