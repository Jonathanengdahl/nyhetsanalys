import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Onest as static TTF files: the image renderer cannot use the variable WOFF2 font. */
export async function ogFonts() {
  const [regular, heavy] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/onest-latin-500.ttf")),
    readFile(join(process.cwd(), "src/fonts/onest-latin-800.ttf")),
  ]);
  return [
    { name: "Onest", data: regular, weight: 500 as const, style: "normal" as const },
    { name: "Onest", data: heavy, weight: 800 as const, style: "normal" as const },
  ];
}

export const ogSize = { width: 1200, height: 630 };
