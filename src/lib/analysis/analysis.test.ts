import { describe, expect, it } from "vitest";
import { topicProblems } from "@/lib/topics/validate";
import { assembleTopic, draftJsonSchema, draftProblems, draftSchema, frameShares, slugify, type ArticleInput, type Draft, type PrimarySource } from "./draft";
import { allowedUrl, readResearch, sourceName } from "./research";
import { analysisRun, pickArticles, uniqueSlug, type AnalysisStore, type ArticleRow, type DraftRow } from "./run";

const articles: ArticleInput[] = [1, 2, 3, 4].map((n) => ({
  n,
  outlet: ["SVT", "DN", "Aftonbladet", "Expressen"][n - 1],
  title: `Rubrik ${n} om budgeten`,
  lead: `Ingress ${n}.`,
  url: `https://example.se/artikel-${n}`,
  publishedAt: "2026-11-24T08:00:00Z",
}));
const primary: PrimarySource[] = [{ n: 5, name: "Regeringskansliet", title: "Budgeten på fem minuter", url: "https://www.regeringen.se/budget", excerpts: ["Utgifterna ökar."] }];

const draft: Draft = {
  title: "Budgeten för 2027",
  titleLines: ["Budgeten", "för 2027"],
  status: "Lagd i dag",
  dek: "Regeringen har lagt fram budgeten. Riksdagen röstar i december.",
  categories: ["ekonomi", "inrikes"],
  card: { summary: "Budgeten är lagd. Riksdagen röstar i december.", highlights: [{ value: "1 573 mdr", label: "i utgifter", uncertainty: "Bekräftat" }] },
  stats: [{ value: "1 573 mdr", label: "i utgifter" }],
  summary: [
    { key: "Vad", text: "Övergångsregeringen har lagt fram budgeten för 2027." },
    { key: "Varför", text: "Ingen ny regering finns, så budgeten saknar ny politik." },
    { key: "Nu", text: "Riksdagen röstar om budgeten i december." },
  ],
  updates: { intro: "Tisdagen den 24 november", items: [{ text: "Budgeten lades fram.", sources: [5], at: null }] },
  openQuestions: [
    { id: "omrostningen", question: "Vilken budget vinner i riksdagen?", status: "Riksdagen röstar om budgetens ramar den 9 december.", label: "Ändras över tid", sources: [5], expectedDate: "2026-12-09", expectedEvent: "Omröstning i riksdagen" },
  ],
  timeline: [{ date: "24 november", text: "Budgeten läggs fram.", sources: [5], tag: "Nytt" }],
  facts: [
    { label: "Bekräftat", title: "Utgifterna", text: "Utgifterna ökar enligt regeringen.", sources: [5] },
    { label: "Bekräftat", title: "Ingen ny politik", text: "Budgeten bygger på årets anslag.", sources: [5, 1] },
    { label: "Obekräftat", title: "Polisen", text: "En artikel skriver att polisen inte får mer pengar.", sources: [2] },
  ],
  media: {
    agree: ["Budgeten saknar ny politik."],
    differ: ["Vem förlorar? SVT lyfter polisen, DN hushållen."],
    frames: [
      { name: "Ingen ny politik", short: "Princip" },
      { name: "Vinnare och förlorare", short: "Vinnare" },
      { name: "Regeringsspelet", short: "Spel" },
    ],
    framesNote: "De flesta artiklar handlar om att budgeten saknar ny politik.",
    matrixNote: "Bara en artikel tar upp regeringsspelet.",
  },
  articles: articles.map((article, index) => ({
    source: article.n,
    genre: index === 3 ? "Ledare" : "Nyhet",
    angle: "Att budgeten saknar ny politik och vad det betyder.",
    rows: [{ key: "Röster", text: "Finansministern." }],
    placement: index === 3 ? "Ekonomisk höger, eftersom texten förordar lägre skatter." : "Ska skrivas över",
    frames: [2, index % 2, index === 2 ? 1 : 0],
  })),
  blame: { title: "Vad säger partierna?", intro: "Partierna står bakom principerna.", items: [{ who: "Regeringen", role: "Finansministern", text: "Säger att budgeten tar ansvar." }], sources: [5] },
  models: { items: [{ name: "En budget som fungerar", pro: "Alla står bakom.", con: "Satsningar skjuts upp.", by: "regeringen." }], sources: [5] },
  numbers: { intro: "Siffrorna kommer från regeringen.", tiles: [{ value: "1 573", label: "Miljarder kronor i utgifter", sub: "2027", sources: [5] }], note: "Beloppen gäller utgiftsramarna.", chart: null },
  missing: [{ title: "Hushållen", text: "Ingen artikel räknar på vad budgeten kostar hushållen.", sources: [1, 2] }],
  panel: [1, 2, 3, 4].map((n) => ({ quote: `Citat ${n}.`, up: `Lyfter ${n}.`, down: `Tonar ned ${n}.` })),
  faq: [
    { question: "Vad är en övergångsbudget?", answer: "En budget utan ny politik som läggs när ingen ny regering finns.", label: "Bekräftat", sources: [5] },
    { question: "När röstar riksdagen?", answer: "Riksdagen röstar om budgetens ramar den 9 december.", label: null, sources: [5] },
    { question: "Får polisen mer pengar?", answer: "Enligt en artikel nej, men det är inte bekräftat av regeringen.", label: "Obekräftat", sources: [2] },
  ],
  glossary: [{ term: "Övergångsregering", match: "övergångsregering", explanation: "Den avgående regeringen som sköter landet tills en ny är på plats." }],
};

const context = { articles, primary, now: new Date("2026-11-24T18:00:00Z"), slug: "budgeten-for-2027" };

describe("the draft schema", () => {
  it("is strict, so the API returns exactly these fields", () => {
    const walk = (node: unknown): void => {
      if (!node || typeof node !== "object") return;
      const object = node as Record<string, unknown>;
      if (object.type === "object") {
        expect(object.additionalProperties).toBe(false);
        expect([...(object.required as string[])].sort()).toEqual(Object.keys(object.properties as object).sort());
      }
      Object.values(object).forEach(walk);
    };
    walk(draftJsonSchema);
    expect(JSON.stringify(draftJsonSchema)).not.toMatch(/minLength|maxItems|\$schema/);
  });

  it("accepts the test draft", () => {
    expect(draftSchema.parse(draft)).toBeTruthy();
  });
});

describe("assembling a topic", () => {
  const topic = assembleTopic(draft, context);

  it("passes every check a hand-written topic passes", () => {
    expect(topicProblems(topic)).toEqual([]);
    expect(draftProblems(draft, context)).toEqual([]);
  });

  it("takes sources and links from the material, never from the model", () => {
    expect(topic.sources.map((source) => source.url)).toEqual([...articles.map((article) => article.url), primary[0].url]);
    expect(topic.articles.map((article) => article.url)).toEqual(articles.map((article) => article.url));
    expect(topic.sourceGroups).toEqual([
      { title: "Analyserade artiklar", ids: [1, 2, 3, 4] },
      { title: "Primärkällor", ids: [5] },
    ]);
  });

  it("never places news politically, and keeps the reason for an opinion piece", () => {
    expect(topic.articles[0].placement).toBe("Ej placerad, eftersom det är nyhetsrapportering.");
    expect(topic.articles[3].placement).toContain("eftersom");
    expect(topic.articles.every((article) => article.basis === "rubrik och ingress")).toBe(true);
  });

  it("counts articles, outlets and frame shares on the server", () => {
    expect(topic.counts).toBe("4 artiklar från 4 medier, 5 källor");
    const total = topic.media.frames.reduce((sum, frame) => sum + frame.weight, 0);
    expect(total).toBeGreaterThan(98);
    expect(total).toBeLessThan(102);
    expect(topic.media.matrix).toHaveLength(4);
    expect(topic.panel.items.map((item) => item.name)).toEqual(["Den rödgröna", "Liberalen", "Den konservativa", "Nationalpopulisten"]);
  });

  it("drops articles that are not in the material or appear twice", () => {
    const odd = { ...draft, articles: [...draft.articles, { ...draft.articles[0] }, { ...draft.articles[0], source: 99 }] };
    expect(assembleTopic(odd, context).articles).toHaveLength(4);
  });

  it("finds problems in a weak draft", () => {
    const weak = { ...draft, panel: [], faq: [], dek: "Ett tankstreck – här." };
    const problems = draftProblems(weak, context);
    expect(problems).toContain("Panelen behöver fyra röster.");
    expect(problems).toContain("Texten använder tankstreck som skiljetecken.");
    const broken = assembleTopic({ ...draft, facts: [{ label: "Bekräftat", title: "Fel", text: "En uppgift med påhittad källa.", sources: [42] }] }, context);
    expect(topicProblems(broken)).toContain("Källa 42 finns inte.");
  });
});

describe("helpers", () => {
  it("makes clean addresses", () => {
    expect(slugify("Övergångsbudgeten för 2027")).toBe("overgangsbudgeten-for-2027");
    expect(slugify("  Gränskontrollen: återinförs!  ")).toBe("granskontrollen-aterinfors");
    expect(uniqueSlug("budget", new Set(["budget", "budget-2"]))).toBe("budget-3");
  });

  it("gives frame shares that add up to 100", () => {
    const shares = frameShares([[2, 1, 0], [2, 0, 1]], 3);
    expect(shares.map((share) => share.percent)).toEqual([67, 17, 17]);
  });

  it("picks the newest articles once per headline", () => {
    const rows: ArticleRow[] = [
      { id: 1, title: "Samma", lead: null, url: "https://a.se/1", source: "svt", published_at: "2026-11-24T08:00:00Z", fetched_at: "2026-11-24T08:00:00Z" },
      { id: 2, title: "samma ", lead: null, url: "https://a.se/2", source: "dn", published_at: "2026-11-24T07:00:00Z", fetched_at: "2026-11-24T07:00:00Z" },
      { id: 3, title: "Ny", lead: "Ingress", url: "https://a.se/3", source: "dn", published_at: "2026-11-24T09:00:00Z", fetched_at: "2026-11-24T09:00:00Z" },
    ];
    const picked = pickArticles(rows, (source) => source.toUpperCase(), 10);
    expect(picked.map((article) => [article.n, article.title, article.outlet])).toEqual([
      [1, "Ny", "DN"],
      [2, "Samma", "SVT"],
    ]);
  });

  it("keeps only cited pages on allowed domains", () => {
    const domains = ["scb.se", "regeringen.se"];
    expect(allowedUrl("https://www.scb.se/statistik", domains)).toBe(true);
    expect(allowedUrl("https://scb.se.evil.com/x", domains)).toBe(false);
    expect(allowedUrl("http://scb.se/x", domains)).toBe(false);
    expect(sourceName("https://www.regeringen.se/x")).toBe("Regeringskansliet");
    const { primary: found } = readResearch(
      [
        { type: "server_tool_use" },
        {
          type: "text",
          text: "Arbetslösheten var 8,6 procent.",
          citations: [
            { type: "web_search_result_location", url: "https://www.scb.se/aku", title: "AKU oktober", cited_text: "8,6 procent" },
            { type: "web_search_result_location", url: "https://www.scb.se/aku", title: "AKU oktober", cited_text: "8,6 procent" },
            { type: "web_search_result_location", url: "https://www.example.com/x", title: "Annat", cited_text: "x" },
          ],
        },
      ],
      7,
      domains,
    );
    expect(found).toEqual([{ n: 7, name: "SCB", title: "AKU oktober", url: "https://www.scb.se/aku", excerpts: ["8,6 procent"] }]);
  });
});

describe("an analysis run", () => {
  const rows: ArticleRow[] = articles.map((article, index) => ({
    id: index + 1,
    title: article.title,
    lead: article.lead,
    url: article.url,
    source: article.outlet.toLowerCase(),
    published_at: article.publishedAt,
    fetched_at: article.publishedAt!,
  }));

  function store(overrides: Partial<AnalysisStore> = {}) {
    const saved: DraftRow[] = [];
    const base: AnalysisStore = {
      spentToday: async () => 0,
      nextTopic: async () => ({ clusterId: 7, label: "Budgeten för 2027" }),
      articles: async () => rows,
      takenSlugs: async () => new Set(["budgeten-for-2027"]),
      saveDraft: async (row) => {
        saved.push(row);
      },
      ...overrides,
    };
    return { store: base, saved };
  }

  const deps = (overrides: Partial<AnalysisStore> = {}, text = JSON.stringify(draft)) => {
    const { store: s, saved } = store(overrides);
    return {
      saved,
      deps: {
        store: s,
        outletName: (source: string) => ({ svt: "SVT", dn: "DN", aftonbladet: "Aftonbladet", expressen: "Expressen" })[source] ?? source,
        localSlugs: new Set<string>(),
        now: () => new Date("2026-11-24T18:00:00Z"),
        research: async () => ({ primary: [{ ...primary[0] }], costSek: 0.5 }),
        write: async () => ({ text, costSek: 2 }),
      },
    };
  };

  it("saves a draft that passes the checks, under a free address", async () => {
    const { deps: d, saved } = deps();
    const stats = await analysisRun(d);
    expect(stats).toMatchObject({ analysed: 1, slug: "budgeten-for-2027-2", costSek: 2.5, paused: false });
    expect(saved[0].status).toBe("draft");
    expect(saved[0].problems).toEqual([]);
    expect(saved[0].data?.slug).toBe("budgeten-for-2027-2");
  });

  it("pauses when the daily budget would run out", async () => {
    const { deps: d, saved } = deps({ spentToday: async () => 35 });
    expect((await analysisRun(d)).paused).toBe(true);
    expect(saved).toHaveLength(0);
  });

  it("records a failed draft without calling the model when there are too few articles", async () => {
    const { deps: d, saved } = deps({ articles: async () => rows.slice(0, 2) });
    const stats = await analysisRun(d);
    expect(stats.costSek).toBe(0);
    expect(saved[0]).toMatchObject({ status: "failed", data: null });
  });

  it("records a failed draft, with its cost, when the answer is not valid", async () => {
    const { deps: d, saved } = deps({}, '{"title": 1}');
    const stats = await analysisRun(d);
    expect(saved[0].status).toBe("failed");
    expect(saved[0].costSek).toBe(2.5);
    expect(stats.costSek).toBe(2.5);
  });
});
