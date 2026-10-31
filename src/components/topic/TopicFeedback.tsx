"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { submitHelpful, submitSuggestion, type FeedbackState } from "@/lib/feedback/actions";
import styles from "./TopicFeedback.module.css";

const idle: FeedbackState = { status: "idle" };

/** Field for bots. Hidden from people and assistive technology. */
function Honeypot({ id }: { id: string }) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label htmlFor={`${id}-website`}>Lämna tomt</label>
      <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.fieldError}>
      {message}
    </p>
  );
}

/** "Var sidan tydlig?" Ja or Nej, with an optional comment. */
function HelpfulForm({ topic }: { topic: string }) {
  const [state, action, pending] = useActionState(submitHelpful, idle);
  const id = useId();

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  return (
    // A new key per response remounts the fields so defaultValue applies again.
    <form key={state.status === "error" ? state.attempt : "first"} action={action} className={styles.helpful} noValidate>
      <input type="hidden" name="topic" value={topic} />
      <fieldset className={styles.choice} aria-describedby={errors?.helpful ? `${id}-helpful-error` : undefined}>
        <legend className={styles.question}>Var sidan tydlig?</legend>
        <div className={styles.options}>
          {[
            { value: "ja", label: "Ja" },
            { value: "nej", label: "Nej" },
          ].map((option) => (
            <label key={option.value} className={styles.option}>
              <input type="radio" name="helpful" value={option.value} defaultChecked={values?.helpful === option.value} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <FieldError id={`${id}-helpful-error`} message={errors?.helpful} />

      {/* Shown once Ja or Nej is chosen, where the browser supports :has(). */}
      <div className={styles.more}>
        <div className={styles.field}>
          <label htmlFor={`${id}-comment`} className={styles.label}>
            Vill du berätta mer? <span className={styles.optional}>Frivilligt</span>
          </label>
          <textarea
            id={`${id}-comment`}
            name="comment"
            rows={3}
            maxLength={1000}
            defaultValue={values?.comment}
            className={styles.input}
            aria-invalid={errors?.comment ? true : undefined}
            aria-describedby={errors?.comment ? `${id}-comment-error` : `${id}-comment-hint`}
          />
          <p id={`${id}-comment-hint`} className={styles.hint}>
            Skriv inga personuppgifter.
          </p>
          <FieldError id={`${id}-comment-error`} message={errors?.comment} />
        </div>
        <Honeypot id={id} />
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Skickar …" : "Skicka"}
        </button>
      </div>

      <p className={styles.formError} role="alert">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}

/** A missing perspective. The source is required, so that a person can check it. */
function SuggestionForm({
  topic,
  state,
  action,
  pending,
}: {
  topic: string;
  state: FeedbackState;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const id = useId();

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  return (
    <form key={state.status === "error" ? state.attempt : "first"} action={action} className={styles.form} noValidate>
      <input type="hidden" name="topic" value={topic} />

      <div className={styles.field}>
        <label htmlFor={`${id}-perspective`} className={styles.label}>
          Vilket perspektiv saknas?
        </label>
        <textarea
          id={`${id}-perspective`}
          name="perspective"
          rows={4}
          required
          minLength={15}
          maxLength={1000}
          defaultValue={values?.perspective}
          className={styles.input}
          aria-invalid={errors?.perspective ? true : undefined}
          aria-describedby={`${id}-perspective-hint${errors?.perspective ? ` ${id}-perspective-error` : ""}`}
        />
        <p id={`${id}-perspective-hint`} className={styles.hint}>
          Beskriv kort vad som saknas och varför det hör till ämnet.
        </p>
        <FieldError id={`${id}-perspective-error`} message={errors?.perspective} />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${id}-source`} className={styles.label}>
          Länk till källan
        </label>
        <input
          id={`${id}-source`}
          name="source"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          required
          maxLength={500}
          placeholder="https://"
          defaultValue={values?.source}
          className={styles.input}
          aria-invalid={errors?.source ? true : undefined}
          aria-describedby={`${id}-source-hint${errors?.source ? ` ${id}-source-error` : ""}`}
        />
        <p id={`${id}-source-hint`} className={styles.hint}>
          Till exempel en artikel, en rapport eller officiell statistik där uppgiften går att kontrollera.
        </p>
        <FieldError id={`${id}-source-error`} message={errors?.source} />
      </div>

      <Honeypot id={id} />
      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Skickar …" : "Skicka förslaget"}
      </button>

      <p className={styles.formError} role="alert">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}

/** The end of a topic page: was it clear, and is a perspective missing? A person reads everything. */
export function TopicFeedback({ topic }: { topic: string }) {
  const [suggestion, suggest, suggesting] = useActionState(submitSuggestion, idle);
  return (
    <section className={styles.section}>
      <SectionHeading id="tyck-till" size="medium">
        Tyck till
      </SectionHeading>

      <div className={styles.card}>
        <HelpfulForm topic={topic} />
      </div>

      <div className={styles.card}>
        <h3 className={styles.question}>Saknas ett perspektiv?</h3>
        <p className={styles.text}>
          Föreslå ett perspektiv, en grupp eller en uppgift som saknas. Ange alltid en källa, annars kan vi inte granska
          förslaget.
        </p>
        {/* Stays open after sending, also when the page is reloaded without JavaScript. */}
        <details className={styles.details} open={suggestion.status !== "idle" || undefined}>
          <summary className={styles.open}>
            Skriv ett förslag
            <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className={styles.body}>
            <div className={styles.rules}>
              <p className={`mono ${styles.rulesTitle}`}>Så granskar vi förslag</p>
              <ul className={styles.rulesList}>
                <li>Utan en länk till en källa går förslaget inte att skicka.</li>
                <li>En människa granskar förslaget och källan. Inget läggs till automatiskt.</li>
                <li>
                  Vi tar bara med det som hör till ämnet och har stöd i källan. Vi tar inte ställning, och vi lägger inte
                  till något för att många föreslår det.
                </li>
                <li>
                  Skriv inga personuppgifter, varken om dig själv eller om andra. Vi sparar inte namn, e-post eller
                  IP-adress. Läs mer i vår <Link href="/integritet#synpunkter">integritetspolicy</Link>.
                </li>
              </ul>
            </div>
            <SuggestionForm topic={topic} state={suggestion} action={suggest} pending={suggesting} />
          </div>
        </details>
      </div>
    </section>
  );
}
