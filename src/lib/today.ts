import { swedishDay } from "@/lib/chat/day";

/*
 * Today's date in Swedish time, read on the reader's device with
 * useSyncExternalStore. On the server it is null, so pages built in advance
 * never depend on the day they were built.
 */

export function subscribeToday(callback: () => void) {
  const id = window.setInterval(callback, 60_000);
  return () => window.clearInterval(id);
}

export const getToday = (): string | null => swedishDay();
export const getServerToday = (): string | null => null;

/** The current time in milliseconds on the reader's device, null on the server. Ticks once a minute. */
export const getNow = (): number | null => Date.now();
export const getServerNow = (): number | null => null;

/**
 * "för 12 min sedan", "för 3 tim sedan" or "nyss" when `iso` is less than a day
 * old, otherwise null, so the caller shows the date and time instead.
 */
export function relativeSince(iso: string, now: number): string | null {
  const minutes = Math.round((now - Date.parse(iso)) / 60_000);
  if (!Number.isFinite(minutes) || minutes < 0 || minutes >= 24 * 60) return null;
  if (minutes < 1) return "nyss";
  if (minutes < 60) return `för ${minutes} min sedan`;
  const hours = Math.round(minutes / 60);
  return `för ${hours} ${hours === 1 ? "timme" : "timmar"} sedan`;
}
