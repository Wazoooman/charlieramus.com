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
- [ ] Hero is full-viewport, centered, responsive
- [ ] Fraunces name + mono kicker + sub render per direction
- [ ] Accent number uses a section color, legible both modes
- Issues:

---

# Stage 2 — Flower scatter

- Drop `FlowerField` (`scatter` preset) into the hero behind/around the text.
- Tune positions so flowers frame the name without colliding with text at common
  breakpoints; keep them behind text in z-order, hover still works.

# Stage 2 Report
- [ ] Hero flowers scatter around the name, no text collision at major breakpoints
- [ ] Hover spin works; z-order keeps text readable
- Issues:

---

# Stage 3 — Top bar / nav + theme toggle restyle

- Restyle `components/nav.tsx` + `components/theme-toggle.tsx` to the mono system:
  blurred translucent bar, Space Mono name + nav links, pill toggle.
- Ensure the toggle still drives `next-themes` and flips light/dark cleanly.

# Stage 3 Report
- [ ] Top bar restyled (blur, mono links), fixed and legible over hero
- [ ] Theme toggle flips modes with no flash, label/icon updated
- Issues:

---

# Stage 4 — Scroll cue + responsive pass

- Add a quiet mono "↓ scroll" cue.
- Mobile: scale name down, reduce flower count (via V4 responsive), keep nav usable.

# Stage 4 Report
- [ ] Scroll cue present and unobtrusive
- [ ] Hero looks right phone → ultrawide; no overflow
- Issues:
