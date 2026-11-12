import { describe, expect, it } from "vitest";
import { sortConfig } from "@/config/sort";
import { feeds } from "@/content/feeds";
import { planAssignments, sortAnswer, sortMessage, type OpenTopic, type SortAnswer, type SortArticle } from "./classify";
import { measureHeat, nextStatus, type HeatArticle, type Outlet } from "./heat";
import { sortRun, type HeatRow, type SortStore, type TopicState, type TopicUpdate } from "./run";

const NOW = new Date("2026-11-12T12:00:00Z");
const outlets = new Map<string, Outlet>(feeds.map((feed) => [feed.source, { house: feed.house, national: feed.national }]));

const article = (source: string, fingerprint: string, hoursAgo = 1): HeatArticle => ({
  source,
  fingerprint,
  published_at: new Date(NOW.getTime() - hoursAgo * 3_600_000).toISOString(),
  fetched_at: new Date(NOW.getTime() - hoursAgo * 3_600_000).toISOString(),
});

describe("heat", () => {
  it("is hot with five sources from three media houses and a national outlet", () => {
    const heat = measureHeat(
      [article("svt", "a"), article("dn", "b"), article("svd", "c"), article("aftonbladet", "d"), article("sveriges-radio", "e")],
      outlets,
      NOW,
    );
    expect(heat).toMatchObject({ sources: 5, outlets: 5, houses: 3, national: 5, hot: true });
  });

  it("counts the same TT text in several papers as one source", () => {
    const heat = measureHeat(
      ["svt", "dn", "svd", "gp", "aftonbladet", "expressen"].map((source) => article(source, "tt-samma")),
      outlets,
      NOW,
    );
    expect(heat.sources).toBe(1);
    expect(heat.hot).toBe(false);
  });

  it("needs three media houses, and a national outlet", () => {
    const twoHouses = measureHeat(
      [article("dn", "a"), article("expressen", "b"), article("sydsvenskan", "c"), article("svd", "d"), article("aftonbladet", "e")],
      outlets,
      NOW,
    );
    expect(twoHouses).toMatchObject({ houses: 2, hot: false });
    const regionalOnly = measureHeat([article("gp", "a"), article("sydsvenskan", "b")], outlets, NOW);
    expect(regionalOnly.national).toBe(0);
  });

  it("only counts the last 48 hours, and counts fresh articles", () => {
    const heat = measureHeat([article("svt", "a", 2), article("dn", "b", 10), article("svd", "c", 60)], outlets, NOW);
    expect(heat).toMatchObject({ sources: 2, fresh: 1 });
  });

  it("never overwrites Jonathan's decision", () => {
    const hot = measureHeat(["svt", "dn", "svd", "gp", "tv4"].map((source, index) => article(source, String(index))), outlets, NOW);
    expect(nextStatus("watching", hot)).toBe("hot");
    expect(nextStatus("rejected", hot)).toBe("rejected");
    expect(nextStatus("approved", { ...hot, hot: false })).toBe("approved");
    expect(nextStatus("hot", { ...hot, hot: false })).toBe("watching");
  });
});

const articles: SortArticle[] = [
  { id: 101, title: "Riksbanken sänker räntan", lead: "Styrräntan sänks.", source: "svt" },
  { id: 102, title: "Ny budget presenteras", lead: null, source: "dn" },
  { id: 103, title: "Malmö FF vann derbyt", lead: null, source: "sydsvenskan" },
  { id: 104, title: "Räntebeskedet: så påverkas du", lead: null, source: "aftonbladet" },
];
const topics: OpenTopic[] = [{ id: 7, label: "Riksbankens räntebesked i november", category: "ekonomi", examples: ["Räntan sänks"] }];

describe("sorting answer", () => {
  it("puts the topics and numbered articles in the message", () => {
    const text = sortMessage(topics, articles);
    expect(text).toContain("T7 [ekonomi] Riksbankens räntebesked i november");
    expect(text).toContain("3. Malmö FF vann derbyt");
  });

  it("turns the answer into assignments and new topics", () => {
    const answer: SortAnswer = {
      articles: [
        { n: 1, in_scope: true, category: "ekonomi", topic: "T7" },
        { n: 2, in_scope: true, category: "politik", topic: "N1" },
        { n: 3, in_scope: false, category: "ingen", topic: "" },
        { n: 4, in_scope: true, category: "ekonomi", topic: "t7" },
      ],
      new_topics: [
        { key: "N1", label: "  «Regeringens budget för 2027»\n", category: "politik" },
        { key: "N2", label: "Ett ämne ingen artikel använder", category: "samhalle" },
      ],
    };
    const { assignments, newTopics } = planAssignments(answer, articles, topics);
    expect(assignments).toEqual([
      { articleId: 101, inScope: true, topicId: 7 },
      { articleId: 102, inScope: true, newKey: "N1" },
      { articleId: 103, inScope: false },
      { articleId: 104, inScope: true, topicId: 7 },
    ]);
    expect(newTopics).toEqual([{ key: "N1", label: "Regeringens budget för 2027", category: "politik" }]);
  });

  it("leaves articles unsorted when the answer does not add up", () => {
    const answer: SortAnswer = {
      articles: [
        { n: 1, in_scope: true, category: "ekonomi", topic: "T99" },
        { n: 2, in_scope: true, category: "politik", topic: "N5" },
        { n: 9, in_scope: true, category: "politik", topic: "T7" },
        { n: 4, in_scope: true, category: "ekonomi", topic: "T7" },
        { n: 4, in_scope: false, category: "ingen", topic: "" },
      ],
      new_topics: [],
    };
    expect(planAssignments(answer, articles, topics).assignments).toEqual([{ articleId: 104, inScope: true, topicId: 7 }]);
  });

  it("rejects an answer with the wrong shape", () => {
    expect(() => sortAnswer.parse({ articles: [{ n: 1, in_scope: true, category: "sport", topic: "" }], new_topics: [] })).toThrow();
  });
});

function memoryStore(initialArticles: (SortArticle & { fetched_at: string; fingerprint: string })[]) {
  const sorted = new Map<number, { inScope: boolean; clusterId: number | null }>();
  const topicRows = new Map<number, OpenTopic & TopicState & { last_article_at: string | null }>();
  const saved: TopicUpdate[] = [];
  let nextId = 1;
  let spent = 0;
  const store: SortStore = {
    async unsortedArticles(_since, limit) {
      return initialArticles.filter((row) => !sorted.has(row.id)).slice(0, limit);
    },
    async openTopics() {
      return [...topicRows.values()];
    },
    async createTopics(list) {
      const ids = new Map<string, number>();
      for (const topic of list) {
        const id = nextId++;
        topicRows.set(id, { id, label: topic.label, category: topic.category, examples: [], status: "watching", hot_since: null, last_article_at: null });
        ids.set(topic.key, id);
      }
      return ids;
    },
    async saveAssignments(rows) {
      for (const row of rows) sorted.set(row.articleId, { inScope: row.inScope, clusterId: row.clusterId });
    },
    async heatRows() {
      return initialArticles.flatMap((row): HeatRow[] => {
        const verdict = sorted.get(row.id);
        if (!verdict?.clusterId) return [];
        return [{ cluster_id: verdict.clusterId, title: row.title, source: row.source, fingerprint: row.fingerprint, published_at: null, fetched_at: row.fetched_at }];
      });
    },
    async topicsToMeasure() {
      return [...topicRows.values()].map(({ id, status, hot_since }) => ({ id, status, hot_since }));
    },
    async saveTopics(updates) {
      saved.push(...updates);
      for (const update of updates) {
        const row = topicRows.get(update.id);
        if (row) Object.assign(row, { status: update.status, hot_since: update.hot_since });
      }
    },
    async spentToday() {
      return spent;
    },
  };
  return { store, sorted, saved, setSpent: (value: number) => (spent = value) };
}

const fetched = new Date(NOW.getTime() - 3_600_000).toISOString();
const story = ["svt", "dn", "svd", "gp", "tv4", "aftonbladet"].map((source, index) => ({
  id: index + 1,
  title: `Rubrik ${index + 1} om räntan`,
  lead: null,
  source,
  fetched_at: fetched,
  fingerprint: `f${index}`,
}));

describe("a sorting run", () => {
  it("sorts articles, creates a topic and marks it hot", async () => {
    const memory = memoryStore([...story, { id: 50, title: "Fotboll", lead: null, source: "svt", fetched_at: fetched, fingerprint: "sport" }]);
    const stats = await sortRun({
      store: memory.store,
      outlets,
      now: () => NOW,
      async classify(_topics, batch) {
        return {
          costSek: 0.02,
          answer: {
            articles: batch.map((row, index) =>
              row.id === 50 ? { n: index + 1, in_scope: false, category: "ingen" as const, topic: "" } : { n: index + 1, in_scope: true, category: "ekonomi" as const, topic: "N1" },
            ),
            new_topics: [{ key: "N1", label: "Riksbankens räntebesked", category: "ekonomi" }],
          },
        };
      },
    });
    expect(stats).toMatchObject({ batches: 1, sorted: 7, inScope: 6, outOfScope: 1, newTopics: 1, hot: 1, becameHot: 1, paused: false });
    expect(memory.saved[0]).toMatchObject({ status: "hot", hot_since: NOW.toISOString(), examples: expect.arrayContaining(["Rubrik 1 om räntan"]) });
    expect(memory.saved[0].examples).toHaveLength(sortConfig.examplesPerTopic);
  });

  it("stops when the day's budget is spent, but still measures heat", async () => {
    const memory = memoryStore(story);
    memory.setSpent(sortConfig.dailyBudgetSek);
    let asked = 0;
    const stats = await sortRun({
      store: memory.store,
      outlets,
      now: () => NOW,
      async classify() {
        asked += 1;
        throw new Error("should not be called");
      },
    });
    expect(asked).toBe(0);
    expect(stats).toMatchObject({ paused: true, sorted: 0 });
  });

  it("gives up on a batch the model could not sort, instead of repeating it", async () => {
    const memory = memoryStore(story);
    let asked = 0;
    const stats = await sortRun({
      store: memory.store,
      outlets,
      now: () => NOW,
      async classify() {
        asked += 1;
        return { costSek: 0.01, answer: { articles: [], new_topics: [] } };
      },
    });
    expect(asked).toBe(1);
    expect(stats).toMatchObject({ sorted: 0, skipped: story.length });
  });
});
