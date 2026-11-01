import type { FaqItem, SourceRef, Topic } from "@/lib/topics/types";

/*
 * Ready chat answers taken from the page itself. They are shown at once,
 * cost nothing and do not count against the daily questions.
 */

const cite = (refs: SourceRef[]) => refs.map((n) => `[${n}]`).join("");

/** An answer from Frågor och svar, followed by its source numbers the way the chat writes them. */
export const readyAnswer = (item: FaqItem) => `${item.answer} ${cite(item.sources)}`.trim();

export const MEDIA_QUESTION = "Hur skiljer sig medierna åt?";
export const MISSING_QUESTION = "Vad saknas i debatten?";

/** "Title: text", or "Title? Text" when the title is a question. */
const titled = (title: string, text: string) => (/[?!.]$/.test(title) ? `${title} ${text}` : `${title}: ${text}`);

export function topicReadyAnswers(topic: Topic): Record<string, string> {
  const answers: Record<string, string> = Object.fromEntries(topic.faq.map((item) => [item.question, readyAnswer(item)]));
  if (topic.media.differ.length) {
    answers[MEDIA_QUESTION] = [
      "Artiklarna skiljer sig främst i de här frågorna:",
      ...topic.media.differ.map((item) => `• ${item}`),
      "",
      "Under Så vinklade medierna på sidan står vinkeln i varje artikel.",
    ].join("\n");
  }
  if (topic.missing.length) {
    answers[MISSING_QUESTION] = [
      "Det här saknas eller får lite utrymme i artiklarna vi har gått igenom:",
      ...topic.missing.map((item) => `• ${titled(item.title, item.text)} ${cite(item.sources)}`.trimEnd()),
    ].join("\n");
  }
  return answers;
}

/** What the chat suggests on a topic page: questions from Frågor och svar, then the two questions about the media. */
export function topicSuggestions(topic: Topic, count = 4): string[] {
  const media = [topic.media.differ.length ? MEDIA_QUESTION : null, topic.missing.length ? MISSING_QUESTION : null].filter(
    (question): question is string => question !== null,
  );
  const faq = topic.faq.slice(0, Math.max(0, count - media.length)).map((item) => item.question);
  return [...faq, ...media];
}
