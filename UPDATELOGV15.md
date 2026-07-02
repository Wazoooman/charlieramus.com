# REDESIGN — LOG V15: CONTACT + FLOWER FINALE + ASSEMBLY

**First read `V3-REDESIGN.md`.** This log finishes the `/v3` page: the contact
card, the full-bleed flower-grid finale, then assembles and QAs the whole
homepage and decides on launch. Source of truth for layout/CSS:
`mockups/hellodani-mockup.html` (contact card + flower grid finale).

Depends on: **V12, V13, V14** (all sections built). This log wires them into the
final page order and ships the QA pass.

---

# Stage 1 — Contact card

Reference the mockup's centered red "Get in touch" card (~53% wide, radius 40,
peace-hand SVG, "Think we vibe?", huge thin "Get in touch") + the grey pill tabs
tucked behind its bottom edge.

- `components/v3/contact.tsx`: the red contact card per the mockup.
- Wire the pill tabs (works/garden/x/linkedIn/dribbble in the mockup) to
  Charlie's **real** links — read `components/social-links.tsx` for the actual
  socials/handles; drop any Charlie doesn't have, add any he does.
- The big "Get in touch" CTA → Charlie's real contact (email/`mailto` or contact
  route). Copy in his voice.
- `<Reveal>` on entry. Sits **above** the flower grid finale.
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 1 Report
_TBD — fill after implementing (see UPDATELOGV6.md style)._

---

# Stage 2 — Flower-grid finale

Reference the mockup's full-bleed 8-column flower grid + centered "Great design
is always hidden in the plain sight." + tiny legal line.

- `components/v3/finale.tsx`: the full-bleed flower grid (port the mockup's JS
  grid builder to React using `<Flower>` — they wind-spin with per-flower
  variance), the centered quote, and a small real legal/footer line
  (© Charlie Ramus, year).
- Optionally swap the quote for one in Charlie's voice (confirm with him or keep
  the mockup's).
- Ensure the many flowers spinning stays performant (CSS transforms only;
  reduced-motion disables the spin).
- Verify `npx tsc --noEmit` + eslint clean.

# Stage 2 Report
_TBD — fill after implementing._

---

# Stage 3 — Full page assembly + responsive + a11y

- Assemble `app/v3/page.tsx` in final order: nav → hero → digital-home carousel →
  work bands → services → about collage → personal bento → contact → finale.
  (Confirm order against the mockup top-to-bottom.)
- Full responsive pass at 1440 / 768 / 375: no horizontal overflow anywhere;
  every section collapses cleanly.
- A11y sweep: headings in order, all images have real `alt`, links have
  accessible names, visible focus throughout, all motion respects
  `prefers-reduced-motion`, color contrast on dark sections.
- Verify `npx tsc --noEmit` + eslint clean. Push the `redesign-v12` branch (if
  Charlie approves) → check the Vercel preview URL.

# Stage 3 Report
_TBD — fill after implementing._

---

# Stage 4 — Launch decision

- Present Charlie the finished `/v3` (Vercel preview). Decide:
  - **Swap in**: point `app/page.tsx` at the new `/v3` composition (one change),
    retire or keep `/preview`, and ship; **or**
  - **Keep at `/v3`** for continued iteration.
- If full-site scope is chosen later, that becomes UPDATELOGV16+ (inner pages:
  photography gallery, writing/article, blog, design, gear, web-projects reskinned
  to this system, reusing the existing gallery/loading pipeline).
- Do the swap/commit **only when Charlie explicitly asks.**

# Stage 4 Report
_TBD — fill after implementing._
