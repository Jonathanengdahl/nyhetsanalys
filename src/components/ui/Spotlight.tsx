"use client";

import { useEffect } from "react";

/**
 * Lets elements marked with data-spotlight glow softly where the pointer is.
 * Only for mouse and trackpad; nothing happens on touch screens.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let current: HTMLElement | null = null;

    function onMove(event: PointerEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-spotlight]") : null;
      if (current && current !== target) {
        current.style.removeProperty("--spot-x");
        current.style.removeProperty("--spot-y");
      }
      current = target;
      if (!target) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--spot-x", `${Math.round(event.clientX - rect.left)}px`);
        target.style.setProperty("--spot-y", `${Math.round(event.clientY - rect.top)}px`);
      });
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
