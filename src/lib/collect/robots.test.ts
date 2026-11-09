import { describe, expect, it } from "vitest";
import { isAllowed, parseRobots, robotsFromStatus } from "./robots";

const BOT = "NyhetsanalysBot";

describe("robots.txt", () => {
  it("uses the group for everyone when there is no group for us", () => {
    const robots = parseRobots("User-agent: *\nDisallow: /privat/\nAllow: /privat/oppet\n");
    expect(isAllowed(robots, BOT, "/rss.xml")).toBe(true);
    expect(isAllowed(robots, BOT, "/privat/sida")).toBe(false);
    expect(isAllowed(robots, BOT, "/privat/oppet")).toBe(true);
  });

  it("follows our own group instead of the one for everyone", () => {
    const robots = parseRobots("User-agent: *\nDisallow: /\n\nUser-agent: nyhetsanalysbot\nAllow: /rss\n");
    expect(isAllowed(robots, BOT, "/rss/nyheter")).toBe(true);
    expect(isAllowed(robots, BOT, "/artikel/1")).toBe(true);
    expect(isAllowed(parseRobots("User-agent: NyhetsanalysBot\nDisallow: /\n"), BOT, "/rss")).toBe(false);
  });

  it("lets several user agents share a group, and ignores comments", () => {
    const robots = parseRobots("# kommentar\nUser-agent: GPTBot\nUser-agent: NyhetsanalysBot # vi\nDisallow: /feed\n\nUser-agent: *\nDisallow:\n");
    expect(isAllowed(robots, BOT, "/feed/articles.rss")).toBe(false);
    expect(isAllowed(robots, "AnnanBot", "/feed/articles.rss")).toBe(true);
  });

  it("lets the longest rule win, and Allow win a tie", () => {
    const robots = parseRobots("User-agent: *\nDisallow: /rss\nAllow: /rss/nyheter\nDisallow: /a\nAllow: /a\n");
    expect(isAllowed(robots, BOT, "/rss/sport")).toBe(false);
    expect(isAllowed(robots, BOT, "/rss/nyheter.xml")).toBe(true);
    expect(isAllowed(robots, BOT, "/a")).toBe(true);
  });

  it("understands * and $", () => {
    const robots = parseRobots("User-agent: *\nDisallow: /*.xml$\nDisallow: /*?latest\n");
    expect(isAllowed(robots, BOT, "/rss.xml")).toBe(false);
    expect(isAllowed(robots, BOT, "/rss.xml?x=1")).toBe(true);
    expect(isAllowed(robots, BOT, "/rss?latest")).toBe(false);
  });

  it("treats a missing file as allowed and an unreachable one as not allowed", () => {
    expect(robotsFromStatus(200)).toBeNull();
    expect(robotsFromStatus(404)).toBe("allow-all");
    expect(robotsFromStatus(403)).toBe("allow-all");
    expect(robotsFromStatus(503)).toBe("disallow-all");
  });

  it("always allows robots.txt itself", () => {
    expect(isAllowed(parseRobots("User-agent: *\nDisallow: /\n"), BOT, "/robots.txt")).toBe(true);
  });
});
