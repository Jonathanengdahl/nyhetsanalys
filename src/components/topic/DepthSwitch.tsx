import styles from "./DepthSwitch.module.css";

export const depthLevels = ["30 sek", "5 min", "Djupdykning"] as const;
/** Ids are unique per topic, because Next.js keeps earlier pages in the DOM (hidden) after navigation. */
export const depthInputId = (scope: string, level: number) => `djup-${scope}-${level}`;

/**
 * Choice of depth. Plain radio buttons, so it works without JavaScript; the
 * topic page hides deeper sections with CSS. All text stays in the HTML.
 */
export function DepthSwitch({ scope }: { scope: string }) {
  return (
    <div className={styles.bar}>
      <div className="container">
        <fieldset className={styles.switch}>
          <legend className="sr-only">Hur djupt vill du gå?</legend>
          <span className={styles.indicator} aria-hidden="true" />
          {depthLevels.map((label, level) => (
            <span key={label} className={styles.option}>
              <input
                type="radio"
                name={`djup-${scope}`}
                value={level}
                data-depth-choice={level}
                id={depthInputId(scope, level)}
                defaultChecked={level === 1}
                className={styles.radio}
              />
              <label htmlFor={depthInputId(scope, level)} className={styles.label}>
                {label}
              </label>
            </span>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
