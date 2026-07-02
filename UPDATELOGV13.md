# REDESIGN — LOG V13: HERO + NAV + "DIGITAL HOME" CAROUSEL

**First read `V3-REDESIGN.md`.** This log builds the **top** of the `/v3` page:
the nav cluster, the hero, and the horizontal browser-card carousel. Source of
truth for layout/CSS: `mockups/hellodani-mockup.html` (hero section + "Step into
my digital home" carousel).

Depends on: **V12** (the `app/v3/` scaffold, `v3.css`, and the `<Flower>` +
`<Reveal>` primitives must exist). These sections mount **above** the V12 bento
in `app/v3/page.tsx`.

---

# Stage 1 — Nav cluster + hero

Reference the mockup's hero markup and CSS (`.nav` centered cluster, `.hero`,
`.bloom` daisies, rainbow arc, headline, lede, dashed rule, "Chat with me" pill).

- **Nav** (`components/v3/nav.tsx`): the centered, **non-sticky** works/studio/
  garden cluster that scrolls away. Wordmark uses **Caveat** (script). Point the
  links at real destinations (e.g. works→`/web-projects`, garden→`/writing` or
  `/blog` — confirm with Charlie's routes; use anchors to on-page sections where
  the mockup does).
- **Hero** (`components/v3/hero.tsx`): the two big daisies bleeding ~25% off the
  L/R edges (use `<Flower>` from V12 — they wind-spin), the rainbow arc, "Hi, I'm
  Charlie Ramus", the **thin serif** headline (Libre Baskerville, weight 400,
  ~52px per the mockup), a real lede in Charlie's voice, the dashed rule, and the
  black pill CTA ("Chat with me" → real contact link or the contact section).
- Replace ALL placeholder copy with Charlie's real name/tagline (junior in
  Boulder — software, communities, photography, design).
- Keep the mockup's daisy placement clear of the text; keep the vw/vh scaling.
- Verify: `npx tsc --noEmit` + eslint clean; hero renders above the bento; live
  site untouched.

# Stage 1 Report

- [x] **`components/v3/nav.tsx`** — the centered, **non-sticky** nav cluster
  (`<nav aria-label="Primary">`, styled by `nav` / `nav a` / `nav .logo` in
  v3.css, which is `position:relative` not sticky, so it scrolls away with the
  hero). Three items: `works → /web-projects`, the **Caveat** script wordmark
  `Charlie Ramus` (`.logo`), and `garden → /writing`. Both are **real routes**
  that exist today (`app/web-projects/page.tsx`, `app/writing/page.tsx`) — chosen
  over the mockup's `#work`/`#garden` anchors since those on-page sections don't
  land until V14/V15. Uses **`next/link`** (in-app routes; eslint
  `no-html-link-for-pages` requires it — plain `<a>` errored).
- [x] **`components/v3/hero.tsx`** — the mockup's `<header class="hero">`: two
  `.bloom` daisies bleeding `-9vw` off L/R via the V12 **`<Flower>`** primitive
  (so they wind-spin, varied by `index`) with the mockup's exact palette — left
  `cyan` petal + `#0015D4` core (7 petals), right `red` petal + `#F4F3EE` core
  (8 petals); the inline **rainbow arc** SVG (red/yellow/blue, `aria-hidden`);
  `.hi` "Hi, I'm Charlie Ramus"; the **thin serif** `<h1>` (Libre Baskerville
  400, `clamp(26px,4vw,52px)` from v3.css); a real **lede** in Charlie's voice
  (junior in Boulder — software, communities, photography, design); the dashed
  `.rule`; and the black **"Chat with me"** pill → `mailto:charlie.ramus12@gmail.com`
  (the same public contact link used in `components/contact.tsx`). Hero renders
  `<Nav/>` inside the header (mockup structure) and wraps `.inner` in the V12
  **`<Reveal>`** for the fade-up. All placeholder copy replaced.
- [x] **`app/v3/page.tsx`** — mounts `<Hero/>` **above** the V12
  `#personal` bento; comment updated to note the carousel (S2) + later sections.
- [x] **`app/v3/v3.css`** — added one rule `& .hero .bloom .flower { width:100% }`.
  The mockup put `.flower` directly on `.bloom` (which carries the `clamp()`
  width); here `<Flower>` nests a `span.flower` inside `.bloom`, so it needs to be
  sized to fill the bleed area or it collapses to intrinsic size. No other CSS
  touched (all hero/nav styles were already ported in V12).
- **Data flow:** nav/CTA targets are hardcoded real routes + the shared mailto;
  no new data files needed. Blooms are pure `<Flower>` (server component); only
  `.inner`'s `<Reveal>` is client. Daisy `pointer-events:none` + vw bleed keep
  them clear of the text (v3.css, unchanged).
- **Verify:** `npx tsc --noEmit` clean; `npx eslint components/v3/nav.tsx
  components/v3/hero.tsx app/v3/page.tsx` clean. Per the machine constraint (no
  dev server / browser automation) verification is static only. Live site
  (`app/page.tsx`, `/preview`) untouched — only `app/v3/page.tsx` changed plus
  two new `components/v3/*` files and one additive v3.css rule.
- **Issues:** None blocking. (1) `garden → /writing` is a judgment call — "garden"
  reads as a digital-garden/writing space; swap to `/blog` if Charlie prefers.
  (2) Nav links go to real routes rather than the mockup's `#work`/`#garden`
  anchors; once V14 (work) / V15 (services `#garden`) land, they could switch to
  on-page anchors if Charlie wants the single-page feel. (3) Not visually
  confirmed in a browser (constraint) — recommend an eyeball on the Vercel
  preview for daisy bleed / headline size vs. the mockup screenshots (that's the
  S3 polish pass anyway).

---

# Stage 2 — "Step into my digital home" carousel

Reference the mockup's `.carousel` (full-bleed, horizontal browser-card row).

- `components/v3/digital-home.tsx`: the section heading + a horizontal,
  scroll-snap row of browser-chrome "shot" cards.
- Wire the cards to **real previews** instead of placeholders: pull from
  photos/projects/sections (e.g. a photo, a project, an essay header image). Read
  `data/photos.ts`, `components/projects.tsx`, and `getAllArticles()` for real
  sources; link each card to its real route.
- Keep the mockup's full-bleed treatment and card styling. Horizontal overflow
  scrolls; no vertical page overflow.
- `<Reveal>` on entry. Responsive: the row scrolls on small screens (touch),
  no layout break at 375px.
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 2 Report
_TBD — fill after implementing._

---

# Stage 3 — Polish + responsive + a11y

- Match hero proportions to the mockup screenshots (headline weight/size, daisy
  bleed, rainbow arc position). Confirm daisies wind-spin and stay clear of text.
- Nav: keyboard-operable links, visible focus, sensible tab order; confirm it is
  non-sticky (scrolls away) as in the mockup.
- Carousel: cards are links with accessible names; keyboard/touch scrollable;
  images have real `alt`.
- No horizontal overflow at 375px. Motion respects reduced-motion.
- Verify `npx tsc --noEmit` + eslint clean. Don't commit unless Charlie asks.

# Stage 3 Report
_TBD — fill after implementing._
