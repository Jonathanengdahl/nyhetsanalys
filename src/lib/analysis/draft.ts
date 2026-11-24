import { z } from "zod";
import { categoryLabels } from "@/lib/topics";
import { uncertaintyLabels, type Accent, type MatrixValue, type PanelVoice, type Topic, type TopicCategory } from "@/lib/topics/types";

/*
 * The draft the model writes, and how it becomes a Topic. The model only
 * writes text and picks source numbers. Everything that can be counted or
 * looked up (sources, links, shares, colours, dates, the method text) is set
 * here by the server, so the model cannot invent a link or a number of
 * articles.
 */

const label = z.enum(uncertaintyLabels);
const refs = z.array(z.number().int());
const text = z.string();

export const draftSchema = z.strictObject({
  title: text,
  titleLines: z.array(text),
  status: text,
  dek: text,
  categories: z.array(z.enum(["inrikes", "utrikes", "ekonomi", "politik"])),
  card: z.strictObject({
    summary: text,
    highlights: z.array(z.strictObject({ value: text, label: text, uncertainty: label })),
  }),
  stats: z.array(z.strictObject({ value: text, label: text })),
  summary: z.array(z.strictObject({ key: text, text })),
  updates: z.strictObject({
    intro: text,
    items: z.array(z.strictObject({ text, sources: refs, at: text.nullable() })),
  }),
  openQuestions: z.array(
    z.strictObject({
      id: text,
      question: text,
      status: text,
      label: label.nullable(),
      sources: refs,
      expectedDate: text.nullable(),
      expectedEvent: text.nullable(),
    }),
  ),
  timeline: z.array(z.strictObject({ date: text, text, sources: refs, tag: z.enum(["Nytt", "Kommande"]).nullable() })),
  facts: z.array(z.strictObject({ label, title: text, text, sources: refs })),
  media: z.strictObject({
    agree: z.array(text),
    differ: z.array(text),
    frames: z.array(z.strictObject({ name: text, short: text })),
    framesNote: text,
    matrixNote: text,
  }),
  articles: z.array(
    z.strictObject({
      source: z.number().int(),
      genre: z.enum(["Nyhet", "Analys", "Reportage", "Ledare", "Debatt", "Krönika"]),
      angle: text,
      rows: z.array(z.strictObject({ key: text, text })),
      placement: text,
      frames: z.array(z.number().int()),
    }),
  ),
  blame: z.strictObject({
    title: text,
    intro: text,
    items: z.array(z.strictObject({ who: text, role: text, text })),
    sources: refs,
  }),
  models: z.strictObject({
    items: z.array(z.strictObject({ name: text, pro: text, con: text, by: text })),
    sources: refs,
  }),
  numbers: z.strictObject({
    intro: text,
    tiles: z.array(z.strictObject({ value: text, label: text, sub: text, sources: refs })),
    note: text,
    chart: z
      .strictObject({
        title: text,
        note: text,
        sources: refs,
        rows: z.array(z.strictObject({ name: text, value: z.number(), label: text })),
      })
      .nullable(),
  }),
  missing: z.array(z.strictObject({ title: text, text, sources: refs })),
  panel: z.array(z.strictObject({ quote: text, up: text, down: text })),
  faq: z.array(z.strictObject({ question: text, answer: text, label: label.nullable(), sources: refs })),
  glossary: z.array(z.strictObject({ term: text, match: text.nullable(), explanation: text })),
});

export type Draft = z.infer<typeof draftSchema>;

/** Keywords the API's structured outputs do not need; the server checks lengths itself. */
const dropped = new Set(["$schema", "minLength", "maxLength", "minItems", "maxItems", "minimum", "maximum", "pattern", "format"]);

function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => (dropped.has(key) ? [] : [[key, clean(item)]])));
  }
  return value;
}

/** The JSON schema sent to the API, made from the same definition the server checks with. */
export const draftJsonSchema = clean(z.toJSONSchema(draftSchema, { target: "draft-2020-12" })) as Record<string, unknown>;

/** An article from the topic, as the model saw it: number, outlet, headline and lead. */
export interface ArticleInput {
  n: number;
  outlet: string;
  title: string;
  lead: string | null;
  url: string;
  publishedAt: string | null;
}

/** A page at a primary source that the research step cited. */
export interface PrimarySource {
  n: number;
  name: string;
  title: string;
  url: string;
  excerpts: string[];
}

const categoryAccent: Record<TopicCategory, Accent> = { inrikes: "sky", utrikes: "coral", ekonomi: "mint", politik: "lime" };
const frameAccents: Accent[] = ["sky", "pink", "coral", "lime", "mint", "sun"];
const newsGenres = new Set(["Nyhet", "Analys", "Reportage"]);

/** The four fixed archetypes, in the order the model writes them (see the prompt). */
const archetypes: Omit<PanelVoice, "quote" | "up" | "down">[] = [
  { name: "Den rödgröna", axes: "Ekonomisk vänster, GAL", x: "27%", y: "29%", accent: "mint" },
  { name: "Liberalen", axes: "Ekonomisk höger, GAL", x: "73%", y: "29%", accent: "sky" },
  { name: "Den konservativa", axes: "Ekonomisk höger, TAN", x: "73%", y: "71%", accent: "sun" },
  { name: "Nationalpopulisten", axes: "Ekonomisk vänster, TAN", x: "27%", y: "71%", accent: "pink" },
];

const months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

/** "12 november" in Swedish time. */
export function swedishDay(iso: string): string {
  const parts = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", day: "numeric", month: "numeric" }).formatToParts(new Date(iso));
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = Number(parts.find((part) => part.type === "month")?.value ?? 1);
  return `${Number(day)} ${months[month - 1]}`;
}

/** An address from a title: "Övergångsbudgeten för 2027" becomes "overgangsbudgeten-for-2027". */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/ö/g, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** Shares of the frames, counted the way the hand-written topics count them: main focus counts twice. */
export function frameShares(values: number[][], frames: number): { percent: number; weight: number }[] {
  const totals = Array.from({ length: frames }, (_, column) => values.reduce((sum, row) => sum + (row[column] ?? 0), 0));
  const all = totals.reduce((sum, value) => sum + value, 0) || 1;
  return totals.map((total) => {
    const weight = Math.round((total / all) * 1000) / 10;
    return { percent: Math.round(weight), weight };
  });
}

const toMatrixValue = (value: number | undefined): MatrixValue => (value === 2 ? 2 : value === 1 ? 1 : 0);

export interface AssembleContext {
  articles: ArticleInput[];
  primary: PrimarySource[];
  now: Date;
  slug: string;
  publishedAt?: string;
}

export function assembleTopic(draft: Draft, context: AssembleContext): Topic {
  const { articles, primary } = context;
  const nowIso = context.now.toISOString();
  const categories = [...new Set(draft.categories)] as TopicCategory[];
  const tags = categories.map((category) => categoryLabels[category]);
  const byNumber = new Map(articles.map((article) => [article.n, article]));

  // Only articles the model analysed and that exist, once each.
  const seen = new Set<number>();
  const analysed = draft.articles.filter((article) => {
    if (!byNumber.has(article.source) || seen.has(article.source)) return false;
    seen.add(article.source);
    return true;
  });
  const frameCount = draft.media.frames.length;
  const matrixValues = analysed.map((article) => Array.from({ length: frameCount }, (_, column) => toMatrixValue(article.frames[column])));
  const shares = frameShares(matrixValues, frameCount);
  const outlets = new Set(analysed.map((article) => byNumber.get(article.source)!.outlet));

  const sources = [
    ...articles.map((article) => ({ name: article.outlet, title: article.title, url: article.url })),
    ...primary.map((source) => ({ name: source.name, title: source.title, url: source.url })),
  ];
  const sourceCount = sources.length;
  const longestLine = Math.max(...draft.titleLines.map((line) => line.length), 0);
  const sourceNames = [...new Set(draft.facts.flatMap((fact) => fact.sources).map((n) => sources[n - 1]?.name).filter(Boolean))].slice(0, 3);

  return {
    slug: context.slug,
    rank: 0,
    title: draft.title.trim(),
    titleLines: draft.titleLines.length ? draft.titleLines : [draft.title],
    titleSize: longestLine > 18 ? "medium" : "large",
    accent: categoryAccent[categories[0] ?? "inrikes"],
    tags,
    categories,
    status: draft.status,
    dek: draft.dek,
    publishedAt: context.publishedAt ?? nowIso,
    updatedAt: nowIso,
    counts: `${analysed.length} artiklar från ${outlets.size} medier, ${sourceCount} källor`,
    card: {
      tags,
      summary: draft.card.summary,
      highlights: draft.card.highlights.slice(0, 2),
      sourceLine: sourceNames.length ? `Källor: ${sourceNames.join(", ").replace(/, ([^,]*)$/, " och $1")}` : undefined,
    },
    stats: draft.stats.slice(0, 4),
    summary: draft.summary,
    updates: { intro: draft.updates.intro, items: draft.updates.items.map((item) => ({ text: item.text, sources: item.sources, ...(item.at ? { at: item.at } : {}) })) },
    openQuestions: draft.openQuestions.map((question) => ({
      id: question.id,
      question: question.question,
      status: question.status,
      ...(question.label ? { label: question.label } : {}),
      sources: question.sources,
      ...(question.expectedDate && question.expectedEvent ? { expected: { date: question.expectedDate, event: question.expectedEvent } } : {}),
    })),
    timeline: draft.timeline.map((event) => ({ date: event.date, text: event.text, sources: event.sources, ...(event.tag ? { tag: event.tag } : {}) })),
    facts: draft.facts,
    media: {
      intro: `Vi har läst ${analysed.length} artiklar från ${outlets.size} medier. Analysen gäller de enskilda artiklarna, inte mediernas samlade bevakning. Vi har bara läst rubrik och ingress, eftersom vi inte hämtar hela artiklar.`,
      agree: draft.media.agree,
      differ: draft.media.differ,
      framesMeta: `Andel av omnämnandena i alla ${analysed.length} artiklar. Huvudfokus räknas dubbelt.`,
      frames: draft.media.frames.map((frame, index) => ({ name: frame.name, ...shares[index], accent: frameAccents[index % frameAccents.length] })),
      framesNote: draft.media.framesNote,
      matrixColumns: draft.media.frames.map((frame, index) => ({ short: frame.short, full: frame.name, accent: frameAccents[index % frameAccents.length] })),
      matrix: analysed.map((article, index) => ({ name: byNumber.get(article.source)!.outlet, values: matrixValues[index] })),
      matrixKey: draft.media.frames.map((frame) => `${frame.short}: ${frame.name.charAt(0).toLowerCase()}${frame.name.slice(1)}.`).join(" "),
      matrixNote: draft.media.matrixNote,
    },
    articles: analysed.map((article) => {
      const input = byNumber.get(article.source)!;
      return {
        outlet: input.outlet,
        genre: article.genre,
        title: input.title,
        meta: input.publishedAt ? swedishDay(input.publishedAt) : "",
        angle: article.angle,
        rows: article.rows.filter((row) => row.key !== "Vinkel"),
        // News is never placed (principle 2). Opinion pieces are placed only with a reason.
        placement: newsGenres.has(article.genre) ? "Ej placerad, eftersom det är nyhetsrapportering." : article.placement,
        basis: "rubrik och ingress",
        url: input.url,
        linkLabel: "Läs originalet",
      };
    }),
    blame: draft.blame,
    models: draft.models,
    numbers: {
      intro: draft.numbers.intro,
      tiles: draft.numbers.tiles,
      charts: draft.numbers.chart ? [{ ...draft.numbers.chart, rows: draft.numbers.chart.rows.map((row) => ({ ...row, accent: "sky" as Accent })) }] : [],
      note: draft.numbers.note,
    },
    missing: draft.missing,
    panel: {
      intro:
        "Fyra fiktiva arketyper läser samma vecka. De representerar inga verkliga personer eller partier, utan typiska hållningar på två axlar som används inom statsvetenskapen: ekonomisk vänster–höger och GAL–TAN. Alla får lika mycket utrymme, och var och en har sin egen blinda fläck.",
      items: draft.panel.length >= archetypes.length ? archetypes.map((archetype, index) => ({ ...archetype, ...draft.panel[index] })) : [],
    },
    method: [
      `Analysen är skriven med AI utifrån ${analysed.length} artiklar och ${sourceCount} källor. Fakta och siffror kommer från myndigheter och andra primärkällor. En människa har godkänt ämnet, men texten har inte granskats av en redaktör.`,
      "Vi läser bara rubrik och ingress från medierna och länkar till originalen. Varje artikel bedöms för sig. Politisk placering görs bara när en text tar ställning, och alltid med motivering.",
      "Varje uppgift har en källa och en märkning för hur säker den är. Hittar du ett fel, skriv till oss så rättar vi.",
    ],
    faq: draft.faq.map((item) => ({ question: item.question, answer: item.answer, ...(item.label ? { label: item.label } : {}), sources: item.sources })),
    glossary: draft.glossary.map((item) => ({ term: item.term, ...(item.match ? { match: item.match } : {}), explanation: item.explanation })),
    sources,
    sourceGroups: [
      { title: "Analyserade artiklar", ids: articles.map((article) => article.n) },
      ...(primary.length ? [{ title: "Primärkällor", ids: primary.map((source) => source.n) }] : []),
    ],
    corrections: [],
  };
}

/** Problems that only AI drafts can have, on top of topicProblems. */
export function draftProblems(draft: Draft, context: AssembleContext): string[] {
  const problems: string[] = [];
  const articleNumbers = new Set(context.articles.map((article) => article.n));
  if (draft.articles.filter((article) => articleNumbers.has(article.source)).length < 3) problems.push("Utkastet analyserar färre än tre artiklar.");
  if (draft.media.frames.length < 3 || draft.media.frames.length > 6) problems.push("Så vinklade medierna behöver tre till sex vinklar.");
  if (draft.articles.some((article) => article.frames.length !== draft.media.frames.length)) problems.push("En artikel har fel antal värden för vinklarna.");
  if (draft.panel.length !== 4) problems.push("Panelen behöver fyra röster.");
  if (draft.summary.length < 3) problems.push("Sammanfattningen har färre än tre delar.");
  if (draft.facts.length < 3) problems.push("Färre än tre uppgifter med källa.");
  if (draft.faq.length < 3) problems.push("Färre än tre frågor i Frågor och svar.");
  // A dash used as punctuation reads as AI-written (Jonathan's style rule).
  const prose = JSON.stringify(draft);
  if (/\s[—–]\s/.test(prose)) problems.push("Texten använder tankstreck som skiljetecken.");
  return problems;
}
