# REDESIGN — LOG V14: WORK BANDS + SERVICES + ABOUT COLLAGE

**First read `V3-REDESIGN.md`.** This log builds the middle of the `/v3` page:
the work project bands, the services section, and the "Behind the pixels" about
collage. Source of truth for layout/CSS: `mockups/hellodani-mockup.html` ("Tiny
fraction of my work", "I've got your back with…", "Behind the pixels").

Depends on: **V12** (scaffold + primitives). Mounts **between** the V13 hero/
carousel and the V12 bento in `app/v3/page.tsx` (final order is fixed in V15).

---

# Stage 1 — "Tiny fraction of my work" project bands

Reference the mockup's `.proj` / `.band` / `.panel` / `.stage` / `.stack`
markup + the full-width grey "get in touch / Case study" bar.

- `components/v3/work.tsx`: alternating project bands (work panel + gap + stacked
  colored-flower/white tile), sides alternating, with the full-width bar between
  bands, per the mockup.
- Wire to **real projects**: read `components/projects.tsx` / `WebProjectEntry.tsx`
  and `/web-projects` (and `data/stories.ts` if used) for real titles, tags, and
  thumbnails. Replace "Project One–Four" with Charlie's actual projects; link each
  band to its case-study/route.
- Flower tiles use `<Flower>` (wind-spin). `<Reveal>` per band.
- Keep the mockup's device/UI card treatment; use real preview imagery where
  available (`next/image` + blur for photos).
- Responsive: bands stack on mobile; no horizontal overflow at 375px.
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 1 Report

- [x] **`components/v3/work.tsx`** — the mockup's `#work` section, self-contained
  (`<section id="work"><div class="wrap">`): a `.head` (`<Reveal>`), then the
  `.proj` column of four alternating `.band`s with the full-width grey `.touch`
  bar between bands 2 and 3, exactly per the mockup. Server component; the
  scroll fade-up rides the V12 `<Reveal>` on each band / head / touch bar.
- [x] **Alternating bands** — a `ProjectBand` sub-component renders one band:
  a `.panel` (device-card `.stage` + `.label`) beside a `.stack` (colored flower
  tile + white tile). `flip` toggles the ported `.band.flip` class, which swaps
  the panel/stack sides via CSS `order`; bands run false/true/false/true so sides
  alternate. Card rotations mirror on flipped bands (`±4°` / `∓5°`) so the two
  screenshot cards read as a scatter, not a mechanical repeat. The mockup's
  `.band:hover .card` lift is inherited unchanged.
- [x] **Wired to REAL projects** (mockup's "Project One–Four" gradients replaced):
  - **charlieramus.com** — web · next.js → `/web-projects`, two This-Site
    screenshots.
  - **WELandscape Co.** — web · marketing site → `/web-projects`, two WELandscape
    screenshots.
  - **Personal Journal** — data · self-tracking → `/web-projects`, two
    PersonalJournal screenshots.
  - **Graphic Design** — brand · visual identity → `/design`, the `Frame-4`
    portfolio thumbnail (single card).
  Each **whole panel is a `<Link>`** to the project's real route with an
  `aria-label` = `"<title> — <tags>"`; the `.label` shows title + tags. Every
  device card is a real screenshot via **`next/image`** (`fill` + `sizes`,
  `objectFit:cover`) inside the mockup's rotated/positioned `.card` frame.
- [x] **Data flow** — projects are declared **inline** (`PROJECTS` const), the
  same pattern V13 established: the real source arrays live in **"use client"**
  modules (`components/WebProjectEntry.tsx`, `components/projects.tsx`), so
  importing them into this **server** component hands back a client *reference*,
  not the data. Inlining the routes + real asset paths keeps the live components
  100% untouched. All 13 referenced screenshots verified present on disk
  (`public/images/{This-Site,WELandscape,PersonalJournal,For-Projects-…}`).
  Flower tiles reuse the mockup's per-band palette via the V12 `<Flower>`
  primitive (wind-spin), `petals={6}`.
- [x] **Links** are real routes that exist today (`app/web-projects/page.tsx`,
  `app/design/page.tsx`); the `.touch` "Case study" button → `/web-projects`. All
  copy is in Charlie's voice (no placeholder text).
- **Responsive** — `.band`/`.band.flip` collapse to a single column and the
  `.stack` goes 2-across at ≤720px (ported v3.css `@media`); `.v3-root` is
  `overflow-x:hidden` so nothing bleeds past the viewport at 375px.
- **Verify:** `npx tsc --noEmit` clean; `npx eslint components/v3/work.tsx
  app/v3/page.tsx` clean. Confirmed the ported `& a { color:inherit;
  text-decoration:none }` + `a:focus-visible` outline apply, so the panel links
  inherit ink color, have no underline, and are keyboard-focusable. Static-only
  per the no-browser constraint.
- **Issues:** None blocking. (1) Three web-project bands all link to
  `/web-projects` (the shared case-study page — the individual web projects don't
  have per-project routes). Each could instead deep-link to its live site
  (`charlieramus.com`, `welandscapeco.com`, the journal repo) if Charlie prefers
  external destinations — left in-app for the "case study" framing. (2) The mockup
  had bespoke per-band card compositions (Corti-style UI, mini dashboards); this
  port uses a consistent two-screenshot device-card treatment with real imagery
  instead, honoring "keep the device/UI card treatment" while showing real work.
  (3) Not visually confirmed in a browser (constraint) — recommend an eyeball on
  the Vercel preview for card crop / band rhythm vs. the mockup (S4 polish pass).

---

# Stage 2 — "I've got your back with…" services

Reference the mockup's dark services section: fanned card stack + 3-column
service list with dashed underlines.

- `components/v3/services.tsx`: the dark section, the fanned card stack (port the
  mockup's JS stack builder to React), and the 3-column dashed-underline service
  list.
- Content: Charlie's real skills/services (design, web, photography, etc.). If
  there's no existing dataset, add `data/services.ts` (typed, `// CUSTOMIZE`
  comments) rather than hardcoding into JSX.
- `<Reveal>` on entry; dark section styling per the mockup.
- Responsive: 3-col list collapses cleanly; fanned stack degrades gracefully on
  mobile.
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 2 Report

- [x] **`components/v3/services.tsx`** — the mockup's `#garden` services section,
  self-contained (`<section id="garden"><div class="wrap">`): a `.head`
  (`<Reveal>`), the decorative fanned card stack (`.fan`), and the 3-column
  dashed-underline `.svc-grid`. Server component; fade-up via `<Reveal>` on each
  block.
- [x] **Fanned card stack** — ports the mockup's inline-`<script>` `#fan` builder
  to React (`Fan()`): maps the mockup's exact `fanColors` (dark + pastel run) to
  `.fc` cards, each `rotate((i − n/2)·7°)`, `zIndex:i`, `transform-origin:bottom
  center` (from ported CSS). One refinement over the mockup: the mockup laid cards
  from a left origin (`left = i·44`), which hugs the left edge; here each card's
  `left` is `calc(50% − spread/2 + i·44px)` so the whole fan is **centered** under
  the heading. The fan is purely decorative → the `.fan` wrapper is
  `aria-hidden="true"`.
- [x] **Note on "dark section":** the stage brief calls this a "dark services
  section," but the mockup's `#garden` is actually on the **paper** background
  (there's no dark-section rule in the mockup CSS — only the *fan cards* carry
  dark colors like `#1c1c1c`/`#111`). Followed the mockup as source of truth
  rather than inventing a dark band. Flag for Charlie if a dark section was in
  fact wanted — easy to add a `#garden { background:… ; color:… }` rule.
- [x] **`data/services.ts`** (new) — a typed `services: string[]` with `//
  CUSTOMIZE` comments, per the house pattern (mirrors `data/experience.ts`),
  rather than hardcoding into JSX. Nine real skills across Charlie's actual work —
  Web Development, Next.js / React, UI / UX Design, Brand & Visual Identity,
  Photography, Content & Community, Design Systems, Python / Automation, Data &
  Analytics — which fill the mockup's 3×3 grid evenly. The component maps whatever
  length the array is, so add/remove is free.
- [x] **Copy** replaced with Charlie's voice (heading kept: "I've got your back
  with…"; real subline about design + code + camera). No placeholder text.
- **Responsive** — the ported v3.css `@media (max-width:720px)` collapses
  `.svc-grid` to 2 columns; the fan is centered (`left: calc(50% − …)`) so it
  degrades from the middle and the `.v3-root` `overflow-x:hidden` backstop clips
  any bleed at 375px (the fan's ~442px span exceeds a phone width but scrolls
  nowhere / is clipped, and it's decorative).
- **Verify:** `npx tsc --noEmit` clean; `npx eslint components/v3/services.tsx
  data/services.ts` clean. Static-only per the no-browser constraint. Live site
  untouched.
- **Issues:** None blocking. (1) See the "dark section" note above — the only
  intentional deviation, and it favors the mockup CSS. (2) The centered-fan tweak
  is a small, deliberate departure from the mockup's left-origin math to avoid the
  cards hugging the wrap's left edge; revert to `left:i·44px` if the exact mockup
  placement is preferred. (3) Not visually confirmed in a browser (constraint) —
  worth an eyeball on the Vercel preview for fan overlap / spacing (S4 polish).

---

# Stage 3 — "Behind the pixels" about collage

Reference the mockup's scattered polaroid collage + bio.

- `components/v3/about-collage.tsx`: the scattered polaroid collage + bio text.
- Photos: real images from `import { photos } from "@/data/photos"` (a curated
  slice), `next/image` + blur. Bio: pull Charlie's real bio from
  `components/about.tsx` (`aboutParagraphs`) — his actual voice, not placeholder.
- `<Reveal>`; keep the polaroid scatter/tilt from the mockup.
- Responsive: collage reflows without overlap/overflow on mobile.
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 3 Report
_TBD — fill after implementing._

---

# Stage 4 — Polish + responsive + a11y

- Match proportions to the mockup screenshots across all three sections.
- A11y: project bands and collage images have real `alt`/accessible names; links
  keyboard-operable with visible focus; dark services section meets contrast.
- No horizontal overflow at 375px; motion respects reduced-motion.
- Verify `npx tsc --noEmit` + eslint clean. Don't commit unless Charlie asks.

# Stage 4 Report
_TBD — fill after implementing._
