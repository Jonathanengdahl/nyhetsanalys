"use client";

import { useSyncExternalStore } from "react";
import { formatDayAndTime } from "@/lib/format";
import { getNow, getServerNow, relativeSince, subscribeToday } from "@/lib/today";

/**
 * When the topics were last updated. Built as a date and time, so the HTML
 * never depends on when it was built. On the reader's device it turns into
 * "uppdaterad för 12 min sedan" while the update is less than a day old,
 * and ticks once a minute.
 */
export function UpdatedTime({ iso }: { iso: string }) {
  const now = useSyncExternalStore(subscribeToday, getNow, getServerNow);
  const relative = now === null ? null : relativeSince(iso, now);
  return (
    <time dateTime={iso} className="mono" title={formatDayAndTime(iso)}>
      {relative ? `uppdaterad ${relative}` : formatDayAndTime(iso)}
    </time>
  );
}
