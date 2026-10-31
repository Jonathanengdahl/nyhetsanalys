import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { topics } from "@/content/topics";
import { topicOutline } from "./outline";

const sectionSources = ["src/components/topic/sections.tsx", "src/components/topic/MediaSection.tsx"]
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

describe("topic outline", () => {
  it("only points at headings that exist on the topic page", () => {
    for (const item of topicOutline(topics[0])) {
      expect(sectionSources).toContain(`id="${item.id}"`);
    }
  });

  it("has unique ids and describes every part", () => {
    for (const topic of topics) {
      const outline = topicOutline(topic);
      expect(new Set(outline.map((item) => item.id)).size).toBe(outline.length);
      for (const item of outline) expect(item.detail.length).toBeGreaterThan(0);
    }
  });
});
