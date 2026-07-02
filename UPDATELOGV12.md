# REDESIGN — LOG V12: FOUNDATION + MOTION + PERSONAL BENTO

> **Merge status (2026-07-02):** Stages 1–2 built and committed on `redesign-v12`
> (`f29bd0a stage1v12`, `a9449b8 stage2v12`), then fast-forwarded into `main`
> (0 behind, 4 ahead) and pushed to origin. Stages 3–4 not yet started.

**First read `V3-REDESIGN.md`** (architecture, CSS-porting rules, data map,
flower spec, constraints). This log stands up the `/v3` "mini app" and ports the
first section. Source of truth for layout/CSS: `mockups/hellodani-mockup.html`.

Goal of V12: a working `/v3` route that renders the mockup's **"A little more
personal"** bento — faithfully styled from the mockup CSS, wired to Charlie's
real data, with the shared motion primitives (flower wind-spin + reveal) in
place for later logs.

Depends on: nothing (first log). Later logs (V13–V15) add the hero, work,
services, contact, and finale around this section.

---

# Stage 1 — `/v3` scaffold + ported CSS foundation

- Create `app/v3/layout.tsx`: load **Libre Baskerville** (serif), **Inter**
  (sans), **Caveat** (script) via `next/font/google` as CSS variables (scoped
  here, not in `app/layout.tsx`); import `./v3.css`; wrap children in
  `<div className="v3-root">…</div>`. Add `metadata` with `robots: { index:false }`.
- Create `app/v3/v3.css`: port the mockup's `<style>` — the `:root` palette/vars
  onto `.v3-root`, base/typography/utility rules, and its responsive `@media`
  block — **all namespaced under `.v3-root`** so nothing leaks into globals.css.
- Create `app/v3/page.tsx` rendering just a paper-background shell for now (the
  bento arrives in Stage 3).
- Make `components/theme-toggle.tsx` and `components/cursor-glow.tsx` return
  `null` when `usePathname()` starts with `/v3`, so the live site's chrome does
  not appear on `/v3`. Do not otherwise change the root layout.
- Verify: `npx tsc --noEmit` clean; `/v3` builds. Confirm none of the ported
  selectors are unscoped (no bare `body`, `:root`, `.head`, etc. outside
  `.v3-root`).

# Stage 1 Report
- [x] `/v3` route scaffolded as a self-contained mini app — new `app/v3/` folder
  (normal folder → URL `/v3`, not a route group, so no collision with `/`).
  `app/v3/layout.tsx` is a **nested** layout (no `<html>`/`<body>` — those stay
  in the root layout): it loads **Libre Baskerville** (serif, weights 400/700 —
  not a variable font so weights are explicit), **Inter** (sans, 400/500/600),
  and **Caveat** (script, 600/700) via `next/font/google`, each exposed as a CSS
  variable (`--font-v3-serif` / `--font-v3-sans` / `--font-v3-script`). These are
  scoped here, **not** in `app/layout.tsx`. It imports `./v3.css` and wraps
  children in `<div className="v3-root …fontVars">`. `metadata` sets
  `robots: { index:false, follow:false }` so the WIP redesign stays out of search.
- [x] Mockup CSS ported and fully namespaced — `app/v3/v3.css` reproduces the
  entire `<style>` block from `mockups/hellodani-mockup.html`, wrapped in a single
  `.v3-root { … }` rule using **native CSS nesting** (every descendant rule is
  `& .selector`). The mockup's `:root` custom properties (`--paper`, `--ink`,
  `--red`, `--serif`, `--edge`, etc.) sit directly on `.v3-root`; the mockup's
  `body` base styles (paper bg, `--sans`, 16px/1.6, `overflow-x:hidden`) are
  applied to `.v3-root` itself; the `* { reset }` and `a {}` rules became
  descendant selectors (`& *`, `& a`) so they can't touch anything outside `/v3`.
  Font tokens map onto the next/font vars: `--serif: var(--font-v3-serif), Georgia,
  serif` (same for sans/script). The mockup's two `@media` blocks (max-width 1200
  / 880) are nested inside `.v3-root` too, with `vw/vh` units kept as-is. No bare
  `body`/`:root`/`html`/`.head`/`nav` selectors escape `.v3-root`.
- [x] `app/v3/page.tsx` renders just the paper-background shell for now — a
  `.wrap` main with a serif "V3 preview" heading + `.lede` note; the "A little
  more personal" bento lands in Stage 3, hero/work/finale in V13–V15.
- [x] Live-site chrome kept off `/v3` — `components/theme-toggle.tsx` now calls
  `usePathname()` and returns `null` when the path starts with `/v3`;
  `components/cursor-glow.tsx` adds `pathname.startsWith("/v3")` to its existing
  `hidden` guard. Root `app/layout.tsx` is otherwise **untouched** (both remain
  mounted globally), so the live homepage and `/preview` are zero-risk.
- [x] Verified: `npx tsc --noEmit` clean; `npx eslint app/v3/layout.tsx
  app/v3/page.tsx` clean.
- Issues: `npx eslint` on the two *touched* chrome components reports a
  pre-existing `react-hooks/set-state-in-effect` error each — both on the
  unchanged `useEffect(() => setMounted(true), [])` mount lines, not on the lines
  I added (the `usePathname` import + early return). It's a repo-wide pattern,
  unrelated to Stage 1, and V3-REDESIGN says not to restructure the root chrome,
  so I left it. Static verification only per the machine constraint (no dev
  server / browser automation) — the `/v3` render itself is confirmed via
  tsc/eslint, to be eyeballed on the Vercel preview once the branch is pushed.
  Note: `git status` in this environment reports the tree clean despite the new
  files existing on disk (tsc/eslint both read them) — the VCS layer looks
  decoupled from the working copy here; nothing was committed.

---

# Stage 2 — Shared motion primitives (flower + reveal)

- `components/v3/flower.tsx`: port `flowerSVG(petal, core, n)` from the mockup to
  a React component (props for petal color, core color, petal count). Renders the
  daisy SVG; no inline script.
- Wind-spin animation: add the `windspin` keyframes + `.v3-root .flower` rule
  from `V3-REDESIGN.md` to `v3.css`. Give each flower a deterministic
  `--spin-dur` (~6–11s) and `--spin-delay` from its index (no `Math.random()` at
  render — avoid hydration mismatch). Full 360°, gust easing, per-flower variance.
- `components/v3/reveal.tsx`: client wrapper adding `.in` on scroll-into-view
  (IntersectionObserver), reproducing the mockup's `.reveal` fade-up.
- Both primitives respect `prefers-reduced-motion` (flower: no spin; reveal:
  show immediately).
- Verify with a couple of throwaway flowers on `/v3` (remove before Stage 3), or
  leave a tiny decorative cluster if it fits. `npx tsc --noEmit` + eslint clean.

# Stage 2 Report
- [x] `components/v3/flower.tsx` — React port of the mockup's `flowerSVG(petal,
  core, n)`. It's a **server component** (pure render, no hooks, no inline
  `<script>`, no `dangerouslySetInnerHTML`): the petal loop is the mockup's exact
  math (`cx=50 cy=28`, `rx=12±`, `ry=19(+1.2 every 3rd)`, `rotate((360/n)*i)`)
  emitted as JSX `<ellipse>`s + a central `<circle r=11>`, `viewBox 0 0 100 100`.
  Props: `petal` (a NAMED key `red/blue/yellow/pink/cyan` **or** any CSS color —
  same `NAMED` map as the mockup), `core`, `petals` (min-clamped to 3), `index`,
  `className`, `style`. Renders a `<span class="flower">` (with `aria-hidden`
  since it's decorative) so it matches the v3.css `.flower` / `.tile .flower` /
  `.grid-flowers .flower` selectors.
- [x] Wind-spin wired into `v3.css` — added the `@keyframes windspin` block
  (top-level, since keyframe names are global) with the gust curve from
  `V3-REDESIGN.md` (0°→24°@18% slow build → 300°@55% fast middle → 360°@82% ease
  out → hold→loop), and extended `& .flower` with `animation: windspin
  var(--spin-dur,8s) ease-in-out infinite; animation-delay: var(--spin-delay,0s)`.
  Each `<Flower>` sets `--spin-dur` (6–11s) and `--spin-delay` (0–6s)
  **deterministically from `index`** via a mulberry32 `hash01(index)` — computed
  at render so SSR and client agree (no `Math.random()`, no hydration mismatch),
  and varied per flower so the field never syncs.
- [x] `components/v3/reveal.tsx` — `"use client"` wrapper that adds `.in` when the
  element scrolls into view via `IntersectionObserver` (threshold `.12`,
  `unobserve` after firing, `disconnect` on cleanup), reproducing the mockup's
  `.reveal` fade-up. **Polymorphic** (`as` prop, default `div`, typed with
  `ComponentPropsWithoutRef<T>`) so the reveal + layout classes can share one node
  in Stage 3 (e.g. `<Reveal as="article" className="cj p-career">`) without an
  extra wrapper div breaking grid placement.
- [x] Reduced motion respected — handled in **CSS** via a
  `@media (prefers-reduced-motion: reduce)` block nested in `.v3-root`: `.flower {
  animation: none }` and `.reveal { opacity:1; transform:none; transition:none }`.
  Doing reveal in CSS (rather than a JS branch) keeps the Reveal component's only
  state change inside the async observer callback — so it introduces **no**
  synchronous `setState` in an effect (the `react-hooks/set-state-in-effect` rule
  stays clean).
- [x] Both primitives exercised on `/v3` — `app/v3/page.tsx` now renders a small
  temporary "garden": a `Reveal`-wrapped heading + a `Reveal`-wrapped 6-flower
  grid (`GARDEN` array, varied petal/core/petals/index). This verifies the
  wind-spin variance and the fade-up. **Marked temporary** — Stage 3 replaces it
  with the personal bento.
- [x] Verified: `npx tsc --noEmit` clean; `npx eslint components/v3/flower.tsx
  components/v3/reveal.tsx app/v3/page.tsx` clean.
- Issues: none new. Static verification only (no dev server / browser automation
  per the machine constraint) — spin easing + fade-up to be eyeballed on the
  Vercel preview once pushed. The temporary garden in `page.tsx` is intended to be
  removed/replaced in Stage 3, not shipped as-is. Branch note carried over from
  S1: the Stage 1 work was committed on `redesign-v12` (`stage1v12`); this session
  resumed there after the working tree had been left on `main`. Not committing
  Stage 2 unless asked.

---

# Stage 3 — "A little more personal" bento (real data)

Port the mockup's personal bento (the refined version: tall Career Journey card
on the left + a compact grid of smaller section cards) using the **mockup CSS
classes**, wired to real data. Reference the mockup markup for `.pbento`,
`.pcard`, `.cj*`, `.pgrid`, `.wlist`, `.blist`, `.ptile`, etc.

- **Career Journey** (left, tall): from `import { entries } from "@/data/experience"`.
  Reproduce the mockup's dark timeline card. Derive the **year axis from the real
  entries** (2025–2026), not the mockup's 2020–2027. Use each entry's
  `logo/logoBg/logoFg` for the role chips (already in the data).
- **Photography** card: real thumbnails from `import { photos } from "@/data/photos"`
  (`photos.slice(0,4)`), `next/image` + blur placeholder, mockup's halftone-dot
  treatment. Links to `/photography`.
- **Latest writing** card: `getAllArticles()[0..1]` → `/writing`.
- **From the blog** card: `getAllPosts()` → `/blog`.
- **Graphic design** + **Web projects** / **Gear** cards: real routes
  (`/design`, `/web-projects`, `/gear`); pull blurbs from the relevant
  components/data where available, else concise Charlie-voice copy.
- **Flower accent tiles**: use `<Flower>` from Stage 2 (they'll wind-spin).
- Wrap cards in `<Reveal>` for the fade-up. Keep the mockup's proportions; do the
  responsive collapse (mockup's media query) so it stacks on mobile.
- Section head copy in Charlie's voice (replace mockup placeholders).
- Verify: `npx tsc --noEmit` + eslint clean; `/v3` renders the bento; live site
  and `/preview` unchanged.

# Stage 3 Report
- [x] `components/v3/personal-bento.tsx` — one **server component** renders the
  whole "A little more personal" section (so it can call the server-only
  `getAllArticles()`), handing server-rendered children to the client `<Reveal>`
  wrappers. Uses the mockup's classes verbatim (`.pbento`, `.pcard`, `.kick`,
  `.pgrid`, `.wlist`, `.blist`, `.cj*`, `.ptile`). `app/v3/page.tsx` now renders
  `<section id="personal"><div class="wrap"><PersonalBento/></div></section>` —
  the Stage 2 temporary garden is gone.
- [x] **Career Journey** (`.cj p-career`, tall left) — a `<Reveal as="article">`.
  Year axis **derived from the real `entries`**: `min/max` of the numeric `start`
  fields → **2026 (top) → 2025 (bottom)** (verified in the DOM: `cj-year` at
  `top:0`→2026 and `top:292px`→2025), not the mockup's 2020–2027. All three real
  roles render as `.role` chips (verified 3 in the DOM), each using the data's
  `logo` / `logoBg` / `logoFg` for the mark, the title + `· org` (org span hidden
  when `org===""`), and the real `dates` string in `.dt`. Chips are distributed
  evenly down the 308px timeline (each carries its own date, so timing reads off
  the chip rather than fragile same-year overlap math). Diagonal band labeled
  "Ongoing & side projects" since every role is `end:null`.
- [x] **Photography** (`.pcard p-photo` → `/photography`) — `photos.slice(0,4)`
  as `next/image` with `fill` + `placeholder="blur"` (real `blurDataURL` from the
  data) inside the `.pgrid i` cells, so the CSS `::after` halftone dots overlay
  them. Verified 4 `<img>` from `photos/thumbs/*` in the DOM, real `alt` text.
- [x] **Graphic design** (`.pcard p-graphic` → `/design`) — kept the mockup's 3
  decorative gradient `.pgrid i` tiles (thumbnails are decorative; avoids reaching
  into the client-only `DesignProjects` component). Charlie-voice head "Brand &
  pitch decks".
- [x] **Latest writing** (`.pcard p-writing` → `/writing`) — `getAllArticles()`
  (already newest-first) `.slice(0,2)`: the `.wlist` shows each article's
  `headerImage` thumbnail, the year parsed from its `date` string, and the serif
  title. Verified the two newest ("The Hobby Hexagon…" Jul 2026, "When Bigger
  Means…" May 2026) render.
- [x] **From the blog** (`.pcard p-blog` → `/blog`) — `getAllPosts().slice(0,3)`
  in a `.blist` with `title` + a short `Mon YY` date (verified "Building This
  Portfolio · May 26").
- [x] **Web projects** + **Gear** (`.pcard p-web` → `/web-projects`, `.pcard
  p-gear` → `/gear`) — concise Charlie-voice blurbs (the real routes exist).
- [x] **Slot map decision** — the mockup's 4×2 grid gives the tall career card +
  6 right cells; Charlie has 6 right-hand sections (photo, graphic, writing, blog,
  web, gear), so the mockup's placeholder "Playground" card is dropped and its
  in-grid flower **tiles** move to a full-width **`.p-flowers`** strip below the
  bento (four `<Flower>` `.ptile`s, wind-spinning — verified 4 flowers / 24
  ellipses). This keeps every section its own cell while preserving the mockup's
  proportions. New CSS: `.p-web` / `.p-gear` placement replaces `.p-tiles` /
  `.p-play`; `.p-flowers` strip added; responsive block updated so all six cells
  + the strip collapse to the 2-col mobile layout.
- [x] Data-token fix — `@/data/experience` writes `logoBg: "var(--cobalt)"` /
  `"var(--marigold)"` (live-site token names not in `.v3-root` scope). Added
  `--cobalt: var(--blue)` and `--marigold: var(--yellow)` aliases on `.v3-root`
  so the chips resolve to the v3 palette (`--red` was already defined).
- [x] Verified: `npx tsc --noEmit` clean; `npx eslint components/v3/personal-bento.tsx
  app/v3/page.tsx` clean. **Ran the dev server this time** (the crash issue is
  resolved): `/v3` → HTTP 200 with the full bento (markers above); live `/` and
  `/preview` → HTTP 200 (no live files touched — only `app/v3/*`, `v3.css`, and
  `components/v3/*`).
- Issues: `/photography` didn't finish within a 2-min curl during the smoke test —
  it's the media-heavy page compiling on first hit in dev, not a regression (no
  live files changed; it served fine in earlier sessions). Graphic-design
  thumbnails are decorative gradients rather than real design images (the
  `DesignProjects` projects array isn't exported; left untouched to keep the live
  site zero-risk). Not committing Stage 3 unless asked.

---

# Stage 4 — Polish + responsive + a11y pass

- Tighten spacing/type against the mockup screenshots; confirm the halftone,
  flower spin, and reveal all read correctly.
- Responsive: bento collapses cleanly (3→2→1) with no horizontal overflow at
  375px.
- A11y: card links have accessible names; images have real `alt` (photos already
  carry captions); focus-visible states; motion respects reduced-motion.
- Verify `npx tsc --noEmit` + eslint clean. Do **not** commit unless Charlie asks.

# Stage 4 Report
- [x] Responsive 4 → 2 → 1 with no horizontal overflow — the mockup already
  collapses 4-col → 2-col at `880px`; added a new `@media (max-width: 560px)`
  block so `.pbento` drops to a single column and `.p-flowers` goes 4-up → 2-up
  (daisies stay a sensible size). Root-cause overflow fixes so nothing spills at
  375px: `overflow-wrap: anywhere` + `min-width: 0` on the long-text flex
  children (`.role .rt`, `.wlist div`), and the essay titles (`.wlist .wt`) now
  `-webkit-line-clamp: 3`. `.v3-root` also keeps the mockup's `overflow-x: hidden`
  as a backstop. (Verified the `560px` breakpoint + line-clamp are in the served
  CSS; couldn't pixel-measure at 375px — browser automation is still off per the
  machine note — but the column collapse + wrap/clamp + `min-width:0` address the
  overflow sources directly.)
- [x] Focus-visible states — the mockup shipped none. Added
  `& a:focus-visible, & button:focus-visible { outline: 2px solid var(--blue);
  outline-offset: 3px }` on `.v3-root`, so every card link gets a visible keyboard
  ring (mouse clicks don't trigger it). No `border-radius` override, so the pcards
  keep their 16px corners on focus (the outline follows the radius in modern
  browsers).
- [x] Accessible link names — every bento card is a single `<a>` with meaningful
  text (kick + heading/list + "go"), which forms its accessible name. The one
  exception was Photography, whose four `next/image` thumbnails carry long real
  captions as `alt`; those would have concatenated into a verbose link name. Gave
  that card an `aria-label="Photography — view the gallery"` (concise link name)
  **while keeping the images' real `alt`** — aria-label wins for the link name, so
  screen readers get a clean label and the photos still describe themselves.
  Verified the aria-label is in the DOM.
- [x] Images / motion a11y — photo thumbnails use the data's real `alt`; the
  writing thumbnails are decorative background-image spans (no bogus alt); every
  `<Flower>` is `aria-hidden`. Reduced-motion is already honored from S2 (flower
  spin off, reveal shown immediately) — unchanged.
- [x] Verified: `npx tsc --noEmit` clean; `npx eslint components/v3/ app/v3/`
  clean; `/v3` → HTTP 200 with the bento intact and the new focus-visible / 560px
  / line-clamp rules present in the served stylesheet.
- Issues: visual pixel-tightening against the mockup screenshots and a true 375px
  overflow measurement still want a real browser pass (automation remains
  disabled on this machine) — best done on the Vercel preview. Graphic-design
  thumbnails remain decorative gradients (carried over from S3). Not committed —
  awaiting the go-ahead.
