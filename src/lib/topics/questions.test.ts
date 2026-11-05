import { describe, expect, it } from "vitest";
import { dayParts, daysBetween, expectedEvents, formatDay, pickEvent, relativeDays, sortQuestions } from "./questions";
import type { OpenQuestion, Topic } from "./types";

const question = (id: string, extra: Partial<OpenQuestion> = {}): OpenQuestion => ({
  id,
  question: `${id}?`,
  status: "Läget just nu.",
  sources: [1],
  ...extra,
});

const questions: OpenQuestion[] = [
  question("undated"),
  question("later", { expected: { date: "2026-12-09", event: "Omröstning" } }),
  question("sooner", { expected: { date: "2026-11-12", event: "Budget" } }),
  question("old-answer", { expected: { date: "2026-10-14", event: "Siffror" }, answer: { text: "Svar.", date: "2026-10-14", sources: [1] } }),
  question("new-answer", { answer: { text: "Svar.", date: "2026-10-20", sources: [1] } }),
];

describe("open questions", () => {
  it("puts the nearest day first, undated last and the newest answer first", () => {
    const { open, answered } = sortQuestions(questions);
    expect(open.map((item) => item.id)).toEqual(["sooner", "later", "undated"]);
    expect(answered.map((item) => item.id)).toEqual(["new-answer", "old-answer"]);
  });

  it("lists only unanswered days, nearest first", () => {
    const events = expectedEvents({ openQuestions: questions } as Topic);
    expect(events).toEqual([
      { id: "sooner", date: "2026-11-12", event: "Budget" },
      { id: "later", date: "2026-12-09", event: "Omröstning" },
    ]);
  });

  it("picks the next day from a given day, or the last one when all have passed", () => {
    const events = expectedEvents({ openQuestions: questions } as Topic);
    expect(pickEvent(events, "2026-10-24")?.id).toBe("sooner");
    expect(pickEvent(events, "2026-11-12")?.id).toBe("sooner");
    expect(pickEvent(events, "2026-11-13")?.id).toBe("later");
    expect(pickEvent(events, "2027-01-01")?.id).toBe("later");
    expect(pickEvent([], "2026-11-01")).toBeNull();
  });
});

describe("days", () => {
  it("counts whole calendar days, also across months and daylight saving", () => {
    expect(daysBetween("2026-11-05", "2026-11-12")).toBe(7);
    expect(daysBetween("2026-10-24", "2026-11-04")).toBe(11);
    expect(daysBetween("2026-10-24", "2026-10-26")).toBe(2);
    expect(daysBetween("2026-11-05", "2026-11-04")).toBe(-1);
    expect(daysBetween("2026-12-31", "2027-01-01")).toBe(1);
  });

  it("says how far away a day is in plain Swedish", () => {
    expect(relativeDays(0)).toBe("i dag");
    expect(relativeDays(1)).toBe("i morgon");
    expect(relativeDays(7)).toBe("om 7 dagar");
    expect(relativeDays(-1)).toBe("i går");
    expect(relativeDays(-10)).toBe("för 10 dagar sedan");
  });

  it("writes days the Swedish way", () => {
    expect(formatDay("2026-11-04")).toBe("4 november");
    expect(formatDay("2027-01-15", 2026)).toBe("15 januari 2027");
    expect(formatDay("2026-12-09", 2026)).toBe("9 december");
    expect(dayParts("2026-10-26")).toEqual({ day: 26, month: "okt" });
  });
});

describe("cards", () => {
  it("keeps the opening question of a media difference", async () => {
    const { leadQuestion } = await import("./cards");
    expect(leadQuestion("Är uppgången kraftig eller väntad? TT:s rubrik talar om ett trendbrott.")).toBe("Är uppgången kraftig eller väntad?");
    expect(leadQuestion("Ingen fråga här.")).toBe("Ingen fråga här.");
  });
});
