import { SectionHeading } from "@/components/ui/SectionHeading";
import { SourceChips } from "@/components/ui/SourceChips";
import { UncertaintyBadge } from "@/components/ui/UncertaintyBadge";
import type { Topic } from "@/lib/topics/types";
import { glosser } from "./Glossary";
import styles from "./Faq.module.css";

/** Short questions with answers from the topic's own material. The text is always in the HTML. */
export function FaqSection({ topic }: { topic: Topic }) {
  if (topic.faq.length === 0) return null;
  const gloss = glosser(topic, "fragor");
  return (
    <section className={styles.section}>
      <SectionHeading id="fragor-och-svar">Frågor och svar</SectionHeading>
      <p className={styles.intro}>Korta svar på vanliga frågor, bara utifrån underlaget på den här sidan.</p>
      <div className={styles.list}>
        {topic.faq.map((item, index) => (
          <details key={item.question} className={`reveal ${styles.item}`} open={index === 0}>
            <summary className={styles.question}>
              <span>{item.question}</span>
              <svg className="chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className={styles.answer}>
              {item.label && <UncertaintyBadge label={item.label} />}
              <p className={styles.answerText}>{gloss(item.answer)}</p>
              <SourceChips refs={item.sources} sources={topic.sources} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
