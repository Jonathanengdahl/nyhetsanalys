import { SectionHeading } from "@/components/ui/SectionHeading";
import type { MatrixValue, Topic } from "@/lib/topics/types";
import { accentStyle, Chevron } from "./sections";
import styles from "./sections.module.css";

const levelText: Record<MatrixValue, string> = { 0: "saknas", 1: "nämns", 2: "huvudfokus" };

export function MediaSection({ topic, "data-depth": depth }: { topic: Topic; "data-depth"?: "1" | "2" }) {
  const { media } = topic;
  return (
    <section className={styles.section} data-depth={depth}>
      <SectionHeading id="mediebilden">Mediebilden</SectionHeading>
      <p className={styles.intro}>{media.intro}</p>

      <div className={`reveal ${styles.card} ${styles.gap10}`}>
        <h3 className={styles.boxTitle}>Det de flesta källor är överens om</h3>
        <ul className={styles.iconList}>
          {media.agree.map((item) => (
            <li key={item}>
              <svg className={styles.agreeIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 5 5 9-10" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`reveal ${styles.card} ${styles.gap10}`}>
        <h3 className={styles.boxTitle}>Där de skiljer sig</h3>
        <ul className={styles.iconList}>
          {media.differ.map((item) => (
            <li key={item}>
              <svg className={styles.differIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 7h11l-3-3M17 17H6l3 3" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.card} ${styles.gap12}`}>
        <h3 className={styles.boxTitle}>Det här lyfter artiklarna fram</h3>
        <p className={styles.small}>{media.framesMeta}</p>
        <div className={styles.frameBar} aria-hidden="true">
          {media.frames
            .filter((frame) => frame.weight > 0)
            .map((frame) => (
              <div key={frame.name} className={`seg ${styles.frameSeg}`} style={{ flexGrow: frame.weight, ...accentStyle(frame.accent) }} />
            ))}
        </div>
        <ul className={styles.legend}>
          {media.frames.map((frame) => (
            <li key={frame.name} className="reveal" style={accentStyle(frame.accent)}>
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
        <div className={`${styles.card} ${styles.gap12}`}>
          <h3 className={styles.boxTitle}>Artikel för artikel: vad lyfts fram?</h3>
          <ul className={styles.matrixKey} aria-label="Teckenförklaring">
            <li>
              <span className={styles.keyFull} aria-hidden="true" />
              Huvudfokus
            </li>
            <li>
              <span className={styles.keyRing} aria-hidden="true" />
              Nämns
            </li>
            <li>
              <span className={styles.keyEmpty} aria-hidden="true" />
              Saknas
            </li>
          </ul>
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
                    <td key={media.matrixColumns[index].short} style={accentStyle(media.matrixColumns[index].accent)}>
                      <span className={`cell ${styles.dot}`} data-level={value} aria-hidden="true" />
                      <span className="sr-only">{levelText[value]}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.note}>{media.matrixKey}</p>
          <p className={styles.bodySmall}>{media.matrixNote}</p>
        </div>

        <div className={styles.stack10}>
          <h3 className={styles.boxTitle}>Analysen av varje artikel</h3>
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
                {article.rows.map((row) => (
                  <div key={row.key} className={styles.stack0}>
                    <span className={styles.kickerAccent}>{row.key}</span>
                    <span className={styles.bodySmall}>{row.text}</span>
                  </div>
                ))}
                <div className={styles.placement}>
                  <span className={styles.kickerNegative}>Politisk dimension</span>
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
    </section>
  );
}
