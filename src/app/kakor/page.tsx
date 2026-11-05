import type { Metadata } from "next";
import Link from "next/link";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Kakor",
  description: "Vilka kakor sajten använder. Under betan sätter vi inga kakor, och ämnen du följer sparas bara i din webbläsare.",
  alternates: { canonical: "/kakor" },
};

export default function CookiesPage() {
  return (
    <article className={`container ${styles.prose}`}>
      <h1>Kakor</h1>
      <p className={styles.lead}>
        Sajten sätter inga kakor under betan. Om du följer ett ämne sparas det bara i din egen webbläsare.
      </p>

      <h2 id="nu">Just nu</h2>
      <p>
        Vi använder varken kakor för statistik, annonser eller inloggning. Typsnitten ligger hos oss, så ingen annan tjänst
        får veta att du besöker sajten.
      </p>

      <h2 id="i-webblasaren">Ämnen du följer</h2>
      <p>
        När du trycker på Följ ämnet sparar vi i din webbläsare vilka ämnen du följer och vilken version av ämnet du
        läste senast. Det behövs för att startsidan ska kunna visa dina ämnen och säga när något är nytt. Det är ingen
        kaka, och uppgifterna skickas aldrig till oss. Inget sparas förrän du trycker på knappen.
      </p>
      <p>
        Du tar bort uppgifterna genom att sluta följa ämnena eller genom att rensa webbplatsdata i webbläsaren. Följer du
        ett ämne på en annan enhet eller i en annan webbläsare måste du trycka på Följ ämnet där också.
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
