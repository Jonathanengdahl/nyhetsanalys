export type AnswerPart = { type: "text"; text: string } | { type: "ref"; n: number };

/** Splits an answer into text and source references like [2], so references can become links. */
export function splitReferences(answer: string): AnswerPart[] {
  const parts: AnswerPart[] = [];
  for (const piece of answer.split(/(\[\d{1,3}\])/)) {
    if (!piece) continue;
    const match = piece.match(/^\[(\d{1,3})\]$/);
    if (match) parts.push({ type: "ref", n: Number(match[1]) });
    else parts.push({ type: "text", text: piece });
  }
  return parts;
}
