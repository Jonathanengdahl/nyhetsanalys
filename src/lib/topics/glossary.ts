const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A pattern for a glossary word. Only the first letter ignores case, so
 * "talman" also finds "Talmannen", while "KPI" never finds "KPIF". A word can
 * continue with small letters ("talman" in "talmannen") but never sits inside
 * another word.
 */
export function glossaryPattern(word: string, flags = ""): RegExp {
  const first = word.charAt(0);
  const head = first.toLowerCase() === first.toUpperCase() ? escape(first) : `[${first.toLowerCase()}${first.toUpperCase()}]`;
  return new RegExp(`(?<![\\p{L}\\p{N}])${head}${escape(word.slice(1))}\\p{Ll}*(?![\\p{L}\\p{N}])`, `u${flags}`);
}
