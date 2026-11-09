/*
 * robots.txt as in RFC 9309. We read the group for our own user agent if
 * there is one, otherwise the group for "*". The longest matching rule wins,
 * and Allow wins over Disallow when they are equally long. "*" matches any
 * characters and "$" the end of the path.
 */

type Rule = { allow: boolean; pattern: string };
type Group = { agents: string[]; rules: Rule[] };

export type RobotsRules = { groups: Group[] };

/** How to treat a robots.txt that could not be read, from the HTTP status (RFC 9309, 2.3.1). */
export function robotsFromStatus(status: number): "allow-all" | "disallow-all" | null {
  if (status >= 200 && status < 300) return null;
  // 4xx: the file is unavailable, so everything may be read. 5xx: unreachable, so nothing.
  if (status >= 400 && status < 500) return "allow-all";
  return "disallow-all";
}

export function parseRobots(text: string): RobotsRules {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (key === "user-agent") {
      // Several user-agent lines in a row share one group.
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === "allow" || key === "disallow") {
      // An empty Disallow allows everything, so it adds no rule.
      if (value === "") continue;
      current.rules.push({ allow: key === "allow", pattern: value });
    }
  }
  return { groups };
}

/** The rules that apply to us: every group naming our token, otherwise every "*" group. */
function rulesFor(robots: RobotsRules, token: string): Rule[] {
  const name = token.toLowerCase();
  const ours = robots.groups.filter((group) => group.agents.some((agent) => agent !== "*" && name.includes(agent)));
  const groups = ours.length > 0 ? ours : robots.groups.filter((group) => group.agents.includes("*"));
  return groups.flatMap((group) => group.rules);
}

const escape = (text: string) => text.replace(/[.+?^{}()|[\]\\]/g, "\\$&");

/** A robots.txt pattern as a regular expression for the start of the path. */
function patternToRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern).split("*").map(escape).join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** Decodes percent-encoded characters that do not need encoding, so "/%7Ea" and "/~a" match the same rules. */
function normalizePath(path: string): string {
  try {
    return path.replace(/%[0-9A-Fa-f]{2}/g, (code) => {
      const char = decodeURIComponent(code);
      return /[A-Za-z0-9\-._~]/.test(char) ? char : code.toUpperCase();
    });
  } catch {
    return path;
  }
}

/** Whether our user agent may fetch a path ("/rss.xml?latest") under these rules. */
export function isAllowed(robots: RobotsRules, token: string, path: string): boolean {
  if (path === "/robots.txt") return true;
  const target = normalizePath(path || "/");
  let best: Rule | null = null;
  for (const rule of rulesFor(robots, token)) {
    if (!patternToRegExp(normalizePath(rule.pattern)).test(target)) continue;
    const longer = !best || rule.pattern.length > best.pattern.length;
    const tieAllow = best && rule.pattern.length === best.pattern.length && rule.allow;
    if (longer || tieAllow) best = rule;
  }
  return best ? best.allow : true;
}
