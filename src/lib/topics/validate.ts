import { mainFocus } from "./angles";
import { leadQuestion } from "./cards";
import { glossaryPattern } from "./glossary";
import { uncertaintyLabels, type Topic, type UncertaintyLabel } from "./types";

/*
 * The checks every topic must pass before it is shown to readers: the
 * hand-written ones in the tests and the AI drafts before publishing. Each
 * problem is a short sentence in Swedish, so it can be shown in admin.
 */

/** Every source number on the page. */
export function sourceRefs(topic: Topic): number[] {
  return sourceLists(topic).flat().concat(topic.sourceGroups.flatMap((group) => group.ids));
}

/** Every list of source numbers on the page, to check them one by one. */
export function sourceLists(topic: Topic): number[][] {
  return [
    ...topic.updates.items.map((item) => item.sources),
    ...topic.timeline.map((event) => event.sources),
    ...topic.facts.map((fact) => fact.sources),
    topic.blame.sources,
    topic.models.sources,
    ...topic.numbers.tiles.map((tile) => tile.sources),
    ...topic.numbers.charts.map((chart) => chart.sources),
    ...topic.missing.map((item) => item.sources),
    ...topic.faq.map((item) => item.sources),
    ...topic.openQuestions.flatMap((question) => [question.sources, ...(question.answer ? [question.answer.sources] : [])]),
  ];
}

/** The texts where explained words are marked (see glosser in Glossary.tsx). */
export function glossedText(topic: Topic): string {
  return [
    ...topic.summary.map((row) => row.text),
    ...topic.updates.items.map((item) => item.text),
    ...topic.timeline.map((event) => event.text),
    ...topic.facts.map((fact) => fact.text),
    ...topic.numbers.tiles.map((tile) => tile.label),
    ...topic.missing.map((item) => item.text),
    ...topic.faq.map((item) => item.answer),
    ...topic.openQuestions.flatMap((question) => [question.status, question.answer?.text ?? ""]),
  ].join("\n");
}

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const isRealDay = (day: string) => /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(`${day}T12:00:00Z`)) && new Date(`${day}T12:00:00Z`).toISOString().slice(0, 10) === day;
const knownLabel = (label: string | undefined) => label === undefined || uncertaintyLabels.includes(label as UncertaintyLabel);
const unique = (list: unknown[]) => new Set(list).size === list.length;

export function topicProblems(topic: Topic): string[] {
  const problems: string[] = [];
  const add = (ok: boolean, problem: string) => {
    if (!ok) problems.push(problem);
  };

  add(slugPattern.test(topic.slug), `Adressen "${topic.slug}" har otillåtna tecken.`);
  add(!Number.isNaN(Date.parse(topic.publishedAt)) && !Number.isNaN(Date.parse(topic.updatedAt)), "Datumen går inte att läsa.");
  add(topic.title.trim().length > 3, "Rubriken saknas.");
  add(topic.summary.length > 0, "Sammanfattningen saknas.");
  add(topic.sources.length > 0, "Källor saknas.");
  add(topic.sources.every((source) => !source.url || /^https:\/\//.test(source.url)), "En källa har en adress som inte börjar med https.");

  for (const ref of sourceRefs(topic)) {
    if (!Number.isInteger(ref) || ref < 1 || ref > topic.sources.length) {
      problems.push(`Källa ${ref} finns inte.`);
      break;
    }
  }
  add(sourceLists(topic).every(unique), "Samma källa står två gånger på ett ställe.");
  add(topic.facts.every((fact) => fact.sources.length > 0), "En uppgift saknar källa.");

  add(topic.facts.every((fact) => knownLabel(fact.label)), "En uppgift har en okänd osäkerhetsmärkning.");
  add((topic.card.highlights ?? []).every((item) => knownLabel(item.uncertainty)), "En siffra på kortet har en okänd märkning.");
  add(topic.faq.every((item) => knownLabel(item.label)), "En fråga har en okänd märkning.");
  add(topic.openQuestions.every((question) => knownLabel(question.label) && knownLabel(question.answer?.label)), "En väntande fråga har en okänd märkning.");

  add(unique(topic.faq.map((item) => item.question)), "Två frågor i Frågor och svar är likadana.");
  for (const item of topic.faq) {
    add(item.question.endsWith("?"), `Frågan "${item.question}" slutar inte med frågetecken.`);
    add(item.answer.length > 20, `Svaret på "${item.question}" är för kort.`);
    add(item.sources.length > 0, `Svaret på "${item.question}" saknar källa.`);
  }

  const text = glossedText(topic);
  add(unique(topic.glossary.map((item) => item.term)), "Ett ord förklaras två gånger.");
  for (const item of topic.glossary) {
    add(glossaryPattern(item.match ?? item.term).test(text), `Ordet "${item.term}" förklaras men används inte i texten.`);
    add(item.explanation.length > 20, `Förklaringen av "${item.term}" är för kort.`);
  }

  const columns = topic.media.matrixColumns.length;
  add(topic.media.matrix.length === topic.articles.length, "Varje artikel behöver en rad i jämförelsen.");
  add(
    topic.media.matrix.every((row) => row.values.length === columns && row.values.every((value) => value === 0 || value === 1 || value === 2)),
    "Jämförelsen har fel antal värden.",
  );
  topic.articles.forEach((article, index) => {
    add(article.angle.length > 20, `${article.outlet}: vinkeln är för kort.`);
    add(mainFocus(topic, index).length > 0, `${article.outlet}: huvudfokus saknas.`);
  });
  for (const difference of topic.media.differ) {
    const question = leadQuestion(difference);
    add(question.endsWith("?") && question.length < 140, `"${difference.slice(0, 40)}…" börjar inte med en kort fråga.`);
  }
  if (topic.media.frames.length > 0) {
    const total = topic.media.frames.reduce((sum, frame) => sum + frame.weight, 0);
    add(total > 98 && total < 102, `Andelarna i Så vinklade medierna blir ${Math.round(total)} procent.`);
  }

  add(unique(topic.openQuestions.map((question) => question.id)), "Två väntande frågor har samma id.");
  const updated = topic.updatedAt.slice(0, 10);
  for (const question of topic.openQuestions) {
    add(slugPattern.test(question.id), `Den väntande frågan "${question.id}" har ett otillåtet id.`);
    add(question.question.endsWith("?"), `"${question.question}" slutar inte med frågetecken.`);
    add(question.status.length > 20, `Läget för "${question.question}" är för kort.`);
    add(question.sources.length > 0, `"${question.question}" saknar källa.`);
    if (question.expected) add(isRealDay(question.expected.date) && question.expected.event.length > 5, `"${question.question}" har ett ogiltigt datum.`);
    if (question.answer) {
      add(question.answer.sources.length > 0, `Svaret på "${question.question}" saknar källa.`);
      if (question.answer.date) add(isRealDay(question.answer.date) && question.answer.date <= updated, `Svaret på "${question.question}" har ett ogiltigt datum.`);
    }
  }

  return problems;
}
