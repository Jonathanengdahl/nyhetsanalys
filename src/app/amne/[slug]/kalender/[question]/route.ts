import { calendarFile } from "@/lib/calendar/ics";
import { questionEvent } from "@/lib/calendar/questions";
import { getPublishedTopics, getTopic } from "@/lib/topics";

// One calendar file per question that waits for an answer on a known day. Built in advance.
export async function generateStaticParams() {
  const topics = await getPublishedTopics();
  return topics.flatMap((topic) =>
    topic.openQuestions.filter((question) => question.expected && !question.answer).map((question) => ({ slug: topic.slug, question: question.id })),
  );
}

async function render(slug: string, id: string) {
  "use cache";
  const topic = await getTopic(slug);
  // Only questions that still wait for an answer on a known day.
  const question = topic?.openQuestions.find((item) => item.id === id && !item.answer);
  const event = topic && question ? questionEvent(topic, question) : null;
  return event ? calendarFile(event) : null;
}

export async function GET(_request: Request, { params }: RouteContext<"/amne/[slug]/kalender/[question]">) {
  const { slug, question } = await params;
  const file = await render(slug, question);
  if (!file) return new Response("Det finns ingen sådan händelse.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(file, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      // Inline, so that iPhone and iPad offer to add the event. Other browsers save the file.
      "Content-Disposition": `inline; filename="${question}.ics"`,
    },
  });
}
