import { describe, expect, it } from "vitest";
import { parseSiteUrl } from "./site";

describe("parseSiteUrl", () => {
  it("falls back to localhost", () => {
    expect(parseSiteUrl(undefined)).toBe("http://localhost:3000");
  });

  it("uses the Vercel production host when SITE_URL is missing", () => {
    expect(parseSiteUrl(undefined, "nyhetsanalys.vercel.app")).toBe("https://nyhetsanalys.vercel.app");
  });

  it("prefers SITE_URL and drops trailing slashes", () => {
    expect(parseSiteUrl("https://exempel.se/", "nyhetsanalys.vercel.app")).toBe("https://exempel.se");
  });
});
