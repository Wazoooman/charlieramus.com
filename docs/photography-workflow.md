# Adding Photos to the Photography Page

This is the complete, start-to-finish process for getting a photo onto
`charlieramus.com/photography` — from the original export off your camera, to
the WebP file, to the live grid and lightbox.

There are three stages:

1. **Export & convert** the photo to WebP
2. **Drop it in** and register it in `gallery.json`
3. **Sync the gallery** with one command

That's it. The sync step handles thumbnails, resizing, blur placeholders, and
the data file for you.

---

## Stage 1 — Export and convert to WebP

The site serves every photo as `.webp`. WebP gives near-lossless quality at a
fraction of the file size of JPEG/PNG, which keeps the page fast.

### Option A — Export straight to WebP from Lightroom (recommended)

1. In Lightroom, select your edited photo.
2. **File → Export** (or right-click → Export → Export…).
3. Under **File Settings**, set **Image Format → WebP**.
4. Set **Quality** to around **82–90**. (Higher than 90 bloats the file with
   no visible gain.)
5. Under **Image Sizing**, you can leave the full resolution — the sync script
   will automatically shrink anything larger than 2048px on the long edge.
6. Export to a folder you can find easily (e.g. your Desktop).

### Option B — Convert an existing JPEG/PNG to WebP

If you already have a finished JPEG or PNG, convert it with either:

- **Squoosh** (free, browser, no install): go to <https://squoosh.app>, drag
  your image in, pick **WebP** on the right, set quality ~85, and download.
- **cwebp** (command line): `cwebp -q 85 input.jpg -o output.webp`

### Naming the file

Use a clear, lowercase, no-spaces filename. The existing convention is:

```
YYYYMMDD-CAMERAID_WebP.webp        e.g. 20260412-IMGL5331-2_WebP.webp
```

Spaces and odd characters can break the URL, so stick to letters, numbers,
hyphens, and underscores.

---

## Stage 2 — Drop it in and register it

### 2a. Move the file

Put your finished `.webp` into:

```
public/photos/
```

That's the only folder you touch. **Do not** create or edit anything in
`public/photos/thumbs/` — those are generated for you in Stage 3.

### 2b. Add one line to `gallery.json`

Open [`public/photos/gallery.json`](../public/photos/gallery.json). It's a
plain list of photos. Add one entry for your new file:

```json
{ "file": "20260412-IMGL5331-2_WebP.webp", "caption": "Colorful coastal buildings in Reykjavik, Iceland" }
```

- **`file`** — must match the filename you dropped into `public/photos/`,
  exactly (including capitalization).
- **`caption`** — the description shown in the lightbox and used as the image's
  alt text. Write a real sentence; it helps accessibility and SEO.

**Order matters.** Photos appear on the page in the same order they're listed in
this file. Put new entries wherever you want them to show up. The first few
entries load with priority, so put your strongest shots near the top.

> ⚠️ JSON is picky: every entry except the last needs a trailing comma, and
> quotes must be straight `"` not curly `"`. If the sync command errors, a
> misplaced comma or quote is almost always the cause.

---

## Stage 3 — Sync the gallery

From the project root, run:

```bash
npm run sync-gallery
```

This single command does everything:

| Step | What it does |
|------|--------------|
| **Downscale guard** | Any full image larger than 2048px on the long edge is shrunk in place (WebP q82). This is what keeps the page from crashing phones. |
| **Thumbnail** | A small 600px grid thumbnail is generated into `public/photos/thumbs/`. The grid loads these instead of the full image, so the page stays light. |
| **Blur placeholder** | A tiny blurred preview is generated so images fade in gracefully instead of popping. |
| **Data file** | [`data/photos.ts`](../data/photos.ts) is regenerated from `gallery.json`. |

When it finishes you'll see something like:

```
✓ Synced 54 photos → data/photos.ts (54 thumbnails, 0 downscaled)
```

You never edit `data/photos.ts` by hand — it's auto-generated and overwritten
every run.

---

## Stage 4 — Preview and ship

### Preview locally

```bash
npm run dev
```

Open <http://localhost:3000/photography> and check that your photo shows up in
the grid and opens full-size in the lightbox.

### Commit and deploy

The new full image **and** its generated thumbnail both need to be committed,
or the photo will break in production:

```bash
git add public/photos/ data/photos.ts
git commit -m "Add new photography: <short description>"
git push
```

The site deploys automatically from `main` via Cloudflare Pages.

---

## Quick reference

Adding one photo, start to finish:

```bash
# 1. Export to WebP (Lightroom or Squoosh) and name it cleanly.
# 2. Move the .webp into public/photos/
# 3. Add a line to public/photos/gallery.json:
#      { "file": "your-file.webp", "caption": "..." }
# 4. Sync:
npm run sync-gallery
# 5. Commit:
git add public/photos/ data/photos.ts
git commit -m "Add new photography"
git push
```

---

## How it fits together (the "why")

The grid and the lightbox load **different** versions of each photo:

- **Grid** → the small thumbnail from `public/photos/thumbs/` (~600px). With
  50+ photos on screen, loading full-resolution images would exhaust a phone's
  memory and crash the tab. Thumbnails keep the whole grid light.
- **Lightbox** → the full image from `public/photos/` (up to 2048px). Only one
  is loaded at a time, when you click a photo, so full quality is safe here.

`gallery.json` is the **only** file you edit by hand. Everything else —
`data/photos.ts`, the thumbnails, the blur placeholders, the resizing — is
produced by `npm run sync-gallery`. That's why the workflow stays just: drop,
add a line, sync.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `sync-gallery` errors with a JSON message | Check `gallery.json` for a missing/extra comma or a curly quote. |
| Photo missing from the page | Filename in `gallery.json` doesn't match the file in `public/photos/` exactly (check capitalization). |
| `⚠ Could not read <file>` warning | The file isn't a valid image, or isn't in `public/photos/`. |
| Photo broken in production but fine locally | You forgot to `git add public/photos/thumbs/` — commit the whole `public/photos/` folder. |
| Page feels slow / crashes on phone | Re-run `npm run sync-gallery`; the downscale guard will shrink any oversized full image. |
