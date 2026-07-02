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
_TBD — fill after implementing (see UPDATELOGV6.md style)._

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
