import type { Metadata } from "next";
import { site } from "@/config/site";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description: "Vilka personuppgifter vi sparar, varför, hur länge och hur du får dem borttagna.",
};

export default function PrivacyPage() {
  return (
    <article className={`container-text ${styles.prose}`}>
      <h1>Integritetspolicy</h1>
      <p className={styles.draft}>
        Utkast under betan. Texten granskas innan tjänsten lanseras.
      </p>

      <h2 id="ansvarig">Vem ansvarar för dina uppgifter</h2>
      <p>
        {site.owner.name} är personuppgiftsansvarig. Du når oss på{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.
      </p>

      <h2 id="vad-vi-sparar">Vad vi sparar</h2>
      <p>När du anmäler dig till betan eller veckobrevet sparar vi:</p>
      <ul>
        <li>din e-postadress</li>
        <li>vad du har anmält dig till (beta, veckobrev, testläsare)</li>
        <li>att du har godkänt att vi sparar uppgiften, och när</li>
      </ul>
      <p>
        Vi sparar inte din IP-adress. Vi använder den bara tillfälligt för att stoppa för många försök i
        rad.
      </p>

      <h2 id="varfor">Varför</h2>
      <p>
        Vi använder e-postadressen för att kontakta dig om betan och, om du valt det, för att skicka
        veckobrevet. Den rättsliga grunden är ditt samtycke. Vi säljer aldrig uppgifterna och delar dem
        inte med annonsörer.
      </p>

      <h2 id="var">Var uppgifterna finns</h2>
      <p>
        Uppgifterna lagras i en databas hos Supabase i Stockholm, inom EU. Sajten drivs av Vercel.
      </p>

      <h2 id="hur-lange">Hur länge</h2>
      <p>
        Vi sparar uppgifterna så länge du vill vara med. Betans anmälningslista raderas senast när betan
        är slut.
      </p>

      <h2 id="dina-rattigheter">Dina rättigheter</h2>
      <p>
        Du kan när som helst ta tillbaka ditt samtycke, få veta vilka uppgifter vi har om dig, få dem
        rättade eller borttagna. Skriv till{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>. Du kan också klaga hos
        Integritetsskyddsmyndigheten (IMY).
      </p>

      <h2 id="kakor">Kakor</h2>
      <p>Sajten sätter inga kakor under betan.</p>
    </article>
  );
}
