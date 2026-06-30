# REDESIGN — LOG V9: SUBPAGES RESKIN

Bring every secondary route into the new system so the site is consistent end to
end: photography, writing/blog, web-projects, design, gear. Depends on Logs V3-V8.

---

# Stage 1 — Shared page chrome

- Restyle `components/back-button.tsx` and the per-page headers to the new tokens
  + mono labels / Fraunces titles.
- Ensure the restyled top bar (V5) and theme toggle work on every route.

# Stage 1 Report
- [x] **Back button + page headers restyled consistently.** New shared
  `components/page-header.tsx` (server component) is the single header for every
  secondary route: a mono back link (Space Mono micro-label + lucide `ArrowLeft`,
  matching the V5 nav link style), a mono `.label` eyebrow, a Fraunces
  `display-lg` title, and an optional subtitle. It is fully token-driven and
  takes `eyebrow`/`title`/`subtitle`/`backHref`/`backLabel` (plus an optional
  `accent` CSS color the per-section stages V9 S2-S4 will pass to tint the
  eyebrow). Wired into all six index/portfolio pages — `app/photography`,
  `app/writing`, `app/blog`, `app/web-projects`, `app/design`, `app/gear` —
  replacing six different ad-hoc back links (some `← Home` text, some
  `ArrowLeft + Back`, mismatched sizes/colors) and six mismatched titles
  (`text-4xl font-bold`, `text-2xl`, even an inline-styled Inter h1 on gear)
  with one Fraunces system. `components/back-button.tsx` (the runtime-dynamic
  article back link, used by `app/writing/[slug]`) was restyled to the same mono
  chrome while keeping its `articleReferrer` Home/Writing logic; the
  `app/blog/[slug]` inline back link got the same mono treatment. Verified
  (browse): on `/photography` and `/gear` the title computes
  `font-family: Fraunces`, the eyebrow renders ("Gallery" / "Photography"), and
  gear's back link points to `/photography` labeled "Photography".
- [x] **Top bar / theme toggle functional on all subpages.** `<Nav />` (the V5
  top bar) now renders on every secondary route (the six index pages plus
  `app/writing/[slug]` and `app/blog/[slug]`), each page padded `pt-24` to clear
  the fixed `h-14` bar. Nav's section links were switched from same-page hashes
  (`#about`) to absolute (`/#about`) so they wayfind back to the homepage from
  any route. The theme toggle was already global (mounted in `app/layout.tsx`),
  but it did nothing on `/photography`, `/design`, `/gear`, which were hardcoded
  to `#141414`/`#f4f3ee`/`#717171` and stuck dark — those are now `bg-bg`/
  `text-fg`/`text-muted`, so the toggle actually drives them. Verified (browse):
  on `/photography`, `nav.fixed` is visible, and toggling theme flips
  `<html>` dark→light with `main` background switching `rgb(20,20,20)` →
  `rgb(244,243,238)` (the `--bg` token in each mode). All six routes return 200;
  `/writing/article-one` and `/blog/building-this-portfolio` return 200 with the
  fixed nav present. `tsc --noEmit` clean.
- Issues: none blocking. Scope held to chrome — the inner content components
  (photography gallery, project/design/gear lists, article bodies) are untouched
  and remain Stages 2-4. Two known deferrals surfaced: the gallery's dark
  skeleton still hardcodes `bg-[#141414]` (V2 perf placeholder, intentionally
  left for Stage 2), and the blog list/title still use the non-existent
  `text-foreground` utility (pre-existing; Stage 3 reskins blog content). The
  eyebrow copy ("Gallery", "Essays & Notes", "Journal", "Selected Builds",
  "Visual Work", "Kit") is editable in one line at each page's `<PageHeader>`
  call site.

---

# Stage 2 — Photography page

- Reskin `app/photography/page.tsx` + `photography-gallery.tsx` to the new palette
  (sky section color), apply halftone accent where fitting.
- Preserve all the V2 performance work (next/image, blur placeholders, dark
  skeleton, `unoptimized` Cloudflare fix) — do not regress loading.

# Stage 2 Report
- [ ] Photography gallery reskinned (palette + halftone), lightbox intact
- [ ] V2 image performance preserved (no white flash / slow-load regression)
- Issues:

---

# Stage 3 — Writing + blog article styling

- Update `.article-body` usage and `app/writing` + `app/blog` (incl. `[slug]`) to
  Fraunces headings + serif body, new link/quote/code styles, marigold accent.
- Verify MDX rendering (`next-mdx-remote`) still works.

# Stage 3 Report
- [ ] Writing/blog index + article pages reskinned, readable long-form
- [ ] MDX renders correctly; code/quote/list styles intact
- Issues:

---

# Stage 4 — Web-projects, design, gear pages

- Reskin `app/web-projects`, `app/design`, `app/gear` and their components
  (`WebProjects.tsx`, `WebProjectEntry.tsx`, `DesignProjects.tsx`,
  `CarouselLightbox.tsx`, `GearList.tsx`) to section colors (red/pink/cobalt).
- Keep the carousel/lightbox behavior; restyle only.

# Stage 4 Report
- [ ] Web-projects / design / gear reskinned to section colors
- [ ] Carousel + lightbox behavior preserved
- Issues:

---

# Stage 5 — Cross-page consistency pass

- Audit spacing, type scale, color usage, and motion across all routes for a
  single coherent system. Fix one-offs and drift.

# Stage 5 Report
- [ ] Spacing/type/color/motion consistent across every route
- [ ] No leftover old-style components or stray tokens
- Issues:
