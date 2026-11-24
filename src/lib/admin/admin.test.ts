import { afterEach, describe, expect, it, vi } from "vitest";
import { isAdminRequest, passwordFrom } from "./auth";
import { decisionInput, statusAfter } from "@/lib/sort/decide";
import { allowedDecisions } from "./decisions";

const basic = (user: string, password: string) => `Basic ${btoa(`${user}:${password}`)}`;

describe("admin password", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("reads the password after the first colon", () => {
    expect(passwordFrom(basic("jonathan", "a:b:c"))).toBe("a:b:c");
    expect(passwordFrom("Bearer x")).toBeNull();
    expect(passwordFrom("Basic !!!")).toBeNull();
  });

  it("refuses everything when the password is missing or short", () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    expect(isAdminRequest(basic("x", ""))).toBe(false);
    vi.stubEnv("ADMIN_PASSWORD", "short");
    expect(isAdminRequest(basic("x", "short"))).toBe(false);
  });

  it("accepts the right password with any user name", () => {
    vi.stubEnv("ADMIN_PASSWORD", "ett-langt-losenord");
    expect(isAdminRequest(basic("vem-som-helst", "ett-langt-losenord"))).toBe(true);
    expect(isAdminRequest(basic("x", "ett-langt-losenorD"))).toBe(false);
    expect(isAdminRequest(null)).toBe(false);
  });
});

describe("decisions", () => {
  it("parses only known decisions and real ids", () => {
    expect(decisionInput.safeParse({ id: "12", decision: "approve" }).success).toBe(true);
    expect(decisionInput.safeParse({ id: "0", decision: "approve" }).success).toBe(false);
    expect(decisionInput.safeParse({ id: "12", decision: "publish" }).success).toBe(false);
  });

  it("gives the status after each decision", () => {
    expect(statusAfter("approve", false)).toBe("approved");
    expect(statusAfter("reject", true)).toBe("rejected");
    expect(statusAfter("reopen", true)).toBe("hot");
    expect(statusAfter("reopen", false)).toBe("watching");
  });
});

describe("draft decisions", () => {
  it("never offers to publish a draft with problems", () => {
    expect(allowedDecisions({ status: "draft", problems: [], data: {} as never })).toEqual(["publish", "retry"]);
    expect(allowedDecisions({ status: "draft", problems: ["Källa 4 finns inte."], data: {} as never })).toEqual(["retry"]);
    expect(allowedDecisions({ status: "published", problems: [], data: {} as never })).toEqual(["withdraw"]);
    expect(allowedDecisions({ status: "failed", problems: ["x"], data: null })).toEqual(["retry"]);
  });
});
