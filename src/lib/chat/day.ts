import { site } from "@/config/site";

/** "2026-10-31": the calendar day in Swedish time. Quotas and the budget follow it. */
export function swedishDay(now = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: site.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Minutes that Swedish time is ahead of UTC at a given moment (60 or 120). */
function offsetMinutes(at: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: site.timeZone, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

/** The moment Swedish midnight started today, as an ISO string in UTC. */
export function startOfSwedishDay(now = new Date()): string {
  const [year, month, day] = swedishDay(now).split("-").map(Number);
  const midnightUtc = Date.UTC(year, month - 1, day);
  // The offset can change during the day (daylight saving), so take it at midnight.
  const guess = new Date(midnightUtc - offsetMinutes(now) * 60_000);
  return new Date(midnightUtc - offsetMinutes(guess) * 60_000).toISOString();
}
