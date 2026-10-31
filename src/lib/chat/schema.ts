import { z } from "zod";
import { chatConfig } from "@/config/ai";

const message = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(chatConfig.maxAnswerLength),
});

/** What the chat panel sends: where the reader is, and the conversation so far. */
export const chatRequestSchema = z.object({
  scope: z
    .string()
    .trim()
    .regex(/^(start|[a-z0-9]+(-[a-z0-9]+)*)$/),
  messages: z
    .array(message)
    .min(1)
    .max(20)
    .refine((messages) => messages.at(-1)?.role === "user", { error: "Sista meddelandet ska vara en fråga." })
    .refine((messages) => (messages.at(-1)?.content.length ?? 0) <= chatConfig.maxQuestionLength, {
      error: `Frågan får vara högst ${chatConfig.maxQuestionLength} tecken.`,
    }),
});

export type ChatRequest = z.output<typeof chatRequestSchema>;

/**
 * The messages sent to the model: the latest ones only, starting with a
 * question and ending with the reader's new question.
 */
export function trimHistory(messages: ChatRequest["messages"]) {
  let recent = messages.slice(-chatConfig.maxHistoryMessages);
  while (recent.length > 1 && recent[0].role !== "user") recent = recent.slice(1);
  return recent.map(({ role, content }) => ({ role, content }));
}
