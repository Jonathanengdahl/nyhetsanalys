import { describe, expect, it } from "vitest";
import { looksLikeAnthropicKey, redactSecrets, safeErrorMessage } from "./secrets";

// Made-up values with the right shape. Never real keys.
const KEY = `sk-ant-api03-${"a1B2_c3-".repeat(8)}`;
const SUPABASE = `sb_secret_${"Xy9z".repeat(8)}`;

describe("keeping secrets out of logs", () => {
  it("hides Claude and Supabase keys, tokens and bearer values", () => {
    const text = `Headers.append: "Bearer curl --header "x-api-key: ${KEY}"" is invalid; also ${SUPABASE} and eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZSJ9.c2lnbmF0dXJl`;
    const safe = redactSecrets(text);
    expect(safe).not.toContain(KEY);
    expect(safe).not.toContain(SUPABASE);
    expect(safe).not.toContain("eyJhbGciOiJIUzI1NiJ9");
    expect(safe).toContain("Bearer [dold]");
    expect(safe).toContain("x-api-key: [dold]");
  });

  it("keeps ordinary error text and makes it one short line", () => {
    expect(safeErrorMessage(new Error("Connection\n  refused"))).toBe("Connection refused");
    expect(safeErrorMessage("x".repeat(500), 10)).toHaveLength(10);
  });

  it("recognises a key, and not a code example or a key with text around it", () => {
    expect(looksLikeAnthropicKey(KEY)).toBe(true);
    expect(looksLikeAnthropicKey(`curl https://api.anthropic.com/v1/messages --header "x-api-key: ${KEY}"`)).toBe(false);
    expect(looksLikeAnthropicKey(`${KEY} `)).toBe(false);
    expect(looksLikeAnthropicKey("sk-ant-")).toBe(false);
    expect(looksLikeAnthropicKey("")).toBe(false);
  });
});
