# REDESIGN — LOG V4: ILLUSTRATION SYSTEM (DROP-IN FLOWERS)

Build the customizable illustration system that powers the hero scatter and the
closing quote field. Goal: Charlie drops `.svg`/`.webp` files into one folder
with a fixed naming pattern and the site picks them up automatically — no code
edits. Each illustration spins 180° on hover. Depends on Log V3 tokens.

---

# Stage 1 — Asset folder + naming convention + sample assets

- Create `public/illustrations/` as the single drop-in location.
- Convention: `illustration-1.svg` … `illustration-N.svg` (or `.webp`),
  contiguous numbering, mixed formats allowed. Target 7-10 variants.
- Add a short `public/illustrations/README.md` documenting the rule (naming,
  supported formats, recommended ~square aspect, transparent background).
- Seed with placeholder flower SVGs so the system is testable before final art.

# Stage 1 Report
- [x] `public/illustrations/` created with seed assets — 8 placeholder flowers
  (`illustration-1.svg`…`illustration-6.svg`, `illustration-7.webp`,
  `illustration-8.webp`), procedurally generated from the DESIGN.md palette
  (ink outlines, transparent bg, ~square 200/400px), varied petal counts/colors.
- [x] Naming convention documented in folder README
  (`public/illustrations/README.md`: naming rule, supported formats, square
  aspect, transparent bg, palette guidance, 7–10 target).
- [x] Both `.svg` and `.webp` confirmed present and loadable — SVGs render as
  flowers; `.webp` files produced via `sharp` (density 300 → 400×400, q90) and
  visually verified (valid transparent WebP).
- Issues: none. `sharp` already present in `node_modules` (Next image opt), so
  no new dependency. Generator was a one-off script (run + removed), not checked in.

---

# Stage 2 — Build-time folder read (server util)

- Add `lib/illustrations.ts`: a server-only helper that reads
  `public/illustrations/` at build with `fs.readdirSync`, filters to
  `.svg`/`.webp`, sorts numerically, and returns public paths
  (`/illustrations/illustration-1.svg`).
- Return `[]` gracefully if the folder is empty (no crash, no flowers).
- Call only from server components so `fs` never ships to the client.

# Stage 2 Report
- [x] `lib/illustrations.ts` reads + filters + numerically sorts the folder —
  `getIllustrationPaths()` uses `fs.readdirSync`, filters by
  `/^illustration-(\d+)\.(svg|webp)$/i`, sorts on the numeric `<n>` (not string,
  so `illustration-10` sorts after `-9`), returns `/illustrations/...` paths.
  Verified output: 1.svg…6.svg then 7.webp, 8.webp in order.
- [x] Empty/missing folder returns `[]` without error — `readdirSync` wrapped in
  try/catch; missing dir → `[]`. Verified against a non-existent folder.
- [x] `fs` access stays server-side (no client bundle leakage) — file starts with
  `import "server-only"` (Next 16 provides this internally + type decls, no npm
  install needed), so importing it into a client component is a build-time error.
- Issues: none. `npx tsc --noEmit` clean.

---

# Stage 3 — Scatter + hover-spin client component

- Add `components/illustrations.tsx` (`"use client"`): receives the path list as
  a prop, renders each as `next/image` (or inline `<img>` for SVG) absolutely
  positioned.
- 180° hover spin: `transition: transform .6s cubic-bezier(.22,1,.36,1)`,
  `:hover { transform: rotate(180deg) }` (+ optional slight scale).
- Positions: accept a `layout` prop (preset position arrays) so hero and quote
  field can place flowers differently; deterministic placement so SSR/CSR match
  (no hydration mismatch — no `Math.random()` at render).

# Stage 3 Report
- [x] Client component renders the passed illustrations, absolutely positioned —
  `components/illustrations.tsx` (`"use client"`) renders each placement as an
  `<img>` (handles mixed `.svg`/`.webp`; `next.config` is `unoptimized`, so plain
  `<img>` ≈ `next/image` here) inside an absolute `.flower-layer`. Verified live:
  26 flowers across 2 layers, each absolutely positioned.
- [x] 180° hover spin works on each, smooth easing — CSS `.flower` rests at
  `rotate(var(--flower-rot))`, `:hover` → `rotate(calc(... + 180deg)) scale(1.06)`
  with `transition: transform .6s cubic-bezier(.22,1,.36,1)`. Verified: a flower
  resting at -8° settled to `matrix(-1.05,.15,-.15,-1.05)` on hover = rotate(172°)
  × 1.06. Layer is `pointer-events:none`, flowers `pointer-events:auto` so only
  the flower reacts.
- [x] Placement deterministic (no hydration warnings) — positions come from
  `components/flower-layouts.ts` (pure data + index math, no `Math.random()`).
  Browser console clean, zero hydration warnings.
- [x] Adding/removing a file changes the render with no code edit — paths are read
  from the folder (Stage 2) and cycle by index, so file count drives the render.
- Issues: `@next/next/no-img-element` lint suppressed inline (decorative,
  pre-optimized, mixed formats) — intentional, eslint clean.

---

# Stage 4 — Reusable FlowerField wrapper

- Add a `FlowerField` usage pattern: server component reads paths via
  `lib/illustrations.ts` and passes them to `components/illustrations.tsx`.
- Two presets: `scatter` (sparse, for hero edges) and `field` (dense ring/grid,
  for the Log V8 closing quote).
- Make count/density capped by available assets and a `max` prop.

# Stage 4 Report
- [x] FlowerField composes server-read + client-render cleanly —
  `components/flower-field.tsx` (server) calls `getIllustrationPaths()`, picks a
  preset, and passes paths + placements to client `<Illustrations>`. `fs` stays
  server-side; returns `null` when there are no assets.
- [x] `scatter` and `field` presets both render correctly — verified on a throwaway
  route: `scatter` (8 sparse flowers hugging the hero edges, clear of the headline)
  and `field` (18-flower deterministic ring around a centred quote). Temp route
  removed after verification.
- [x] Density respects asset count + `max` prop — `cap = min(preset.length,
  max ?? preset.length, assets × MAX_REPEAT)`. The `max` prop hard-caps count; the
  `assets × 3` term keeps a tiny asset set from carpeting a dense preset.
- Issues: none. `npm run build` clean (exit 0); no flowertest route shipped.

---

# Stage 5 — Responsive + performance + reduced motion

- Reduce flower count and/or opacity on small screens (avoid clutter + overflow).
- `prefers-reduced-motion`: disable the spin (static, still decorative).
- Perf: `loading="lazy"` on non-hero fields, mark hero flowers non-priority,
  keep SVGs inline-cheap; ensure no layout shift.

# Stage 5 Report
- [x] Mobile renders fewer/lighter flowers, no horizontal overflow — `@media
  (max-width: 640px)` hides `[data-mobile-hide]` flowers and drops flower opacity
  to .85. Verified at 375×812: 13 of 26 flowers shown, `scrollWidth === clientWidth
  === 375` (no overflow). `.flower-layer` is `overflow: hidden` so nothing spills.
- [x] Spin disabled under `prefers-reduced-motion` — `@media (prefers-reduced-
  motion: reduce)` sets `.flower { transition: none }` and `.flower:hover {
  transform: rotate(var(--flower-rot)) }` (rest tilt kept, no 180° spin),
  complementing the existing global motion guard.
- [x] No CLS; off-screen fields lazy-load — flowers are absolutely positioned in an
  `inset:0` layer (out of flow → no layout shift), with explicit `width`/`height`.
  Images use `loading="lazy"` (verified `loading=lazy` in DOM); hero is left
  non-priority by default (`priority` defaults `false`).
- Issues: headless Chromium reported `prefers-reduced-motion: false`, so the
  disabled-spin path was confirmed by the matched CSS rule rather than live
  emulation. Rule is a standard media query; behavior is deterministic.
