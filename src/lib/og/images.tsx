import "server-only";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";
import type { Topic } from "@/lib/topics/types";
import { token } from "./tokens";

/*
 * Share images (1200 x 630), drawn with the same tokens as the site. The
 * renderer (Satori) only knows flexbox and plain colours, so every box with
 * several children is a flex box and colours are given as hex or rgba.
 */

function rgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function Frame({ children }: { children: ReactNode }) {
  const accent = token("--color-accent");
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "56px 72px",
        backgroundColor: token("--color-bg"),
        backgroundImage: `radial-gradient(circle at 12% 0%, ${rgba(accent, 0.18)}, transparent 45%), radial-gradient(circle at 95% 10%, ${rgba(token("--series-1"), 0.14)}, transparent 40%), radial-gradient(circle at 60% 110%, ${rgba(token("--series-5"), 0.12)}, transparent 45%)`,
        color: token("--color-ink"),
        fontFamily: "Onest",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ width: 34, height: 8, borderRadius: 4, backgroundColor: token("--logo-1") }} />
          <div style={{ width: 25, height: 8, borderRadius: 4, backgroundColor: token("--logo-2") }} />
          <div style={{ width: 16, height: 8, borderRadius: 4, backgroundColor: token("--logo-3") }} />
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.6 }}>{site.name}</div>
        <div
          style={{
            display: "flex",
            padding: "4px 14px",
            border: `2px solid ${token("--color-line-strong")}`,
            borderRadius: 999,
            color: token("--color-ink-3"),
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          {site.beta.label}
        </div>
      </div>
      {children}
    </div>
  );
}

/** The share image of a topic: title, summary, date and what the articles focus on. */
export function TopicShareImage({ topic }: { topic: Topic }) {
  const frames = [...topic.media.frames].sort((a, b) => b.weight - a.weight);
  const series = [1, 2, 3, 4, 5, 6].map((n) => token(`--series-${n}`));
  const accent = token(`--color-${topic.accent}`);
  return (
    <Frame>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 52, color: token("--color-ink-3"), fontSize: 24, fontWeight: 500 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: accent }} />
        <div style={{ display: "flex" }}>{`${topic.card.tags.join(", ")} · ${topic.status}`}</div>
      </div>
      <div style={{ display: "flex", marginTop: 14, fontSize: topic.title.length > 26 ? 76 : 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1.02 }}>
        {topic.title}
      </div>
      <div style={{ display: "flex", marginTop: 22, maxWidth: 980, color: token("--color-ink-2"), fontSize: 30, fontWeight: 500, lineHeight: 1.35 }}>
        {topic.card.summary}
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: token("--color-ink-3"), fontSize: 22, fontWeight: 500 }}>
          <div style={{ display: "flex" }}>Det här lyfter artiklarna fram</div>
          <div style={{ display: "flex" }}>{`${formatDate(topic.updatedAt)} · ${topic.counts}`}</div>
        </div>
        <div style={{ display: "flex", width: "100%", height: 18, gap: 4 }}>
          {frames
            .filter((frame) => frame.weight > 0)
            .map((frame, index) => (
              <div key={frame.name} style={{ flexGrow: frame.weight, height: 18, borderRadius: 6, backgroundColor: series[index % series.length] }} />
            ))}
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 22, fontWeight: 500, color: token("--color-ink-2") }}>
          {frames.slice(0, 3).map((frame, index) => (
            <div key={frame.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: series[index % series.length] }} />
              <div style={{ display: "flex" }}>{`${frame.percent} % ${frame.name}`}</div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** The share image of the site: what we do and today's topics. */
export function SiteShareImage({ topics }: { topics: Topic[] }) {
  return (
    <Frame>
      <div style={{ display: "flex", marginTop: 44, fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.02, maxWidth: 900 }}>
        {site.shortDescription}
      </div>
      <div style={{ display: "flex", marginTop: 22, maxWidth: 900, color: token("--color-ink-2"), fontSize: 30, fontWeight: 500, lineHeight: 1.35 }}>
        Vi jämför hur medierna beskriver samma händelse och visar vad som saknas. Neutralt och alltid med källor.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40 }}>
        {topics.slice(0, 4).map((topic) => (
          <div
            key={topic.slug}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 22px",
              border: `2px solid ${token("--color-line")}`,
              borderRadius: 999,
              backgroundColor: token("--color-bg"),
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: token(`--color-${topic.accent}`) }} />
            {topic.title}
          </div>
        ))}
      </div>
    </Frame>
  );
}
