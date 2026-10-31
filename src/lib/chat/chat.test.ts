import { describe, expect, it } from "vitest";
import { chatConfig } from "@/config/ai";
import { topics } from "@/content/topics";
import { costSek } from "./cost";
import { startOfSwedishDay, swedishDay } from "./day";
import { startMaterial, topicMaterial } from "./material";
import { chatInstructions } from "./prompt";
import { readyAnswer } from "./ready";
import { splitReferences } from "./references";
import { chatRequestSchema, trimHistory } from "./schema";

const [first] = topics;

describe("chat material", () => {
  it("numbers a topic's sources like the page does", () => {
    const material = topicMaterial(first);
    expect(material.sources).toHaveLength(first.sources.length);
    expect(material.sources[0]).toMatchObject({ n: 1, name: first.sources[0].name });
    expect(material.text).toContain(`[${first.sources.length}] ${first.sources.at(-1)?.name}`);
    expect(material.text).toContain(first.dek);
  });

  it("only cites sources that exist", () => {
    for (const topic of topics) {
      const material = topicMaterial(topic);
      const cited = [...material.text.matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1]));
      for (const n of cited) expect(n).toBeLessThanOrEqual(material.sources.length);
    }
  });

  it("gives every source on the start page its own number", () => {
    const material = startMaterial(topics);
    const total = topics.reduce((sum, topic) => sum + topic.sources.length, 0);
    expect(material.sources).toHaveLength(total);
    expect(material.sources.map((source) => source.n)).toEqual(Array.from({ length: total }, (_, i) => i + 1));
    for (const topic of topics) expect(material.text).toContain(`ÄMNE: ${topic.title}`);
  });

  it("includes Frågor och svar and the glossary", () => {
    const material = topicMaterial(first);
    expect(material.text).toContain("FRÅGOR OCH SVAR");
    for (const item of first.faq) expect(material.text).toContain(item.answer);
    for (const item of first.glossary) expect(material.text).toContain(`${item.term}: ${item.explanation}`);
  });

  it("writes ready answers the way the chat cites sources", () => {
    const [item] = first.faq;
    const answer = readyAnswer(item);
    expect(answer.startsWith(item.answer)).toBe(true);
    expect(splitReferences(answer).filter((part) => part.type === "ref")).toHaveLength(item.sources.length);
  });

  it("puts the rules before the material", () => {
    const text = chatInstructions(topicMaterial(first), "topic");
    expect(text.indexOf("Svara bara utifrån UNDERLAGET")).toBeLessThan(text.indexOf("UNDERLAGET:\n"));
    expect(text).toContain(first.title);
  });
});

describe("references", () => {
  it("splits [n] into references", () => {
    expect(splitReferences("Ungefär 550 000 [1] eller fler [12].")).toEqual([
      { type: "text", text: "Ungefär 550 000 " },
      { type: "ref", n: 1 },
      { type: "text", text: " eller fler " },
      { type: "ref", n: 12 },
      { type: "text", text: "." },
    ]);
  });

  it("leaves other brackets alone", () => {
    expect(splitReferences("Se [källa] och [1a].")).toEqual([{ type: "text", text: "Se [källa] och [1a]." }]);
  });
});

describe("cost", () => {
  it("counts input, output and cache at list price in kronor", () => {
    const sek = costSek("claude-haiku-5-5", {
      input_tokens: 500,
      output_tokens: 600,
      cache_read_input_tokens: 6000,
      cache_creation_input_tokens: 0,
    });
    // (500 * 0.1 + 600 * 0.5 + 6000 * 0.01) / 1e6 dollars, times 10 kr.
    expect(sek).toBeCloseTo(0.0041, 6);
    expect(sek * 100).toBeLessThan(1); // under 1 öre
  });

  it("makes the daily budget last for thousands of questions", () => {
    const perQuestion = costSek("claude-haiku-5-5", { input_tokens: 600, output_tokens: 700, cache_read_input_tokens: 15000 });
    expect(chatConfig.dailyBudgetSek / perQuestion).toBeGreaterThan(2000);
  });
});

describe("Swedish day", () => {
  it("follows Swedish time, not UTC", () => {
    expect(swedishDay(new Date("2026-10-31T22:30:00Z"))).toBe("2026-10-31");
    expect(swedishDay(new Date("2026-10-31T23:30:00Z"))).toBe("2026-11-01");
  });

  it("starts at Swedish midnight in winter and summer", () => {
    expect(startOfSwedishDay(new Date("2026-10-31T12:00:00Z"))).toBe("2026-10-30T23:00:00.000Z");
    expect(startOfSwedishDay(new Date("2026-07-01T12:00:00Z"))).toBe("2026-06-30T22:00:00.000Z");
    // The day daylight saving ends (25 October 2026): midnight was still summer time.
    expect(startOfSwedishDay(new Date("2026-10-25T15:00:00Z"))).toBe("2026-10-24T22:00:00.000Z");
  });
});

describe("chat request", () => {
  const question = (content: string) => ({ role: "user" as const, content });

  it("accepts a question on the start page or a topic page", () => {
    expect(chatRequestSchema.safeParse({ scope: "start", messages: [question("Vad hände?")] }).success).toBe(true);
    expect(chatRequestSchema.safeParse({ scope: first.slug, messages: [question("Vad hände?")] }).success).toBe(true);
  });

  it("refuses odd scopes, empty or too long questions and answers last", () => {
    expect(chatRequestSchema.safeParse({ scope: "../admin", messages: [question("Hej")] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ scope: "start", messages: [question("   ")] }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ scope: "start", messages: [question("a".repeat(501))] }).success).toBe(false);
    expect(
      chatRequestSchema.safeParse({ scope: "start", messages: [question("Hej"), { role: "assistant", content: "Svar" }] }).success,
    ).toBe(false);
  });

  it("keeps the latest turns and starts with a question", () => {
    const messages = Array.from({ length: 9 }, (_, i) => ({ role: i % 2 === 0 ? ("user" as const) : ("assistant" as const), content: `m${i}` }));
    const trimmed = trimHistory(messages);
    expect(trimmed.length).toBeLessThanOrEqual(chatConfig.maxHistoryMessages);
    expect(trimmed[0].role).toBe("user");
    expect(trimmed.at(-1)?.content).toBe("m8");
  });
});
