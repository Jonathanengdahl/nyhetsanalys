import type { FaqItem } from "@/lib/topics/types";

/** A ready chat answer from Frågor och svar: the answer followed by its source numbers, the way the chat writes them. */
export const readyAnswer = (item: FaqItem) => `${item.answer} ${item.sources.map((n) => `[${n}]`).join("")}`.trim();
