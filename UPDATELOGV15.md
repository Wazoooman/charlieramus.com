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

- [x] `components/v3/contact.tsx` — new server component porting the mockup's red
  "Get in touch" card. Structure matches the mockup 1:1: `<section class="contact">
  <div class="wrap">` → `.box` (peace-hand SVG `.peace`, "Think we vibe?" `.vibe`,
  huge CTA `.huge`) + the `.pills` row tucked behind the card's bottom edge. All
  layout/CSS was already ported to `app/v3/v3.css` in V12 (`.contact .box/.peace/
  .vibe/.huge`, `.pills`, `.legal-min`), so this stage is content-only.
- [x] Peace-hand SVG copied verbatim from the mockup (`viewBox 0 0 40 48`,
  `stroke="#fff"`), marked `aria-hidden` (decorative).
- [x] Big CTA is now a real `<a class="huge" href="mailto:charlie.ramus12@gmail.com">
  Get in touch</a>` (inherits `#fff`, no underline, and the `:focus-visible` ring
  from `& a` in v3.css). Kept "Think we vibe?" / "Get in touch" — already in
  Charlie's voice.
- [x] Pills wired to Charlie's **real** links via `socialHref(label)` reading
  `components/social-links.tsx` (single source of truth). Mockup had
  works/garden/x/linkedIn/dribbble; Charlie has no X or Dribbble so those dropped.
  Final pills: `works`→`#work`, `garden`→`#garden` (real on-page anchors, verified
  present in work.tsx/services.tsx), then `linkedIn`, `github`, `photography`
  (Instagram Photography), `letterboxd`. Internal `#` anchors open in place;
  socials get `target="_blank" rel="noreferrer noopener"`.
- [x] Entry motion via `<Reveal>` on both `.box` and `.pills` (matches the mockup's
  `.reveal` on those nodes; reduced-motion handled in v3.css).
- [x] Wired into `app/v3/page.tsx` after the `#personal` bento — the last section
  for now; the flower-grid finale (S2) will sit below it.
- [x] `npx tsc --noEmit` clean; `npx eslint components/v3/contact.tsx app/v3/page.tsx`
  clean.

Issues: None. Could not view rendered output (dev server / browser automation
crash this machine — static verification only); visual confirmation deferred to
the Vercel preview per the V3 brief.

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

- [x] `components/v3/finale.tsx` — new server component porting the mockup's
  full-bleed flower-grid finale. Structure matches the mockup: `<section
  class="finale">` → `.grid-flowers` (8-col grid, full-bleed, NOT inside `.wrap`)
  + the centered `.center-text` quote floating over it, then a `.legal-min` line
  below. All CSS (`.finale`, `.grid-flowers`, `.center-text`, `.legal-min`, and the
  880px `repeat(5,1fr)` fallback) was already ported to v3.css in V12.
- [x] Grid builder ported from the mockup's inline `<script>` to a render-time
  `Array.from({length: 40})` — no `<script>`, no `dangerouslySetInnerHTML`. Same
  index math: `PET`/`COR` palettes verbatim, petal `= PET[(i*3+(i%2))%5]`, core
  `= COR[(i*5)%6]` with white fallback on collision, petals `= 5+(i%4)`. Each cell
  is a `<Flower petal core petals index={i} />`.
- [x] Spin performance: reuses the existing `<Flower>` (V12) — CSS `windspin`
  transform only, per-flower `--spin-dur`/`--spin-delay` derived deterministically
  from `index` (no hydration mismatch, no JS per frame), and disabled under
  `prefers-reduced-motion` via v3.css. 40 spinning flowers = 40 cheap composited
  transforms.
- [x] Kept the mockup's quote "Great design is always / hidden in the plain sight."
  (rendered as a `<p class="center-text">`, real `<br>`). No `<Reveal>` — the
  mockup reveals neither the grid nor the quote, and a reveal `transform` would
  clobber the quote's `translate(-50%,-50%)` centering.
- [x] Real legal line: `© {new Date().getFullYear()} Charlie Ramus` (computed on
  the server, so no client hydration mismatch) — replaces the mockup's "mockup
  layout study · placeholder content" placeholder.
- [x] Wired into `app/v3/page.tsx` as the final element, below `<Contact />`.
- [x] `npx tsc --noEmit` clean; `npx eslint components/v3/finale.tsx app/v3/page.tsx`
  clean.

Issues: None. Static verification only (dev server / browser automation crash this
machine); the spinning grid + quote overlay need a visual pass on the Vercel
preview. Decision left open per the brief: swapping the quote for one in Charlie's
voice — kept the mockup's for now.

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
