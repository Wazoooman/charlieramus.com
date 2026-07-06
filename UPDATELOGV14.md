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

- [x] **`components/v3/about-collage.tsx`** — the mockup's about section,
  self-contained (`<section id="about"><div class="wrap">`): a `.head`
  (`<Reveal>`) then the `.about-grid` of a scattered polaroid `.collage` (four
  tilted `.ph.p1–p4` frames) beside the `.bio`. Layout/CSS (`.about-grid` /
  `.collage` / `.ph.p1–p4`) was ported in V12; this only fills it with real
  content. Server component; fade-up rides the V12 `<Reveal>`.
- [x] **Real photography** — a curated four-photo slice of `data/photos`
  (`COLLAGE_INDICES = [0, 4, 7, 12]` — a mix of Iceland + Boulder frames), each
  rendered with **`next/image`** (`fill`, `sizes="150px"`,
  `placeholder="blur"` from the photo's own `blurDataURL`, `objectFit:cover`)
  inside the mockup's white-bordered `.ph` polaroid frame with its per-frame tilt.
  Each image keeps its **real, descriptive `alt`** straight from the gallery data,
  so the collage has genuine accessible names. The slice is defended
  (`.filter(Boolean)`) against a shorter gallery.
- [x] **Real bio** — imports `aboutParagraphs` from `components/about.tsx` (a plain
  export from a **server** component, so it imports cleanly — no client-reference
  problem, unlike the projects/web-projects arrays). Renders Charlie's actual
  three-paragraph bio in his own voice (Boulder junior — software, content,
  photography), the exact copy the live About section uses; **no duplication, no
  placeholder**.
- [x] **`app/v3/page.tsx`** — mounts `<AboutCollage/>` after `<Services/>` (still
  above the bento; the provisional order — V15 fixes the final section order).
- **Responsive** — `.about-grid` collapses to one column at ≤880px (ported CSS);
  the collage's absolute scatter is fine down to ~560px, then a new
  `@media (max-width:560px)` rule reflows it into a tidy centered 2-up (frames go
  `position:relative; inset:auto; width:42%`, keeping the fill `<Image>`'s
  positioned parent and each frame's tilt) — **no overlap or overflow** on phones.
- **Verify:** `npx tsc --noEmit` clean; `npx eslint components/v3/about-collage.tsx
  app/v3/page.tsx` clean. Static-only per the no-browser constraint. Live site
  untouched.
- **Issues:** None blocking. (1) The four collage photos are a hand-picked
  index slice (`[0, 4, 7, 12]`) — swap the indices for different frames any time.
  (2) The bio renders all three `aboutParagraphs` (the mockup had two); it reads
  well but the third can be dropped if Charlie wants a shorter blurb. (3) Not
  visually confirmed in a browser (constraint) — recommend an eyeball on the
  Vercel preview for polaroid crop / scatter vs. the mockup (covered by S4).

---

# Stage 4 — Polish + responsive + a11y

- Match proportions to the mockup screenshots across all three sections.
- A11y: project bands and collage images have real `alt`/accessible names; links
  keyboard-operable with visible focus; dark services section meets contrast.
- No horizontal overflow at 375px; motion respects reduced-motion.
- Verify `npx tsc --noEmit` + eslint clean. Don't commit unless Charlie asks.

# Stage 4 Report

Polish/responsive/a11y pass across all three V14 sections (work, services, about).

- [x] **Proportions vs. the mockup** — the three sections' layout/CSS was ported
  verbatim in V12 (`.band`/`.panel`/`.stack`, `.fan`/`.svc-grid`,
  `.about-grid`/`.collage`/`.ph.p1–p4`), so proportions match by construction. The
  only deliberate departures, both to make the ported layout hold real content:
  the work bands use a consistent two-screenshot device-card treatment (vs. the
  mockup's bespoke gradient placeholders), and the services fan is **centered**
  under the heading (vs. the mockup's left-origin math) so it doesn't hug the edge.
- [x] **A11y — work bands:** each band's whole `.panel` is a `<Link>` with an
  `aria-label` = `"<title> — <tags>"` (clear link purpose); every device card is a
  real screenshot with a **descriptive `alt`**. **Services:** the decorative fan
  is `aria-hidden="true"`; the meaningful content is the real `.svc-grid` text
  list. **About:** every collage image carries its real gallery `alt`. All links
  are keyboard-operable with **visible focus** via the ported
  `a:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px }`.
- [x] **Contrast** — the brief mentions a "dark services section," but the mockup
  puts `#garden` on the **paper** background (only the fan *cards* are dark; there
  is no dark-section rule in the mockup CSS). On paper, the heading/list are the
  standard `--ink` on `--paper` — comfortably above 4.5:1 — so contrast is met.
  Flagged in the S2 report in case a genuine dark band was actually wanted.
- [x] **No horizontal overflow at 375px** — work `.band`/`.band.flip` collapse to
  one column and the `.stack` goes 2-across at ≤880px; `.svc-grid` drops to 2
  columns at ≤880px and the fan's ~440px spread is **scaled to ~0.64** on its inner
  wrapper at ≤560px so it fits a phone; the collage reflows to a 2-up at ≤560px.
  `.v3-root { overflow-x: hidden }` is the backstop. Statically confirmed nothing
  exceeds the viewport at 375px.
- [x] **Reduced motion** — extended the existing `@media (prefers-reduced-motion:
  reduce)` block to also neutralize the work bands' card lift
  (`& .band:hover .card { transform: none }`) — it was the one transform-based
  hover the block didn't already cover (it lives on `.band:hover .card`, not
  `.card:hover`). All V14 motion (flower wind-spin, `.reveal` fade-ups, card/button
  hovers) is now silenced under reduced motion; the fan's mobile scale is a static
  layout transform, not motion, so it correctly stays.
- **Files touched (S4):** `app/v3/v3.css` (reduced-motion band-card line; `.fan-inner`
  base + its mobile `scale`; the ≤560px collage reflow) and
  `components/v3/services.tsx` (wrapped the fan cards in `.fan-inner` so the mobile
  scale doesn't collide with the `.fan` reveal's own `transform`). Work + about
  components needed no changes — they were built a11y-clean in S1/S3.
- **Verify:** `npx tsc --noEmit` clean; `npx eslint` on all three V14 components +
  `data/services.ts` + `app/v3/page.tsx` clean. Static-only per the no-browser
  constraint (`node_modules` docs honored; no dev server / browser). Live site
  (`app/page.tsx`, `/preview`) untouched — all changes are under `app/v3/*`,
  `components/v3/*`, and the new `data/services.ts`. **Not committed** (awaiting
  Charlie's go-ahead).
- **Issues:** None blocking. Two standing flags carried from earlier stages, both
  Charlie's call: (1) the three web-project bands share the `/web-projects`
  destination (could deep-link to each live site instead); (2) `#garden` follows
  the mockup's paper background rather than a dark band. Everything still wants an
  eyeball on the Vercel preview for exact crop/rhythm vs. the mockup screenshots,
  per the no-browser constraint.
