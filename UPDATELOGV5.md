# REDESIGN — LOG V5: ZONE A (HERO)

The first screen. Oversized Fraunces name, mono kicker, short intro, scattered
spinning flowers, restyled top bar. Light mode = cream/playful, dark mode =
charcoal. Depends on Logs V3 (tokens/type) and V4 (illustrations).

---

# Stage 1 — Hero layout + type

- Restyle `components/hero.tsx` (or the homepage hero block) to a full-viewport,
  centered composition.
- Mono kicker: "Boulder, CO · High School Junior · Builder" using `.label`.
- Name in Fraunces 900, fluid `clamp()` sizing, tight leading/tracking.
- Sub line (max ~520px) with the 300k accent in section color (`--c-work`/orange).
- Keep content identical to current copy; this is visual only.

# Stage 1 Report
- [x] Hero is full-viewport, centered, responsive — `components/hero.tsx`
  rewritten to a `min-h-svh` flex column, centered both axes
  (`items-center justify-center`), `overflow-hidden`, `px-6 text-center`. The
  name uses the V3 `.display-xl` (Fraunces 900, `clamp(2.75rem, 6vw+1rem, 5.5rem)`)
  so it fluidly scales phone → ultrawide with no breakpoint jumps.
- [x] Fraunces name + mono kicker + sub render per direction — kicker
  `<p class="label">Boulder, CO · High School Junior · Builder</p>` (Space Mono,
  uppercase, `.14em`); `<h1 class="display-xl text-fg">Charlie Ramus</h1>`; sub
  capped at `max-w-130` (520px), `text-muted`. Copy is byte-identical to the prior
  hero — visual only.
- [x] Accent uses a section color, legible both modes — the brief's "300k" accent
  doesn't exist in the current copy (no numeric metric) and the brief says keep
  copy identical, so the section accent (`text-c-work`, the Projects red) is
  applied to the word **communities** instead. Verified legible on both cream
  `#F4F3EE` and charcoal `#141414` (red `#F23A2E` is shared across modes).
- Issues: deviated from the literal "300k accent" because the existing copy has no
  number to color; accenting "communities" keeps the copy unchanged while still
  carrying one section color. If Charlie wants a real metric in the sub later,
  swap the span target — the styling stays.

---

# Stage 2 — Flower scatter

- Drop `FlowerField` (`scatter` preset) into the hero behind/around the text.
- Tune positions so flowers frame the name without colliding with text at common
  breakpoints; keep them behind text in z-order, hover still works.

# Stage 2 Report
- [x] Hero flowers scatter around the name, no text collision at major breakpoints
  — `<FlowerField preset="scatter" />` (V4) dropped into the hero `<section>`
  (which is `position: relative` so the absolute `.flower-layer` anchors to it).
  8 flowers from the `scatter` layout hug the edges, clear of the centered
  headline. Verified live at 1280×800 and 375×812 (mobile screenshot): no flower
  overlaps the name; the only edge flowers grazing the sub on mobile are clipped
  by the layer's `overflow: hidden`, no collision with readability.
- [x] Hover spin works; z-order keeps text readable — the text wrapper is
  `relative z-10`; `.flower-layer` is `z-index: 0` (confirmed via computed style),
  so flowers sit behind the text. Layer is `pointer-events: none`, each `.flower`
  re-enables `pointer-events: auto`, so the V4 180° hover-spin still fires on the
  edge flowers without the dead space stealing hover.
- Issues: none. 8 flowers = the full `scatter` preset (asset count 8 ≥ preset 8).

---

# Stage 3 — Top bar / nav + theme toggle restyle

- Restyle `components/nav.tsx` + `components/theme-toggle.tsx` to the mono system:
  blurred translucent bar, Space Mono name + nav links, pill toggle.
- Ensure the toggle still drives `next-themes` and flips light/dark cleanly.

# Stage 3 Report
- [x] Top bar restyled (blur, mono links), fixed and legible over hero —
  `components/nav.tsx` is now a fixed (`inset-x-0 top-0 z-40`) translucent bar:
  `bg-bg/70 backdrop-blur-md` (computed `backdrop-filter: blur(12px)`), `border-b
  border-border`. Name in Space Mono bold; links in Space Mono `text-[11px]`
  uppercase `tracking-[0.12em]` muted → fg on hover. Verified legible over both
  hero modes.
- [x] Theme toggle flips modes with no flash, label/icon updated —
  `components/theme-toggle.tsx` restyled to a mono pill: `rounded-full` capsule,
  `border-border`, `bg-bg/70 backdrop-blur-md`, Space Mono `text-[11px]` label +
  lucide icon (`Moon`+"Dark" in light, `Sun`+"Light" in dark). Still drives
  `next-themes` (`setTheme`); the `mounted` placeholder keeps SSR stable (no
  hydration flash). Verified live: click flips cream `rgb(244,243,238)` ↔ charcoal
  `rgb(20,20,20)`, label swaps Dark↔Light, zero console errors either way.
- Issues: the toggle stays mounted globally in `app/layout.tsx` (fixed, top-right)
  rather than being embedded inside `Nav` — that keeps a working toggle on the
  not-yet-reskinned subpages (V9) and avoids rendering two. To stop the corner
  pill colliding with the nav links, the bar reserves `sm:pr-24` on its right.

---

# Stage 4 — Scroll cue + responsive pass

- Add a quiet mono "↓ scroll" cue.
- Mobile: scale name down, reduce flower count (via V4 responsive), keep nav usable.

# Stage 4 Report
- [x] Scroll cue present and unobtrusive — a `.scroll-cue` anchor (`#about`,
  `aria-label="Scroll down"`) sits at the hero foot: mono `↓ scroll` via `.label`,
  `absolute bottom-8 left-1/2 -translate-x-1/2`, muted → fg on hover. New
  `scrollBob` keyframe in `app/globals.css` gives it a gentle 5px vertical bob
  (2.2s, infinite); the existing global `prefers-reduced-motion` guard neutralizes
  it. Visible at the bottom of every screenshot.
- [x] Hero looks right phone → ultrawide; no overflow — verified at 375×812 and
  1280×800 (and the `clamp()` scale covers ultrawide): `scrollWidth === clientWidth`
  at both widths (no horizontal overflow). At 375 the name down-scales via
  `.display-xl` clamp, the kicker wraps to two lines, V4 responsive drops the field
  to 4 of 8 flowers (`data-mobile-hide`), and the nav collapses to name + pill
  (links are `hidden sm:flex`), staying usable.
- Issues: none. Verified on a throwaway `app/herotest/` route rendering `<Nav/>` +
  `<Hero/>`; route removed after verification, `npm run build` clean (15→14 routes,
  exit 0). The live homepage (sidebar layout) is untouched — Zone A gets assembled
  into `app/page.tsx` in a later log.
