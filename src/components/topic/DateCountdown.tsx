"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { dayParts, daysBetween, formatDay, relativeDays } from "@/lib/topics/questions";
import { getServerToday, getToday, subscribeToday } from "@/lib/today";
import styles from "./OpenQuestions.module.css";

/**
 * The day an answer is expected, as a small calendar tile. On the reader's
 * device it also says how far away the day is, and once the day has passed it
 * says so instead of offering the calendar (`children`). The page is built in
 * advance, so without JavaScript the date and the calendar choices show.
 */
export function DateCountdown({
  date,
  event,
  updatedAt,
  compact = false,
  children,
}: {
  date: string;
  event: string;
  /** When the topic was last updated, ISO time. */
  updatedAt: string;
  /** Only the tile, the event and the day, for short lists such as the cards. */
  compact?: boolean;
  children?: ReactNode;
}) {
  const today = useSyncExternalStore(subscribeToday, getToday, getServerToday);
  const days = today === null ? null : daysBetween(today, date);
  const state = days === null ? "unknown" : days < 0 ? "passed" : days === 0 ? "today" : "upcoming";
  const tile = dayParts(date);

  return (
    <div className={styles.when} data-state={state} data-compact={compact || undefined}>
      <span className={styles.tile} aria-hidden="true">
        <span className={styles.tileMonth}>{tile.month}</span>
        <span className={styles.tileDay}>{tile.day}</span>
      </span>
      <div className={styles.whenBody}>
        <p className={styles.event}>{event}</p>
        <p className={styles.date}>
          {state === "passed" ? "Svaret väntades " : "Väntas "}
          <time dateTime={date}>{formatDay(date)}</time>
          {days !== null && <span className={styles.relative}>{` · ${relativeDays(days)}`}</span>}
        </p>
        {compact ? null : state === "passed" ? (
          <p className={styles.stale}>
            {updatedAt.slice(0, 10) < date ? "Ämnet har inte uppdaterats sedan dess." : "Vi har inget svar i underlaget än."}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
