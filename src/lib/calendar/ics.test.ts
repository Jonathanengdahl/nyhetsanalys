import { describe, expect, it } from "vitest";
import { topics } from "@/content/topics";
import { calendarFile, escapeText, foldLine, googleCalendarUrl, icsStamp } from "./ics";
import { calendarPath, questionEvent } from "./questions";

const event = {
  uid: "regeringsbildningen-budgeten@example.se",
  date: "2026-11-30",
  title: "Budgeten för 2027 läggs fram (Regeringsbildningen)",
  description: "Vem lägger fram budgeten för 2027? Läs läget; källor, siffror och datum: https://example.se/amne/regeringsbildningen#vantar-svar",
  url: "https://example.se/amne/regeringsbildningen#vantar-svar",
  stamp: "2026-10-24T17:40:00+02:00",
};

describe("calendar file", () => {
  it("escapes commas, semicolons, backslashes and line breaks", () => {
    expect(escapeText("a, b; c\\d\ne")).toBe("a\\, b\\; c\\\\d\\ne");
  });

  it("folds long lines at 75 bytes without splitting a letter", () => {
    const line = `DESCRIPTION:${"Åäö är svenska bokstäver, och de tar två byte var. ".repeat(4)}`;
    const folded = foldLine(line);
    const bytes = (text: string) => new TextEncoder().encode(text).length;
    for (const part of folded.split("\r\n")) expect(bytes(part)).toBeLessThanOrEqual(75);
    expect(folded.replaceAll("\r\n ", "")).toBe(line);
    expect(foldLine("SUMMARY:Kort")).toBe("SUMMARY:Kort");
  });

  it("is an all-day event that ends the day after, with CRLF line endings", () => {
    const file = calendarFile(event);
    expect(file.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(file.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(file.replaceAll("\r\n", "")).not.toContain("\n");
    expect(file).toContain("DTSTART;VALUE=DATE:20261130\r\n");
    expect(file).toContain("DTEND;VALUE=DATE:20261201\r\n");
    expect(file).toContain(`DTSTAMP:${icsStamp(event.stamp)}\r\n`);
    expect(icsStamp(event.stamp)).toBe("20261024T154000Z");
    expect(file.replaceAll("\r\n ", "")).toContain("Läs läget\\; källor\\, siffror och datum");
  });

  it("fills in the same day in Google Kalender", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("dates")).toBe("20261130/20261201");
    expect(url.searchParams.get("text")).toBe(event.title);
  });
});

describe("calendar events for open questions", () => {
  it("exist only for questions with a day, and link back to the topic", () => {
    for (const topic of topics) {
      for (const question of topic.openQuestions) {
        const item = questionEvent(topic, question);
        if (!question.expected) {
          expect(item).toBeNull();
          continue;
        }
        expect(item?.date).toBe(question.expected.date);
        expect(item?.url.endsWith(`/amne/${topic.slug}#vantar-svar`)).toBe(true);
        expect(item?.title).toContain(topic.title);
        expect(calendarPath(topic.slug, question.id)).toBe(`/amne/${topic.slug}/kalender/${question.id}`);
      }
    }
  });
});
