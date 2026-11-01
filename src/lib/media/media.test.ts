import { describe, expect, it } from "vitest";
import { media } from "@/content/media";
import { topics } from "@/content/topics";
import { countMedia, getMediaOutlets, mediaUsage, outletFor } from ".";
import type { MediaFact, MediaOutlet } from "./types";

const facts = (outlet: MediaOutlet): [string, MediaFact][] =>
  (
    [
      ["publisher", outlet.publisher],
      ["owner", outlet.owner],
      ["ownerType", outlet.ownerType],
      ["funding", outlet.funding],
      ["mediaSupport", outlet.mediaSupport],
      ["editorialLabel", outlet.editorialLabel],
      ["changes", outlet.changes],
    ] as [string, MediaFact | undefined][]
  ).filter((entry): entry is [string, MediaFact] => entry[1] !== undefined);

describe("media register", () => {
  it("knows the medium behind every article", () => {
    for (const topic of topics) {
      for (const article of topic.articles) expect(outletFor(article.outlet), article.outlet).toBeDefined();
    }
  });

  it("has unique slugs and names", () => {
    const slugs = media.map((outlet) => outlet.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const names = media.flatMap((outlet) => [outlet.name, ...outlet.aliases].map((name) => name.toLowerCase()));
    expect(new Set(names).size).toBe(names.length);
  });

  it.each(media.map((outlet) => [outlet.name, outlet] as const))("backs every fact about %s with a source", (_name, outlet) => {
    expect(Number.isNaN(Date.parse(outlet.checked))).toBe(false);
    for (const source of outlet.sources) expect(source.url, source.title).toMatch(/^https:\/\//);
    for (const [field, fact] of facts(outlet)) {
      expect(fact.text.trim().length, field).toBeGreaterThan(0);
      expect(fact.sources.length, `${outlet.name}: ${field}`).toBeGreaterThan(0);
      for (const ref of fact.sources) {
        expect(ref).toBeGreaterThanOrEqual(1);
        expect(ref).toBeLessThanOrEqual(outlet.sources.length);
      }
    }
    // Every source is used by at least one fact.
    const used = new Set(facts(outlet).flatMap(([, fact]) => fact.sources));
    outlet.sources.forEach((_source, index) => expect(used.has(index + 1), `${outlet.name}: källa ${index + 1}`).toBe(true));
  });

  it("only gives Swedish media a line about Swedish media support", () => {
    for (const outlet of media) if (outlet.mediaSupport) expect(outlet.country).toBe("Sverige");
  });

  it("never lets a number split across lines", async () => {
    const text = JSON.stringify(await getMediaOutlets());
    expect(text).toContain("70\u00a0000");
    expect(text).not.toMatch(/\d \d{3}(?!\d)/);
  });

  it("counts media per topic and where each medium is used", () => {
    const usage = mediaUsage(topics);
    const total = [...usage.values()].flat().reduce((sum, use) => sum + use.articles, 0);
    expect(total).toBe(topics.reduce((sum, topic) => sum + topic.articles.length, 0));
    for (const topic of topics) expect(countMedia(topic)).toBeLessThanOrEqual(topic.articles.length);
  });
});
