import { describe, expect, it } from "vitest";
import { teasers } from "@/content/teasers";
import { topics } from "@/content/topics";
import { getPublishedTopics, getTeasers } from ".";
import { glossaryPattern } from "./glossary";
import { uncertaintyLabels, type Topic } from "./types";

// The same checks must hold for AI-generated topics later, before they are published.
function sourceRefs(topic: Topic): number[] {
  return [
    ...topic.updates.items.flatMap((item) => item.sources),
    ...topic.timeline.flatMap((event) => event.sources),
    ...topic.facts.flatMap((fact) => fact.sources),
    ...topic.blame.sources,
    ...topic.models.sources,
    ...topic.numbers.tiles.flatMap((tile) => tile.sources),
    ...topic.numbers.charts.flatMap((chart) => chart.sources),
    ...topic.missing.flatMap((item) => item.sources),
    ...topic.faq.flatMap((item) => item.sources),
    ...topic.sourceGroups.flatMap((group) => group.ids),
  ];
}

/** Every list of source numbers on the page, to check them one by one. */
function sourceLists(topic: Topic): number[][] {
  return [
    ...topic.updates.items.map((item) => item.sources),
    ...topic.timeline.map((event) => event.sources),
    ...topic.facts.map((fact) => fact.sources),
    topic.blame.sources,
    topic.models.sources,
    ...topic.numbers.tiles.map((tile) => tile.sources),
    ...topic.numbers.charts.map((chart) => chart.sources),
    ...topic.missing.map((item) => item.sources),
    ...topic.faq.map((item) => item.sources),
  ];
}

/** The texts where explained words are marked (see glosser in Glossary.tsx). */
function glossedText(topic: Topic): string {
  return [
    ...topic.summary.map((row) => row.text),
    ...topic.updates.items.map((item) => item.text),
    ...topic.timeline.map((event) => event.text),
    ...topic.facts.map((fact) => fact.text),
    ...topic.numbers.tiles.map((tile) => tile.label),
    ...topic.missing.map((item) => item.text),
    ...topic.faq.map((item) => item.answer),
  ].join("\n");
}

describe.each(topics.map((topic) => [topic.slug, topic] as const))("topic %s", (_slug, topic) => {
  it("has a clean slug", () => {
    expect(topic.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("only refers to sources that exist", () => {
    for (const ref of sourceRefs(topic)) {
      expect(ref).toBeGreaterThanOrEqual(1);
      expect(ref).toBeLessThanOrEqual(topic.sources.length);
    }
  });

  it("uses known uncertainty labels", () => {
    for (const fact of topic.facts) expect(uncertaintyLabels).toContain(fact.label);
    for (const item of topic.card.highlights ?? []) expect(uncertaintyLabels).toContain(item.uncertainty);
    for (const item of topic.faq) if (item.label) expect(uncertaintyLabels).toContain(item.label);
  });

  it("never lists the same source twice in one place", () => {
    for (const list of sourceLists(topic)) expect(new Set(list).size).toBe(list.length);
  });

  it("answers every question in Frågor och svar with a source", () => {
    const questions = topic.faq.map((item) => item.question);
    expect(new Set(questions).size).toBe(questions.length);
    for (const item of topic.faq) {
      expect(item.question.endsWith("?")).toBe(true);
      expect(item.answer.length).toBeGreaterThan(20);
      expect(item.sources.length).toBeGreaterThan(0);
    }
  });

  it("explains words that are used on the page", () => {
    const text = glossedText(topic);
    const terms = topic.glossary.map((item) => item.term);
    expect(new Set(terms).size).toBe(terms.length);
    for (const item of topic.glossary) {
      expect(text, item.term).toMatch(glossaryPattern(item.match ?? item.term));
      expect(item.explanation.length).toBeGreaterThan(20);
    }
  });

  it("has a value for every column in the article matrix", () => {
    for (const row of topic.media.matrix) {
      expect(row.values).toHaveLength(topic.media.matrixColumns.length);
      for (const value of row.values) expect([0, 1, 2]).toContain(value);
    }
  });

  it("has frame shares that add up to about 100 percent", () => {
    const total = topic.media.frames.reduce((sum, frame) => sum + frame.weight, 0);
    expect(total).toBeGreaterThan(98);
    expect(total).toBeLessThan(102);
  });

  it("has valid dates", () => {
    expect(Number.isNaN(Date.parse(topic.updatedAt))).toBe(false);
    expect(Number.isNaN(Date.parse(topic.publishedAt))).toBe(false);
  });
});

describe("topic list", () => {
  it("has unique slugs and ranks", () => {
    const slugs = topics.map((topic) => topic.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const ranks = [...topics, ...teasers].map((item) => item.rank);
    expect(new Set(ranks).size).toBe(ranks.length);
  });
});

describe("data layer", () => {
  it("never lets a number split across lines", async () => {
    const text = JSON.stringify([await getPublishedTopics(), await getTeasers()]);
    expect(text).toContain("550 000");
    expect(text).not.toMatch(/\d \d{3}(?!\d)/);
  });

  it("keeps everything else as it is", async () => {
    const [first] = await getPublishedTopics();
    const source = topics.find((topic) => topic.slug === first.slug);
    expect(first.slug).toBe(source?.slug);
    expect(first.updatedAt).toBe(source?.updatedAt);
    expect(first.media.frames.map((frame) => frame.weight)).toEqual(source?.media.frames.map((frame) => frame.weight));
  });
});
