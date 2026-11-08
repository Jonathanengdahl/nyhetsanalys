import styles from "./Headline.module.css";

/**
 * The start page headline. Every word is in the HTML from the start. With
 * motion on, the words land one by one, from a little below and slightly out
 * of focus to sharp. Pure CSS, so nothing runs when motion is turned off.
 */
export function Headline({ text, lines, className }: { text: string; lines: string[]; className?: string }) {
  let index = 0;
  return (
    <h1 className={`${styles.headline} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {lines.map((line) => (
        <span key={line} aria-hidden="true" className={styles.line}>
          {line.split(" ").map((word, wordIndex) => {
            const delay = 80 + index++ * 110;
            return (
              <span key={`${word}-${wordIndex}`} className={styles.word} style={{ animationDelay: `${delay}ms` }}>
                {word}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
