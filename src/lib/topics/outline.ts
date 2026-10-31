import type { Topic } from "./types";

/** 0 = 30 sek, 1 = 5 min, 2 = Djupdykning: the depth where a part first shows. */
export type Depth = 0 | 1 | 2;

export type OutlineItem = {
  /** The heading's id on the topic page. */
  id: string;
  title: string;
  depth: Depth;
  /** What the part contains, for example "6 händelser". */
  detail: string;
  /** Shown in the overview at the top of the page (the rail lists all parts). */
  overview: boolean;
};

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** The parts of a topic page in reading order, matching the headings in sections.tsx. */
export function topicOutline(topic: Topic): OutlineItem[] {
  const charts = topic.numbers.charts.length;
  return [
    { id: "pa-30-sekunder", title: "På 30 sekunder", depth: 0, detail: count(topic.summary.length, "punkt", "punkter"), overview: false },
    { id: "nytt", title: "Nytt sedan sist", depth: 0, detail: count(topic.updates.items.length, "nyhet", "nyheter"), overview: false },
    { id: "vad-har-hant", title: "Vad har hänt", depth: 1, detail: count(topic.timeline.length, "händelse", "händelser"), overview: true },
    { id: "fakta", title: "Fakta och osäkerhet", depth: 1, detail: count(topic.facts.length, "uppgift", "uppgifter"), overview: true },
    { id: "mediebilden", title: "Mediebilden", depth: 1, detail: `${count(topic.articles.length, "artikel", "artiklar")} jämförda`, overview: true },
    { id: "vem-pekar-ut-vem", title: topic.blame.title, depth: 2, detail: count(topic.blame.items.length, "aktör", "aktörer"), overview: true },
    { id: "forklaringsmodeller", title: "Förklaringsmodeller", depth: 1, detail: count(topic.models.items.length, "modell", "modeller"), overview: true },
    {
      id: "siffrorna",
      title: "Siffrorna bakom",
      depth: 1,
      detail: charts ? count(charts, "diagram", "diagram") : count(topic.numbers.tiles.length, "nyckeltal", "nyckeltal"),
      overview: true,
    },
    { id: "det-som-saknas", title: "Det här saknas i debatten", depth: 1, detail: count(topic.missing.length, "perspektiv", "perspektiv"), overview: true },
    { id: "perspektivpanelen", title: "Perspektivpanelen", depth: 2, detail: count(topic.panel.items.length, "röst", "röster"), overview: true },
    { id: "sa-ar-sidan-gjord", title: "Så är sidan gjord", depth: 0, detail: "Metod och rättelser", overview: false },
    { id: "kallor", title: "Källor", depth: 0, detail: count(topic.sources.length, "källa", "källor"), overview: true },
  ];
}

export const depthNames = ["30 sek", "5 min", "Djupdykning"] as const;
