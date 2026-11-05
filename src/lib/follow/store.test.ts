import { describe, expect, it } from "vitest";
import { FOLLOW_KEY, isFollowing, isNewer, parseFollows } from "./store";

describe("followed topics", () => {
  it("reads what the browser stored and skips anything odd", () => {
    const raw = JSON.stringify({
      version: 1,
      topics: {
        regeringsbildningen: { followedAt: "2026-11-05T10:00:00.000Z", seen: "2026-10-24T17:40:00+02:00" },
        "Inte en slug": { followedAt: "x", seen: "y" },
        inflationen: { followedAt: 5 },
      },
    });
    expect(parseFollows(raw)).toEqual({
      regeringsbildningen: { followedAt: "2026-11-05T10:00:00.000Z", seen: "2026-10-24T17:40:00+02:00" },
    });
    expect(parseFollows(null)).toEqual({});
    expect(parseFollows("inte json")).toEqual({});
    expect(parseFollows("null")).toEqual({});
    expect(FOLLOW_KEY).toBe("nyhetsanalys:folj");
  });

  it("compares versions as times, also across time zones", () => {
    expect(isNewer("2026-10-24T18:08:00+02:00", "2026-10-24T17:40:00+02:00")).toBe(true);
    expect(isNewer("2026-10-24T17:40:00+02:00", "2026-10-24T15:40:00Z")).toBe(false);
    expect(isNewer("2026-10-24T17:40:00+02:00", "inte ett datum")).toBe(false);
  });

  it("does not mistake built-in names for followed topics", () => {
    expect(isFollowing({}, "constructor")).toBe(false);
    expect(isFollowing(parseFollows('{"topics":{"amne":{"followedAt":"a","seen":"b"}}}'), "amne")).toBe(true);
  });
});
