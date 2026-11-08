"use client";

import { useEffect } from "react";

/**
 * Lets the light behind the start page headline lean towards the pointer.
 * The position is eased, so the light follows slowly instead of jumping.
 * Only for mouse and trackpad, and never when the reader prefers less motion.
 */
export function PointerLight({ target }: { target: string }) {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    const element = document.querySelector<HTMLElement>(target);
    if (!element) return;

    // Values from -1 to 1: where the pointer is relative to the middle of the window.
    let wantX = 0;
    let wantY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const step = () => {
      x += (wantX - x) * 0.04;
      y += (wantY - y) * 0.04;
      element.style.setProperty("--lean-x", x.toFixed(3));
      element.style.setProperty("--lean-y", y.toFixed(3));
      frame = Math.abs(wantX - x) + Math.abs(wantY - y) > 0.002 ? requestAnimationFrame(step) : 0;
    };
    const onMove = (event: PointerEvent) => {
      wantX = (event.clientX / window.innerWidth) * 2 - 1;
      wantY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onLeave = () => {
      wantX = 0;
      wantY = 0;
      if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return null;
}
