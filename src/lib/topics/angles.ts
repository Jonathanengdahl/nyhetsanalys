import type { Topic } from "./types";

/**
 * What one article has as its main focus, from the article-by-article matrix
 * (value 2). The matrix has one row per article, in the same order as
 * `topic.articles`.
 */
export function mainFocus(topic: Topic, articleIndex: number): string[] {
  const row = topic.media.matrix[articleIndex];
  if (!row) return [];
  return row.values.flatMap((value, column) => (value === 2 ? [topic.media.matrixColumns[column].full] : []));
}
