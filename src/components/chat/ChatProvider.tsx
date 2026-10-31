"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { chatConfig } from "@/config/ai";
import type { ChatSource } from "@/lib/chat/material";
import { splitReferences } from "@/lib/chat/references";
import { comingSoon, showToast } from "@/components/ui/toast";
import styles from "./Chat.module.css";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  state: "streaming" | "done" | "error";
};

type ChatApi = {
  /** Opens the chat. With a question, it is asked right away. */
  open: (question?: string) => void;
};

const ChatContext = createContext<ChatApi | null>(null);

/** Opens the chat on this page. Outside a page with chat it explains that chat is not here. */
export function useChat(): ChatApi {
  return useContext(ChatContext) ?? { open: () => showToast(comingSoon.chat) };
}

/** Earlier questions with finished answers, sent along for follow-up questions. */
function history(messages: Message[]) {
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  messages.forEach((message, index) => {
    const answer = messages[index + 1];
    if (message.role === "user" && answer?.role === "assistant" && answer.state === "done" && answer.text) {
      turns.push({ role: "user", content: message.text }, { role: "assistant", content: answer.text });
    }
  });
  return turns.slice(-chatConfig.maxHistoryMessages);
}

function AnswerText({ text, sources }: { text: string; sources: Map<number, ChatSource> }) {
  return (
    <p className={styles.answerText}>
      {splitReferences(text).map((part, index) => {
        if (part.type === "text") return part.text;
        const source = sources.get(part.n);
        if (!source) return `[${part.n}]`;
        return source.url ? (
          <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className={styles.ref} title={`${source.name}: ${source.title}`}>
            {part.n}
            <span className="sr-only">
              , källa: {source.name} (öppnas i ny flik)
            </span>
          </a>
        ) : (
          <span key={index} className={styles.ref} title={`${source.name}: ${source.title}`}>
            {part.n}
          </span>
        );
      })}
    </p>
  );
}

/**
 * The AI chat for one page: the start page ("start") or a topic page (its
 * slug). Renders a panel that slides in from the side on large screens and
 * from below on small ones.
 */
export function ChatProvider({
  scope,
  label,
  suggestions,
  sources,
  children,
}: {
  scope: string;
  label: string;
  suggestions: string[];
  sources: ChatSource[];
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const busyRef = useRef(false);
  const nextId = useRef(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const titleId = useId();
  const inputId = useId();
  const sourceMap = useMemo(() => new Map(sources.map((source) => [source.n, source])), [sources]);

  useEffect(() => {
    messagesRef.current = messages;
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const update = useCallback((id: number, change: Partial<Message> | ((message: Message) => Partial<Message>)) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, ...(typeof change === "function" ? change(message) : change) } : message)),
    );
  }, []);

  const showDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const send = useCallback(
    async (question: string) => {
      const text = question.trim().slice(0, chatConfig.maxQuestionLength);
      if (!text || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setDraft("");

      const previous = history(messagesRef.current);
      const questionId = nextId.current++;
      const answerId = nextId.current++;
      setMessages((current) => [
        ...current,
        { id: questionId, role: "user", text, state: "done" },
        { id: answerId, role: "assistant", text: "", state: "streaming" },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scope, messages: [...previous, { role: "user", content: text }] }),
          signal: controller.signal,
        });
        const left = response.headers.get("X-Chat-Remaining");
        if (left !== null) setRemaining(Number(left));
        if (!response.ok || !response.body) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          update(answerId, { text: data?.message ?? "Något gick fel. Prova igen om en stund.", state: "error" });
          return;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          update(answerId, { text: full });
        }
        full += decoder.decode();
        update(answerId, { text: full.trim(), state: "done" });
      } catch {
        if (controller.signal.aborted) {
          update(answerId, (message) => (message.text ? { state: "done" } : { text: "Du stoppade svaret.", state: "error" }));
        } else {
          update(answerId, { text: "Det gick inte att nå chatten. Kontrollera anslutningen och prova igen.", state: "error" });
        }
      } finally {
        abortRef.current = null;
        busyRef.current = false;
        setBusy(false);
      }
    },
    [scope, update],
  );

  const open = useCallback(
    (question?: string) => {
      showDialog();
      if (question) {
        void send(question);
        logRef.current?.focus({ preventScroll: true });
      } else if (window.matchMedia("(pointer: fine)").matches) {
        // With a mouse, start in the text field. On touch screens the keyboard would hide the suggestions.
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
    },
    [send, showDialog],
  );

  // A suggestion button disappears when it is used, so keep the focus in the panel.
  const ask = useCallback(
    (question: string) => {
      void send(question);
      logRef.current?.focus({ preventScroll: true });
    },
    [send],
  );

  // A link to a topic page with #fraga opens its chat directly.
  useEffect(() => {
    if (window.location.hash !== "#fraga") return;
    showDialog();
    window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
  }, [showDialog]);

  const api = useMemo(() => ({ open }), [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void send(draft);
    }
  }

  // A click on the dimmed area outside the panel closes it.
  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  return (
    <ChatContext.Provider value={api}>
      {children}
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} data-chat onClick={onDialogClick}>
        <div className={styles.panel}>
          <div className={styles.head}>
            <div className={styles.headText}>
              <p className={`mono ${styles.kicker}`}>
                <span className={styles.orb} data-busy={busy || undefined} aria-hidden="true" />
                AI-chatt · beta
              </p>
              <h2 id={titleId} className={styles.title}>
                Fråga om {label}
              </h2>
            </div>
            <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="sr-only">Stäng chatten</span>
            </button>
          </div>
          <p className={styles.notice}>Svaren skrivs av AI och bygger bara på vårt underlag. Kontrollera gärna i källorna.</p>

          <div ref={logRef} className={styles.log} role="log" aria-live="polite" aria-busy={busy} aria-label="Samtalet" tabIndex={-1}>
            {messages.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Prova att fråga</p>
                <ul className={styles.suggestions}>
                  {suggestions.map((suggestion) => (
                    <li key={suggestion}>
                      <button type="button" className={styles.suggestion} onClick={() => ask(suggestion)}>
                        {suggestion}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((message) =>
                message.role === "user" ? (
                  <p key={message.id} className={styles.question}>
                    <span className="sr-only">Din fråga: </span>
                    {message.text}
                  </p>
                ) : (
                  <div key={message.id} className={styles.answer} data-state={message.state}>
                    <span className={`mono ${styles.aiTag}`}>AI-svar</span>
                    {message.text ? (
                      <AnswerText text={message.text} sources={sourceMap} />
                    ) : (
                      <p className={styles.thinking}>Läser underlaget…</p>
                    )}
                  </div>
                ),
              )
            )}
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <label htmlFor={inputId} className="sr-only">
              Din fråga
            </label>
            <textarea
              ref={inputRef}
              id={inputId}
              rows={1}
              maxLength={chatConfig.maxQuestionLength}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Skriv en fråga"
              className={styles.input}
            />
            {busy ? (
              <button type="button" className={styles.stop} onClick={() => abortRef.current?.abort()}>
                Stoppa
              </button>
            ) : (
              <button type="submit" className={styles.send} disabled={!draft.trim()}>
                Skicka
              </button>
            )}
          </form>
          <p className={`mono ${styles.quota}`}>
            {remaining === null
              ? `${chatConfig.questionsPerDay} frågor per dag under betan`
              : `${remaining} av ${chatConfig.questionsPerDay} frågor kvar i dag`}
          </p>
        </div>
      </dialog>
    </ChatContext.Provider>
  );
}
