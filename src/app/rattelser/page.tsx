import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getPublishedTopics, topicPath } from "@/lib/topics";
import styles from "../prose.module.css";

export const metadata: Metadata = {
  title: "Rättelser",
  description: "Alla rättelser och viktiga ändringar på ämnessidorna, med datum, och hur du rapporterar ett fel.",
  alternates: { canonical: "/rattelser" },
};

export default async function CorrectionsPage() {
  const topics = await getPublishedTopics();
  const corrections = topics
    .flatMap((topic) => topic.corrections.map((correction) => ({ ...correction, topic })))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <article className={`container ${styles.prose}`}>
      <h1>Rättelser</h1>
      <p className={styles.lead}>
        När vi har fel rättar vi det öppet. Här samlas alla rättelser och viktiga ändringar, med datum och vad som ändrats.
      </p>

      <h2 id="logg">Rättelselogg</h2>
      {corrections.length === 0 ? (
        <p className={styles.empty}>Inga rättelser än.</p>
      ) : (
        <ul>
          {corrections.map((correction) => (
            <li key={correction.topic.slug + correction.date + correction.text}>
              <time dateTime={correction.date}>{formatDate(correction.date)}</time>,{" "}
              <Link href={topicPath(correction.topic.slug)}>{correction.topic.title}</Link>: {correction.text}
            </li>
          ))}
        </ul>
      )}

      <h2 id="rapportera">Rapportera ett fel</h2>
      <p>
        Skriv till <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> och berätta vilken sida det gäller,
        vad som är fel och gärna en källa. En människa granskar varje rapport. Ingen ändring görs bara för att många
        skriver samma sak.
      </p>
      <p>
        Hur rättelser hanteras står också på sidan <Link href="/metod#feedback">Så arbetar vi</Link>.
      </p>
    </article>
  );
}
