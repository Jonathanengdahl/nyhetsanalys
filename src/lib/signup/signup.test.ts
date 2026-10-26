import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";
import { parseSignup } from "./schema";

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("parseSignup", () => {
  it("accepts a valid beta sign-up and normalises the email", () => {
    const result = parseSignup(form({ kind: "beta", email: "  Namn@Exempel.SE ", consent: "on", tester: "on" }));
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ kind: "beta", email: "namn@exempel.se", consent: true, tester: true });
  });

  it("requires consent", () => {
    const result = parseSignup(form({ kind: "newsletter", email: "namn@exempel.se" }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = parseSignup(form({ kind: "beta", email: "inte-en-adress", consent: "on" }));
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    const result = parseSignup(form({ kind: "beta", email: "namn@exempel.se", consent: "on", website: "spam" }));
    expect(result.success).toBe(false);
  });

  it("rejects an unknown kind", () => {
    const result = parseSignup(form({ kind: "other", email: "namn@exempel.se", consent: "on" }));
    expect(result.success).toBe(false);
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit and frees up after the window", () => {
    const isAllowed = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(isAllowed("a", 0)).toBe(true);
    expect(isAllowed("a", 10)).toBe(true);
    expect(isAllowed("a", 20)).toBe(false);
    expect(isAllowed("b", 20)).toBe(true);
    expect(isAllowed("a", 1500)).toBe(true);
  });
});
