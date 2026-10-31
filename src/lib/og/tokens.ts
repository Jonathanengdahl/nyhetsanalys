import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Design tokens for the share images. The image renderer cannot read CSS
 * variables, so the values are read from src/styles/tokens.css at build time.
 * The design is still changed in one place.
 */

let cache: Record<string, string> | null = null;

function tokens(): Record<string, string> {
  if (cache) return cache;
  const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");
  const values: Record<string, string> = {};
  // Only the first :root block, the default (light) values.
  const root = css.slice(css.indexOf(":root"), css.indexOf("}", css.indexOf(":root")));
  for (const match of root.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) values[match[1]] = match[2].trim();
  cache = values;
  return values;
}

/** The value of a token, following var(--other) references. */
export function token(name: string): string {
  const all = tokens();
  let value = all[name];
  for (let depth = 0; value?.startsWith("var(") && depth < 5; depth += 1) {
    value = all[value.slice(4, -1).split(",")[0].trim()];
  }
  if (!value) throw new Error(`Unknown design token ${name}`);
  return value;
}
