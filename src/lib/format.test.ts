import { describe, expect, it } from "vitest";
import { keepNumbersTogether } from "./format";

const nbsp = " ";

describe("keepNumbersTogether", () => {
  it("joins digit groups with a no-break space", () => {
    expect(keepNumbersTogether("mellan 550 000 och 800 000")).toBe(`mellan 550${nbsp}000 och 800${nbsp}000`);
    expect(keepNumbersTogether("1 250 000 personer")).toBe(`1${nbsp}250${nbsp}000 personer`);
    expect(keepNumbersTogether("550 000–800 000")).toBe(`550${nbsp}000–800${nbsp}000`);
  });

  it("leaves other spaces alone", () => {
    expect(keepNumbersTogether("Den 17 oktober 2026")).toBe("Den 17 oktober 2026");
    expect(keepNumbersTogether("5 min och 30 sek")).toBe("5 min och 30 sek");
    expect(keepNumbersTogether("år 2026 och 54 miljarder")).toBe("år 2026 och 54 miljarder");
    expect(keepNumbersTogether("12 1000")).toBe("12 1000");
  });
});
