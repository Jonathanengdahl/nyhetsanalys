import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Om oss och kontakt",
  description: `Vem som står bakom ${site.name}, vem som ansvarar för innehållet och hur du når oss.`,
  alternates: { canonical: "/om" },
};

export default function AboutPage() {
  return (
    <article className={`container ${styles.prose}`}>
      <h1>Om oss och kontakt</h1>
      <p className={styles.lead}>
        {site.name} hjälper dig att förstå dagens största nyheter utan att läsa tio artiklar. Vi jämför hur medierna
        beskriver samma händelse och visar vad som saknas i debatten.
      </p>

      <h2 id="vem">Vem som står bakom</h2>
      <dl className={styles.facts}>
        <div>
          <dt>Ägare</dt>
          <dd>{site.owner.name}</dd>
        </div>
        <div>
          <dt>{site.responsiblePublisher.title}</dt>
          <dd>{site.responsiblePublisher.name}</dd>
        </div>
        <div>
          <dt>Kontakt</dt>
          <dd>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </dd>
        </div>
      </dl>
      <p>
        Inför lanseringen söker vi utgivningsbevis. Då får tjänsten en ansvarig utgivare enligt yttrandefrihetsgrundlagen.
      </p>

      <h2 id="oberoende">Oberoende</h2>
      <p>
        Tjänsten har inga politiska kopplingar. Vi tar aldrig politisk ställning, och olika perspektiv redovisas sida vid
        sida. Ingen som betalar, varken läsare, företag eller annonsörer, kan påverka vad som står på ämnessidorna.
      </p>

      <h2 id="betan">Betan</h2>
      <p>
        Det här är en betaversion. Ämnessidorna är exempel från 24 oktober. De är skrivna och faktakontrollerade med hjälp
        av AI, men de har inte granskats av en redaktör. Chatten, konton och notiser kommer senare.
      </p>
      <p>
        Hur vi väljer ämnen och analyserar artiklar står på sidan <Link href="/metod">Så arbetar vi</Link>. Ser du ett fel
        kan du läsa hur vi hanterar det på sidan <Link href="/rattelser">Rättelser</Link>.
      </p>
    </article>
  );
}
