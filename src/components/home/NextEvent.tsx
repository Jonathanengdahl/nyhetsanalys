"use client";

import { useSyncExternalStore } from "react";
import { dayParts, daysBetween, pickEvent, relativeDays, type ExpectedEvent } from "@/lib/topics/questions";
import { getServerToday, getToday, subscribeToday } from "@/lib/today";
import styles from "./TopicIndex.module.css";

/**
 * The next day a topic is waiting for, on one line in the list of topics.
 * Built in advance from the day the topic was updated (`from`). On the
 * reader's device it picks the next day from today and says how far away it is.
 */
export function NextEvent({ events, from }: { events: ExpectedEvent[]; from: string }) {
  const today = useSyncExternalStore(subscribeToday, getToday, getServerToday);
  const picked = pickEvent(events, today ?? from);
  if (!picked) return null;
  const { day, month } = dayParts(picked.date);
  const days = today === null ? null : daysBetween(today, picked.date);
  const passed = picked.date < (today ?? from);
  const lead = passed ? `Väntades ${day} ${month}` : days !== null && days <= 1 ? relativeDays(days) : `${day} ${month}`;

  return (
    <span className={styles.next} data-passed={passed || undefined}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
      </svg>
      <span className={styles.nextText}>
        <span className="sr-only">{passed ? "Senaste datum: " : "Nästa datum: "}</span>
        <time dateTime={picked.date} className={styles.nextWhen}>
          {lead.charAt(0).toUpperCase() + lead.slice(1)}
        </time>
        {days !== null && days > 1 && !passed && <span className={styles.nextWhen}>{`, ${relativeDays(days)}`}</span>}
        {` · ${picked.event}`}
      </span>
    </span>
  );
}
