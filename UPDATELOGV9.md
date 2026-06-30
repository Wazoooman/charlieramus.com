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
- [x] **Photography gallery reskinned (sky palette), lightbox intact.**
  `components/photography-gallery.tsx` now wears the sky section color. (The V7
  halftone "dotted" dot-screen was applied first, then **removed at Charlie's
  request** — he likes the blue, not the dots; the dotted-motif decision is
  deferred to the end-of-V9 brainstorm / UPDATELOGV11.) Sky is applied across
  the page's accents: the floating Inquire button went from an orange `#FA5B1C`
  rounded rect to a mono pill (`border-sky/50 bg-bg/70 backdrop-blur`, Space Mono
  uppercase `text-sky`) matching the V5 toggle/nav; the lightbox photo-code chip
  is now `text-sky` mono; the footer line is a mono `.label` and the Gear List
  link is a sky mono link (`Gear List →`). All the hardcoded neutrals
  (`text-neutral-*`) became tokens. Each tile is a `group` and the thumbnail has
  a subtle `group-hover:scale-[1.03]` zoom plus a sky `focus-visible` ring. The
  lightbox is unchanged in behavior — verified (browse): clicking a tile opens
  it, the full image loads (`naturalWidth 1366`, `complete`), the `#0001`-style
  code chip computes `rgb(47,156,201)` (= `--sky`), the Hide/Show description
  toggle works, and Escape closes it.
- [x] **V2 image performance preserved (no white flash / slow-load regression).**
  Every V2 mechanism is intact: `next/image` with `fill`, `sizes` per the
  responsive masonry breakpoints, `priority` on the first 4 tiles, and the blur
  placeholders (`placeholder="blur"` + per-photo `blurDataURL`) — the spread
  that applies them was kept verbatim. `unoptimized: true` in `next.config`
  (the Cloudflare optimizer fix) is untouched. The "dark skeleton" that prevents
  the white flash is now the `bg-surface` token instead of a hardcoded
  `#141414`/`bg-neutral-800`: it stays dark (`#1e1e1e`) in dark mode AND becomes
  cream (`#eaeae5`) in light mode, so the no-white-flash guarantee now holds in
  both themes the page supports post-V9-S1 (rather than flashing a dark box on
  the cream light-mode page). Verified (browse): thumbnails and the lightbox
  image report `complete=true` with real `naturalWidth`, no console errors
  (only the pre-existing gear-image aspect-ratio warnings, which are Stage 4),
  and the gallery renders cleanly in both light and dark at 1280.
- Issues: none. The halftone dot-screen was tried then removed per Charlie's
  feedback (no extreme design choices without consulting) — revisit at end of V9
  in UPDATELOGV11. Two deliberate non-changes: the Mother's Day and Inquire
  modals keep their bespoke white-card styling (personal/contact cards, not
  gallery chrome — out of scope), and the lightbox overlay stays `bg-black/80`
  with light neutral caption text since it is always a dark viewing surface
  regardless of theme.

---

# Stage 3 — Writing + blog article styling

- Update `.article-body` usage and `app/writing` + `app/blog` (incl. `[slug]`) to
  Fraunces headings + serif body, new link/quote/code styles, marigold accent.
- Verify MDX rendering (`next-mdx-remote`) still works.

# Stage 3 Report
- [x] **Writing/blog index + article pages reskinned, readable long-form.**
  Marigold (`--c-writing`) is now the writing section accent end to end, applied
  as palette work only (no new motifs per Charlie's note). `.article-body` in
  globals.css: links went from `--accent` to `--c-writing` with a quiet 40%
  marigold underline that fills in on hover (`text-underline-offset: 2px`), and
  the blockquote rule is a 3px marigold left border — body stays Georgia serif
  17px/1.8 with Fraunces headings (unchanged). Article titles are now Fraunces:
  `app/writing/[slug]` and `app/blog/[slug]` h1 went from `text-[2rem] font-bold`
  / `text-2xl font-semibold` to `display-md`, and their author/date meta is the
  mono `.label`. `app/blog/[slug]` now wraps `{post.content}` in
  `.article-body` (it previously had none), and the dead `prose text-base
  text-foreground` wrapper in `lib/posts.tsx` was dropped so the shared rules
  drive it. The two index pages carry the marigold accent: `PageHeader` gets
  `accent="var(--marigold)"` (eyebrow tints marigold) and the article/post list
  hover went from `text-accent` to `text-marigold` (in `writing-article-list.tsx`
  and `app/blog/page.tsx`); blog's invalid `text-foreground` tokens were fixed to
  `text-fg`. Verified (browse): writing index eyebrow computes `rgb(247,181,0)`
  (= `--marigold` dark); a probe link in `.article-body` resolves to
  `rgb(247,181,0)` underlined and a blockquote border to the same.
- [x] **MDX renders correctly; code/quote/list styles intact.**
  `next-mdx-remote/rsc` still renders `app/writing/[slug]` — `article-one`
  returns 200 with the `.article-body` wrapper computing Georgia serif and 12
  `<p>` nodes from the MDX source. Blog content (inline JSX) now flows through
  the same `.article-body`: on `building-this-portfolio` the `<h2>`s compute
  `font-family: Fraunces` and inline `<code>` keeps its `--surface` background
  (`rgb(30,30,30)` dark). Code/pre, ordered/unordered list, and quote rules in
  `.article-body` are untouched except the marigold accent swap. All four routes
  (`/writing`, `/blog`, `/writing/article-one`, `/blog/building-this-portfolio`)
  return 200; `tsc --noEmit` clean.
- Issues: none. No MDX article currently contains a link or blockquote, so the
  marigold body-link/quote styles were verified via injected probe elements
  rather than real content. The blog still has a single hardcoded post in
  `lib/posts.tsx` (not MDX) — left as data, only its stale wrapper classes were
  removed.

---

# Stage 4 — Web-projects, design, gear pages

- Reskin `app/web-projects`, `app/design`, `app/gear` and their components
  (`WebProjects.tsx`, `WebProjectEntry.tsx`, `DesignProjects.tsx`,
  `CarouselLightbox.tsx`, `GearList.tsx`) to section colors (red/pink/cobalt).
- Keep the carousel/lightbox behavior; restyle only.

# Stage 4 Report
- [x] **Web-projects / design / gear reskinned to section colors.** Each page got
  its section hue via `PageHeader accent` plus matching interactive accents, with
  all hardcoded hex swapped for tokens (palette work only, no new motifs).
  **Web-projects → red (`--red`/c-work):** eyebrow red, project names now Fraunces
  `display-sm`, the live-site URL link is `text-red`, and skill pills went from
  `bg-rule text-[#3d3d3d] dark:text-[#c4c4c4]` to neutral `bg-surface text-muted`
  (`components/WebProjectEntry.tsx`). **Design → pink (`--pink`/c-design):** eyebrow
  pink, project titles Fraunces `display-sm`, date is the mono `.label`,
  description/`hr` tokenized (`text-muted`/`border-rule`), and the inline carousel
  arrows are `text-muted hover:text-pink` (`components/DesignProjects.tsx`).
  **Gear → cobalt (`--cobalt`/c-experience):** eyebrow cobalt, the category
  headers ("Camera Bodies", …) are now the mono `.label` over a `bg-rule` hairline,
  item names `text-fg`, notes `text-muted`, and the external-link arrow is
  `text-muted hover:text-cobalt` (`components/GearList.tsx`). The dead
  `components/WebProjects.tsx` (not imported anywhere — the page uses
  `WebProjectEntry`'s default export) was tokenized + red for consistency.
  Verified (browse): eyebrows compute `rgb(242,58,46)` red / `rgb(245,143,181)`
  pink / `rgb(79,97,232)` cobalt, the web URL link is red, titles are Fraunces,
  gear category labels are Space Mono.
- [x] **Carousel + lightbox behavior preserved.** No logic touched in
  `CarouselLightbox.tsx` or the `DesignProjects` inline `Carousel` (clone
  bookends, keyboard/touch nav, enter/exit animations, body-scroll lock all
  intact). The shared `CarouselLightbox` stays a neutral dark overlay
  (`rgba(0,0,0,0.85)`, white controls) — correct since it serves both the red and
  pink sections, so it gets no single section tint. The one functional fix:
  `DesignProjects`' carousel side-ombres were hardcoded `from-[#141414]` (a dark
  fade that would smear across the cream page in light mode) and are now `from-bg`
  so they track the theme; the page arrows likewise moved off `text-white/40` to
  theme-safe `text-muted`. Verified (browse): clicking a design slide and a
  web-projects screenshot both open the lightbox (`Close lightbox` present),
  `ArrowRight` navigates to a freshly loaded image (`naturalWidth 1920`,
  `complete`), and Escape closes. `tsc --noEmit` clean; `/web-projects`,
  `/design`, `/gear` all 200; screenshots reviewed.
- Issues: none. `components/WebProjects.tsx` remains dead code (kept, not deleted —
  removal is out of scope for a reskin); flag for a future cleanup. The Next.js
  dev-mode indicator badge in screenshots is local-only.

---

# Stage 5 — Cross-page consistency pass

- Audit spacing, type scale, color usage, and motion across all routes for a
  single coherent system. Fix one-offs and drift.

# Stage 5 Report
- [x] **Spacing/type/color/motion consistent across every route.** Audited all
  eight subpage routes. **Spacing:** every subpage `main` clears the fixed nav
  with a uniform `pt-24` (the only other `pt-` is a list-item `first:pt-0` reset).
  **Type:** one ladder everywhere — `display-lg` page titles (PageHeader),
  `display-md` article titles, `display-sm` project/design entry names, mono
  `.label` eyebrows/meta/category headers, Georgia `.article-body` for long-form.
  **Color:** each section owns one hue applied the same way (eyebrow + interactive
  accents) — photography sky, writing marigold, web red, design pink, gear cobalt
  — all via tokens; the only remaining hardcoded hex are the two bespoke modal
  cards and the always-dark lightbox overlays (intentional, see below).
  **Motion:** transitions stay in the 150–500ms micro-interaction band and the
  global `prefers-reduced-motion` guard in globals.css covers every route. Two
  real drifts between the sibling writing/blog routes were fixed: the reading
  column is now `max-w-2xl` on all four writing+blog pages (was `max-w-170`/680px
  on writing, `max-w-2xl`/672px on blog), and the blog index list now matches the
  writing list (`divide-rule`, `py-6` — was `divide-border`, `py-8`). Verified
  (browse): all 8 routes return the fixed nav, Fraunces `h1` (photography
  correctly has none — Charlie removed its header), and zero console errors;
  design's carousel ombre now resolves `from-bg` to `rgb(244,243,238)` in light
  mode (no dark smear).
- [x] **No leftover old-style components or stray tokens.** Within V9's scope (the
  subpages and their components) there are no stray legacy tokens: the invalid
  `text-foreground`/`prose` from the blog were fixed in Stage 3, and all
  `text-neutral-*` / hardcoded grays in the gallery, project, design, and gear
  components were tokenized in Stages 2 and 4. The lightbox caption/description
  text keeps fixed light neutrals on purpose — those sit on the permanent
  `bg-black/80` viewing overlay, so theme-aware tokens would go unreadable in
  light mode (same rationale as the white lightbox controls).
- Issues: a few `text-accent`/`text-foreground` usages remain in **homepage**
  components (`contact.tsx`, `writing-section.tsx`, `dashboard.tsx`, `bento.tsx`,
  etc.) — these belong to the V3–V8 homepage zones, are not rendered on any V9
  subpage route, and were left untouched to respect stage scope (`text-accent`
  there is the intended global accent; `text-foreground` is a pre-existing
  homepage bug). The two photography modals (Mother's Day / Inquire) keep their
  bespoke light "greeting-card" styling rather than tokens — converting them is a
  visual/design decision, so it is deferred to the end-of-V9 brainstorm
  (UPDATELOGV11) alongside the dotted-motif question. `components/WebProjects.tsx`
  is dead code, flagged for future deletion.
