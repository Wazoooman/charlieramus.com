/**
 * sync-gallery.mjs
 *
 * One command to process the gallery. For every entry in
 * public/photos/gallery.json it will:
 *   1. Auto-downscale the full image to MAX_FULL px on the long edge (in place)
 *      so a stray full-res export can never crash iOS Safari again.
 *   2. Generate a small grid thumbnail (MAX_THUMB px) in public/photos/thumbs/.
 *   3. Generate a blur placeholder via plaiceholder.
 *   4. Write data/photos.ts.
 *
 * To add photos: drop the .webp into public/photos/, add a line to
 * gallery.json ({ "file": "...", "caption": "..." }), then run:
 *   npm run sync-gallery
 *
 * The thumbnails and any resizing are handled for you.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { imageSize } from "image-size";
import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";

// Long edge caps. Full = lightbox quality; thumb = grid quality.
// The grid renders each photo ~150-380px wide, so 600px covers retina.
const MAX_FULL = 2048;
const MAX_THUMB = 600;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const photosDir = join(root, "public", "photos");
const thumbsDir = join(photosDir, "thumbs");
const galleryPath = join(photosDir, "gallery.json");
const outputPath = join(root, "data", "photos.ts");

mkdirSync(thumbsDir, { recursive: true });

const entries = JSON.parse(readFileSync(galleryPath, "utf8"));

let downscaled = 0;
let thumbed = 0;

const photos = await Promise.all(
  entries.map(async (entry, i) => {
    const code = String(i + 1).padStart(4, "0");
    const fullPath = join(photosDir, entry.file);
    const thumbPath = join(thumbsDir, entry.file);

    let ratio = 1.5;
    let blurDataURL = null;
    let hasThumb = false;

    try {
      let buf = readFileSync(fullPath);
      let { width, height } = imageSize(buf);

      // 1. Guard: downscale the full image in place if it's too big.
      if (Math.max(width, height) > MAX_FULL) {
        buf = await sharp(buf)
          .resize({ width: MAX_FULL, height: MAX_FULL, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
        writeFileSync(fullPath, buf);
        ({ width, height } = imageSize(buf));
        downscaled++;
        console.log(`  ↓ Downscaled ${entry.file} to ${width}x${height}`);
      }

      ratio = Math.round((width / height) * 1000) / 1000;

      // 2. Thumbnail for the grid (regenerated every run, cheap).
      try {
        await sharp(buf)
          .resize({ width: MAX_THUMB, height: MAX_THUMB, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 72 })
          .toFile(thumbPath);
        hasThumb = true;
        thumbed++;
      } catch {
        console.warn(`  ⚠ Could not generate thumbnail for ${entry.file}`);
      }

      // 3. Blur placeholder.
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
      thumb: hasThumb ? `/photos/thumbs/${entry.file}` : `/photos/${entry.file}`,
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
    `thumb: ${JSON.stringify(p.thumb)}`,
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
  thumb: string;
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
console.log(
  `✓ Synced ${photos.length} photos → data/photos.ts ` +
    `(${thumbed} thumbnails, ${downscaled} downscaled)`
);
