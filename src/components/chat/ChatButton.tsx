"use client";

import type { ReactNode } from "react";
import { useChat } from "./ChatProvider";

/** A button that opens the chat on this page, optionally with a question. */
export function ChatButton({
  question,
  className,
  children,
  ariaLabel,
}: {
  question?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const { open } = useChat();
  return (
    <button type="button" className={className} aria-label={ariaLabel} aria-haspopup="dialog" onClick={() => open(question)}>
      {children}
    </button>
  );
}
