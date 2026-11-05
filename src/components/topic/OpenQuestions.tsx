import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SourceChips } from "@/components/ui/SourceChips";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import { googleCalendarUrl } from "@/lib/calendar/ics";
import { calendarPath, questionEvent } from "@/lib/calendar/questions";
import { formatDay, sortQuestions } from "@/lib/topics/questions";
import type { OpenQuestion, Topic } from "@/lib/topics/types";
import { DateCountdown } from "./DateCountdown";
import { DepthMore } from "./sections";
import { glosser } from "./Glossary";
import shared from "./sections.module.css";
import styles from "./OpenQuestions.module.css";

type Gloss = ReturnType<typeof glosser>;

/**
 * "Lägg i kalendern": a calendar file for Apple Kalender and Outlook, or a
 * Google Kalender link. The choices open in a popover, which is plain HTML.
 */
export function CalendarButton({ topic, question, idPrefix = "kalender" }: { topic: Topic; question: OpenQuestion; idPrefix?: string }) {
  const event = questionEvent(topic, question);
  if (!event || !question.expected) return null;
  // Unique per topic and page, since Next.js keeps earlier pages in the DOM.
  const id = `${idPrefix}-${topic.slug}-${question.id}`;
  return (
    <div className={styles.calendar}>
      <button type="button" popoverTarget={id} className={styles.calButton} style={{ anchorName: `--${id}` } as CSSProperties}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
        </svg>
        Lägg i kalendern
      </button>
      <div id={id} popover="auto" className={styles.calPopover} style={{ positionAnchor: `--${id}` } as CSSProperties}>
        <p className={styles.calTitle}>
          {question.expected.event}, {formatDay(question.expected.date)}
        </p>
        <a href={calendarPath(topic.slug, question.id)} className={styles.calLink}>
          Apple Kalender eller Outlook
        </a>
        <a href={googleCalendarUrl(event)} target="_blank" rel="noopener" className={styles.calLink}>
          Google Kalender
          <span className="sr-only"> (öppnas i ny flik)</span>
        </a>
      </div>
    </div>
  );
}

function OpenItem({ topic, question, gloss }: { topic: Topic; question: OpenQuestion; gloss: Gloss }) {
  return (
    <li className={`reveal ${styles.item}`}>
      <h3 className={styles.question}>{question.question}</h3>
      {/* What we know so far. Shown from 5 min. */}
      <div className={styles.details} data-depth="1">
        {question.label && <UncertaintyBadge label={question.label} />}
        <p className={styles.status}>{gloss(question.status)}</p>
        <SourceChips refs={question.sources} sources={topic.sources} />
      </div>
      {question.expected ? (
        <DateCountdown date={question.expected.date} event={question.expected.event} updatedAt={topic.updatedAt}>
          <CalendarButton topic={topic} question={question} />
        </DateCountdown>
      ) : (
        <p className={styles.noDate}>Det finns inget datum för svaret än.</p>
      )}
    </li>
  );
}

function AnsweredItem({ topic, question, gloss }: { topic: Topic; question: OpenQuestion; gloss: Gloss }) {
  const answer = question.answer;
  if (!answer) return null;
  return (
    <li className={`reveal ${styles.item}`}>
      <p className={styles.known}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 12 5 5 9-10" />
        </svg>
        Besvarad
        {answer.date && (
          <>
            {" "}
            <time dateTime={answer.date}>{formatDay(answer.date)}</time>
          </>
        )}
      </p>
      <h4 className={styles.question}>{question.question}</h4>
      <p className={styles.status}>{gloss(answer.text)}</p>
      <div className={styles.details} data-depth="1">
        {answer.label && <UncertaintyBadge label={answer.label} />}
        <SourceChips refs={answer.sources} sources={topic.sources} />
      </div>
    </li>
  );
}

/** What the topic is waiting for, with the day an answer is expected, and what we have learned since. */
export function OpenQuestionsSection({ topic }: { topic: Topic }) {
  if (topic.openQuestions.length === 0) return null;
  const { open, answered } = sortQuestions(topic.openQuestions);
  const gloss = glosser(topic, "vantar");
  return (
    <section className={shared.section}>
      <SectionHeading id="vantar-svar" size="medium">
        Frågor vi väntar svar på
      </SectionHeading>
      <p className={shared.small}>Det här vet vi inte än. Väntas svaret en viss dag kan du lägga dagen i din kalender.</p>
      {open.length > 0 && (
        <ol className={styles.list} aria-label="Öppna frågor">
          {open.map((question) => (
            <OpenItem key={question.id} topic={topic} question={question} gloss={gloss} />
          ))}
        </ol>
      )}
      {answered.length > 0 && (
        <div className={styles.answered}>
          <h3 className={styles.answeredTitle}>Nu vet vi</h3>
          <ol className={styles.list} aria-label="Besvarade frågor">
            {answered.map((question) => (
              <AnsweredItem key={question.id} topic={topic} question={question} gloss={gloss} />
            ))}
          </ol>
        </div>
      )}
      <DepthMore topic={topic} />
    </section>
  );
}
