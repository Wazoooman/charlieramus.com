/**
 * sync-gallery.mjs
 *
 * Reads public/photos/gallery.json, measures each image, generates a
 * blur placeholder via plaiceholder, and writes data/photos.ts.
 *
 * Run with: npm run sync-gallery
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { imageSize } from "image-size";
import { getPlaiceholder } from "plaiceholder";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const photosDir = join(root, "public", "photos");
const galleryPath = join(photosDir, "gallery.json");
const outputPath = join(root, "data", "photos.ts");

const entries = JSON.parse(readFileSync(galleryPath, "utf8"));

const photos = await Promise.all(
  entries.map(async (entry, i) => {
    const code = String(i + 1).padStart(4, "0");
    const imgPath = join(photosDir, entry.file);

    let ratio = 1.5;
    let blurDataURL = null;

    try {
      const buf = readFileSync(imgPath);
      const { width, height } = imageSize(buf);
      ratio = Math.round((width / height) * 1000) / 1000;

      try {
        const { base64 } = await getPlaiceholder(buf, { size: 10 });
        blurDataURL = base64;
      } catch {
        console.warn(`  ⚠ Could not generate blur for ${entry.file}`);
      }
    } catch {
      console.warn(`  ⚠ Could not read ${entry.file} — defaulting to ratio 1.5`);
    }

    return {
      src: `/photos/${entry.file}`,
      alt: entry.caption,
      ratio,
      code,
      caption: entry.caption,
      blurDataURL,
    };
  })
);

const lines = photos.map((p) => {
  const parts = [
    `src: ${JSON.stringify(p.src)}`,
    `alt: ${JSON.stringify(p.alt)}`,
    `ratio: ${p.ratio}`,
    `placeholder: false`,
    `code: ${JSON.stringify(p.code)}`,
    `caption: ${JSON.stringify(p.caption)}`,
  ];
  if (p.blurDataURL) parts.push(`blurDataURL: ${JSON.stringify(p.blurDataURL)}`);
  return `  { ${parts.join(", ")} }`;
});

const output = `// AUTO-GENERATED — do not edit directly.
// Edit public/photos/gallery.json, then run: npm run sync-gallery

export type Photo = {
  src: string;
  alt: string;
  ratio: number;
  placeholder: boolean;
  caption?: string;
  code?: string;
  blurDataURL?: string;
};

export const photos: Photo[] = [
${lines.join(",\n")}
];
`;

writeFileSync(outputPath, output, "utf8");
console.log(`✓ Synced ${photos.length} photos → data/photos.ts`);
