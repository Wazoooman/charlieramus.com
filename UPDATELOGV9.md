# REDESIGN — LOG V9: SUBPAGES RESKIN

Bring every secondary route into the new system so the site is consistent end to
end: photography, writing/blog, web-projects, design, gear. Depends on Logs V3-V8.

---

# Stage 1 — Shared page chrome

- Restyle `components/back-button.tsx` and the per-page headers to the new tokens
  + mono labels / Fraunces titles.
- Ensure the restyled top bar (V5) and theme toggle work on every route.

# Stage 1 Report
- [ ] Back button + page headers restyled consistently
- [ ] Top bar / theme toggle functional on all subpages
- Issues:

---

# Stage 2 — Photography page

- Reskin `app/photography/page.tsx` + `photography-gallery.tsx` to the new palette
  (sky section color), apply halftone accent where fitting.
- Preserve all the V2 performance work (next/image, blur placeholders, dark
  skeleton, `unoptimized` Cloudflare fix) — do not regress loading.

# Stage 2 Report
- [ ] Photography gallery reskinned (palette + halftone), lightbox intact
- [ ] V2 image performance preserved (no white flash / slow-load regression)
- Issues:

---

# Stage 3 — Writing + blog article styling

- Update `.article-body` usage and `app/writing` + `app/blog` (incl. `[slug]`) to
  Fraunces headings + serif body, new link/quote/code styles, marigold accent.
- Verify MDX rendering (`next-mdx-remote`) still works.

# Stage 3 Report
- [ ] Writing/blog index + article pages reskinned, readable long-form
- [ ] MDX renders correctly; code/quote/list styles intact
- Issues:

---

# Stage 4 — Web-projects, design, gear pages

- Reskin `app/web-projects`, `app/design`, `app/gear` and their components
  (`WebProjects.tsx`, `WebProjectEntry.tsx`, `DesignProjects.tsx`,
  `CarouselLightbox.tsx`, `GearList.tsx`) to section colors (red/pink/cobalt).
- Keep the carousel/lightbox behavior; restyle only.

# Stage 4 Report
- [ ] Web-projects / design / gear reskinned to section colors
- [ ] Carousel + lightbox behavior preserved
- Issues:

---

# Stage 5 — Cross-page consistency pass

- Audit spacing, type scale, color usage, and motion across all routes for a
  single coherent system. Fix one-offs and drift.

# Stage 5 Report
- [ ] Spacing/type/color/motion consistent across every route
- [ ] No leftover old-style components or stray tokens
- Issues:
