/*
 * A calendar event as an iCalendar file (RFC 5545), for "Lägg i kalendern".
 * All-day events, since we usually know the day but not the time.
 */

const encoder = new TextEncoder();

/** Commas, semicolons, backslashes and line breaks are escaped in text values. */
export const escapeText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Lines longer than 75 bytes are folded: the rest continues on the next line after one space. */
export function foldLine(line: string): string {
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = "";
  let size = 0;
  for (const char of line) {
    const charSize = encoder.encode(char).length;
    // The first line holds 75 bytes, the rest 74 after the leading space.
    if (size + charSize > (parts.length === 0 ? 75 : 74)) {
      parts.push(current);
      current = "";
      size = 0;
    }
    current += char;
    size += charSize;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

/** "2026-11-12" to "20261112", and the day after for the end of an all-day event. */
const compact = (day: string) => day.replaceAll("-", "");
function nextDay(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, date + 1)).toISOString().slice(0, 10);
}

/** An ISO time as an iCalendar UTC timestamp, "20261024T154000Z". */
export const icsStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export type CalendarEvent = {
  uid: string;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  description: string;
  url: string;
  /** When the event information was written, ISO time. */
  stamp: string;
};

export function calendarFile(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nyhetsanalys//Fragor vi vantar svar pa//SV",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${icsStamp(event.stamp)}`,
    `DTSTART;VALUE=DATE:${compact(event.date)}`,
    `DTEND;VALUE=DATE:${compact(nextDay(event.date))}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `URL:${event.url}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}

/** The same event as a link that opens Google Calendar with it filled in. */
export function googleCalendarUrl(event: Pick<CalendarEvent, "date" | "title" | "description">): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${compact(event.date)}/${compact(nextDay(event.date))}`,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
