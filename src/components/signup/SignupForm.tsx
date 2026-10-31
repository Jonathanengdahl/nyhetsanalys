"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { submitSignup, type SignupState } from "@/lib/signup/actions";
import type { SignupKind } from "@/lib/signup/schema";
import styles from "./SignupForm.module.css";

const initialState: SignupState = { status: "idle" };

const copy: Record<SignupKind, { submit: string; consent: string }> = {
  beta: {
    submit: "Anmäl mig till betan",
    consent: "Jag godkänner att ni sparar min e-postadress för att kontakta mig om betan.",
  },
  newsletter: {
    submit: "Prenumerera",
    consent: "Jag godkänner att ni sparar min e-postadress för att skicka veckobrevet.",
  },
};

export function SignupForm({ kind }: { kind: SignupKind }) {
  const [state, formAction, pending] = useActionState(submitSignup, initialState);
  const id = useId();
  const emailId = `${id}-email`;
  const emailErrorId = `${id}-email-error`;
  const consentId = `${id}-consent`;
  const consentErrorId = `${id}-consent-error`;
  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;

  if (state.status === "success") {
    return (
      <p className={styles.success} role="status">
        {state.message}
      </p>
    );
  }

  return (
    // A new key per response remounts the fields so defaultValue applies again.
    <form
      key={values?.attempt ?? "initial"}
      action={formAction}
      className={styles.form}
      noValidate
    >
      <input type="hidden" name="kind" value={kind} />

      <div className={styles.field}>
        <label htmlFor={emailId} className={styles.label}>
          Din e-postadress
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="namn@exempel.se"
          required
          maxLength={254}
          defaultValue={values?.email}
          className={styles.input}
          aria-invalid={fieldErrors?.email ? true : undefined}
          aria-describedby={fieldErrors?.email ? emailErrorId : undefined}
        />
        {fieldErrors?.email && (
          <p id={emailErrorId} className={styles.fieldError}>
            {fieldErrors.email}
          </p>
        )}
      </div>

      {kind === "beta" && (
        <div className={styles.check}>
          <input
            id={`${id}-tester`}
            name="tester"
            type="checkbox"
            defaultChecked={values?.tester}
            className={styles.checkbox}
          />
          <label htmlFor={`${id}-tester`}>
            Jag vill vara testläsare och lämna synpunkter under betan (frivilligt).
          </label>
        </div>
      )}

      <div className={styles.check}>
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          required
          className={styles.checkbox}
          aria-invalid={fieldErrors?.consent ? true : undefined}
          aria-describedby={fieldErrors?.consent ? consentErrorId : undefined}
        />
        <label htmlFor={consentId}>
          {copy[kind].consent} Du kan när som helst be oss ta bort den. Läs mer i vår{" "}
          <Link href="/integritet">integritetspolicy</Link>.
        </label>
      </div>
      {fieldErrors?.consent && (
        <p id={consentErrorId} className={styles.fieldError}>
          {fieldErrors.consent}
        </p>
      )}

      {/* Honeypot for bots. Hidden from people and assistive technology. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${id}-website`}>Lämna tomt</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Skickar …" : copy[kind].submit}
      </button>

      <p className={styles.formError} role="alert">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
