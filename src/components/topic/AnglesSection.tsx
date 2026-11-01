import { Fragment } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mainFocus } from "@/lib/topics/angles";
import type { Topic } from "@/lib/topics/types";
import shared from "./sections.module.css";
import styles from "./AnglesSection.module.css";

/**
 * How each article framed the topic, side by side. Shown at every depth: at
 * 30 sek the main focus of each article, at 5 min also its headline and angle.
 * Articles are judged one by one, never whole media.
 */
export function AnglesSection({ topic }: { topic: Topic }) {
  const { media, articles } = topic;
  if (articles.length === 0) return null;
  return (
    <section className={shared.section}>
      <SectionHeading id="sa-vinklade-medierna">Så vinklade medierna</SectionHeading>
      <p className={shared.intro}>
        Samma ämne kan beskrivas på olika sätt. Här är {articles.length} artiklar sida vid sida. Vi bedömer varje artikel för
        sig, aldrig hela medier.
      </p>

      {media.differ.length > 0 && (
        <div className={`reveal ${styles.differ}`}>
          <h3 className={shared.itemTitle}>Här skiljer de sig</h3>
          <ul className={shared.iconList}>
            {media.differ.map((item) => (
              <li key={item}>
                <svg className={shared.differIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 7h11l-3-3M17 17H6l3 3" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.articles}>
        <h3 className={shared.itemTitle}>Artikel för artikel</h3>
        <p className={shared.small}>Etiketterna visar vad artikeln har som huvudfokus.</p>
        <ol className={styles.list}>
          {articles.map((article, index) => {
            const focus = mainFocus(topic, index);
            return (
              <li key={`${article.outlet}-${article.title}`} className={`reveal ${styles.row}`}>
                <p className={styles.source}>
                  <span className={styles.outlet}>{article.outlet}</span>
                  <span className={shared.genre}>{article.genre}</span>
                </p>
                <div className={styles.body}>
                  {focus.length > 0 && (
                    <p className={styles.focus}>
                      <span className="sr-only">Huvudfokus: </span>
                      {focus.map((name, i) => (
                        <Fragment key={name}>
                          {i > 0 && <span className="sr-only">, </span>}
                          <span className={styles.tag}>{name}</span>
                        </Fragment>
                      ))}
                    </p>
                  )}
                  <p className={styles.title} data-depth="1">
                    {article.url ? (
                      <a href={article.url} target="_blank" rel="noopener">
                        {article.title}
                        <span className="sr-only"> (öppnas i ny flik)</span>
                      </a>
                    ) : (
                      article.title
                    )}
                  </p>
                  <p className={styles.angle} data-depth="1">
                    {article.angle}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
