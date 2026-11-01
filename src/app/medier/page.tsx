import type { Metadata } from "next";
import Link from "next/link";
import { SourceChips } from "@/components/ui/SourceChips";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getMediaOutlets, mediaUsage, type MediaFact, type MediaOutlet } from "@/lib/media";
import { getPublishedTopics, topicPath } from "@/lib/topics";
import type { Source, Topic } from "@/lib/topics/types";
import prose from "../prose.module.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Medierna vi läser",
  description: "Vem som ger ut, äger och finansierar medierna i vårt underlag. Varje uppgift har en källa.",
  alternates: { canonical: "/medier" },
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Swedish media first, then the other countries in alphabetical order. */
function byCountry(outlets: MediaOutlet[]) {
  const groups = new Map<string, MediaOutlet[]>();
  for (const outlet of outlets) groups.set(outlet.country, [...(groups.get(outlet.country) ?? []), outlet]);
  return [...groups.entries()]
    .sort(([a], [b]) => (a === "Sverige" ? -1 : b === "Sverige" ? 1 : a.localeCompare(b, "sv")))
    .map(([country, items]) => ({ country, id: slugify(country), outlets: items.sort((a, b) => a.name.localeCompare(b.name, "sv")) }));
}

function Fact({ label, fact, sources, note }: { label: string; fact?: MediaFact; sources: Source[]; note?: string }) {
  if (!fact) return null;
  return (
    <div>
      <dt>{label}</dt>
      <dd className={styles.fact}>
        <span>{fact.text}</span>
        {note && <span className={styles.factNote}>{note}</span>}
        <SourceChips refs={fact.sources} sources={sources} />
      </dd>
    </div>
  );
}

function Usage({ uses }: { uses?: { topic: Topic; articles: number }[] }) {
  if (!uses?.length) return null;
  const total = uses.reduce((sum, use) => sum + use.articles, 0);
  return (
    <p className={styles.used}>
      I underlaget: {total} {total === 1 ? "artikel" : "artiklar"}, i{" "}
      {uses.map((use, index) => (
        <span key={use.topic.slug}>
          {index > 0 && (index === uses.length - 1 ? " och " : ", ")}
          <Link href={topicPath(use.topic.slug)}>{use.topic.title}</Link>
        </span>
      ))}
      .
    </p>
  );
}

function OutletCard({ outlet, uses }: { outlet: MediaOutlet; uses?: { topic: Topic; articles: number }[] }) {
  const headingId = `medium-${outlet.slug}`;
  const sameAsPublisher = outlet.owner.text === outlet.publisher.text;
  return (
    <section id={outlet.slug} className={styles.card} aria-labelledby={headingId}>
      <div className={styles.cardHead}>
        <h3 id={headingId} className={styles.name}>
          {outlet.name}
        </h3>
        <span className={styles.kind}>{outlet.kind}</span>
      </div>
      <dl className={`${prose.facts} ${styles.facts}`}>
        <Fact label="Utgivare" fact={outlet.publisher} sources={outlet.sources} />
        {!sameAsPublisher && <Fact label="Ägare" fact={outlet.owner} sources={outlet.sources} />}
        <Fact label="Typ av ägare" fact={outlet.ownerType} sources={outlet.sources} />
        <Fact label="Finansiering" fact={outlet.funding} sources={outlet.sources} />
        <Fact label="Statligt mediestöd" fact={outlet.mediaSupport} sources={outlet.sources} />
        <Fact
          label="Ledarsidans egen beteckning"
          fact={outlet.editorialLabel}
          sources={outlet.sources}
          note="Tidningens egna ord om sin ledarsida. Gäller inte nyhetsjournalistiken, och det är inte vår placering."
        />
        <Fact label="Ändringar i ägandet" fact={outlet.changes} sources={outlet.sources} />
      </dl>
      <Usage uses={uses} />
      <p className={styles.checked}>Kontrollerat {formatDate(outlet.checked)}</p>
    </section>
  );
}

export default async function MediaPage() {
  const [outlets, topics] = await Promise.all([getMediaOutlets(), getPublishedTopics()]);
  const usage = mediaUsage(topics);
  const groups = byCountry(outlets);

  return (
    <article className={`container ${prose.prose}`}>
      <h1>Medierna vi läser</h1>
      <p className={prose.lead}>
        Här är medierna vars artiklar finns i underlaget för ämnena just nu. För varje medium visar vi vem som ger ut det,
        vem som äger det och hur det finansieras. Varje uppgift har en källa.
      </p>

      <dl className={prose.facts}>
        <div>
          <dt>Vi bedömer artiklar, aldrig hela medier</dt>
          <dd>Ägarna visas här och inte vid artiklarna. Varje artikel bedöms för sig på ämnessidorna.</dd>
        </div>
        <div>
          <dt>Bara fakta om ägande och pengar</dt>
          <dd>Vi skriver inte om ägarnas åsikter eller avsikter. Vad uppgifterna betyder avgör du själv.</dd>
        </div>
        <div>
          <dt>Ledarsidans egen beteckning</dt>
          <dd>
            Några tidningar anger själva en politisk beteckning för sin ledarsida. Då visar vi den med tidningens egna ord.
            Den gäller bara ledarsidan, inte nyheterna.
          </dd>
        </div>
        <div>
          <dt>Ägande ändras</dt>
          <dd>Datumet under varje medium visar när vi senast kontrollerade uppgifterna.</dd>
        </div>
      </dl>

      {outlets.length === 0 && (
        <p className={styles.empty}>Uppgifterna om medierna kontrolleras just nu och visas här snart.</p>
      )}

      <nav aria-label="Länder">
        <ul className={prose.toc}>
          {groups.map((group) => (
            <li key={group.id}>
              <a href={`#${group.id}`}>
                {group.country} ({group.outlets.length})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {groups.map((group) => (
        <section key={group.id} className={styles.group} aria-labelledby={group.id}>
          <h2 id={group.id}>{group.country}</h2>
          <div className={styles.cards}>
            {group.outlets.map((outlet) => (
              <OutletCard key={outlet.slug} outlet={outlet} uses={usage.get(outlet.slug)} />
            ))}
          </div>
        </section>
      ))}

      <h2 id="fel">Ser du ett fel?</h2>
      <p>
        Skriv till <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent("Fel på sidan Medierna vi läser")}`}>{site.contact.email}</a>.
        En människa granskar varje rapport, och rättelser visas på <Link href="/rattelser">Rättelser</Link>.
      </p>
    </article>
  );
}
