/*
 * The symbol: two cards that overlap, like two articles read side by side.
 * One source for the shapes, used by the header logo, the share images and
 * the icons. Coordinates are in a 64 x 64 box (docs/brand/crossread-symbol.svg).
 *
 * The overlap is drawn as its own shape instead of with a clip path, so no
 * element ids are needed and the logo can appear several times on a page.
 */

export const symbol = {
  /** The part of the 64 x 64 box the cards use, with a little air. */
  viewBox: "8 2 48 60",
  width: 48,
  height: 60,
  back: { x: 10, y: 4, width: 28, height: 47, rx: 5 },
  front: { x: 25.5, y: 13, width: 28, height: 47, rx: 5 },
  /** Where the cards overlap: the front card's rounded top left, the back card's rounded bottom right. */
  overlap: "M25.5 18a5 5 0 0 1 5-5H38v33a5 5 0 0 1-5 5h-7.5z",
} as const;

export interface SymbolColours {
  back: string;
  front: string;
  overlap: string;
}

const rect = ({ x, y, width, height, rx }: (typeof symbol)["back"] | (typeof symbol)["front"], fill: string) =>
  `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}"/>`;

/** The symbol as a standalone SVG, for images that cannot use CSS variables. */
export function symbolSvg(colours: SymbolColours, size?: { width: number; height: number }): string {
  const dimensions = size ? ` width="${size.width}" height="${size.height}"` : "";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.viewBox}"${dimensions}>`,
    rect(symbol.back, colours.back),
    rect(symbol.front, colours.front),
    `<path d="${symbol.overlap}" fill="${colours.overlap}"/>`,
    "</svg>",
  ].join("");
}
