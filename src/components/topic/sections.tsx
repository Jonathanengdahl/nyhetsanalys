import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/config/site";
import { Odometer } from "@/components/ui/Odometer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SourceChips } from "@/components/ui/SourceChips";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { formatDate } from "@/lib/format";
import type { Accent, Chart, Topic } from "@/lib/topics/types";
import { depthInputId } from "./DepthSwitch";
import styles from "./sections.module.css";

/** Sets --accent and --accent-tint for one named colour. */
export const accentStyle = (accent: Accent) =>
  ({ "--accent": `var(--color-${accent})`, "--accent-tint": `var(--tint-${accent})` }) as CSSProperties;

/** Which depth a section belongs to. The topic page hides deeper sections with CSS. */
type Depth = { "data-depth"?: "1" | "2" };

export function SummarySection({ topic }: { topic: Topic }) {
  return (
    <section className={styles.section}>
      <SectionHeading id="pa-30-sekunder">På 30 sekunder</SectionHeading>
      <dl className={styles.summary}>
        {topic.summary.map((item) => (
          <div key={item.key} className={`reveal ${styles.summaryRow}`}>
            <dt>{item.key}</dt>
            <dd>{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function UpdatesSection({ topic }: { topic: Topic }) {
  return (
    <section className={styles.section}>
      <SectionHeading id="nytt" size="medium">
        Nytt sedan ditt senaste besök
      </SectionHeading>
      <p className={styles.small}>{topic.updates.intro}</p>
      <ul className={styles.updates}>
        {topic.updates.items.map((item) => (
          <li key={item.text} className={`reveal ${styles.update}`}>
            <span className={styles.updateMark} aria-hidden="true" />
            <div className={styles.stack1}>
              <span className={styles.bodyText}>{item.text}</span>
              <SourceChips refs={item.sources} sources={topic.sources} />
            </div>
          </li>
        ))}
      </ul>
      <label htmlFor={depthInputId(topic.slug, 1)} className={`${styles.primaryButton} ${styles.onlyAt}`} data-only="0">
        Visa överblicken, 5 min
      </label>
    </section>
  );
}

export function TimelineSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="vad-har-hant">Vad har hänt</SectionHeading>
      <div className={styles.timeline}>
        <span className={`tline ${styles.timelineLine}`} aria-hidden="true" />
        <ol className={styles.timelineList}>
          {topic.timeline.map((event) => (
            <li key={`${event.date}-${event.text}`} className={`reveal ${styles.event}`}>
              <span className={styles.eventDot} data-tagged={event.tag ? "true" : undefined} aria-hidden="true" />
              <div className={styles.eventHead}>
                <span className={styles.eventDate}>{event.date}</span>
                {event.tag && <span className={styles.eventTag}>{event.tag}</span>}
              </div>
              <p className={styles.eventText}>{event.text}</p>
              <SourceChips refs={event.sources} sources={topic.sources} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FactsSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="fakta">Fakta och osäkerhet</SectionHeading>
      <p className={styles.intro}>
        Siffror ändras ofta de första dagarna. Varje uppgift har en märkning, så att du ser hur säker den är.
      </p>
      <div className={styles.list}>
        {topic.facts.map((fact) => (
          <article key={fact.title} className={`reveal ${styles.item}`}>
            <UncertaintyBadge label={fact.label} className="stamp" />
            <h3 className={styles.itemTitle}>{fact.title}</h3>
            <p className={styles.bodyText}>{fact.text}</p>
            <SourceChips refs={fact.sources} sources={topic.sources} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlameSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="vem-pekar-ut-vem">{topic.blame.title}</SectionHeading>
      <p className={styles.intro}>{topic.blame.intro}</p>
      <ul className={`${styles.plainList} ${styles.list}`}>
        {topic.blame.items.map((item) => (
          <li key={item.who} className={`reveal ${styles.item}`}>
            <span className={styles.itemTitle}>{item.who}</span>
            <span className={styles.small}>{item.role}</span>
            <span className={styles.bodyText}>{item.text}</span>
          </li>
        ))}
      </ul>
      <SourceChips refs={topic.blame.sources} sources={topic.sources} />
    </section>
  );
}

export function ModelsSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="forklaringsmodeller">Förklaringsmodeller</SectionHeading>
      <p className={styles.intro}>
        En förklaringsmodell är en tolkning, inte ett bevisat orsakssamband. Flera kan gälla samtidigt och ingen
        förklarar allt. Därför visar vi vad som talar för och emot varje modell.
      </p>
      <div className={styles.list}>
        {topic.models.items.map((model) => (
          <article key={model.name} className={`reveal ${styles.item} ${styles.gap10}`}>
            <h3 className={styles.itemTitle}>{model.name}</h3>
            <div className={styles.stack0}>
              <span className={styles.kickerPositive}>Talar för</span>
              <span className={styles.bodySmall}>{model.pro}</span>
            </div>
            <div className={styles.stack0}>
              <span className={styles.kickerNegative}>Talar emot</span>
              <span className={styles.bodySmall}>{model.con}</span>
            </div>
            <span className={styles.small}>Lyfts främst av {model.by}</span>
          </article>
        ))}
      </div>
      <SourceChips refs={topic.models.sources} sources={topic.sources} />
    </section>
  );
}

function ChartFigure({ chart, topic }: { chart: Chart; topic: Topic }) {
  const max = chart.max ?? Math.max(...chart.rows.map((row) => row.value));
  const refLeft = chart.refLine ? `${((chart.refLine.value / max) * 100).toFixed(1)}%` : undefined;
  return (
    <figure className={`reveal ${styles.box} ${styles.gap10}`}>
      <figcaption className={styles.chartTitle}>{chart.title}</figcaption>
      <table className={styles.chart}>
        <caption className="sr-only">{chart.title}</caption>
        <tbody>
          {chart.rows.map((row) => (
            <tr key={row.name} style={accentStyle(row.accent)}>
              <th scope="row">{row.name}</th>
              <td className={styles.chartTrackCell}>
                <span className={styles.chartTrack} aria-hidden="true">
                  <span className={`fill ${styles.chartFill}`} style={{ width: `${Math.min(100, (row.value / max) * 100).toFixed(1)}%` }} />
                </span>
              </td>
              <td className={styles.chartValue}>{row.label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {chart.refLine && (
        <div className={styles.chartRef} aria-hidden="true">
          <span />
          <span className={styles.chartRefTrack}>
            <span className={styles.chartRefLine} style={{ left: refLeft }} />
            <span className={styles.chartRefLabel} style={{ left: refLeft }}>
              {chart.refLine.label}
            </span>
          </span>
          <span />
        </div>
      )}
      {chart.refLine && <p className="sr-only">Referenslinje: {chart.refLine.label}.</p>}
      <p className={styles.note}>{chart.note}</p>
      <SourceChips refs={chart.sources} sources={topic.sources} />
    </figure>
  );
}

export function NumbersSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="siffrorna">Siffrorna bakom</SectionHeading>
      <p className={styles.intro}>{topic.numbers.intro}</p>
      <div className={`odo-scroll ${styles.tiles}`}>
        {topic.numbers.tiles.map((tile) => (
          <div key={tile.label} className={`reveal ${styles.tile}`}>
            <span className={styles.tileValue}>
              <Odometer value={tile.value} />
            </span>
            <span className={styles.tileLabel}>{tile.label}</span>
            <span className={styles.note}>{tile.sub}</span>
            <SourceChips refs={tile.sources} sources={topic.sources} />
          </div>
        ))}
      </div>
      {topic.numbers.charts.map((chart) => (
        <ChartFigure key={chart.title} chart={chart} topic={topic} />
      ))}
      <p className={styles.bodyText}>{topic.numbers.note}</p>
    </section>
  );
}

export function MissingSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="det-som-saknas">Det här saknas i debatten</SectionHeading>
      <p className={styles.intro}>
        Frågor som är viktiga för att förstå händelsen men som knappt tas upp i de artiklar vi har analyserat.
      </p>
      {topic.missing.map((item) => (
        <article key={item.title} className={`reveal ${styles.missing}`}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          <p className={styles.bodyText}>{item.text}</p>
          {item.note && <p className={styles.missingNote}>{item.note}</p>}
          <SourceChips refs={item.sources} sources={topic.sources} />
        </article>
      ))}
      <label htmlFor={depthInputId(topic.slug, 2)} className={`${styles.outlineButton} ${styles.onlyAt}`} data-only="1">
        Visa djupdykningen
      </label>
    </section>
  );
}

export function PanelSection({ topic, ...depth }: { topic: Topic } & Depth) {
  return (
    <section className={styles.section} {...depth}>
      <SectionHeading id="perspektivpanelen">Perspektivpanelen</SectionHeading>
      <p className={styles.intro}>{topic.panel.intro}</p>
      <div className={`reveal ${styles.plot}`} aria-hidden="true">
        <span className={styles.plotV} />
        <span className={styles.plotH} />
        <span className={styles.plotTop}>GAL</span>
        <span className={styles.plotBottom}>TAN</span>
        <span className={styles.plotLeft}>Vänster</span>
        <span className={styles.plotRight}>Höger</span>
        {topic.panel.items.map((voice) => (
          <span key={voice.name} className={styles.plotPoint} style={{ left: voice.x, top: voice.y, ...accentStyle(voice.accent) }}>
            <span className={`cell ${styles.plotPill}`}>
              <span className={styles.voiceDot} />
              {voice.name}
            </span>
          </span>
        ))}
      </div>
      <div className={styles.list}>
        {topic.panel.items.map((voice) => (
          <article key={voice.name} className={`settle ${styles.item} ${styles.gap10}`} style={accentStyle(voice.accent)}>
            <div className={styles.voiceHead}>
              <span className={styles.voiceDot} aria-hidden="true" />
              <h3 className={styles.itemTitle}>{voice.name}</h3>
            </div>
            <span className={styles.small}>{voice.axes}</span>
            <p className={styles.quote}>”{voice.quote}”</p>
            <div className={styles.stack0}>
              <span className={styles.kickerPositive}>Lyfter fram</span>
              <span className={styles.bodySmall}>{voice.up}</span>
            </div>
            <div className={styles.stack0}>
              <span className={styles.kickerNegative}>Tonar ner</span>
              <span className={styles.bodySmall}>{voice.down}</span>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.small}>
        Arketyperna och deras citat är fiktiva och skrivna av AI för att visa hur olika hållningar läser samma fakta.
      </p>
    </section>
  );
}

export function MethodSection({ topic }: { topic: Topic }) {
  const subject = encodeURIComponent(`Fel på sidan: ${topic.title}`);
  return (
    <section className={styles.section}>
      <SectionHeading id="sa-ar-sidan-gjord" size="medium">
        Så är sidan gjord
      </SectionHeading>
      {topic.method.map((paragraph) => (
        <p key={paragraph} className={styles.methodText}>
          {paragraph}
        </p>
      ))}
      <div className={styles.methodLinks}>
        <Link href="/metod" className={styles.textLink}>
          Läs hela metoden
        </Link>
        <a href={`mailto:${site.contact.email}?subject=${subject}`} className={styles.ghostButton}>
          Rapportera ett fel
        </a>
      </div>
      <p className={styles.small}>
        Rapporter går till {site.contact.email}. En människa granskar dem, och rättelser visas öppet på sidan.
      </p>
    </section>
  );
}

export function SourcesSection({ topic }: { topic: Topic }) {
  return (
    <section className={styles.section}>
      <h2 id="kallor" className="sr-only">
        Källor
      </h2>
      <details className={styles.sources}>
        <summary className={styles.sourcesSummary}>
          Alla källor ({topic.sources.length})
          <Chevron />
        </summary>
        <div className={styles.sourcesBody}>
          {topic.sourceGroups.map((group) => (
            <div key={group.title} className={styles.stack1}>
              <h3 className={styles.sourcesGroup}>{group.title}</h3>
              <ol className={styles.sourceList}>
                {group.ids
                  .filter((id) => topic.sources[id - 1])
                  .map((id) => {
                    const source = topic.sources[id - 1];
                    return (
                      <li key={id} className={styles.sourceItem}>
                        <span className={styles.sourceNumber}>{id}</span>
                        {source.url ? (
                          <a href={source.url} target="_blank" rel="noopener" className={styles.sourceLink}>
                            <strong>{source.name}</strong>, {source.title}
                          </a>
                        ) : (
                          <span>
                            <strong>{source.name}</strong>, {source.title} (länk saknas)
                          </span>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </div>
          ))}
        </div>
      </details>
      <div className={styles.corrections}>
        <h2 id="rattelser" className={styles.correctionsTitle}>
          Rättelser
        </h2>
        {topic.corrections.length === 0 ? (
          <p className={styles.small}>Inga rättelser än. Ser du ett fel, rapportera det så granskar vi det.</p>
        ) : (
          <ul className={styles.plainList}>
            {topic.corrections.map((correction) => (
              <li key={correction.date + correction.text} className={styles.small}>
                <time dateTime={correction.date}>{formatDate(correction.date)}</time>: {correction.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function Chevron() {
  return (
    <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
