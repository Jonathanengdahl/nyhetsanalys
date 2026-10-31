import { describe, expect, it } from "vitest";
import { helpfulSchema, suggestionSchema } from "./schema";

const perspective = "Arbetsgivarnas syn på pensionsreformen saknas helt.";

describe("helpful feedback", () => {
  it("reads ja and nej", () => {
    expect(helpfulSchema.parse({ topic: "inflationen", helpful: "ja" })).toMatchObject({ helpful: true, comment: null });
    expect(helpfulSchema.parse({ topic: "inflationen", helpful: "nej", comment: "  För långt.  " })).toMatchObject({
      helpful: false,
      comment: "För långt.",
    });
  });

  it("needs an answer and a real topic", () => {
    expect(helpfulSchema.safeParse({ topic: "inflationen" }).success).toBe(false);
    expect(helpfulSchema.safeParse({ topic: "inflationen", helpful: "kanske" }).success).toBe(false);
    expect(helpfulSchema.safeParse({ topic: "../admin", helpful: "ja" }).success).toBe(false);
  });

  it("limits the comment and stops bots", () => {
    expect(helpfulSchema.safeParse({ topic: "inflationen", helpful: "ja", comment: "x".repeat(1001) }).success).toBe(false);
    expect(helpfulSchema.safeParse({ topic: "inflationen", helpful: "ja", website: "spam" }).success).toBe(false);
  });
});

describe("suggested perspective", () => {
  const base = { topic: "protesterna-i-frankrike", perspective };

  it("needs a source", () => {
    const result = suggestionSchema.safeParse({ ...base, source: "" });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("Utan källa");
    expect(suggestionSchema.safeParse(base).success).toBe(false);
  });

  it("accepts a web address, with or without https://", () => {
    expect(suggestionSchema.parse({ ...base, source: "https://www.scb.se/statistik" }).source).toBe("https://www.scb.se/statistik");
    expect(suggestionSchema.parse({ ...base, source: "www.scb.se/statistik" }).source).toBe("https://www.scb.se/statistik");
    expect(suggestionSchema.parse({ ...base, source: "http://exempel.se/a?b=1" }).source).toBe("http://exempel.se/a?b=1");
  });

  it("refuses links that are not web pages", () => {
    for (const source of ["javascript:alert(1)", "ftp://exempel.se/fil", "https://localhost/x", "mailto:a@b.se", "inte en länk"]) {
      expect(suggestionSchema.safeParse({ ...base, source }).success, source).toBe(false);
    }
  });

  it("needs a real description of the perspective", () => {
    expect(suggestionSchema.safeParse({ ...base, perspective: "Saknas", source: "https://scb.se" }).success).toBe(false);
    expect(suggestionSchema.safeParse({ ...base, perspective: "x".repeat(1001), source: "https://scb.se" }).success).toBe(false);
  });
});
