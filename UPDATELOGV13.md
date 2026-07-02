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

- [x] **`components/v3/digital-home.tsx`** — the mockup's `.step` heading
  (🔖 "Step into my digital home") + the full-bleed `.carousel` scroll-snap row
  of browser-chrome `.shot` cards. Server component: reads the server-only
  `getAllArticles()` / `getAllPosts()` and hands server-rendered cards to the
  client `<Reveal>`. Matching the mockup, `.reveal` is on the **carousel as a
  whole** (and the step), so each shot stays a plain `<Link>` — no per-card
  observer. A small `<Bbar>` renders the three decorative traffic-light dots
  (`aria-hidden`).
- [x] **Wired to real previews, each linking to its real route:**
  - **Photography** ×2 — two landscape photos (`ratio ≥ 1.4`, taken from
    different parts of `data/photos.ts` so the row isn't two near-identical
    frames) rendered with `next/image` `fill` + `placeholder="blur"` from each
    photo's `blurDataURL` → `/photography`.
  - **Web Projects** → `/web-projects` and **Graphic Design** → `/design` —
    the two portfolio previews (route + `thumbnailLight` asset) mirror
    `components/projects.tsx` but are declared **inline** (`PORTFOLIO` const), not
    imported: `components/projects.tsx` is a `"use client"` module, and importing
    its `projects` array into this **server** component hands back a client
    *reference* (function proxy), not the data — which crashes on destructure.
    Inlining keeps the live component 100% untouched.
  - **Latest essay** — `getAllArticles()[0].headerImage` → `/writing/[slug]`.
  - **From the blog** — `getAllPosts()[0].title` as the one serif **text** shot
    (`.s-lav`, echoing the mockup's gradient cards so the row mixes imagery +
    type) → `/blog`.
  - Each card is defensively pushed only if its source exists, so a missing
    essay/post/photo just drops that card rather than erroring.
- [x] **`app/v3/v3.css`** — added `& .shot .body.shot-img { padding:0;
  position:relative }` (a padding-free, positioned frame so the `fill` `<Image>`
  fills the browser body — the mockup's bodies were solid gradients), plus
  `& .shot { display:block; transition }` and a `& .shot:hover` lift (the shots
  are now links, so they get the card's hover affordance). No other CSS touched;
  `.carousel` / `.shot` / `.bbar` / `.body` were already ported in V12.
- [x] **`app/v3/page.tsx`** — mounts `<DigitalHome/>` between `<Hero/>` and the
  `#personal` bento, **outside** `.wrap` (full-bleed; the carousel pads itself
  with `--edge`).
- **Data flow:** photos → `data/photos.ts` (thumbs + blur); projects → inline
  `PORTFOLIO` const mirroring `components/projects.tsx` (uses the `thumbnailLight`
  asset since `/v3` is always the paper/light look — no theme system; can't
  import from the client module, see above); essay → server-only
  `getAllArticles()`; post → `getAllPosts()`. All preview assets verified present
  on disk (`Frame-5/4_webp.webp`, `artical-1-header_webp.webp`, photo thumbs).
- **Bugfix (post-first-pass):** the first version imported `{ projects }` from the
  `"use client"` `components/projects.tsx` into this server component, which threw
  `function is not iterable` at runtime (server got a client reference, not the
  array). Fixed by inlining the two entries. A **separate** console warning
  ("Encountered a script tag while rendering React component") comes from
  `next-themes`' `ThemeProvider` in the **root** `app/layout.tsx` (it injects an
  anti-flash `<script>`); it's a dev-only React 19 warning about client
  re-renders, affects the whole site, and surfaced only because the crash forced
  a re-render. Not touched — the V3 brief says don't restructure the root layout.
- **Responsive / overflow:** `.carousel` is `overflow-x:auto` (touch + scroll),
  and `.v3-root` is `overflow-x:hidden`, so the row scrolls horizontally with **no
  vertical page overflow**; shots are 330px < 375px so nothing breaks at phone
  width. Reduced motion already handled globally (`.reveal` forced visible in
  v3.css).
- **A11y:** each shot is a `<Link>` with a descriptive `aria-label` (link purpose
  = destination); preview images are `alt=""` (decorative, name comes from the
  link); chrome dots are `aria-hidden`.
- **Verify:** `npx tsc --noEmit` clean; `npx eslint components/v3/digital-home.tsx
  app/v3/page.tsx` clean. Static-only per the machine constraint. Live site
  untouched — only `app/v3/page.tsx` + `v3.css` changed and one new component.
- **Issues:** None blocking. (1) The two portfolio previews reuse the live site's
  `For-Projects-Placeholder-Cards` thumbnails — fine as real previews, but if
  Charlie wants bespoke `/v3` shots those can swap in later. (2) Not visually
  confirmed in a browser (constraint) — worth an eyeball on the Vercel preview
  for photo crop / card rhythm vs. the mockup (that's the S3 polish pass).

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

- [x] **Hero proportions** — verified against the mockup; they match by
  construction (the hero CSS was ported verbatim in V12): headline is
  `font-family:var(--serif)`, **weight 400**, `clamp(26px,4vw,52px)`; daisies
  bleed `-9vw` at `clamp(320px,37vw,720px)`; rainbow arc is `width:54px` centered
  in `.inner`. No CSS change needed. Daisies **wind-spin** (the `<Flower>` gets
  `animation: windspin` via `.flower` in v3.css; the two blooms carry
  `index={0}`/`{1}` so their `--spin-dur`/`--spin-delay` differ) and stay **clear
  of the text** (`.bloom` is `pointer-events:none`, `z-index:0`, positioned at the
  edges; `.hero{overflow:hidden}` clips the bleed; `.inner` is `z-index:2`).
- [x] **Nav a11y** — links are real `<Link>`s (keyboard-focusable, Enter
  activates); **visible focus** via `& a:focus-visible { outline:2px solid
  var(--blue); outline-offset:3px }` (already in v3.css); **tab order** is natural
  and sensible: works → garden → hero CTA (the wordmark is a non-interactive
  `<span>`, correctly skipped). Confirmed **non-sticky**: `& nav { position:
  relative }` (no `sticky`/`fixed`), so it scrolls away with the hero as in the
  mockup.
- [x] **Carousel a11y** — every card is a `<Link>` with an accessible name (the
  `aria-label` describes the **destination**, e.g. "Photography — view the
  gallery", "Read: <essay title>"). **Images now carry real, descriptive `alt`**
  (previously `alt=""`): photos use the photo's own `alt`, project shots use
  "<Title> preview", the essay shot uses "Header image for “<title>”". So the DOM
  has real alt *and* the link has a clear purpose. Keyboard-scrollable (focusable
  card links → the browser scrolls each into view on focus) and touch-scrollable
  (`.carousel{overflow-x:auto}`); the browser-chrome dots are `aria-hidden`.
- [x] **No horizontal overflow at 375px** — the only fixed-width content is the
  330px `.shot`, which lives inside the `overflow-x:auto` carousel (scrolls
  internally); `.v3-root{overflow-x:hidden}` + `.hero{overflow:hidden}` are the
  backstops that clip the daisy bleed. Nav/hero/bento all use relative units and
  the bento collapses 4→2→1 (`@media 880/560px`). Statically confirmed no element
  exceeds the viewport at 375px.
- [x] **Reduced motion** — extended the `@media (prefers-reduced-motion: reduce)`
  block in v3.css: on top of the existing `.flower{animation:none}` +
  `.reveal{shown, no transition}`, it now also sets `transition:none` on
  `.btn`/`.shot`/`.pcard`/`.card` and `transform:none` on their `:hover`, so **no
  transform-based motion** runs under reduced motion (color/opacity hover feedback
  still applies). Every animated element currently rendered is covered;
  `nav a:hover` is opacity-only.
- **Files touched:** `components/v3/digital-home.tsx` (real image `alt` + `alt`
  field on the image `Shot` type) and `app/v3/v3.css` (reduced-motion extension).
  Hero/nav needed no changes. Live site untouched.
- **Verify:** `npx tsc --noEmit` clean; `npx eslint` on all four V13 components +
  page clean. Static-only per the machine constraint (no dev server / browser).
- **Issues / flags:** (1) The hero `<h1>` currently reads just **"Charlie Ramus"**
  (Charlie edited it during S2), which duplicates the `.hi` line "Hi, I'm Charlie
  Ramus" and leaves the hero without the mockup's thin-serif **tagline**. The
  layout/proportions are correct, but I'd recommend restoring a one-line tagline
  in the `<h1>` — happy to if Charlie wants (left as-is since the edit was
  deliberate). (2) Visual match to the mockup screenshots (exact daisy crop / card
  rhythm) still wants an eyeball on the Vercel preview, per the no-browser
  constraint. Not committed — awaiting Charlie's go-ahead.
