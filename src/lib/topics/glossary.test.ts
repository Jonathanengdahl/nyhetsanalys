import { describe, expect, it } from "vitest";
import { glossaryPattern } from "./glossary";

const find = (word: string, text: string) => glossaryPattern(word).exec(text)?.[0] ?? null;

describe("glossary pattern", () => {
  it("finds longer forms of a word, with or without a capital letter", () => {
    expect(find("talman", "Talmannen gav uppdraget")).toBe("Talmannen");
    expect(find("tidöparti", "de fyra Tidöpartierna")).toBe("Tidöpartierna");
    expect(find("gula väst", "som gula västarna 2018")).toBe("gula västarna");
  });

  it("never finds a word inside another word", () => {
    expect(find("mandat", "fler riksdagsmandat")).toBeNull();
    expect(find("KPI", "mätt som KPIF steg")).toBeNull();
  });

  it("finds short forms before a colon", () => {
    expect(find("KPIF", "KPIF:s ökning")).toBe("KPIF");
    expect(find("KPI", "mätt som KPI.")).toBe("KPI");
  });
});
