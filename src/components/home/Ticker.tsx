import { MotionToggle } from "./MotionToggle";
import styles from "./Ticker.module.css";

export type TickerItem = {
  outlet: string;
  title: string;
};

/**
 * "Läser nu": headlines of the articles we have compared, scrolling sideways.
 * Each outlet gets a neutral letter badge, never its logo.
 */
export function Ticker({ items }: { items: TickerItem[] }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={`${item.outlet}-${item.title}`} className={styles.item}>
          <span className={styles.badge} aria-hidden="true">
            {item.outlet.charAt(0)}
          </span>
          <span className={styles.outlet}>{item.outlet}</span>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.sep} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`rise ${styles.ticker}`} style={{ animationDelay: "1100ms" }}>
      <span className={styles.label}>
        <span className="pulse" aria-hidden="true" />
        <span>
          Läser nu<span className="sr-only">: rubriker från artiklarna vi har jämfört</span>
        </span>
      </span>
      <div className={styles.window}>
        <div className={`anim-marquee ${styles.track}`}>
          {row(false)}
          {row(true)}
        </div>
        <span className={styles.fadeStart} aria-hidden="true" />
        <span className={styles.fadeEnd} aria-hidden="true" />
      </div>
      <MotionToggle />
    </div>
  );
}
