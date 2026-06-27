# REDESIGN — LOG V8: CLOSING FLOWER-FIELD QUOTE

The finale: a full-screen section with the memorable quote centered and ringed by
the drop-in flower images (the ref-2 "flower field" moment). Then the footer.
Depends on Logs V3, V4.

---

# Stage 1 — Full-screen quote + flower field

- Add a full-viewport section at the bottom of `app/page.tsx`.
- Center a short memorable quote in Fraunces; surround it with `FlowerField`
  (`field` preset) filling the screen around the text (dense ring/grid).
- Quote text easily editable (one constant/prop). Confirm hover spin works here too.

# Stage 1 Report
- [ ] Full-screen section with centered Fraunces quote
- [ ] Dense flower field surrounds the quote (uses drop-in assets)
- [ ] Quote is easily editable; flowers spin on hover
- Issues:

---

# Stage 2 — Footer restyle

- Restyle the footer to the mono system: name · location · year, plus social
  links (reuse the existing social set from `components/sidebar.tsx`).

# Stage 2 Report
- [ ] Footer restyled (mono), socials present and correct
- Issues:

---

# Stage 3 — Responsive + motion

- Mobile: reduce flower density (via V4), keep the quote centered and legible.
- Respect `prefers-reduced-motion`; ensure the field doesn't cause overflow/CLS.

# Stage 3 Report
- [ ] Quote + field readable and contained on mobile
- [ ] Reduced-motion respected; no overflow/CLS
- Issues:
