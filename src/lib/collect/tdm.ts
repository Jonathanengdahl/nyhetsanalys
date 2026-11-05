/*
 * Reservations against text and data mining (TDMRep). A site can reserve its
 * rights in an HTTP header on each response, or for the whole site in
 * /.well-known/tdmrep.json. The header is more specific and wins over the
 * file. The file uses robots.txt path matching, so the most specific location
 * that matches applies. Without a reservation mining is allowed by default
 * (EU directive 2019/790, article 4), but we also stop at anything unclear.
 */

type TdmRule = { location: string; reserved: boolean };

/** "1" means reserved, "0" not reserved. Anything else counts as not set. */
export function reservationFromHeader(value: string | null): boolean | null {
  const text = value?.trim();
  if (text === "1") return true;
  if (text === "0") return false;
  return null;
}

/** Reads tdmrep.json. Invalid files give no rules, so the header and robots.txt still decide. */
export function parseTdmRep(json: unknown): TdmRule[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const location = (entry as { location?: unknown }).location;
    const reservation = (entry as { "tdm-reservation"?: unknown })["tdm-reservation"];
    if (typeof location !== "string" || (reservation !== 1 && reservation !== 0)) return [];
    return [{ location, reserved: reservation === 1 }];
  });
}

const escape = (text: string) => text.replace(/[.+?^{}()|[\]\\]/g, "\\$&");

function matches(location: string, path: string): boolean {
  const anchored = location.endsWith("$");
  const body = (anchored ? location.slice(0, -1) : location).split("*").map(escape).join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`).test(path);
}

/** Whether the site-wide file reserves a path. The longest matching location wins, and reserved wins a tie. */
export function reservedByFile(rules: TdmRule[], path: string): boolean | null {
  let best: TdmRule | null = null;
  for (const rule of rules) {
    if (!matches(rule.location, path)) continue;
    if (!best || rule.location.length > best.location.length || (rule.location.length === best.location.length && rule.reserved)) {
      best = rule;
    }
  }
  return best ? best.reserved : null;
}

/** The final answer for one response: the header if it is set, otherwise the file. */
export function isReserved(header: boolean | null, file: boolean | null): boolean {
  return header ?? file ?? false;
}
