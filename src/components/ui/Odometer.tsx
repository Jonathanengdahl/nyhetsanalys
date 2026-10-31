import type { CSSProperties } from "react";
import { odometerParts } from "@/lib/format";
import styles from "./Odometer.module.css";

/**
 * A figure whose digits roll into place. The real value is in the text for
 * screen readers and search engines; the rolling digits are decoration.
 */
export function Odometer({ value, delay }: { value: string; delay?: string }) {
  const style = delay ? ({ "--od": delay } as CSSProperties) : undefined;
  // A range ("550 000–800 000") may wrap after the dash on narrow screens,
  // but a single number never wraps.
  const groups = value.split(/(?<=–)/);
  return (
    <>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className={styles.row} style={style}>
        {groups.map((group, groupIndex) => (
          <span key={groupIndex} className={styles.group}>
            {odometerParts(group).map((part, index) =>
              "digit" in part ? (
                <span key={index} className="odo">
                  <span style={{ "--d": part.digit } as CSSProperties} />
                </span>
              ) : (
                <span key={index}>{/\s/.test(part.text) ? " " : part.text}</span>
              ),
            )}
          </span>
        ))}
      </span>
    </>
  );
}
