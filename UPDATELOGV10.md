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
- [x] Motion timing consistent system-wide
- [x] Cursor-glow decision made + applied; stale seasonal modal handled
- [x] Reduced-motion honored everywhere
- **Timing unification.** The site already had a coherent transform vocabulary —
  tile/panel lifts and small transforms at `duration-300` (bento panel, arrows,
  contact-card tabs), large-surface moves at `duration-500` (bento image zoom,
  contact-card color invert), decorative flower spin at 600ms, and the tuned
  overlay entrances (`dash-*`, `fd-*`, `lb-*`) on `cubic-bezier(0.22,1,0.36,1)`.
  The one real inconsistency was the color/opacity **micro-hovers**: most used
  the established `duration-200`, but a handful fell back to Tailwind's bare 150ms
  default. Normalized those to `duration-200`: `nav` (name + links), `back-button`,
  `page-header` back link, and the dashboard controls — career-row hover
  (`transition-colors`), the "View details" reveal (`transition-opacity`), the
  prev/next arrow buttons + the active-dot (`transition`/`transition-all`), and
  the career-modal close button. Bare `transition` on the bg-only buttons became
  the precise `transition-colors` while I was there.
- **Cursor-glow → kept + restyled (not dropped).** The ambient dark-mode glow is a
  nice touch, but `components/cursor-glow.tsx` drove it through a `useState`
  updated on every `mousemove`, re-rendering the component (and rebuilding the
  gradient string) on each event. Rewrote it to write `--gx/--gy` straight to the
  node via a ref, so tracking the cursor now costs zero React re-renders; the
  visual is byte-for-byte the same radial gradient. Also added explicit coarse-
  pointer and `prefers-reduced-motion` bail-outs (no listener attached at all),
  and hoisted the excluded routes into a `HIDDEN_PATHS` constant. The now-orphaned
  `hooks/useMousePosition.ts` (its only consumer) was deleted.
- **Stale seasonal modal → removed.** The Father's Day modal was date-gated to
  2026-06-21 (today is 2026-06-30) and could never render again. Deleted
  `components/fathers-day-modal.tsx` and unwired it from `app/layout.tsx`. In
  `globals.css` I pruned the modal-only CSS it left behind (`fdOverlayOut`/
  `fdCardOut`/`fdConfetti` keyframes and the `.fd-overlay-out`/`.fd-card-out`/
  `.fd-confetti`/`.fd-note` classes) but **kept** `fdOverlayIn`/`fdCardIn` +
  `.fd-overlay-in`/`.fd-card-in` — the photography modals (V11 S2) reuse those for
  their soft open — and relabeled the comment to reflect the shared ownership.
- **Reduced motion.** The global guard in `globals.css` still neutralizes every
  animation/transition/smooth-scroll; flowers keep their extra explicit guard; and
  cursor-glow now opts out of its own listener under `prefers-reduced-motion`.
- Issues: the Father's Day photo asset (`/public/images/fathers-day-images/
  fathers-day.webp`) is now unreferenced. Left in place — it's not bundled/shipped
  unless requested, so it's harmless; can be swept in a later cleanup if wanted.
  `tsc --noEmit` clean.

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
