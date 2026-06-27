# REDESIGN — LOG V7: ZONE C (VERTICAL BENTO, EXPANDED)

The "more of me" section: section-colored bento tiles that actually link to the
real routes. Expanded to 2-3x the mockup length while staying interesting (varied
sizes and rhythm, no monotony). Depends on Logs V3, V6.

---

# Stage 1 — Bento grid + section-colored tiles + real links

- Build the responsive bento grid below the dashboard on `app/page.tsx`.
- Tiles: Photography, Writing, Web Projects, Design, Gear, Contact — each in its
  section color, Fraunces title + mono label + arrow affordance.
- Wire every tile to its real route (`/photography`, `/writing`, `/web-projects`,
  `/design`, `/gear`) — no dead tiles.

# Stage 1 Report
- [ ] Bento grid renders with section-colored tiles, both modes
- [ ] Every tile links to its real route (verified by navigation)
- Issues:

---

# Stage 2 — Expand length + keep it interesting

- Grow the section to ~2-3x: add rows mixing tile sizes (`col2`/`row2`/full-width),
  short feature blurbs, a stats strip (300k+ impressions, projects shipped), and
  pull-quotes or recent-items previews (latest writing/photos).
- Vary rhythm so scrolling stays engaging; avoid a uniform grid wall.

# Stage 2 Report
- [ ] Section is ~2-3x longer with varied tile sizes and content types
- [ ] Scroll stays visually interesting (no monotonous repetition)
- [ ] Added content uses real data where available
- Issues:

---

# Stage 3 — Halftone photo treatment

- Apply the dithered/halftone motif to the photography tile (and any portrait/
  photo previews) as Charlie's signature visual, in section sky color.
- CSS-driven (dot pattern/blend) or pre-processed asset; keep it performant.

# Stage 3 Report
- [ ] Halftone treatment applied to photo tile/previews, on-brand both modes
- [ ] No performance hit (no heavy filters on large images)
- Issues:

---

# Stage 4 — Wire real redirects + content sources

- Confirm previews (latest writing/photos) pull from existing sources
  (`lib/articles.ts`, `data/photos.ts`, content dirs), not hardcoded.
- All arrows/cards/links resolve to the correct destination.

# Stage 4 Report
- [ ] Previews sourced from real content, not hardcoded
- [ ] All links/redirects resolve correctly
- Issues:

---

# Stage 5 — Responsive grid

- Collapse 4-col → 2-col → 1-col cleanly; preserve hierarchy and color coding.
- No overflow; tap targets adequate on mobile.

# Stage 5 Report
- [ ] Grid reflows 4→2→1 without breakage
- [ ] Hierarchy + section colors preserved at all sizes
- Issues:
