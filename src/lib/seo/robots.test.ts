import { describe, expect, it } from "vitest";
import { parseIndexable } from "@/config/site";
import { NOINDEX_VALUE, robotsHeaders, robotsMetadata } from "./robots";

describe("parseIndexable", () => {
  it("is false unless the value is exactly true", () => {
    expect(parseIndexable(undefined)).toBe(false);
    expect(parseIndexable("")).toBe(false);
    expect(parseIndexable("false")).toBe(false);
    expect(parseIndexable("1")).toBe(false);
    expect(parseIndexable("yes")).toBe(false);
  });

  it("accepts true regardless of case and whitespace", () => {
    expect(parseIndexable("true")).toBe(true);
    expect(parseIndexable(" TRUE ")).toBe(true);
  });
});

describe("robots", () => {
  it("sends noindex as meta and header when not indexable", () => {
    expect(robotsMetadata(false)).toEqual({ index: false, follow: false });
    expect(robotsHeaders(false)).toEqual([{ key: "X-Robots-Tag", value: NOINDEX_VALUE }]);
  });

  it("allows indexing and sends no header when indexable", () => {
    expect(robotsMetadata(true)).toEqual({ index: true, follow: true });
    expect(robotsHeaders(true)).toEqual([]);
  });
});
