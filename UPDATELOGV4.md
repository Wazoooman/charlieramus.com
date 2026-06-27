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
- [ ] Client component renders the passed illustrations, absolutely positioned
- [ ] 180° hover spin works on each, smooth easing
- [ ] Placement deterministic (no hydration warnings)
- [ ] Adding/removing a file changes the render with no code edit
- Issues:

---

# Stage 4 — Reusable FlowerField wrapper

- Add a `FlowerField` usage pattern: server component reads paths via
  `lib/illustrations.ts` and passes them to `components/illustrations.tsx`.
- Two presets: `scatter` (sparse, for hero edges) and `field` (dense ring/grid,
  for the Log V8 closing quote).
- Make count/density capped by available assets and a `max` prop.

# Stage 4 Report
- [ ] FlowerField composes server-read + client-render cleanly
- [ ] `scatter` and `field` presets both render correctly
- [ ] Density respects asset count + `max` prop
- Issues:

---

# Stage 5 — Responsive + performance + reduced motion

- Reduce flower count and/or opacity on small screens (avoid clutter + overflow).
- `prefers-reduced-motion`: disable the spin (static, still decorative).
- Perf: `loading="lazy"` on non-hero fields, mark hero flowers non-priority,
  keep SVGs inline-cheap; ensure no layout shift.

# Stage 5 Report
- [ ] Mobile renders fewer/lighter flowers, no horizontal overflow
- [ ] Spin disabled under `prefers-reduced-motion`
- [ ] No CLS; off-screen fields lazy-load
- Issues:
