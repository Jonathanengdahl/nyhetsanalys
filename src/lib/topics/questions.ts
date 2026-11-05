import type { OpenQuestion, Topic } from "./types";

const byExpected = (a: OpenQuestion, b: OpenQuestion) => (a.expected?.date ?? "9999").localeCompare(b.expected?.date ?? "9999");

/** Unanswered questions with the nearest date first and undated ones last, then the answered ones, newest first. */
export function sortQuestions(questions: OpenQuestion[]) {
  return {
    open: questions.filter((question) => !question.answer).sort(byExpected),
    answered: questions
      .filter((question) => question.answer)
      .sort((a, b) => (b.answer?.date ?? "").localeCompare(a.answer?.date ?? "")),
  };
}

export type ExpectedEvent = { id: string; date: string; event: string };

/** The dates a topic is waiting for, nearest first. The page decides on the reader's device which are still ahead. */
export function expectedEvents(topic: Topic): ExpectedEvent[] {
  return topic.openQuestions
    .flatMap((question) => (!question.answer && question.expected ? [{ id: question.id, ...question.expected }] : []))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Whole days from one calendar day to another, both as YYYY-MM-DD. */
export function daysBetween(from: string, to: string): number {
  const utc = (day: string) => {
    const [year, month, date] = day.split("-").map(Number);
    return Date.UTC(year, month - 1, date);
  };
  return Math.round((utc(to) - utc(from)) / 86_400_000);
}

/** "i dag", "i morgon", "om 3 dagar". */
export function relativeDays(days: number): string {
  if (days === 0) return "i dag";
  if (days === 1) return "i morgon";
  if (days > 1) return `om ${days} dagar`;
  if (days === -1) return "i går";
  return `för ${-days} dagar sedan`;
}

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

/** "12 november" for a calendar day (YYYY-MM-DD), with the year when it differs from `year`. */
export function formatDay(day: string, year?: number): string {
  const [y, m, d] = day.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}${year !== undefined && year !== y ? ` ${y}` : ""}`;
}

const MONTHS_SHORT = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

/** The day of the month and a short month name, for a small calendar tile. */
export function dayParts(day: string): { day: number; month: string } {
  const [, m, d] = day.split("-").map(Number);
  return { day: d, month: MONTHS_SHORT[m - 1] };
}

/** The first event on or after `day`, or the last one when all have passed. */
export function pickEvent(events: ExpectedEvent[], day: string): ExpectedEvent | null {
  if (events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.find((event) => event.date >= day) ?? sorted[sorted.length - 1];
}
