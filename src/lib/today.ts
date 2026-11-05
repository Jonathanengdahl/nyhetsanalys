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
