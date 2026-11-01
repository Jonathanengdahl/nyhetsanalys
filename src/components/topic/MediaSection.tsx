import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Frame, MatrixValue, Topic } from "@/lib/topics/types";
import { Chevron } from "./sections";
import styles from "./sections.module.css";

const levelText: Record<MatrixValue, string> = { 0: "saknas", 1: "nämns", 2: "huvudfokus" };

/**
 * Chart colours follow the frames' order (largest share first), so the
 * stacked bar always uses the validated series order for a white surface.
 */
export function frameSeries(frames: Frame[]) {
  return frames.map((frame, index) => ({
    ...frame,
    style: { "--seg": `var(--series-${(index % 6) + 1})` } as CSSProperties,
  }));
}

export function MediaSection({ topic, "data-depth": depth }: { topic: Topic; "data-depth"?: "1" | "2" }) {
  const { media } = topic;
  const frames = frameSeries(media.frames);
  return (
    <section className={styles.section} data-depth={depth}>
      <SectionHeading id="mediebilden">Mediebilden</SectionHeading>
      <p className={styles.intro}>{media.intro}</p>

      <div className={`reveal ${styles.item}`}>
        <h3 className={styles.itemTitle}>Det de flesta källor är överens om</h3>
        <ul className={styles.iconList}>
          {media.agree.map((item) => (
            <li key={item}>
              <svg className={styles.agreeIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 5 5 9-10" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.small}>
        Där artiklarna skiljer sig står under <a href="#sa-vinklade-medierna" className={styles.inlineLink}>Så vinklade medierna</a> högre upp.
      </p>

      <div className={`${styles.box} ${styles.gap12}`}>
        <h3 className={styles.itemTitle}>Det här lyfter artiklarna fram</h3>
        <p className={styles.small}>{media.framesMeta}</p>
        <div className={styles.frameBar} aria-hidden="true">
          {frames
            .filter((frame) => frame.weight > 0)
            .map((frame) => (
              <div key={frame.name} className={`seg ${styles.frameSeg}`} style={{ flexGrow: frame.weight, ...frame.style }} />
            ))}
        </div>
        <ul className={styles.legend}>
          {frames.map((frame) => (
            <li key={frame.name} className="reveal" style={frame.style}>
              <span className={styles.legendSwatch} aria-hidden="true" />
              <span>
                <strong>{frame.percent} %</strong> {frame.name}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.bodySmall}>{media.framesNote}</p>
      </div>

      <div data-depth="2" className={styles.stackInner}>
        <div className={styles.matrixBlock}>
          <h3 className={styles.itemTitle}>Artikel för artikel: vad lyfts fram?</h3>
          <ul className={styles.matrixKey} aria-label="Teckenförklaring">
            <li>
              <span className={styles.dot} data-level="2" aria-hidden="true" />
              Huvudfokus
            </li>
            <li>
              <span className={styles.dot} data-level="1" aria-hidden="true" />
              Nämns
            </li>
            <li>
              <span className={styles.dot} data-level="0" aria-hidden="true" />
              Saknas
            </li>
          </ul>
          {/* Focusable, so the table can be scrolled sideways with the keyboard on narrow screens. */}
          <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Vad varje artikel lyfter fram">
            <table className={styles.matrix}>
              <caption className="sr-only">Vad varje artikel lyfter fram</caption>
              <thead>
                <tr>
                  <th scope="col">Artikel</th>
                  {media.matrixColumns.map((column) => (
                    <th key={column.short} scope="col">
                      <abbr title={column.full}>{column.short}</abbr>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {media.matrix.map((row) => (
                  <tr key={row.name}>
                    <th scope="row">{row.name}</th>
                    {row.values.map((value, index) => (
                      <td key={media.matrixColumns[index].short}>
                        <span className={`cell ${styles.dot}`} data-level={value} aria-hidden="true" />
                        <span className="sr-only">{levelText[value]}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.note}>{media.matrixKey}</p>
          <p className={styles.bodySmall}>{media.matrixNote}</p>
        </div>

        <div className={styles.stack10}>
          <h3 className={styles.itemTitle}>Analysen av varje artikel</h3>
          <div className={styles.articles}>
            {topic.articles.map((article) => (
              <details key={article.outlet + article.title} className={`reveal ${styles.article}`}>
                <summary className={styles.articleSummary}>
                  <span className={styles.stack1}>
                    <span className={styles.articleHead}>
                      <span className={styles.articleOutlet}>{article.outlet}</span>
                      <span className={styles.genre}>{article.genre}</span>
                    </span>
                    <span className={styles.articleTitle}>”{article.title}”</span>
                    <span className={styles.note}>{article.meta}</span>
                  </span>
                  <Chevron />
                </summary>
                <div className={styles.articleBody}>
                  <div className={styles.stack0}>
                    <span className={styles.kicker}>Vinkel</span>
                    <span className={styles.bodySmall}>{article.angle}</span>
                  </div>
                  {article.rows.map((row) => (
                    <div key={row.key} className={styles.stack0}>
                      <span className={styles.kicker}>{row.key}</span>
                      <span className={styles.bodySmall}>{row.text}</span>
                    </div>
                  ))}
                  <div className={styles.placement}>
                    <span className={styles.kicker}>Politisk dimension</span>
                    <span className={styles.bodySmall}>{article.placement}</span>
                  </div>
                  <span className={styles.note}>Underlag: {article.basis}</span>
                  {article.url ? (
                    <a href={article.url} target="_blank" rel="noopener" className={styles.textLink}>
                      {article.linkLabel}
                      <span className="sr-only">: {article.title} hos {article.outlet} (öppnas i ny flik)</span>
                    </a>
                  ) : (
                    <span className={styles.note}>{article.linkLabel}</span>
                  )}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
