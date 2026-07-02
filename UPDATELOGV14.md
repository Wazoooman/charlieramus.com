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
_TBD — fill after implementing (see UPDATELOGV6.md style)._

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
_TBD — fill after implementing._

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
