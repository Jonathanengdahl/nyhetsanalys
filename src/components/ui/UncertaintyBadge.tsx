import type { UncertaintyLabel } from "@/lib/topics/types";
import styles from "./UncertaintyBadge.module.css";

const variants: Record<UncertaintyLabel, { key: string; icon: string }> = {
  Bekräftat: { key: "confirmed", icon: "m5 12 5 5 9-10" },
  "Siffror skiljer sig": { key: "differ", icon: "M5 9h14M5 15h14M15 4 9 20" },
  "Ändras över tid": { key: "changes", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" },
  Uppskattning: { key: "estimate", icon: "M4 14c2.5-4 5.5-4 8 0s5.5 4 8 0" },
  Omstritt: { key: "disputed", icon: "M7 7h11l-3-3M17 17H6l3 3" },
  Obekräftat: { key: "unconfirmed", icon: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5" },
  Falskt: { key: "false", icon: "M6 6l12 12M18 6 6 18" },
};

/** Uncertainty label. The text is always shown; colour and icon only repeat it. */
export function UncertaintyBadge({ label, className }: { label: UncertaintyLabel; className?: string }) {
  const variant = variants[label];
  return (
    <span className={`${styles.badge} ${className ?? ""}`} data-label={variant.key}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={variant.icon} />
      </svg>
      {label}
    </span>
  );
}
