/**
 * Central site configuration. Name, domain, owner and contact details live
 * here so they can be changed in one place. Environment variables are read
 * here and nowhere else.
 */

export function parseIndexable(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

/**
 * SITE_URL wins. On Vercel the project's production domain is used when
 * SITE_URL is not set, so links in metadata never point to localhost there.
 */
export function parseSiteUrl(value: string | undefined, vercelProductionHost?: string): string {
  const host = vercelProductionHost?.trim();
  const url = value?.trim() || (host ? `https://${host}` : "") || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export const site = {
  /** Working name. Product name and domain are not decided yet. */
  name: "Nyhetsanalys",
  shortDescription: "Vi analyserar dagens heta nyhetsämnen.",
  description:
    "När många medier skriver om samma sak samlar vi artiklarna, jämför hur de beskriver händelsen och visar vad som saknas i debatten. Neutralt och alltid med källor.",
  url: parseSiteUrl(process.env.SITE_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL),
  indexable: parseIndexable(process.env.SITE_INDEXABLE),
  locale: "sv-SE",
  language: "sv",
  timeZone: "Europe/Stockholm",
  /** Browser UI colour. Mirrors --color-bg in src/styles/tokens.css. */
  themeColor: "#1b1240",
  owner: {
    name: "Ascenddigital OÜ",
  },
  responsiblePublisher: {
    name: "Jonathan Engdahl",
    title: "Ansvarig för innehållet",
  },
  contact: {
    email: "hello@ascenddigital.tech",
  },
  beta: {
    enabled: true,
    label: "Beta",
    notice:
      "Betaversion med exempelinnehåll från 24 oktober. Texterna är skrivna med AI och har inte granskats av en redaktör.",
  },
} as const;

export type Site = typeof site;
