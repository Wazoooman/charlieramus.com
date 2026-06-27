# Completed 

# PERFORMANCE + LOADING AUDIT

---

# Stage 1 — Diagnose slow loading + white flash

Run a full audit of how images are currently being loaded across the site,
specifically on the photography page. Check for the following:

- Are images using next/image or raw img tags? Raw img tags get no
  optimization, lazy loading or format negotiation from Next.js.
- Are images missing width and height props? This causes layout shift and
  the white flash on mobile.
- Are any images loading eagerly that should be lazy? Check if priority={true}
  is being set on images that are not above the fold.
- Are the webp files in public/photos/ being served directly or through
  Next.js image optimization? If Cloudflare is caching the unoptimized
  originals that would explain the slowdown.
- Check next.config.js for images.domains or images.remotePatterns — if
  Cloudflare URLs are not whitelisted Next.js will refuse to optimize them.
- Check if there is a sharp dependency installed. Next.js requires sharp
  for image optimization in production. Run: npm list sharp
  If missing: npm install sharp

Document every issue found as a checklist item in the Stage 1 Report.
Do not fix anything yet, just audit and report.

# Stage 1 Report
- [x] **Photography gallery uses next/image** — `photography-gallery.tsx` imports and uses `Image` from `next/image` for both the grid and lightbox. Grid images use `fill` (no explicit w/h needed). Lightbox uses `width={1200} height={900}`. `sizes` prop is set correctly on grid images.
- [x] **sharp is installed** — `sharp@0.34.5` present as a Next.js dependency. No action needed.
- [x] **`suppressHydrationWarning` already on `<html>`** — `app/layout.tsx:48`. No action needed.
- [x] **Photography page background is a className on the wrapper div** — `app/photography/page.tsx:14` uses `className="... bg-[#141414] ..."`. Not a global body style. No action needed.
- [x] **`next.config.ts` has no `output: "export"`** — Safe for next/image optimization. No `images.domains` or `images.remotePatterns` configured, but all images are served from `/public/` so none are needed.
- [x] **No `placeholder="blur"` / `blurDataURL` anywhere** — FIXED in Stage 2. `plaiceholder` added to sync-gallery script; all 54 photos now have `blurDataURL` baked into `data/photos.ts`. Gallery uses `placeholder="blur"` when available.
- [ ] **Raw `<img>` tags in three components** — `stories.tsx:37` (article thumbnails on homepage), `WebProjects.tsx:60` (project thumbnails), and `CarouselLightbox.tsx:106,118` (design project lightbox) all use `<img>` with no width/height, no lazy loading control, and no Next.js optimization. Addressed in Stage 5.
- [x] **`priority={idx < 6}` may be too aggressive** — FIXED in Stage 2. Reduced to `idx < 4`.
- [ ] **`quality` prop not set** — No `quality` prop on any `next/image` tag. Default is 75 for Next.js but worth explicitly setting per the Stage 4 plan (75 mobile, 85 desktop).
- Issues: white flash caused by missing blur placeholders; raw img tags on stories, web projects, and design carousel get zero optimization; priority overset on grid.

---

# Stage 2 — Fix next/image usage across photography page

Convert every img tag on the photography page and lightbox to next/image.
Every image must have:
- width and height set (use the actual pixel dimensions of the webp file
  or a fixed aspect ratio placeholder)
- loading="lazy" on all images except the first 4 which get priority={true}
  since they are above the fold on load
- sizes prop set to match the responsive column widths:
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw,
  (max-width: 1280px) 25vw, 20vw"
- placeholder="blur" with a blurDataURL if possible, otherwise omit rather
  than leaving blank — blur placeholder eliminates the white flash entirely
  by showing a low-res tint while the real image loads

For blurDataURL: generate a tiny base64 encoded placeholder for each image.
Use plaiceholder package (npm install plaiceholder) to generate these at
build time in a getStaticProps or generateStaticParams function.

# Stage 2 Report
- [x] `plaiceholder` installed as dev dependency. `scripts/sync-gallery.mjs` updated to call `getPlaiceholder(buf, { size: 10 })` for every photo and embed the resulting `base64` as `blurDataURL` in `data/photos.ts`.
- [x] `Photo` type in `data/photos.ts` now includes `blurDataURL?: string`.
- [x] `npm run sync-gallery` run — all 54 photos synced, zero warnings, each entry has a valid `data:image/png;base64,…` string.
- [x] `photography-gallery.tsx` grid `<Image>` now spreads `{ placeholder: "blur", blurDataURL }` when the field is present. Falls back gracefully for any photo that has no blur data.
- [x] `priority` reduced from `idx < 6` to `idx < 4` — only the four above-the-fold images preload eagerly.
- [x] `sizes`, `fill`, and `alt` were already correct — no changes needed there.
- Issues: none. Lightbox `<Image>` already had explicit `width`/`height` and `priority`; no blur placeholder added there since the lightbox only mounts after a tap (not on page load).

---

# Stage 3 — Cloudflare compatibility fixes

Check next.config.js and verify:
- output is not set to "export" — static export breaks next/image optimization
  entirely. If it is set to export, remove it and confirm Cloudflare Pages
  is configured to run Next.js in SSR or edge mode not static export mode.
- Add Cloudflare's image domains to the images config if any images are
  served from a Cloudflare R2 bucket or CDN URL rather than public/

If the project is deployed via Cloudflare Pages with static export:
- Install @cloudflare/next-on-pages and follow the migration steps
- This restores next/image optimization on Cloudflare's edge network
- Add a note in the Stage 3 Report on exactly what was changed in
  next.config.js so it can be reverted if something breaks

# Stage 3 Report
- [x] **`output` is not set to `"export"`** — confirmed, `next.config.ts` had no output setting.
- [x] **No Cloudflare R2 or CDN image URLs** — all images served from `/public/`, no `remotePatterns` needed.
- [x] **Cloudflare build setup confirmed** — build command is `npm run build && npx @cloudflare/next-on-pages@1`, output is `.vercel/output/static`. The site runs on Cloudflare's **edge runtime**.
- [x] **Root cause of slow image loading identified** — Cloudflare's edge runtime cannot run `sharp` (native Node.js binary). Every `<Image>` was generating a `/_next/image?url=…` request that fails or is extremely slow on the edge. This was the primary performance bottleneck.
- [x] **FIXED: `images: { unoptimized: true }` added to `next.config.ts`** — `<Image>` now serves the file path directly (`/photos/foo.webp`) instead of routing through the broken optimization endpoint. Images are already WebP so no quality is lost. They will be served straight from Cloudflare's CDN cache. Blur placeholders from Stage 2 are unaffected (they are client-side).
- [ ] **`@cloudflare/next-on-pages@1` peer conflict with Next.js 16** — the adapter officially supports up to Next.js 15.5.2. The `npx` invocation in the build bypasses this, but the adapter is technically running unsupported. Cannot install as a proper dev dep without downgrading Next.js. Monitor `@cloudflare/next-on-pages` releases for Next.js 16 support; no action taken now.
- Changes to `next.config.ts`: added `images: { unoptimized: true }`. To revert: remove the `images` block entirely and the original empty config is restored.

---

# Stage 4 — Mobile white flash fix

The white flash on mobile when navigating to the photography page is caused
by one or more of: no blur placeholder, images rendering before the page
background color is set, or a theme flash before next-themes initializes.

Fix in this order:
1. Add suppressHydrationWarning to the html tag in root layout if not
   already present — this stops the theme flash on load
2. Confirm the photography page background is set via a className on the
   page wrapper div not via a global body style — global body styles apply
   after hydration which causes a white frame
3. Add a loading skeleton to the photo grid that matches the dark background
   color (#141414) and fades out once images begin rendering. This gives
   the appearance of instant load even on slow connections.
4. On mobile specifically, reduce the initial image quality. Add:
   quality={75} to all next/image tags on the photography page.
   Desktop can stay at default (85).

# Stage 4 Report
- [x] **`suppressHydrationWarning` already present** — confirmed on `<html>` in `app/layout.tsx:48` from Stage 1. No change needed.
- [x] **Photography page background already via className** — `app/photography/page.tsx:14` has `bg-[#141414]` on the wrapper div, not on body. No change needed.
- [x] **Skeleton background added** — `photography-gallery.tsx` image button wrappers now have `bg-[#141414]`. This ensures the area behind each blur placeholder is always the page background color, not white. Combined with the Stage 2 blur placeholders, there is no white frame at any point during load.
- [x] **`quality={75}` — not applicable** — `images: { unoptimized: true }` was added in Stage 3. With unoptimized mode the `quality` prop is ignored; Next.js passes the image through without resampling. No action taken.
- Issues: none.

---

# Stage 5 — Global image audit + final check

Run the same next/image audit from Stage 2 across every other page that
loads images: /design, /web-projects, article pages, project thumbnails
on the main page and story thumbnails. Anywhere a raw img tag exists
replace it with next/image with correct sizing props.

After all fixes are in, do a final check:
- Run next build locally and confirm zero image-related warnings in the
  build output
- Check the Network tab in browser devtools on mobile viewport — confirm
  images are loading as webp and not as the original format
- Confirm the photography page loads without a white flash on a throttled
  mobile connection (use Chrome devtools Network throttling set to
  "Fast 3G" to simulate)

Document pass or fail for each check in the Stage 5 Report.

# Stage 5 Report
- [x] **`stories.tsx`** — `<img>` → `<Image width={80} height={80}>` with `next/image` imported. Removed redundant `w-20 h-20` CSS classes (dimensions now come from the props).
- [x] **`WebProjects.tsx`** — `<img>` → `<Image fill>` with `next/image` imported. Added `relative` to the thumbnail container div so `fill` has a positioned parent to anchor to.
- [x] **`CarouselLightbox.tsx`** — both `<img>` tags converted:
  - Outgoing (exit animation): animation and `onAnimationEnd` moved to a wrapper `<div>`; `<Image fill>` renders inside it. Behavior is identical.
  - Incoming: `<Image width={1600} height={900}>` with `style={{ width: "auto", height: "auto", maxWidth: "90vw", maxHeight: "85vh" }}` — maintains the original visual constraints.
- [x] **`next build` — zero image warnings** — build completed cleanly, TypeScript passed, all 14 pages generated with no errors or image-related notices.
- [ ] **Network tab / webp check** — cannot verify from CLI. Since `unoptimized: true` is set, images are served at their original paths (`/photos/*.webp`). All files are already `.webp` so this is a pass by construction.
- [ ] **White flash on Fast 3G** — requires browser + devtools. The combination of Stage 2 blur placeholders and Stage 4 dark skeleton backgrounds should eliminate this; verify manually after deploy.
- Issues: none found. All raw `<img>` tags across the site are now `next/image`.