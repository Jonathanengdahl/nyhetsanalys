"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createRateLimiter } from "./rate-limit";
import { parseSignup } from "./schema";

export type SignupState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: { email?: string; consent?: string };
      // Echoed back so the form can keep what the visitor typed. `attempt`
      // is unique per response so the form remounts with these values.
      values: { email: string; tester: boolean; attempt: string };
    };

function submittedValues(formData: FormData) {
  const email = formData.get("email");
  return {
    email: typeof email === "string" ? email.slice(0, 254) : "",
    tester: formData.get("tester") === "on",
    attempt: crypto.randomUUID(),
  };
}

const isAllowed = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const SUCCESS_MESSAGE: Record<string, string> = {
  beta: "Tack! Vi hör av oss när betan öppnar för fler.",
  newsletter: "Tack! Du får veckobrevet när vi börjar skicka det.",
};

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitSignup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const parsed = parseSignup(formData);

  if (!parsed.success) {
    // A filled honeypot is treated as success so bots learn nothing.
    if (formData.get("website")) {
      return { status: "success", message: SUCCESS_MESSAGE.beta };
    }
    const fields = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Något i formuläret behöver rättas.",
      fieldErrors: { email: fields.email?.[0], consent: fields.consent?.[0] },
      values: submittedValues(formData),
    };
  }

  if (!isAllowed(await clientKey())) {
    return {
      status: "error",
      message: "För många försök. Vänta en stund och försök igen.",
      values: submittedValues(formData),
    };
  }

  const { kind, email, tester } = parsed.data;
  const flags = {
    wants_beta: kind === "beta",
    wants_newsletter: kind === "newsletter",
    wants_tester: kind === "beta" && tester,
  };

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: selectError } = await supabase
      .from("waitlist")
      .select("id, wants_beta, wants_newsletter, wants_tester")
      .eq("email", email)
      .maybeSingle();
    if (selectError) throw selectError;

    if (existing) {
      // Only ever add choices; a new form never removes earlier ones.
      const { error } = await supabase
        .from("waitlist")
        .update({
          wants_beta: existing.wants_beta || flags.wants_beta,
          wants_newsletter: existing.wants_newsletter || flags.wants_newsletter,
          wants_tester: existing.wants_tester || flags.wants_tester,
          consent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("waitlist").insert({ email, consent_storage: true, ...flags });
      if (error) throw error;
    }
  } catch (error) {
    // Log without personal data.
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";
    console.error(`signup failed (kind=${kind}, code=${code})`);
    return {
      status: "error",
      message: "Det gick inte att spara just nu. Försök igen om en stund.",
      values: submittedValues(formData),
    };
  }

  // Same message whether the address was new or not, so nobody can test
  // which addresses are on the list.
  return { status: "success", message: SUCCESS_MESSAGE[kind] };
}
