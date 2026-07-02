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
_TBD — fill after implementing (see UPDATELOGV6.md for the expected style)._

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
