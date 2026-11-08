import { describe, expect, it } from "vitest";
import { relativeSince } from "./today";

const at = (iso: string) => Date.parse(iso);

describe("relative time since an update", () => {
  it("says how long ago within a day, and nothing after that", () => {
    const now = at("2026-11-08T12:00:00Z");
    expect(relativeSince("2026-11-08T11:59:40Z", now)).toBe("nyss");
    expect(relativeSince("2026-11-08T11:48:00Z", now)).toBe("för 12 min sedan");
    expect(relativeSince("2026-11-08T11:00:00Z", now)).toBe("för 1 timme sedan");
    expect(relativeSince("2026-11-08T09:10:00Z", now)).toBe("för 3 timmar sedan");
    expect(relativeSince("2026-11-07T11:00:00Z", now)).toBeNull();
  });

  it("gives nothing for a time in the future or one that cannot be read", () => {
    const now = at("2026-11-08T12:00:00Z");
    expect(relativeSince("2026-11-08T13:00:00Z", now)).toBeNull();
    expect(relativeSince("igår", now)).toBeNull();
  });
});
