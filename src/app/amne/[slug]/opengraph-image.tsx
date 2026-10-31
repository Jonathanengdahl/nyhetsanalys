import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { ogFonts, ogSize } from "@/lib/og/fonts";
import { TopicShareImage } from "@/lib/og/images";
import { getTopic, getTopicSlugs } from "@/lib/topics";

export const alt = "Ämnet på Nyhetsanalys: rubrik, datum och vad artiklarna lyfter fram.";
export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getTopicSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Rendered once per topic and cached. Returns null for unknown topics. */
async function render(slug: string) {
  "use cache";
  const topic = await getTopic(slug);
  if (!topic) return null;
  const image = new ImageResponse(<TopicShareImage topic={topic} />, { ...ogSize, fonts: await ogFonts() });
  return new Uint8Array(await image.arrayBuffer());
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const png = await render(slug);
  if (!png) notFound();
  return new Response(png, { headers: { "Content-Type": contentType } });
}
