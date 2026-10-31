import { ImageResponse } from "next/og";
import { ogFonts, ogSize } from "@/lib/og/fonts";
import { SiteShareImage } from "@/lib/og/images";
import { getPublishedTopics } from "@/lib/topics";

export const alt = "Nyhetsanalys: vi analyserar dagens heta nyhetsämnen och jämför hur medierna beskriver dem.";
export const size = ogSize;
export const contentType = "image/png";

/** Rendered once and cached, so the image is not drawn again for every visit. */
async function render() {
  "use cache";
  const topics = await getPublishedTopics();
  const image = new ImageResponse(<SiteShareImage topics={topics} />, { ...ogSize, fonts: await ogFonts() });
  return new Uint8Array(await image.arrayBuffer());
}

export default async function Image() {
  return new Response(await render(), { headers: { "Content-Type": contentType } });
}
