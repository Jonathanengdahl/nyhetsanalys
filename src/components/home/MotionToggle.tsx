"use client";

import { useState, type MouseEvent } from "react";
import styles from "./Ticker.module.css";

/**
 * Pauses every looping animation on the page (the ticker, the light behind
 * the headline and the topic figure). Sets data-motion on the nearest
 * element that has it.
 */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next = !paused;
    const root = event.currentTarget.closest<HTMLElement>("[data-motion]");
    root?.setAttribute("data-motion", next ? "paused" : "running");
    setPaused(next);
  }

  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-pressed={paused}>
      {paused ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6.5" y="5.5" width="4" height="13" rx="1" />
          <rect x="13.5" y="5.5" width="4" height="13" rx="1" />
        </svg>
      )}
      <span className="sr-only">Pausa rörelser på sidan</span>
    </button>
  );
}
