"use client";

import type { ReactNode } from "react";
import { comingSoon, showToast, type ComingSoonFeature } from "./toast";

/** A control for a planned feature. Tapping it explains that it is not built yet. */
export function ComingSoonButton({
  feature,
  className,
  children,
  ariaLabel,
}: {
  feature: ComingSoonFeature;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={() => showToast(comingSoon[feature])}>
      {children}
    </button>
  );
}
