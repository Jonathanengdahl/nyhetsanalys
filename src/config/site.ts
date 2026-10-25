/**
 * Central site configuration. Name, domain, owner and contact details live
 * here so they can be changed in one place. Environment variables are read
 * here and nowhere else.
 */

export function parseIndexable(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function parseSiteUrl(value: string | undefined): string {
  const url = value?.trim() || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

export const site = {
  /** Working name. Product name and domain are not decided yet. */
  name: "Nyhetsanalys",
  shortDescription: "Vi analyserar dagens heta nyhetsämnen.",
  description:
    "När många medier skriver om samma sak samlar vi artiklarna, jämför hur de beskriver händelsen och visar vad som saknas i debatten. Neutralt och alltid med källor.",
  url: parseSiteUrl(process.env.SITE_URL),
  indexable: parseIndexable(process.env.SITE_INDEXABLE),
  locale: "sv-SE",
  language: "sv",
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
      "Det här är en betaversion. Innehållet är exempeldata och kan innehålla fel.",
  },
} as const;

export type Site = typeof site;
