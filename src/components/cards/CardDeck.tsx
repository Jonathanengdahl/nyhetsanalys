"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "./CardDeck.module.css";

const noop = () => () => {};

/**
 * Cards side by side, swiped one at a time. Native scrolling with snap
 * points, so it works without JavaScript. With JavaScript a bar above the
 * cards shows where the reader is and has buttons for the previous and next
 * card. The bar sticks under the header, so it stays in reach on long cards.
 */
export function CardDeck({ titles, label, children }: { titles: string[]; label: string; children: ReactNode }) {
  const deck = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // The buttons need JavaScript, so they are only drawn in the browser.
  const enhanced = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    const root = deck.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(cards.indexOf(entry.target as HTMLElement));
      },
      { root, threshold: 0.6 },
    );
    for (const card of cards) observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Focus stays on the button, so it can be pressed again. The position above says where the reader is.
  function go(index: number) {
    const card = deck.current?.querySelectorAll<HTMLElement>("[data-card]")[index];
    if (!card) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
  }

  const count = titles.length;
  return (
    <div className={styles.wrap}>
      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          {enhanced ? (
            <>
              <p className={styles.position} aria-live="polite">
                <span className="mono">
                  {active + 1} av {count}
                </span>{" "}
                <span className={styles.positionTitle}>{titles[active]}</span>
              </p>
              <span className={styles.dots} aria-hidden="true">
                {titles.map((title, index) => (
                  <span key={title} className={styles.dot} data-active={index === active || undefined} />
                ))}
              </span>
              <span className={styles.arrows}>
                <button type="button" className={styles.arrow} onClick={() => go(active - 1)} aria-disabled={active === 0 || undefined}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                  <span className="sr-only">Föregående kort</span>
                </button>
                <button type="button" className={styles.arrow} onClick={() => go(active + 1)} aria-disabled={active === count - 1 || undefined} data-next>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                  <span className="sr-only">Nästa kort</span>
                </button>
              </span>
            </>
          ) : (
            <p className={styles.position}>{count} kort. Svep för att bläddra.</p>
          )}
        </div>
      </div>
      <div ref={deck} className={styles.deck} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
