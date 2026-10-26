import { z } from "zod";

export const SIGNUP_KINDS = ["beta", "newsletter"] as const;
export type SignupKind = (typeof SIGNUP_KINDS)[number];

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal(""), z.null(), z.undefined()])
  .transform((value) => value === "on" || value === "true");

export const signupSchema = z.object({
  kind: z.enum(SIGNUP_KINDS),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, { error: "E-postadressen är för lång." })
    .pipe(z.email({ error: "Skriv en giltig e-postadress, till exempel namn@exempel.se." })),
  consent: checkbox.refine((value) => value, {
    error: "Du behöver godkänna att vi sparar din e-postadress.",
  }),
  tester: checkbox,
  // Honeypot: must stay empty. Real visitors never see this field.
  website: z.string().max(0).optional().or(z.null()),
});

export type SignupInput = z.output<typeof signupSchema>;

export function parseSignup(formData: FormData) {
  return signupSchema.safeParse({
    kind: formData.get("kind"),
    email: formData.get("email") ?? "",
    consent: formData.get("consent"),
    tester: formData.get("tester"),
    website: formData.get("website"),
  });
}
