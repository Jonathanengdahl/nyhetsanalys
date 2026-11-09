import { describe, expect, it } from "vitest";
import { FeedParseError, parseFeed } from "./feed";
import { canonicalUrl, cleanText, fingerprint, parseDate, shortLead } from "./normalize";

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>SVT Nyheter</title>
    <link>https://www.svt.se/</link>
    <item>
      <title>Riksbanken höjer räntan &amp; kronan stärks</title>
      <link>https://www.svt.se/nyheter/ekonomi/riksbanken?utm_source=rss#top</link>
      <guid isPermaLink="false">abc-1</guid>
      <pubDate>Wed, 04 Nov 2026 09:30:00 +0100</pubDate>
      <description><![CDATA[<p>Styrräntan höjs till <b>2 procent</b>.</p>]]></description>
      <content:encoded><![CDATA[<p>HELA ARTIKELN SOM VI ALDRIG FÅR SPARA</p>]]></content:encoded>
    </item>
    <item>
      <title>2026</title>
      <link>https://www.svt.se/nyheter/2026</link>
      <dc:date>2026-11-04T10:00:00Z</dc:date>
    </item>
    <item><title>Utan länk</title></item>
  </channel>
</rss>`;

const atom = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Ledare</title>
  <entry>
    <title type="html">Budgeten &amp;ndash; en ledare</title>
    <link rel="self" href="https://example.se/self"/>
    <link rel="alternate" href="https://example.se/ledare/1"/>
    <id>urn:1</id>
    <updated>2026-11-04T08:00:00+01:00</updated>
    <summary>Kort om budgeten.</summary>
  </entry>
</feed>`;

describe("feeds", () => {
  it("reads RSS without the full text, and keeps numbers as text", () => {
    const items = parseFeed(rss);
    expect(items).toHaveLength(2);
    expect(items[0]).toEqual({
      title: "Riksbanken höjer räntan & kronan stärks",
      link: "https://www.svt.se/nyheter/ekonomi/riksbanken?utm_source=rss#top",
      guid: "abc-1",
      published: "Wed, 04 Nov 2026 09:30:00 +0100",
      summary: "<p>Styrräntan höjs till <b>2 procent</b>.</p>",
    });
    expect(JSON.stringify(items)).not.toContain("HELA ARTIKELN");
    expect(items[1].title).toBe("2026");
    expect(items[1].published).toBe("2026-11-04T10:00:00Z");
  });

  it("reads Atom and picks the alternate link", () => {
    const [entry] = parseFeed(atom);
    expect(entry.link).toBe("https://example.se/ledare/1");
    expect(entry.published).toBe("2026-11-04T08:00:00+01:00");
    expect(cleanText(entry.title)).toBe("Budgeten – en ledare");
  });

  it("refuses what is not a feed", () => {
    expect(() => parseFeed("<html><body>Hej</body></html>")).toThrow(FeedParseError);
  });
});

describe("cleaning", () => {
  it("removes tracking parameters and fragments from addresses", () => {
    expect(canonicalUrl("https://WWW.SVT.se/a?utm_source=rss&id=3&fbclid=x#top")).toBe("https://www.svt.se/a?id=3");
    expect(canonicalUrl("javascript:alert(1)")).toBeNull();
    expect(canonicalUrl("inte en adress")).toBeNull();
  });

  it("turns HTML into plain text", () => {
    expect(cleanText("<p>Styrräntan höjs till <b>2&nbsp;procent</b>.</p><script>x()</script>")).toBe("Styrräntan höjs till 2 procent.");
    expect(cleanText(undefined)).toBe("");
  });

  it("cuts long leads at a word", () => {
    const lead = shortLead("Riksbanken höjer styrräntan till två procent efter att inflationen har stigit i flera månader i rad.", 50);
    expect(lead).toBe("Riksbanken höjer styrräntan till två procent efter …");
    expect(shortLead("Kort.", 50)).toBe("Kort.");
    expect(shortLead("  ", 50)).toBeNull();
  });

  it("gives the same text from two outlets the same fingerprint", () => {
    const tt = fingerprint("Riksbanken höjer räntan", "Styrräntan höjs till 2 procent, meddelar Riksbanken.");
    expect(fingerprint("RIKSBANKEN HÖJER RÄNTAN!", "Styrräntan höjs till 2 procent – meddelar Riksbanken")).toBe(tt);
    expect(fingerprint("Riksbanken sänker räntan", "Styrräntan sänks.")).not.toBe(tt);
  });

  it("reads the date formats feeds use", () => {
    expect(parseDate("Wed, 04 Nov 2026 09:30:00 +0100")).toBe("2026-11-04T08:30:00.000Z");
    expect(parseDate("2026-11-04T08:00:00+01:00")).toBe("2026-11-04T07:00:00.000Z");
    expect(parseDate("igår")).toBeNull();
  });
});
