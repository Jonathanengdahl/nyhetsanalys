import { z } from "zod";

const topic = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

// Honeypot: must stay empty. Real visitors never see this field.
const honeypot = z.string().max(0).optional().or(z.null());

/** "Var den här sidan tydlig?" with an optional comment. */
export const helpfulSchema = z.object({
  topic,
  helpful: z.enum(["ja", "nej"], { error: "Välj ja eller nej." }).transform((value) => value === "ja"),
  comment: z
    .string()
    .trim()
    .max(1000, { error: "Kommentaren får vara högst 1 000 tecken." })
    .nullish()
    .transform((value) => value || null),
  website: honeypot,
});

/** A missing perspective. A source is required, so that a person can check it. */
export const suggestionSchema = z.object({
  topic,
  perspective: z
    .string({ error: "Beskriv perspektivet som saknas." })
    .trim()
    .min(15, { error: "Beskriv perspektivet med minst en mening." })
    .max(1000, { error: "Förslaget får vara högst 1 000 tecken." }),
  source: z
    .string({ error: "Lägg till en länk till källan." })
    .trim()
    .min(1, { error: "Lägg till en länk till källan. Utan källa kan vi inte granska förslaget." })
    .max(500, { error: "Länken är för lång." })
    // "www.scb.se/..." is read as https://. Other schemes (javascript:, ftp:) stay and fail below.
    .transform((value) => (/^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`))
    .pipe(
      z.url({
        protocol: /^https?$/,
        hostname: z.regexes.domain,
        error: "Skriv hela länken till källan, till exempel https://www.exempel.se/artikel.",
      }),
    ),
  website: honeypot,
});

export function parseHelpful(formData: FormData) {
  return helpfulSchema.safeParse({
    topic: formData.get("topic"),
    helpful: formData.get("helpful"),
    comment: formData.get("comment"),
    website: formData.get("website"),
  });
}

export function parseSuggestion(formData: FormData) {
  return suggestionSchema.safeParse({
    topic: formData.get("topic"),
    perspective: formData.get("perspective"),
    source: formData.get("source"),
    website: formData.get("website"),
  });
}
