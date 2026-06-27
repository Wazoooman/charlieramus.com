# REDESIGN — LOG V7: ZONE C (VERTICAL BENTO, EXPANDED)

The "more of me" section: section-colored bento tiles that actually link to the
real routes. Expanded to 2-3x the mockup length while staying interesting (varied
sizes and rhythm, no monotony). Depends on Logs V3, V6.

---

# Stage 1 — Bento grid + section-colored tiles + real links

- Build the responsive bento grid below the dashboard on `app/page.tsx`.
- Tiles: Photography, Writing, Web Projects, Design, Gear, Contact — each in its
  section color, Fraunces title + mono label + arrow affordance.
- Wire every tile to its real route (`/photography`, `/writing`, `/web-projects`,
  `/design`, `/gear`) — no dead tiles.

# Stage 1 Report
- [x] **Bento grid renders with section-colored tiles, both modes.** New
  `components/bento.tsx` (server component) — a responsive CSS grid
  (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) below the dashboard. Each
  section tile = a `.panel` with a section-colored top rule + dot + mono
  `.label` + Fraunces `.display-sm` title + blurb + `ArrowUpRight` "Explore"
  affordance, driven by a `toneMap` keyed to the wayfinding palette
  (photography=sky `c-photo`, writing=marigold `c-writing`, web=red `c-work`,
  design=pink `c-design`, gear=orange). Added to `app/preview/page.tsx` after
  `<Dashboard />`. Verified live (browse) in dark desktop, light mobile — colors
  and dots correct in both modes, no overflow, zero console errors.
- [x] **Every tile links to its real route (verified by navigation).** Photography
  → `/photography`, Writing → `/writing`, Web Projects → `/web-projects`,
  Design → `/design`, Gear → `/gear`, latest-writing items → `/writing/<slug>`,
  Contact → `mailto:`. All routes return 200 (curl); clicking the Web Projects
  tile in `#explore` navigated to `/web-projects` (browse).
- Issues: `stories` could not be imported into the server component from
  `components/stories.tsx` ("use client" — exports become client references,
  `stories[0]` was `undefined` → SSR crash). Extracted the data to
  `data/stories.ts` (plain module); `stories.tsx` now re-exports it, and both
  `bento.tsx` and the existing importers consume the data module.

---

# Stage 2 — Expand length + keep it interesting

- Grow the section to ~2-3x: add rows mixing tile sizes (`col2`/`row2`/full-width),
  short feature blurbs, a stats strip (300k+ impressions, projects shipped), and
  pull-quotes or recent-items previews (latest writing/photos).
- Vary rhythm so scrolling stays engaging; avoid a uniform grid wall.

# Stage 2 Report
- [x] **Section is ~2-3x longer with varied tile sizes and content types.**
  Beyond the six section tiles, the grid now mixes: a large Photography anchor
  (`sm:col-span-2 sm:row-span-2`) holding a 2×2 photo preview; a wide Writing
  tile (`sm:col-span-2`) with a pull-quote of the latest essay; a paired
  Web/Design row of square tiles; a full-width **stats strip** (`lg:col-span-4`,
  4 figures in Fraunces `.display-md`); a wide **Latest writing** preview list
  (3 stories with thumbnails); a serif **pull-quote** tile; a wide **Gear**
  feature blurb; and a solid-ink **Contact** CTA tile to close. Six tile shapes,
  five content types (image grid / list / stats / quote / CTA).
- [x] **Scroll stays visually interesting (no monotonous repetition).** Rhythm
  alternates big↔small and panel↔solid: the photo-heavy anchor, a text quote
  tile, the numeric stats band as a palette cleanser, then list + quote, then
  blurb + the inverted ink contact tile. No two adjacent rows share a layout.
- [x] **Added content uses real data where available.** Photo previews =
  `photos.slice(0,4)` from `data/photos.ts` (with `blurDataURL` placeholders);
  stats `61 photographs` / `3 essays` derive from `photos.length` /
  `stories.length`; Latest-writing list + the Writing tile quote pull from
  `data/stories.ts` (real slugs/thumbnails). `300k+` impressions and `6 threads`
  are the only hardcoded figures (no dataset for them).
- Issues: Section tiles in a row stretch to the tallest sibling (CSS grid
  `items-stretch`), so the Writing/Web/Design tiles carry some bottom whitespace
  with the "Explore" arrow pinned via `mt-auto` — reads as intentional bento
  negative space; the dedicated responsive pass (Stage 5) can tighten if wanted.

---

# Stage 3 — Halftone photo treatment

- Apply the dithered/halftone motif to the photography tile (and any portrait/
  photo previews) as Charlie's signature visual, in section sky color.
- CSS-driven (dot pattern/blend) or pre-processed asset; keep it performant.

# Stage 3 Report
- [ ] Halftone treatment applied to photo tile/previews, on-brand both modes
- [ ] No performance hit (no heavy filters on large images)
- Issues:

---

# Stage 4 — Wire real redirects + content sources

- Confirm previews (latest writing/photos) pull from existing sources
  (`lib/articles.ts`, `data/photos.ts`, content dirs), not hardcoded.
- All arrows/cards/links resolve to the correct destination.

# Stage 4 Report
- [ ] Previews sourced from real content, not hardcoded
- [ ] All links/redirects resolve correctly
- Issues:

---

# Stage 5 — Responsive grid

- Collapse 4-col → 2-col → 1-col cleanly; preserve hierarchy and color coding.
- No overflow; tap targets adequate on mobile.

# Stage 5 Report
- [ ] Grid reflows 4→2→1 without breakage
- [ ] Hierarchy + section colors preserved at all sizes
- Issues:
