import { z } from "zod";
import { topicCategories, type TopicCategory } from "@/config/sort";

/*
 * What the model is asked, the shape of its answer, and how the answer is
 * turned into changes. The model only says which topic an article belongs to.
 * Everything else (heat, status, what is shown) is decided by the server.
 */

export interface SortArticle {
  id: number;
  title: string;
  lead: string | null;
  source: string;
}

export interface OpenTopic {
  id: number;
  label: string;
  category: TopicCategory;
  examples: string[];
}

export const sortInstructions = `Du sorterar svenska nyhetsartiklar till ämnen för en neutral nyhetsanalystjänst. Du ser bara rubrik och ingress.

För varje artikel:
1. in_scope: true om artikeln handlar om politik, ekonomi, samhälle eller utrikes och är av allmänintresse. false för sport, nöje, kultur, livsstil, recept, väder, trafik, enskilda brott eller olyckor utan bredare samhällsfråga, personporträtt, frågesporter, tävlingar, annonser och allt som handlar om privatpersoner.
2. category: politik, ekonomi, samhalle eller utrikes. "ingen" om in_scope är false.
3. topic: vilket ämne artikeln hör till.
   - Ett befintligt ämne anges med dess id, till exempel "T12". Välj det bara om artikeln handlar om samma händelse eller samma pågående fråga.
   - Ett nytt ämne anges med en kort nyckel, till exempel "N1", som du också beskriver under new_topics. Flera artiklar i samma omgång kan få samma nya nyckel.
   - Tom sträng om in_scope är false.

Ett ämne är en händelse eller en avgränsad fråga, till exempel "Regeringens budgetproposition för 2027" eller "Protesterna mot pensionsreformen i Frankrike". Inte ett helt område som "Inrikespolitik". Hellre ett nytt ämne än att blanda ihop två olika händelser.

För nya ämnen: label är en saklig rubrik på svenska, högst 80 tecken, utan värdeladdade ord, utan namn på privatpersoner och utan medienamn.

Svara bara med JSON enligt schemat.`;

/** The user message: the open topics and the articles to sort. */
export function sortMessage(topics: OpenTopic[], articles: SortArticle[]): string {
  const topicLines = topics.length
    ? topics.map((topic) => `T${topic.id} [${topic.category}] ${topic.label}${topic.examples.length ? ` | t.ex.: ${topic.examples.join(" / ")}` : ""}`).join("\n")
    : "(inga ännu)";
  const articleLines = articles
    .map((article, index) => `${index + 1}. ${article.title}${article.lead ? ` | ${article.lead.slice(0, 220)}` : ""}`)
    .join("\n");
  return `Befintliga ämnen:\n${topicLines}\n\nArtiklar att sortera:\n${articleLines}`;
}

const categoryOrNone = [...topicCategories, "ingen"] as const;

/** The JSON schema the API holds the answer to (structured outputs). */
export const sortOutputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["articles", "new_topics"],
  properties: {
    articles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["n", "in_scope", "category", "topic"],
        properties: {
          n: { type: "integer" },
          in_scope: { type: "boolean" },
          category: { type: "string", enum: [...categoryOrNone] },
          topic: { type: "string" },
        },
      },
    },
    new_topics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["key", "label", "category"],
        properties: {
          key: { type: "string" },
          label: { type: "string" },
          category: { type: "string", enum: [...topicCategories] },
        },
      },
    },
  },
} as const;

/** The same shape checked again on our side: the server never trusts the answer blindly. */
export const sortAnswer = z.object({
  articles: z.array(
    z.object({
      n: z.number().int(),
      in_scope: z.boolean(),
      category: z.enum(categoryOrNone),
      topic: z.string(),
    }),
  ),
  new_topics: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      category: z.enum(topicCategories),
    }),
  ),
});
export type SortAnswer = z.infer<typeof sortAnswer>;

export interface NewTopic {
  key: string;
  label: string;
  category: TopicCategory;
}

export interface Assignment {
  articleId: number;
  inScope: boolean;
  /** An existing topic. */
  topicId?: number;
  /** A topic created in this batch. */
  newKey?: string;
}

/** Labels are cut and cleaned: no line breaks, no quotes around, at most 120 characters. */
export function cleanLabel(label: string): string {
  return label.replace(/\s+/g, " ").trim().replace(/^["'«»”“]+|["'«»”“]+$/g, "").trim().slice(0, 120);
}

/**
 * Turns the model's answer into assignments. Anything that does not add up
 * (a number that is not in the batch, an unknown topic id, a new key without
 * a description) leaves the article unsorted, so it is tried again next run.
 */
export function planAssignments(answer: SortAnswer, articles: SortArticle[], topics: OpenTopic[]): { assignments: Assignment[]; newTopics: NewTopic[] } {
  const known = new Set(topics.map((topic) => topic.id));
  const described = new Map<string, NewTopic>();
  for (const topic of answer.new_topics) {
    const key = topic.key.trim();
    const label = cleanLabel(topic.label);
    if (!/^N\d+$/i.test(key) || label.length < 3) continue;
    if (!described.has(key.toUpperCase())) described.set(key.toUpperCase(), { key: key.toUpperCase(), label, category: topic.category });
  }

  const seen = new Set<number>();
  const usedKeys = new Set<string>();
  const assignments: Assignment[] = [];
  for (const row of answer.articles) {
    const article = articles[row.n - 1];
    if (!article || seen.has(row.n)) continue;
    seen.add(row.n);
    const topic = row.topic.trim().toUpperCase();

    if (!row.in_scope || row.category === "ingen") {
      assignments.push({ articleId: article.id, inScope: false });
      continue;
    }
    const existing = /^T(\d+)$/.exec(topic);
    if (existing && known.has(Number(existing[1]))) {
      assignments.push({ articleId: article.id, inScope: true, topicId: Number(existing[1]) });
    } else if (described.has(topic)) {
      assignments.push({ articleId: article.id, inScope: true, newKey: topic });
      usedKeys.add(topic);
    }
  }
  return { assignments, newTopics: [...described.values()].filter((topic) => usedKeys.has(topic.key)) };
}
