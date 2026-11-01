/**
 * Shape of a published topic page. The example data in src/content/ uses
 * exactly this shape, and so will the JSON in the Supabase table
 * `topic_versions`, so switching data source does not change the pages.
 */

/** Accent colours from the design tokens (--color-<accent>). */
export type Accent = "lime" | "coral" | "pink" | "mint" | "sun" | "sky" | "muted";

/** Filter categories on the start page and in the archive. */
export type TopicCategory = "inrikes" | "utrikes" | "ekonomi" | "politik";

export const uncertaintyLabels = [
  "Bekräftat",
  "Siffror skiljer sig",
  "Ändras över tid",
  "Uppskattning",
  "Omstritt",
  "Obekräftat",
  "Falskt",
] as const;

export type UncertaintyLabel = (typeof uncertaintyLabels)[number];

/** 1-based number of an entry in `Topic.sources`. */
export type SourceRef = number;

export interface Source {
  name: string;
  title: string;
  url?: string;
}

export interface TopicStat {
  value: string;
  label: string;
}

export interface Frame {
  name: string;
  /** Rounded share shown to the reader. */
  percent: number;
  /** Exact share used for the bar width. */
  weight: number;
  accent: Accent;
}

export interface MatrixColumn {
  short: string;
  full: string;
  accent: Accent;
}

/** 0 = missing, 1 = mentioned, 2 = main focus. */
export type MatrixValue = 0 | 1 | 2;

export interface ArticleAnalysis {
  outlet: string;
  genre: string;
  title: string;
  meta: string;
  /** What the article puts at the centre, in one sentence. Shown under Så vinklade medierna. */
  angle: string;
  rows: { key: string; text: string }[];
  /** Political placement, or why the text is not placed. */
  placement: string;
  basis: string;
  url?: string;
  linkLabel: string;
}

export interface ChartRow {
  name: string;
  value: number;
  label: string;
  accent: Accent;
}

export interface Chart {
  title: string;
  max?: number;
  refLine?: { value: number; label: string };
  note: string;
  sources: SourceRef[];
  rows: ChartRow[];
}

export interface PanelVoice {
  name: string;
  axes: string;
  /** Position in the GAL–TAN / left–right square, as CSS percentages. */
  x: string;
  y: string;
  accent: Accent;
  quote: string;
  up: string;
  down: string;
}

/** A short question with an answer from the topic's own material. Shown on the page and used as a ready chat answer. */
export interface FaqItem {
  question: string;
  answer: string;
  label?: UncertaintyLabel;
  sources: SourceRef[];
}

/** A word explained on the page. `match` is the start of the word in the text, when it differs from `term`. */
export interface GlossaryItem {
  term: string;
  match?: string;
  explanation: string;
}

/** How the topic is shown on the start page and in the archive. */
export interface TopicCard {
  tags: string[];
  summary: string;
  /** Large figures on the featured card, each with its uncertainty label. */
  highlights?: { value: string; label: string; uncertainty: UncertaintyLabel }[];
  /** One large number on a small card. */
  figure?: string;
  uncertainty?: UncertaintyLabel;
  sourceLine?: string;
}

export interface Topic {
  slug: string;
  rank: number;
  title: string;
  titleLines: string[];
  titleSize: "large" | "medium";
  accent: Accent;
  tags: string[];
  categories: TopicCategory[];
  status: string;
  dek: string;
  publishedAt: string;
  updatedAt: string;
  counts: string;
  card: TopicCard;
  stats: TopicStat[];
  summary: { key: string; text: string }[];
  updates: { intro: string; items: { text: string; sources: SourceRef[] }[] };
  timeline: { date: string; text: string; sources: SourceRef[]; tag?: string }[];
  facts: { label: UncertaintyLabel; title: string; text: string; sources: SourceRef[] }[];
  media: {
    intro: string;
    agree: string[];
    differ: string[];
    framesMeta: string;
    frames: Frame[];
    framesNote: string;
    matrixColumns: MatrixColumn[];
    matrix: { name: string; values: MatrixValue[] }[];
    matrixKey: string;
    matrixNote: string;
  };
  articles: ArticleAnalysis[];
  blame: { title: string; intro: string; items: { who: string; role: string; text: string }[]; sources: SourceRef[] };
  models: { items: { name: string; pro: string; con: string; by: string }[]; sources: SourceRef[] };
  numbers: {
    intro: string;
    tiles: { value: string; label: string; sub: string; sources: SourceRef[] }[];
    charts: Chart[];
    note: string;
  };
  missing: { title: string; text: string; note?: string; sources: SourceRef[] }[];
  panel: { intro: string; items: PanelVoice[] };
  method: string[];
  faq: FaqItem[];
  glossary: GlossaryItem[];
  sources: Source[];
  sourceGroups: { title: string; ids: SourceRef[] }[];
  corrections: { date: string; text: string }[];
}

/** A topic shown as an example card only, without its own page. */
export interface TopicTeaser {
  key: string;
  rank: number;
  title: string;
  accent: Accent;
  categories: TopicCategory[];
  card: TopicCard & { badge?: string };
}
