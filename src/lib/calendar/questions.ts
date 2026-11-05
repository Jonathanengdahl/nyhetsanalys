import { site } from "@/config/site";
import { topicPath } from "@/lib/topics";
import type { OpenQuestion, Topic } from "@/lib/topics/types";
import type { CalendarEvent } from "./ics";

/** The address of a question's calendar file. */
export const calendarPath = (slug: string, id: string) => `${topicPath(slug)}/kalender/${id}`;

/** A calendar event for the day an answer is expected, linking back to the topic page. */
export function questionEvent(topic: Topic, question: OpenQuestion): CalendarEvent | null {
  if (!question.expected) return null;
  const url = `${site.url}${topicPath(topic.slug)}#vantar-svar`;
  return {
    uid: `${topic.slug}-${question.id}@${new URL(site.url).hostname}`,
    date: question.expected.date,
    title: `${question.expected.event} (${topic.title})`,
    description: `${question.question} Läs läget hos ${site.name}: ${url}`,
    url,
    stamp: topic.updatedAt,
  };
}
