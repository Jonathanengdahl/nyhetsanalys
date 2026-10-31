import type { CSSProperties } from "react";
import type { Accent } from "@/lib/topics/types";
import styles from "./ClusterField.module.css";

type ClusterDef = {
  name: string;
  accent: Accent;
  x: number;
  y: number;
  count: number;
  size: number;
  labelX: string;
  labelY: string;
  duration: string;
};

// Illustration: each dot is an article, and articles about the same event gather into a topic.
const CLUSTERS: ClusterDef[] = [
  { name: "Frankrike", accent: "coral", x: 27, y: 38, count: 16, size: 12, labelX: "calc(27% - 30px)", labelY: "calc(38% - 74px)", duration: "7s" },
  { name: "Regeringen", accent: "lime", x: 76, y: 27, count: 8, size: 10, labelX: "calc(76% - 128px)", labelY: "calc(27% - 12px)", duration: "8s" },
  { name: "Inflationen", accent: "mint", x: 72, y: 74, count: 7, size: 10, labelX: "calc(72% - 132px)", labelY: "calc(74% - 13px)", duration: "6.5s" },
  { name: "Europa", accent: "pink", x: 18, y: 84, count: 6, size: 10, labelX: "calc(18% - 20px)", labelY: "calc(84% - 52px)", duration: "9s" },
  { name: "Ukraina", accent: "sun", x: 54, y: 50, count: 4, size: 10, labelX: "calc(54% + 22px)", labelY: "calc(50% - 12px)", duration: "7.5s" },
];

const LOOSE: [number, number][] = [
  [8, 12], [50, 13], [92, 48], [44, 90], [63, 33], [9, 58], [90, 90], [40, 66], [58, 80], [84, 62],
];

/** Small deterministic random generator, so the server always renders the same picture. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const css = (value: Record<string, string>) => value as CSSProperties;

function buildClusters() {
  const random = seeded(11);
  return CLUSTERS.map((cluster, clusterIndex) => ({
    ...cluster,
    labelDelay: `${1450 + clusterIndex * 110}ms`,
    dots: Array.from({ length: cluster.count }, (_, i) => {
      const angle = i * 2.39996 + clusterIndex;
      const radius = cluster.size * 0.78 * Math.sqrt(i + 0.5);
      return {
        left: `calc(${cluster.x}% + ${(Math.cos(angle) * radius).toFixed(1)}px)`,
        top: `calc(${cluster.y}% + ${(Math.sin(angle) * radius).toFixed(1)}px)`,
        fromX: `${((random() - 0.5) * 520).toFixed(0)}px`,
        fromY: `${((random() - 0.5) * 440).toFixed(0)}px`,
        delay: `${(200 + random() * 800).toFixed(0)}ms`,
      };
    }),
  }));
}

function buildLoose() {
  const random = seeded(5);
  return LOOSE.map(([x, y]) => ({
    left: `${x}%`,
    top: `${y}%`,
    fromX: `${((random() - 0.5) * 520).toFixed(0)}px`,
    fromY: `${((random() - 0.5) * 440).toFixed(0)}px`,
    delay: `${(300 + random() * 900).toFixed(0)}ms`,
  }));
}

export function ClusterField() {
  const clusters = buildClusters();
  const loose = buildLoose();
  const names = CLUSTERS.map((cluster) => cluster.name);
  const label = `Artiklar som prickar som dras ihop till ${names.length} ämnen: ${names.slice(0, -1).join(", ")} och ${names.at(-1)}. Grå prickar är ämnen som bevakas.`;

  return (
    <figure className={`rise ${styles.figure}`} style={{ animationDelay: "200ms" }}>
      <div className={styles.field} role="img" aria-label={label}>
        <span className={styles.legend}>
          <span className={styles.legendDot} />
          Bevakas
        </span>
        {loose.map((dot) => (
          <span
            key={dot.left + dot.top}
            className={`anim-converge ${styles.dot} ${styles.looseDot}`}
            style={css({ left: dot.left, top: dot.top, "--sx": dot.fromX, "--sy": dot.fromY, animationDelay: dot.delay })}
          />
        ))}
        {clusters.map((cluster) => (
          <span
            key={cluster.name}
            className={`anim-drift ${styles.cluster}`}
            style={css({ animationDuration: cluster.duration, "--dot-color": `var(--color-${cluster.accent})`, "--dot-size": `${cluster.size}px` })}
          >
            {cluster.dots.map((dot) => (
              <span
                key={dot.left + dot.top}
                className={`anim-converge ${styles.dot}`}
                style={css({ left: dot.left, top: dot.top, "--sx": dot.fromX, "--sy": dot.fromY, animationDelay: dot.delay })}
              />
            ))}
            <span className={`anim-pop ${styles.label}`} style={css({ left: cluster.labelX, top: cluster.labelY, animationDelay: cluster.labelDelay })}>
              {cluster.name}
            </span>
          </span>
        ))}
        <span className={`anim-scan ${styles.scan}`} />
      </div>
      <figcaption className={styles.caption}>
        Varje prick är en artikel. Artiklar om samma händelse dras ihop till ett ämne.
      </figcaption>
    </figure>
  );
}
