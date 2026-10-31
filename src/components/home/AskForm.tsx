"use client";

import { useEffect, useRef } from "react";
import { comingSoon, showToast } from "@/components/ui/toast";
import styles from "./AskForm.module.css";

const PLACEHOLDER = "Fråga om dagens ämnen";
const EXAMPLES = [
  "Varför blev det våld i Frankrike nu?",
  "Vad betyder KPIF?",
  "Vem leder regeringsbildningen?",
  "Vad saknas i debatten?",
];

/**
 * Question field for the coming chat. Example questions type themselves into
 * the placeholder until the reader focuses the field.
 */
export function AskForm({ suggestions }: { suggestions: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const stopTyping = () => {
    window.clearInterval(timerRef.current);
    timerRef.current = undefined;
    inputRef.current?.setAttribute("placeholder", PLACEHOLDER);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const startAt = Date.now() + 3200;
    const spans = EXAMPLES.map((q) => q.length * 55 + 1700 + q.length * 22 + 350);
    const total = spans.reduce((a, b) => a + b, 0);
    let last = "";
    timerRef.current = window.setInterval(() => {
      const input = inputRef.current;
      const now = Date.now();
      if (!input || now < startAt) return;
      let t = (now - startAt) % total;
      let i = 0;
      while (i < spans.length - 1 && t >= spans[i]) {
        t -= spans[i];
        i += 1;
      }
      const question = EXAMPLES[i];
      const typing = question.length * 55;
      let shown = 0;
      if (t < typing) shown = Math.floor(t / 55);
      else if (t < typing + 1700) shown = question.length;
      else if (t < typing + 1700 + question.length * 22) shown = question.length - Math.floor((t - typing - 1700) / 22);
      const text = question.slice(0, Math.max(0, shown));
      if (text !== last) {
        last = text;
        input.setAttribute("placeholder", text);
      }
    }, 70);
    return () => window.clearInterval(timerRef.current);
  }, []);

  return (
    <>
      <form
        className={`rise ${styles.form}`}
        style={{ animationDelay: "1050ms" }}
        onSubmit={(event) => {
          event.preventDefault();
          showToast(comingSoon.chat);
        }}
      >
        <label htmlFor="fraga-live" className="sr-only">
          {PLACEHOLDER}
        </label>
        <input
          ref={inputRef}
          id="fraga-live"
          name="fraga"
          type="text"
          autoComplete="off"
          placeholder={PLACEHOLDER}
          onFocus={stopTyping}
          className={styles.input}
        />
        <button type="submit" className={styles.submit}>
          Fråga
        </button>
      </form>
      <div className={`rise ${styles.suggestions}`} style={{ animationDelay: "1180ms" }}>
        {suggestions.map((question) => (
          <button key={question} type="button" className={styles.suggestion} onClick={() => showToast(comingSoon.chat)}>
            {question}
          </button>
        ))}
      </div>
    </>
  );
}
