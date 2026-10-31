import { ChatButton } from "@/components/chat/ChatButton";
import styles from "./AskFab.module.css";

/** Floating button that opens the chat. Appears after some scrolling where the browser supports it. */
export function AskFab({ label, appearAt = "topic" }: { label: string; appearAt?: "start" | "topic" }) {
  return (
    <ChatButton className={`fab-in ${styles.fab} ${appearAt === "start" ? styles.start : styles.topic}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 18.5V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H9z" />
      </svg>
      {label}
    </ChatButton>
  );
}
