"use client";

import { useEffect, useRef } from "react";
import styles from "./DecodeHeadline.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789";
const TIMING = [
  { start: 150, duration: 650 },
  { start: 520, duration: 600 },
  { start: 900, duration: 800 },
];

/**
 * The start page headline. The text is in the HTML from the start; after
 * loading, a short "decoding" sweep runs over each line. Skipped when the
 * reader prefers reduced motion.
 */
export function DecodeHeadline({ text, lines, className }: { text: string; lines: string[]; className?: string }) {
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const startedAt = performance.now();
    let frame = 0;
    let lastGlyphTick = -1;
    const scrambles = lines.map(() => "");

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const glyphTick = Math.floor(elapsed / 40);
      let done = true;
      lines.forEach((line, index) => {
        const element = lineRefs.current[index];
        if (!element || element.children.length !== 3) return;
        const [resolvedEl, scrambleEl, restEl] = Array.from(element.children) as HTMLElement[];
        const timing = TIMING[index] ?? { start: 150 + index * 370, duration: 700 };
        const progress = (elapsed - timing.start) / timing.duration;
        let resolved = line;
        let scramble = "";
        let rest = "";
        if (progress < 1) {
          done = false;
          if (progress <= 0) {
            resolved = "";
            rest = line;
          } else {
            const count = Math.floor(progress * line.length);
            const width = Math.min(3, line.length - count);
            if (glyphTick !== lastGlyphTick || !scrambles[index]) {
              scrambles[index] = Array.from({ length: width }, (_, k) =>
                line.charAt(count + k) === " " ? " " : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)),
              ).join("");
            }
            resolved = line.slice(0, count);
            scramble = scrambles[index].slice(0, width);
            rest = line.slice(count + width);
          }
        }
        if (resolvedEl.textContent !== resolved) resolvedEl.textContent = resolved;
        if (scrambleEl.textContent !== scramble) scrambleEl.textContent = scramble;
        if (restEl.textContent !== rest) restEl.textContent = rest;
      });
      lastGlyphTick = glyphTick;
      if (!done) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lines]);

  return (
    <h1 className={`${styles.headline} ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      {lines.map((line, index) => (
        <span
          key={line}
          aria-hidden="true"
          className={styles.line}
          ref={(element) => {
            lineRefs.current[index] = element;
          }}
        >
          <span>{line}</span>
          <span className={styles.scramble} />
          <span />
        </span>
      ))}
    </h1>
  );
}
