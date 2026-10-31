"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { depthNames, type OutlineItem } from "@/lib/topics/outline";
import styles from "./TopicNav.module.css";

const OFFSET = 150;

/** The article this navigation belongs to. Next.js keeps earlier pages hidden in the DOM. */
const articleOf = (element: Element | null) => element?.closest("article") ?? null;

function currentDepth(article: Element): number {
  const checked = article.querySelector<HTMLInputElement>("input[data-depth-choice]:checked");
  return checked ? Number(checked.value) : 2;
}

/**
 * Jumps to a part of the topic page. If the part is hidden at the chosen
 * depth, the depth switches first. Plain anchor links still work without
 * JavaScript.
 */
function jump(event: MouseEvent<HTMLAnchorElement>, item: OutlineItem) {
  const article = articleOf(event.currentTarget);
  const heading = article?.querySelector<HTMLElement>(`#${item.id}`);
  if (!article || !heading) return;
  event.preventDefault();

  if (currentDepth(article) < item.depth) {
    article.querySelector<HTMLInputElement>(`input[data-depth-choice="${item.depth}"]`)?.click();
  }
  requestAnimationFrame(() => {
    // Visually hidden headings (Källor) are positioned off the flow, so use their section.
    const target = heading.classList.contains("sr-only") ? (heading.parentElement ?? heading) : heading;
    const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || OFFSET;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - margin, behavior: reduce ? "auto" : "smooth" });
    window.history.replaceState(window.history.state, "", `#${item.id}`);
  });
}

/** Overview of the topic page: a grid of parts at the top, or a list beside the text that follows the reader. */
export function TopicNav({ items, variant }: { items: OutlineItem[]; variant: "overview" | "rail" }) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  // The rail marks the part that is being read.
  useEffect(() => {
    if (variant !== "rail") return;
    const article = articleOf(rootRef.current);
    if (!article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const heading = article.querySelector<HTMLElement>(`#${item.id}`);
        const section = heading?.closest("section");
        if (!heading || !section || section.offsetParent === null) continue;
        if (section.getBoundingClientRect().top - OFFSET <= 0) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    article.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      article.removeEventListener("change", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items, variant]);

  if (variant === "overview") {
    const parts = items.filter((item) => item.overview);
    return (
      <nav ref={rootRef} className={styles.overview} aria-label="Det här finns på sidan">
        <p className={`mono ${styles.overviewTitle}`}>På den här sidan</p>
        <ul className={styles.grid}>
          {parts.map((item) => (
            <li key={item.id} className="reveal">
              <a href={`#${item.id}`} className={styles.tile} onClick={(event) => jump(event, item)} data-spotlight>
                <span className={styles.tileTitle}>{item.title}</span>
                <span className={`mono ${styles.tileDetail}`}>
                  {item.detail}
                  {item.depth === 2 && <span className={styles.deep}> · {depthNames[2]}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav ref={rootRef} className={styles.rail} aria-label="Delar av sidan">
      <p className={`mono ${styles.railTitle}`}>På den här sidan</p>
      <ol className={styles.railList}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.railLink}
              aria-current={active === item.id ? "location" : undefined}
              data-level={item.depth}
              onClick={(event) => jump(event, item)}
            >
              <span className={styles.railName}>{item.title}</span>
              <span className={`mono ${styles.railDetail}`}>
                {item.detail}
                {item.depth === 2 && ` · ${depthNames[2]}`}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
