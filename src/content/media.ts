import type { MediaOutlet } from "@/lib/media/types";
import type { Source } from "@/lib/topics/types";

/**
 * The media whose articles are in our material, with who publishes, owns and
 * finances them. Every fact points at its sources (1-based numbers in
 * `sources`). Checked against the sources on the date in `checked`.
 * Only facts about ownership and money: never owners' opinions or intentions.
 */

const CHECKED = "2026-11-01";

/** Mediemyndigheten's list of everyone granted mediestöd for 2026. */
const mediestod2026: Source = {
  name: "Mediemyndigheten",
  title: "Beviljat per stödform 2026, mediestöd",
  url: "https://mediemyndigheten.se/globalassets/stod-till-medier/beviljade-stod/2026/beviljat-per-stodform-2026---mediestod.pdf",
};

const NO_MEDIA_SUPPORT_2026 = "Finns inte med bland dem som har beviljats mediestöd för 2026.";

export const media: MediaOutlet[] = [
  {
    slug: "borskollen",
    name: "Börskollen",
    aliases: [],
    country: "Sverige",
    kind: "Nyhetsmedium",
    publisher: { text: "Börskollen Sverige AB", sources: [1] },
    owner: {
      text: "FairValue FV AB, som köpte Börskollen i maj 2026. FairValue står också bakom analyshuset Kalqyl och plattformen TradeVenue. Vilka som äger FairValue framgår inte av källorna.",
      sources: [2, 1],
    },
    ownerType: { text: "Företag inom finansmedia och kommunikation för börsbolag", sources: [2] },
    funding: { text: "Annonser, sponsrat innehåll och affiliatelänkar", sources: [3, 1] },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [4] },
    sources: [
      { name: "Börskollen", title: "Redaktionell policy", url: "https://www.borskollen.se/redaktionell-policy" },
      {
        name: "FairValue",
        title: "Pressmeddelande: FairValue förvärvar Börskollen, 27 maj 2026",
        url: "https://www.mfn.se/a/kalqyl/fairvalue-forvarvar-borskollen-bygger-en-ny-plattform-for-kapitalmarknaden",
      },
      { name: "Börskollen", title: "Bästa kreditkortet 2026, med upplysning om reklam och affiliatelänkar", url: "https://borskollen.se/basta-kreditkortet" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "direkt",
    name: "Direkt",
    aliases: ["Nyhetsbyrån Direkt"],
    country: "Sverige",
    kind: "Nyhetsbyrå",
    publisher: { text: "Nyhetsbyrån Direkt, en del av Infront News", sources: [1] },
    owner: {
      text: "Infront, en koncern inom finansdata med huvudkontor i Oslo. Infront ägs sedan 2021 av det brittiska riskkapitalbolaget Inflexion.",
      sources: [1, 2, 3],
    },
    ownerType: { text: "Riskkapitalbolag", sources: [2] },
    funding: { text: "Säljer nyheter till banker, nätmäklare, kapitalförvaltare och medier", sources: [1] },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [4] },
    sources: [
      { name: "Infront", title: "News Agency Direkt", url: "https://www.infront.co/global/en/solutions/modules/direkt/news-agency.html" },
      { name: "Inflexion", title: "Portföljbolaget Infront", url: "https://www.inflexion.com/portfolio/infront" },
      {
        name: "Inflexion",
        title: "Inflexion completes acquisition of Infront, juni 2021",
        url: "https://www.inflexion.com/news-and-insights/news/2021/inflexion-completes-acquisition-of-infront-and-appoints-chair/",
      },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "efn",
    name: "EFN",
    aliases: ["EFN Ekonomikanalen"],
    country: "Sverige",
    kind: "Nyhetsmedium",
    publisher: { text: "EFN Ekonomikanalen AB", sources: [1] },
    owner: { text: "Svenska Handelsbanken, som äger EFN Ekonomikanalen AB helt", sources: [2, 1] },
    ownerType: { text: "Börsnoterad bank", sources: [2, 3] },
    funding: {
      text: "Handelsbanken betalar verksamheten. Inslag och program är reklamfria och gratis. Sedan mars 2025 finns också prenumerationstidningen EFN Finansmagasinet.",
      sources: [1, 4, 5],
    },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [8] },
    changes: {
      text: "Handelsbanken meddelade i maj 2023 att EFN skulle läggas ned, men ändrade sig i december 2023. EFN finns kvar som dotterbolag.",
      sources: [6, 7],
    },
    sources: [
      { name: "EFN", title: "Om EFN", url: "https://efn.se/om-efn" },
      { name: "Handelsbanken", title: "Svenska dotterbolag", url: "https://www.handelsbanken.se/sv/om-oss/svenska-dotterbolag" },
      { name: "Handelsbanken", title: "About the share", url: "https://www.handelsbanken.com/en/investor-relations/the-share/about-the-share" },
      {
        name: "Aktiespararna",
        title: "Kostnadstyngda Handelsbanken satsar på lokal journalistik, 24 april 2024",
        url: "https://www.aktiespararna.se/nyheter/kostnadstyngda-handelsbanken-satsar-pa-lokal-journalistik",
      },
      { name: "EFN", title: "EFN lanserar EFN Finansmagasinet, 6 mars 2025", url: "https://efn.se/efn-lanserar-efn-finansmagasinet-en-ny-tidning" },
      { name: "Realtid", title: "Handelsbanken avvecklar EFN", url: "https://www.realtid.se/bors-finans/bank-fintech/handelsbanken-avvecklar-efn/" },
      { name: "Börsvärlden", title: "Handelsbanken ändrar sig, EFN läggs inte ned", url: "https://borsvarlden.com/artiklar/handelsbanken-andrar-sig-efn-laggs-inte-ned" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "ekonomifokus",
    name: "Ekonomifokus",
    aliases: [],
    country: "Sverige",
    kind: "Nyhetsmedium",
    publisher: { text: "Hojjo Sverige AB", sources: [1] },
    owner: {
      text: "Hojjo Sverige AB, som grundades 2017 av Andreas Hogmalm och Joakim Ryttersson. Båda anges som delägare. Om bolaget har fler ägare framgår inte.",
      sources: [1],
    },
    ownerType: { text: "Aktiebolag som är delägt av grundarna", sources: [1] },
    funding: {
      text: "Annonser, samarbeten med andra sajter och försäljning av tjänster som skrivuppdrag och värderingar",
      sources: [2, 1],
    },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [3] },
    sources: [
      { name: "Ekonomifokus", title: "Om Ekonomifokus", url: "https://www.ekonomifokus.se/om-oss" },
      { name: "Ekonomifokus", title: "Kontakta oss", url: "https://www.ekonomifokus.se/kontakt" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "finwire",
    name: "Finwire",
    aliases: ["Nyhetsbyrån Finwire"],
    country: "Sverige",
    kind: "Nyhetsbyrå",
    publisher: { text: "FinWire AB, Göteborg", sources: [1] },
    owner: {
      text: "Inte kontrollerat för 2026. Den senaste uppgiften vi har hittat är från 2020. Då ägdes bolaget av grundarna, kommunikationskoncernen Nowa Kommunikation och en privat investerare.",
      label: "Obekräftat",
      sources: [2, 3],
    },
    funding: {
      text: "Säljer nyheter till medier, banker, nätmäklare och fondbolag. Säljer också tjänster för investerarkommunikation till börsbolag.",
      sources: [2, 4],
    },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [5] },
    sources: [
      { name: "Syna", title: "FinWire AB", url: "https://upplysningar.syna.se/kreditupplysning/kop/5569413270/finwire-ab" },
      {
        name: "Realtid",
        title: "Expanderande Göteborgsbolag bevakar växande småföretagsmarknad, 18 november 2020",
        url: "https://www.realtid.se/bors-finans/expanderande-goteborgsbolag-bevakar-vaxande-smaforetagsmarknad/",
      },
      { name: "Realtid", title: "Nowagruppen blir ny ägare i Finwire, 12 september 2019", url: "https://www.realtid.se/bors-finans/nowagruppen-blir-ny-agare-i-finwire/" },
      { name: "Finwire TV", title: "Produkter", url: "https://www.finwire.tv/produkter/" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "hurbra",
    name: "HurBra",
    aliases: [],
    country: "Sverige",
    kind: "Nyhetsmedium",
    publisher: { text: "BTD Consulting Uppsala AB", sources: [1] },
    owner: { text: "Inte kontrollerat än. Sajten anger bolaget som driver den, men inte vem som äger bolaget.", sources: [1] },
    funding: { text: "Delvis annonser från externa annonsleverantörer", sources: [2] },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [3] },
    sources: [
      { name: "HurBra", title: "Om oss", url: "https://hurbra.se/om-oss" },
      { name: "HurBra", title: "Integritetspolicy", url: "https://hurbra.se/integritetspolicy" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
  {
    slug: "placera",
    name: "Placera",
    aliases: [],
    country: "Sverige",
    kind: "Nyhetsmedium",
    publisher: { text: "Placera Media AB. Tidningen drivs av Nya Klara Publishing AB, som också gör Affärsvärlden.", sources: [1] },
    owner: { text: "Avanza Bank Holding AB, genom det helägda dotterbolaget Placera Media AB", sources: [1, 2] },
    ownerType: { text: "Börsnoterad bank", sources: [1, 3] },
    funding: { text: "Ingår i Avanzas tjänster och är gratis att läsa. Annonser.", sources: [2, 1] },
    mediaSupport: { text: NO_MEDIA_SUPPORT_2026, sources: [6] },
    changes: {
      text: "Sedan november 2024 kommer det redaktionella innehållet från Affärsvärlden. Placeras egen redaktion lades ned.",
      sources: [4, 5],
    },
    sources: [
      { name: "Placera", title: "Om Placera", url: "https://placera.se/om-placera" },
      { name: "Avanza", title: "About Placera", url: "https://investors.avanza.se/en/about/placera_eng" },
      {
        name: "Avanza",
        title: "Förändrat antal aktier och röster i Avanza Bank Holding AB (publ), 30 september 2026",
        url: "https://www.inderes.se/releases/forandrat-antal-aktier-och-roster-i-avanza-bank-holding-ab-publ-9",
      },
      {
        name: "Avanza",
        title: "Avanza avser inleda samarbete med Affärsvärlden, 20 augusti 2024",
        url: "https://storage.mfn.se/b4daf55a-53a2-44e4-bee7-60eff699d6c0/avanza-avser-inga-samarbete-med-affarsvarlden-for-att-starka-nyhetsflodet-till-kunder.pdf",
      },
      { name: "Placera", title: "Nya Placera varvar upp, inte ner, 4 november 2024", url: "https://www.placera.se/nyheter/nya-placera-varvar-upp-inte-ner-2024-11-04" },
      mediestod2026,
    ],
    checked: CHECKED,
  },
];
