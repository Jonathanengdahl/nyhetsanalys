import { formatDateTime } from "@/lib/format";
import { topicPath } from "@/lib/topics";
import type { SourceRef, Topic } from "@/lib/topics/types";

/**
 * The material ("underlaget") the chat may answer from. It is built from the
 * same data as the pages, so the chat never knows more than the reader can
 * read on the site. Sources are numbered so answers can cite them as [n].
 */

export type ChatSource = { n: number; name: string; title: string; url?: string };

export type ChatMaterial = {
  /** What the chat is about, for the reader: "Protesterna i Frankrike" or "dagens ämnen". */
  label: string;
  text: string;
  sources: ChatSource[];
};

type Numbering = (ref: SourceRef) => number;

const cite = (refs: SourceRef[], number: Numbering) => (refs.length ? ` ${refs.map((ref) => `[${number(ref)}]`).join("")}` : "");

const bullets = (lines: string[]) => lines.map((line) => `- ${line}`).join("\n");

function topicSections(topic: Topic, number: Numbering, full: boolean): string {
  const parts: string[] = [
    `ÄMNE: ${topic.title}`,
    `Adress: ${topicPath(topic.slug)}`,
    `Uppdaterad: ${formatDateTime(topic.updatedAt)}`,
    `Läge: ${topic.status}`,
    `Ingress: ${topic.dek}`,
    `Underlag: ${topic.counts}`,
    "",
    "PÅ 30 SEKUNDER",
    bullets(topic.summary.map((row) => `${row.key}: ${row.text}`)),
    "",
    "NYTT",
    topic.updates.intro,
    bullets(topic.updates.items.map((item) => `${item.text}${cite(item.sources, number)}`)),
    "",
    "NYCKELTAL",
    bullets(topic.stats.map((stat) => `${stat.value} ${stat.label}`)),
    "",
    "FAKTA OCH OSÄKERHET (märkningen står inom parentes)",
    bullets(topic.facts.map((fact) => `(${fact.label}) ${fact.title}: ${fact.text}${cite(fact.sources, number)}`)),
    "",
    "SIFFRORNA BAKOM",
    topic.numbers.intro,
    bullets(topic.numbers.tiles.map((tile) => `${tile.value} ${tile.label}. ${tile.sub}${cite(tile.sources, number)}`)),
    "",
    "DET HÄR SAKNAS I DEBATTEN",
    bullets(topic.missing.map((item) => `${item.title}: ${item.text}${item.note ? ` ${item.note}` : ""}${cite(item.sources, number)}`)),
    "",
    "ORDLISTA",
    bullets(topic.glossary.map((item) => `${item.term}: ${item.explanation}`)),
    "",
    "MEDIEBILDEN",
    topic.media.intro,
    "Medierna är överens om:",
    bullets(topic.media.agree),
    "Medierna skiljer sig åt:",
    bullets(topic.media.differ),
  ];

  if (!full) return parts.join("\n");

  parts.push(
    "",
    "VAD HAR HÄNT (tidslinje)",
    bullets(topic.timeline.map((event) => `${event.date}: ${event.text}${cite(event.sources, number)}`)),
    "",
    `Vad artiklarna lyfter fram (${topic.media.framesMeta}):`,
    bullets(topic.media.frames.map((frame) => `${frame.name}: ${frame.percent} %`)),
    topic.media.framesNote,
    "Artiklarna, en och en:",
    bullets(
      topic.articles.map(
        (article) =>
          `${article.outlet} (${article.genre}), "${article.title}". ${article.rows.map((row) => `${row.key}: ${row.text}`).join(" ")} Politisk placering: ${article.placement}`,
      ),
    ),
    "",
    `VEM PEKAR UT VEM: ${topic.blame.title}`,
    topic.blame.intro,
    bullets(topic.blame.items.map((item) => `${item.who} (${item.role}): ${item.text}`)) + cite(topic.blame.sources, number),
    "",
    "FÖRKLARINGSMODELLER (perspektiv, inte fakta)",
    bullets(topic.models.items.map((model) => `${model.name}. För: ${model.pro} Emot: ${model.con} Företräds av: ${model.by}`)) +
      cite(topic.models.sources, number),
    "",
    "DIAGRAM",
    bullets(
      topic.numbers.charts.map(
        (chart) => `${chart.title}: ${chart.rows.map((row) => `${row.name} ${row.label}`).join(", ")}. ${chart.note}${cite(chart.sources, number)}`,
      ),
    ),
    topic.numbers.note,
    "",
    "PERSPEKTIVPANELEN (typiska argument från olika håll, inte verkliga personer och inte våra åsikter)",
    topic.panel.intro,
    bullets(topic.panel.items.map((voice) => `${voice.name} (${voice.axes}): "${voice.quote}"`)),
    "",
    "FRÅGOR OCH SVAR (visas på sidan, märkningen står inom parentes)",
    bullets(
      topic.faq.map((item) => `${item.question} ${item.label ? `(${item.label}) ` : ""}${item.answer}${cite(item.sources, number)}`),
    ),
    "",
    "SÅ ÄR SIDAN GJORD",
    bullets(topic.method),
  );

  if (topic.corrections.length) {
    parts.push("", "RÄTTELSER", bullets(topic.corrections.map((item) => `${item.date}: ${item.text}`)));
  }
  return parts.join("\n");
}

function sourceList(sources: ChatSource[]) {
  return ["KÄLLOR", ...sources.map((source) => `[${source.n}] ${source.name}: ${source.title}`)].join("\n");
}

/** Everything on one topic page. */
export function topicMaterial(topic: Topic): ChatMaterial {
  const sources = topic.sources.map((source, index) => ({ n: index + 1, ...source }));
  const text = [topicSections(topic, (ref) => ref, true), "", sourceList(sources)].join("\n");
  return { label: topic.title, text, sources };
}

/** Today's topics in short form, with one numbering of all sources. */
export function startMaterial(topics: Topic[]): ChatMaterial {
  const sources: ChatSource[] = [];
  const sections = topics.map((topic) => {
    const offset = sources.length;
    topic.sources.forEach((source, index) => sources.push({ n: offset + index + 1, ...source }));
    return topicSections(topic, (ref) => offset + ref, false);
  });
  const text = [
    `DAGENS ANALYSERADE ÄMNEN (${topics.length}): ${topics.map((topic) => topic.title).join(", ")}`,
    "",
    sections.join("\n\n---\n\n"),
    "",
    sourceList(sources),
  ].join("\n");
  return { label: "dagens ämnen", text, sources };
}
