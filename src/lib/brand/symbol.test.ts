import { describe, expect, it } from "vitest";
import { symbol, symbolSvg } from "./symbol";

describe("the logo symbol", () => {
  it("draws the overlap exactly where the two cards meet", () => {
    const { back, front } = symbol;
    const left = Math.max(back.x, front.x);
    const right = Math.min(back.x + back.width, front.x + front.width);
    const top = Math.max(back.y, front.y);
    const bottom = Math.min(back.y + back.height, front.y + front.height);
    // Starts on the front card's left edge below its rounded corner, runs along the back card's
    // right edge down to its rounded corner, and ends on the back card's bottom edge.
    expect(symbol.overlap).toMatch(new RegExp(`^M${left} ${top + front.rx}a5 5 0 0 1 5-5H${right}v${bottom - back.rx - top}a5 5 0 0 1-5 5h-${right - back.rx - left}z$`));
  });

  it("fits inside its view box", () => {
    const [x, y, width, height] = symbol.viewBox.split(" ").map(Number);
    for (const card of [symbol.back, symbol.front]) {
      expect(card.x).toBeGreaterThanOrEqual(x);
      expect(card.y).toBeGreaterThanOrEqual(y);
      expect(card.x + card.width).toBeLessThanOrEqual(x + width);
      expect(card.y + card.height).toBeLessThanOrEqual(y + height);
    }
    expect([width, height]).toEqual([symbol.width, symbol.height]);
  });

  it("makes a standalone image in the given colours", () => {
    const svg = symbolSvg({ back: "#111111", front: "#222222", overlap: "#333333" }, { width: 36, height: 45 });
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    expect(svg).toContain('width="36" height="45"');
    for (const colour of ["#111111", "#222222", "#333333"]) expect(svg).toContain(colour);
  });
});
