import { describe, expect, it } from "vitest";
import { teasers } from "@/content/teasers";
import { topics } from "@/content/topics";
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
    ...topic.sourceGroups.flatMap((group) => group.ids),
  ];
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
