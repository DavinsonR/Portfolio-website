import fs from "node:fs";
import path from "node:path";
import type { PbiPageId } from "./powerbi-model";

export type Shot = { src: string; width: number; height: number };

/** A report page's screenshot, if the file exists at build time.
 *
 *  The pages prerender (`generateStaticParams`), so this runs once in
 *  `next build`, never in the browser. A static `import` of the PNG would
 *  break the build while the file is missing — the exact opposite of the
 *  contract: the page must look finished with or without the picture, the
 *  way the hero works without a photograph. The IHDR read gives the real
 *  width and height, so the image reserves its box and nothing shifts. */
export function reportShot(page: PbiPageId): Shot | null {
  const file = path.join(process.cwd(), "public", "powerbi", `${page}.png`);
  if (!fs.existsSync(file)) return null;
  const head = Buffer.alloc(24);
  const fd = fs.openSync(file, "r");
  try {
    fs.readSync(fd, head, 0, 24, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (head.toString("ascii", 1, 4) !== "PNG") return null;
  return { src: `/powerbi/${page}.png`, width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}
