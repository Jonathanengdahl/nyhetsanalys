import { site } from "@/config/site";

function parts(iso: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(site.locale, { timeZone: site.timeZone, ...options }).format(new Date(iso));
}

/** "24 oktober kl. 18.08" in Swedish time. */
export function formatDateTime(iso: string) {
  const date = parts(iso, { day: "numeric", month: "long" });
  const time = parts(iso, { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  return `${date} kl. ${time}`;
}

/** "Lördag 24 oktober, uppdaterad 18.08" for the start page. */
export function formatDayAndTime(iso: string) {
  const day = parts(iso, { weekday: "long", day: "numeric", month: "long" });
  const time = parts(iso, { hour: "2-digit", minute: "2-digit" }).replace(":", ".");
  return `${day.charAt(0).toUpperCase()}${day.slice(1)}, uppdaterad ${time}`;
}

/** "24 oktober 2026". */
export function formatDate(iso: string) {
  return parts(iso, { day: "numeric", month: "long", year: "numeric" });
}

export type OdometerPart = { digit: number } | { text: string };

/** Splits a figure like "550 000–800 000" into rolling digits and fixed characters. */
export function odometerParts(value: string): OdometerPart[] {
  return Array.from(value).map((char) => (char >= "0" && char <= "9" ? { digit: Number(char) } : { text: char }));
}

/** "1 ämne", "6 ämnen". */
export function countTopics(n: number) {
  return n === 1 ? "1 ämne" : `${n} ämnen`;
}
