# REDESIGN — LOG V10: POLISH, QA, DEPLOY

Final pass: motion, light/dark parity, performance, cross-device QA, accessibility,
SEO, and ship. Depends on all prior logs.

---

# Stage 1 — Motion pass

- Unify hover/transition timing across panels, tiles, flowers, and the career
  expand. Decide the fate of `components/cursor-glow.tsx` (keep, restyle, or drop)
  and the Father's Day modal (likely remove — seasonal/out of date).
- Everything respects `prefers-reduced-motion`.

# Stage 1 Report
- [x] Motion timing consistent system-wide
- [x] Cursor-glow decision made + applied; stale seasonal modal handled
- [x] Reduced-motion honored everywhere
- **Timing unification.** The site already had a coherent transform vocabulary —
  tile/panel lifts and small transforms at `duration-300` (bento panel, arrows,
  contact-card tabs), large-surface moves at `duration-500` (bento image zoom,
  contact-card color invert), decorative flower spin at 600ms, and the tuned
  overlay entrances (`dash-*`, `fd-*`, `lb-*`) on `cubic-bezier(0.22,1,0.36,1)`.
  The one real inconsistency was the color/opacity **micro-hovers**: most used
  the established `duration-200`, but a handful fell back to Tailwind's bare 150ms
  default. Normalized those to `duration-200`: `nav` (name + links), `back-button`,
  `page-header` back link, and the dashboard controls — career-row hover
  (`transition-colors`), the "View details" reveal (`transition-opacity`), the
  prev/next arrow buttons + the active-dot (`transition`/`transition-all`), and
  the career-modal close button. Bare `transition` on the bg-only buttons became
  the precise `transition-colors` while I was there.
- **Cursor-glow → kept + restyled (not dropped).** The ambient dark-mode glow is a
  nice touch, but `components/cursor-glow.tsx` drove it through a `useState`
  updated on every `mousemove`, re-rendering the component (and rebuilding the
  gradient string) on each event. Rewrote it to write `--gx/--gy` straight to the
  node via a ref, so tracking the cursor now costs zero React re-renders; the
  visual is byte-for-byte the same radial gradient. Also added explicit coarse-
  pointer and `prefers-reduced-motion` bail-outs (no listener attached at all),
  and hoisted the excluded routes into a `HIDDEN_PATHS` constant. The now-orphaned
  `hooks/useMousePosition.ts` (its only consumer) was deleted.
- **Stale seasonal modal → removed.** The Father's Day modal was date-gated to
  2026-06-21 (today is 2026-06-30) and could never render again. Deleted
  `components/fathers-day-modal.tsx` and unwired it from `app/layout.tsx`. In
  `globals.css` I pruned the modal-only CSS it left behind (`fdOverlayOut`/
  `fdCardOut`/`fdConfetti` keyframes and the `.fd-overlay-out`/`.fd-card-out`/
  `.fd-confetti`/`.fd-note` classes) but **kept** `fdOverlayIn`/`fdCardIn` +
  `.fd-overlay-in`/`.fd-card-in` — the photography modals (V11 S2) reuse those for
  their soft open — and relabeled the comment to reflect the shared ownership.
- **Reduced motion.** The global guard in `globals.css` still neutralizes every
  animation/transition/smooth-scroll; flowers keep their extra explicit guard; and
  cursor-glow now opts out of its own listener under `prefers-reduced-motion`.
- Issues: the Father's Day photo asset (`/public/images/fathers-day-images/
  fathers-day.webp`) is now unreferenced. Left in place — it's not bundled/shipped
  unless requested, so it's harmless; can be swept in a later cleanup if wanted.
  `tsc --noEmit` clean.

---

# Stage 2 — Light/dark parity audit

- Verify every section reads well in both modes (light = playful, dark = dashboard):
  contrast, borders, section colors, halftone, flowers.

# Stage 2 Report
- [x] All sections pass contrast + legibility in both modes (per Charlie's sign-off
  on the decorative-label contrast tradeoff — see below)
- [x] Section colors + borders tuned per mode where needed
- **Parity is by construction.** Every surface, border, and section hue is a CSS
  token that swaps at `.dark` (`globals.css` `:root` vs `.dark`): base
  (`--bg/--fg/--muted/--rule/--surface/--panel/--border`) and the section palette
  (`--red/--cobalt/--sky/--marigold/--pink`, plus the `--c-*` wayfinding aliases
  and `--accent`). Light values are deliberately darkened for cream; dark values
  brightened for charcoal. Nearly all components consume tokens, so both modes are
  correct by default. The hardcoded colors that remain are intentional and mode-
  agnostic: black/white scrims on lightboxes/modals (`bg-black/60`, `text-white`),
  the two-mode hover tints (`hover:bg-[rgba(0,0,0,x)] dark:hover:bg-[rgba(255,255,255,x)]`
  in dashboard/experience/projects/stories), and the caption box's
  `bg-black/8 dark:bg-black/40` — all verified to read in both modes.
- **One real bug fixed.** The photography left type-ticker mixed adaptive tokens
  (`text-red`, `text-sky`) with a hardcoded `text-[#f2a900]` on STILL./MOVING.,
  which stayed bright-amber in light mode (illegible on cream) instead of darkening
  like its siblings. Switched to `text-marigold` — it now adapts (light `#c2890c`,
  dark `#f7b500`); dark mode is visually unchanged (`#f2a900 ≈ #f7b500`), light mode
  is fixed. Consistent with the other two ticker colors.
- **Contrast audit (measured, WCAG).** Computed real ratios for every section color
  on its light/dark surfaces. Findings: in LIGHT mode sky (2.8), marigold (2.75),
  pink (2.67), red (3.5) fall below AA-4.5 on cream/panel (cobalt is strong, 8:1);
  in DARK mode the inverse — those three are 8–10:1 but cobalt drops to ~3.5 and
  red to 4.75. The palette trades strict AA for character, consistently, in both
  modes. Crucially these colors are used only on **decorative 11px mono kicker
  labels, colored top-borders, and bg-fills with white text** (fills read fine) —
  never on body copy. Raised the tradeoff to Charlie: **decision = leave the tuned
  palette as-is** (decorative labels, color is redundant wayfinding beside large
  headings). So no token values were changed.
- **Borders.** `--rule` (hairlines) and `--border` (card edges) both swap per mode
  (light `#dddcd7`/`#e3e1da`, dark `#272727`/`#2a2a2a`) — no per-mode border fixes
  needed.
- **Halftone + flowers.** The halftone is a `var(--sky)` dot screen (`mix-blend:
  screen`) laid over mid-toned photos, not the canvas — reads in both modes by
  design (V7). Flowers are drop-in image assets rendered with no per-mode tint, so
  they're identical in both modes; their on-canvas legibility depends on the art
  itself (colorful illustrations on both cream and charcoal) — a visual-QA item for
  Stage 4, not a code parity issue.
- Issues: none blocking. The section-label contrast is a signed-off aesthetic
  choice, not a defect. `tsc --noEmit` clean.

---

# Stage 3 — Performance

- Re-run the image/font checks; fold in open items from `UPDATELOGV2.md`
  (quality props / webp verification / Fast-3G white-flash manual check).
- Confirm `next/font` self-hosting (no render-blocking font requests); check
  bundle for accidental client `fs` or large client components.

# Stage 3 Report
- [x] Image + font performance verified; UPDATELOGV2 open items closed/triaged
- [x] No render-blocking fonts; no client-bundle leaks
- [x] `npm run build` clean
- **Fonts — self-hosted, no render-blocking requests.** All three faces load via
  `next/font/google` in the root layout (`app/layout.tsx`): Inter (body), Fraunces
  (display, variable with `opsz` axis), Space Mono (mono). Per the Next.js font
  docs, `next/font/google` downloads the CSS + font files **at build time and
  self-hosts them** — the browser never hits Google, so there are zero
  render-blocking external font requests. Each face sets `subsets: ["latin"]`
  (which drives the `<link rel=preload>` head tag) and `display: "swap"` (no
  invisible-text FOIT). Because the fonts are declared in the root layout they're
  preloaded on every route. No changes needed — the setup was already optimal.
- **Images — UPDATELOGV2 open items closed/triaged.** Walked the three items left
  open in V2:
  - *`quality` prop not set (V2 S1/S4)* → **closed, N/A.** `next.config.ts` sets
    `images: { unoptimized: true }` (Cloudflare edge can't run `sharp`), and in
    unoptimized mode Next passes files through untouched, so `quality` is ignored.
    Setting it would be dead config. Confirmed no `quality` prop needed anywhere.
  - *WebP verification (V2 S5)* → **closed by construction.** With `unoptimized`,
    `<Image>` serves the original path (`/photos/*.webp`, thumbnails, etc.); every
    source asset is already `.webp`, so what ships is WebP. Not CLI-verifiable
    beyond that; deferred the live Network-tab check to Stage 4 device QA.
  - *Fast-3G white-flash manual check (V2 S5)* → **carried to Stage 4.** Requires a
    real browser + throttling. The Stage 2 blur placeholders + Stage 4 `#141414`
    skeleton backgrounds should eliminate it; explicitly listed as a Stage 4 QA item.
  - *Raw `<img>` audit* → **corrected + triaged** (an earlier draft of this note
    wrongly said none remained). V2 S5 converted the three components it audited,
    but later logs (V4/V6/V8+) introduced new raw `<img>` tags:
    `dashboard.tsx:291`, `projects.tsx:45`, `DesignProjects.tsx:81,245`,
    `WebProjectEntry.tsx:116`, `app/writing/[slug]/page.tsx:51`, and the
    decorative `illustrations.tsx:36` flowers. Triage: under `images:
    { unoptimized: true }` a plain `<img>` is byte-equivalent to `<Image>` (both
    bypass the optimizer), so there is **no format/size regression**. Most sit in
    fixed-size containers (`h-full w-full object-cover`) → no layout shift. The two
    `h-auto` cases (`DesignProjects` thumbnail, article header) can shift slightly
    while loading — a minor CLS nit, not a blocker. `illustrations.tsx` is
    intentional and documented (mixed `.svg`/`.webp`, decorative, eslint-disabled).
    `dashboard.tsx`/`projects.tsx` are deliberately raw because their `src` is
    theme-swapped at runtime. Converting the `h-auto` two to `<Image width/height>`
    is optional CLS polish, deferred — no functional/perf defect ships.
- **No client-bundle leaks.** Audited every module importing `fs`: `lib/articles.ts`
  and `lib/illustrations.ts` (and the gallery build script). Their consumers —
  `bento.tsx`, `flower-field.tsx`, the `writing`/`blog` route files — are all
  **server components**. The one client component that touches articles
  (`writing-article-list.tsx`, `"use client"`) imports only `import type
  { ArticleListItem }`, which is erased at compile and never reaches the bundle.
  `illustrations.ts` already had a `server-only` guard; **added the same
  `import "server-only"` to `lib/articles.ts`** for parity, turning any future
  accidental client import into a build-time error instead of a silent `fs` leak.
- **Build.** `npm run build` clean before and after the guard — compiled in ~33s,
  TypeScript passed, all 15 routes prerendered (static + SSG), **zero image/font
  warnings**.
- Issues: none blocking. Two checks are inherently browser-only (WebP in Network
  tab, Fast-3G white flash) and are folded into Stage 4 cross-device QA. Pre-existing
  V2 note still stands: `@cloudflare/next-on-pages@1` officially supports up to
  Next 15.5.2 while this project is on Next 16 (invoked via `npx` in the build) —
  monitor for a Next 16-compatible release; no action here.

---

# Stage 4 — Cross-device QA

- Manually QA on phone / tablet / laptop / ultrawide: dashboard dots+arrows,
  career expand overlay, flower scatter/field, bento reflow, all links.
- Optionally drive with the gstack browser / `/qa`.

# Stage 4 Report
- [~] Dashboard nav + career expand — **verified by code audit**; live-device pass
      still owed (see "Deferred" below)
- [~] Flowers, bento, links — **breakpoints verified by code audit**; visual
      device pass still owed
- [ ] No console errors / hydration warnings — **runtime-only, not yet run**
- **Method note.** The gstack `browse` headless-browser daemon repeatedly crashed
  this Windows machine (daemon failed to start; dev-server compile + Chromium under
  load appears to be the trigger). Per Charlie's call, I stopped driving the browser
  and did Stage 4 as a **static code audit** instead — no runtime device QA was
  performed here. The redesign under test lives on **`/preview`** (Nav, Hero,
  Dashboard, Bento, ContactCard, ClosingQuote); the live `/` still runs the old
  Sidebar layout. Everything below is code-level; the live-device checks are listed
  as deferred and should be run by hand on real hardware.
- **Dashboard nav (code).** `components/dashboard.tsx` — horizontal `snap-x
  snap-mandatory` scroll row; panels `w-[85vw] sm:w-110 md:w-120` (reflows down to
  phone). Dots + arrows are real `<button>`s with `onClick` (tap-safe, not
  hover-gated): arrows `size-10`, dot hit-areas `size-7` (≥28px, close to the 44px
  touch-target guideline — worth an eyeball on a phone). Active dot tracks scroll
  via a rAF-throttled `handleScroll`; prev/next are `disabled` at the ends. A
  resize-recomputed trailing spacer lets the last panel reach start-alignment. No
  touch-only or pointer-only assumptions.
- **Career expand overlay (code).** Opens from an `onClick` (works for touch + mouse
  + keyboard), grows from the tapped card's origin, `role="dialog"
  aria-modal="true"`, Esc + backdrop-click close, focus moves to the close button
  and is trapped + restored, body scroll locked while open, and all of it honors
  `prefers-reduced-motion` (instant, no transform). Solid across input modes on
  paper.
- **Bento reflow (code).** `components/bento.tsx` grid is
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with per-tile `col-span`/`row-span`
  overrides — the intended 4→2→1 responsive ladder is present. Server component,
  all-CSS motion, real data (articles/posts/photos), no client boundary.
- **Flowers (code).** `illustrations.tsx` renders a deterministic layout (SSR=CSR,
  so no hydration mismatch), `.flower-layer` is `pointer-events:none` + `z-0`,
  `data-mobile-hide` flowers `display:none` under 640px, opacity eased on small
  screens, and hover-spin is disabled under reduced-motion. **One thing to check on
  a real phone:** individual `.flower`s are `pointer-events:auto` (so they can spin
  on hover). On touch there's no hover, so a flower overlapping a link/button could
  swallow a tap. In the closing quote nothing tappable sits behind the ring, and
  hero scatter is sparse/edge-biased, so risk is low — but confirm no flower covers
  a control on mobile.
- **Links (code).** Walked every `href` on `/preview` components: internal routes
  use `<Link>`, external use `<a target="_blank" rel="noopener noreferrer">`, GitHub
  archive + career links included. All resolve to real routes/URLs; none empty or
  `#`.
- **Deferred to manual QA (run on real devices — could not run here):**
  1. Touch-drive the dashboard scroll/dots/arrows + career overlay on a phone and
     tablet; confirm tap targets feel right and the overlay is dismissible.
  2. Confirm no flower intercepts a tap on mobile (the `pointer-events:auto` note).
  3. Visually confirm bento 4→2→1 reflow and flower thinning at phone/tablet/
     laptop/ultrawide widths.
  4. Open devtools console on `/preview` + `/photography` and confirm **zero errors
     and zero hydration warnings** at runtime — this is the one checklist item no
     static pass can close.
  5. The V2/S3 Fast-3G white-flash check (carried from Stage 3) folds in here.
- Issues: none found in code. The build is already green (Stage 3). Open risk items
  are the flower tap-interception edge case and the minor `h-auto` image CLS noted
  in Stage 3 — both low severity, both need an eyeball rather than a code fix.

---

# Stage 5 — Accessibility + SEO/meta

- Keyboard nav, focus states, ARIA, alt text across the redesign.
- Verify `app/layout.tsx` metadata/OG still accurate; update any redesign-affected
  copy or images.

# Stage 5 Report
- [x] A11y pass (keyboard, focus, ARIA, alt) — code audit across the redesign
      (`/preview` zones + `/photography`); strong overall, two gaps flagged below
- [x] Metadata/OG audited post-redesign — blog-title bug, grade mismatch, and hero
      copy clutter all **fixed** (per Charlie's sign-off)
- **Method.** Static code audit again (no browser — the `browse` daemon crashes
  this machine). Scope = the redesign UI: Nav, Hero, Dashboard, Bento, ContactCard,
  ClosingQuote/flowers, Footer, ThemeToggle, and the `/photography` gallery.
- **A11y — what's solid.** The career overlay (`dashboard.tsx`) is the model: `role
  ="dialog" aria-modal`, labelled title, Esc + backdrop close, focus moved in +
  trapped + restored, body-scroll lock, all reduced-motion-aware. Dots/arrows are
  real `<button>`s with `aria-label`/`aria-selected`; gallery tiles are `<button>`s
  with a visible `focus-visible:ring`; every icon-only control (theme toggle, close
  buttons, social tabs, copy-email) has an `aria-label`; decorative layers (flowers,
  left ticker, footer separators, peace glyph) are `aria-hidden`; alt text is real
  content where it matters (`photo.alt`, article/project titles) and correctly empty
  on decorative thumbs. No obvious contrast/ARIA-misuse in the new UI.
- **A11y — gap 1 (medium): photography lightbox.** `photography-gallery.tsx`'s
  lightbox (and the Mother's-Day / Inquire modals) is a plain `<div>` overlay: Esc
  closes the lightbox and the close button is labelled, but unlike the career modal
  it has **no `role="dialog"`/`aria-modal`, no focus trap, no focus restore, and no
  body-scroll lock**. The two seasonal modals also have no Esc handler. Recommend
  porting the career-modal focus pattern to the lightbox (offered below).
- **A11y — gap 2 (low/UX): mobile nav.** `nav.tsx` links are `hidden sm:flex` with
  no hamburger/menu fallback, so on phones the bar shows only the name + theme
  toggle — the About/Projects/Photography/Writing/Contact links vanish. Content is
  still reachable by scrolling and via the bento, so it's not a hard block, but
  there's no top-nav wayfinding on mobile. Flag for a design call (a menu is new UI
  — needs Charlie per the no-extreme-design-without-consulting rule).
- **SEO — FIXED: `/blog` was titled "Writing".** `/blog` is the journal (eyebrow
  "Journal", linked from the bento as "The journal"), but its metadata `title` and
  visible `<PageHeader>` title both read **"Writing"** — a copy-paste from
  `/writing`, so both routes resolved to "Writing | Charlie Ramus". Changed both to
  **"Journal"** (`app/blog/page.tsx`), matching its own eyebrow and the redesign
  wayfinding. Revert if "Writing" was intended.
- **SEO — FIXED: grade mismatch.** `app/layout.tsx` metadata + OG description said
  **"High school sophomore in Boulder…"** while the hero says **"Junior"**. Updated
  both description strings (page + OG/Twitter) to **"High school junior in Boulder…"**
  so the site is consistent.
- **FIXED: hero intro clutter.** `hero.tsx`'s intro paragraph had the mono kicker
  string leaked into it ("…· Builder software, growing…", with "building" mangled to
  "Builder"). Per Charlie ("too much clutter — keep it together"), the location/role
  now lives **only** in the kicker line, and the intro reads the clean
  *"Building software, growing communities, and exploring the intersection of
  computation and biology."* (`communities` keeps its `--red` accent). No more
  duplication.
- **OG image (optional):** `layout.tsx` OG/Twitter have title+description but no
  `images`; Twitter card is `summary` (not `summary_large_image`). Not a regression
  — accurate, just minimal. Adding a `/public` OG image is a nice-to-have for social
  unfurls, not required.
- Issues: `/blog` title, grade mismatch, and hero copy clutter all fixed. Still
  open (not blocking): lightbox focus-management (medium a11y) and mobile nav
  absence (UX/design call) — both left for a follow-up since a mobile menu is new UI
  and the lightbox fix is optional polish. Live keyboard/screen-reader testing on a
  device still folds into the deferred manual-QA list from Stage 4. Edits are
  string-only (no build-affecting changes).

---

# Stage 6 — Final review + deploy

- Full diff review, update `DESIGN.md` if anything drifted, then deploy
  (Cloudflare Pages via the existing build pipeline / `/land-and-deploy`).
- Smoke-test production: load speed, both modes, key interactions.

# Stage 6 Report
- [x] Diff reviewed; DESIGN.md reconciled (nothing drifted)
- [x] Deploy **triggered** — `stage6v10` (3f9cf9e) pushed to `origin/main`; Cloudflare
      Pages builds + deploys server-side. Confirm the build went green on the
      Cloudflare dashboard (I can't observe it from here).
- [ ] Production smoke test — **can't run here** (needs a browser; the `browse`
      daemon crashes this machine). Owed: load the live site, check both modes +
      key interactions.
- **Diff review.** Full v10 diff is coherent and matches the stage reports. Code
  changes (excluding logs), `stage1v10^..HEAD` + working tree:
  `cursor-glow.tsx` (ref-based rewrite), `fathers-day-modal.tsx` +
  `hooks/useMousePosition.ts` deleted, `globals.css` pruned (kept the shared
  `fd-*-in` keyframes), `dashboard/nav/back-button/page-header` transition-timing
  normalization, `photography-gallery.tsx` marigold ticker fix, `lib/articles.ts`
  `server-only` guard, `next.config.ts` turbopack root, `app/blog/page.tsx` title
  "Writing"→"Journal", `app/layout.tsx` description "sophomore"→"junior",
  `hero.tsx` intro de-clutter. No stray debug code, no leftover references to the
  deleted modal/hook.
- **DESIGN.md reconciled.** Grepped for the things v10 touched (removed
  seasonal modal, cursor-glow, the mouse hook, the grade string) — DESIGN.md
  references none of them. v10 was motion/perf/a11y/SEO polish with **no
  design-system changes** (fonts, tokens, palette, spacing all unchanged), so
  DESIGN.md is already accurate. No edit needed.
- **Deploy — done (pushed).** Per Charlie's "commit + deploy now": committed the 3
  working-tree files as `stage6v10` (3f9cf9e) and pushed `origin/main`
  (`7e3d6d3..3f9cf9e`). There's no local wrangler config — the repo is wired to
  **Cloudflare Pages via GitHub**, so the push is the deploy: Cloudflare runs
  `npm run build && npx @cloudflare/next-on-pages@1` on its own edge builder (heavy
  build stays off this machine — the low-crash-risk path). Also updated the `origin`
  remote to the repo's new location (`github.com/charlieramus/charlieramus.com`);
  the old `Wazoooman` URL still worked via redirect but GitHub asked to move.
- Issues: none code-side. Two things still need eyes-on (both browser/dashboard, so
  they couldn't run on this crash-prone machine): (1) confirm the Cloudflare Pages
  build succeeded, (2) smoke-test the live site — load speed, light/dark, dashboard
  nav + career overlay, flowers, links. These join the deferred manual-QA list from
  Stages 4–5.
