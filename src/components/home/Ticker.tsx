import styles from "./Ticker.module.css";

/** "Läser nu": the media we follow, scrolling sideways. */
export function Ticker({ outlets }: { outlets: string[] }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {outlets.map((outlet) => (
        <li key={outlet}>
          {outlet}
          <span className={styles.sep} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`rise ${styles.ticker}`} style={{ animationDelay: "1300ms" }}>
      <span className={styles.label}>
        <span className="pulse" aria-hidden="true" />
        Läser nu
      </span>
      <div className={styles.window}>
        <div className={`anim-marquee ${styles.track}`}>
          {row(false)}
          {row(true)}
        </div>
        <span className={styles.fadeStart} aria-hidden="true" />
        <span className={styles.fadeEnd} aria-hidden="true" />
      </div>
    </div>
  );
}
