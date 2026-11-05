import { describe, expect, it } from "vitest";
import { isReserved, parseTdmRep, reservationFromHeader, reservedByFile } from "./tdm";

describe("reservations against text and data mining", () => {
  it("reads the header: 1 is reserved, 0 is not, anything else is unset", () => {
    expect(reservationFromHeader("1")).toBe(true);
    expect(reservationFromHeader(" 0 ")).toBe(false);
    expect(reservationFromHeader("yes")).toBeNull();
    expect(reservationFromHeader(null)).toBeNull();
  });

  it("reads tdmrep.json and skips entries that are not valid", () => {
    const rules = parseTdmRep([
      { location: "/", "tdm-reservation": 1 },
      { location: "/press/*", "tdm-reservation": 0 },
      { location: 5, "tdm-reservation": 1 },
      { location: "/x", "tdm-reservation": "1" },
    ]);
    expect(rules).toEqual([
      { location: "/", reserved: true },
      { location: "/press/*", reserved: false },
    ]);
    expect(parseTdmRep({ not: "a list" })).toEqual([]);
  });

  it("lets the most specific location in the file decide", () => {
    const rules = parseTdmRep([
      { location: "/", "tdm-reservation": 1 },
      { location: "/rss/*", "tdm-reservation": 0 },
    ]);
    expect(reservedByFile(rules, "/artikel/1")).toBe(true);
    expect(reservedByFile(rules, "/rss/nyheter")).toBe(false);
    expect(reservedByFile([], "/rss")).toBeNull();
  });

  it("lets the header win over the file, and allows mining when nothing is said", () => {
    expect(isReserved(false, true)).toBe(false);
    expect(isReserved(true, false)).toBe(true);
    expect(isReserved(null, true)).toBe(true);
    expect(isReserved(null, null)).toBe(false);
  });
});
