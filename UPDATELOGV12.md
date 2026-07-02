# REDESIGN — LOG V12: FOUNDATION + MOTION + PERSONAL BENTO

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
_TBD — fill after implementing._

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
_TBD — fill after implementing._

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
_TBD — fill after implementing._
