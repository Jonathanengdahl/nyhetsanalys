/*
 * Keeping secrets out of logs. An error from a library can carry the value
 * that caused it, for example a malformed API key in a header, and logs are
 * read by more people and kept longer than environment variables.
 */

const SECRET_PATTERNS: RegExp[] = [
  /sk-ant-[A-Za-z0-9_-]+/g, // Claude API keys
  /sb_secret_[A-Za-z0-9_-]+/g, // Supabase secret keys
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+/g, // JSON web tokens
  /(Bearer\s+)[^\s"']+/gi,
];

/** The text with every key, token and bearer value replaced by a marker. */
export function redactSecrets(text: string): string {
  return SECRET_PATTERNS.reduce(
    (result, pattern) => result.replace(pattern, (_whole, prefix?: string) => `${typeof prefix === "string" ? prefix : ""}[dold]`),
    text,
  );
}

/** An error as one line that is safe to log. */
export function safeErrorMessage(error: unknown, max = 300): string {
  const text = error instanceof Error ? error.message : String(error);
  return redactSecrets(text).replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Whether a value looks like a Claude API key: starts with sk-ant- and has no
 * spaces or line breaks. Catches the common mistake of pasting a whole code
 * example, or a key with text around it, into the environment variable.
 */
export function looksLikeAnthropicKey(value: string): boolean {
  return /^sk-ant-[A-Za-z0-9_-]{20,}$/.test(value);
}
