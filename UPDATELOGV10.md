# REDESIGN — LOG V10: POLISH, QA, DEPLOY

Final pass: motion, light/dark parity, performance, cross-device QA, accessibility,
SEO, and ship. Depends on all prior logs.

---

# Stage 1 — Motion pass

- Unify hover/transition timing across panels, tiles, flowers, and the career
  expand. Decide the fate of `components/cursor-glow.tsx` (keep, restyle, or drop)
  and the Father's Day modal (likely remove — seasonal/out of date).
- Everything respects `prefers-reduced-motion`.

# Stage 1 Report
- [ ] Motion timing consistent system-wide
- [ ] Cursor-glow decision made + applied; stale seasonal modal handled
- [ ] Reduced-motion honored everywhere
- Issues:

---

# Stage 2 — Light/dark parity audit

- Verify every section reads well in both modes (light = playful, dark = dashboard):
  contrast, borders, section colors, halftone, flowers.

# Stage 2 Report
- [ ] All sections pass contrast + legibility in both modes
- [ ] Section colors + borders tuned per mode where needed
- Issues:

---

# Stage 3 — Performance

- Re-run the image/font checks; fold in open items from `UPDATELOGV2.md`
  (quality props / webp verification / Fast-3G white-flash manual check).
- Confirm `next/font` self-hosting (no render-blocking font requests); check
  bundle for accidental client `fs` or large client components.

# Stage 3 Report
- [ ] Image + font performance verified; UPDATELOGV2 open items closed/triaged
- [ ] No render-blocking fonts; no client-bundle leaks
- [ ] `npm run build` clean
- Issues:

---

# Stage 4 — Cross-device QA

- Manually QA on phone / tablet / laptop / ultrawide: dashboard dots+arrows,
  career expand overlay, flower scatter/field, bento reflow, all links.
- Optionally drive with the gstack browser / `/qa`.

# Stage 4 Report
- [ ] Dashboard nav + career expand work on touch + desktop
- [ ] Flowers, bento, links verified across breakpoints
- [ ] No console errors / hydration warnings
- Issues:

---

# Stage 5 — Accessibility + SEO/meta

- Keyboard nav, focus states, ARIA, alt text across the redesign.
- Verify `app/layout.tsx` metadata/OG still accurate; update any redesign-affected
  copy or images.

# Stage 5 Report
- [ ] A11y pass (keyboard, focus, ARIA, alt) across new UI
- [ ] Metadata/OG accurate post-redesign
- Issues:

---

# Stage 6 — Final review + deploy

- Full diff review, update `DESIGN.md` if anything drifted, then deploy
  (Cloudflare Pages via the existing build pipeline / `/land-and-deploy`).
- Smoke-test production: load speed, both modes, key interactions.

# Stage 6 Report
- [ ] Diff reviewed; DESIGN.md reconciled
- [ ] Deployed to production successfully
- [ ] Production smoke test passed (speed, modes, interactions)
- Issues:
