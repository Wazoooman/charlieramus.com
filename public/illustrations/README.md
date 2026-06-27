# Illustrations (drop-in flowers)

This folder is the **single drop-in location** for the decorative flower
illustrations that scatter across the hero and ring the closing quote field.
Add, remove, or swap files here and the site picks them up automatically — **no
code edits required**.

## Naming convention

```
illustration-1.svg
illustration-2.svg
illustration-3.webp
illustration-4.svg
…
illustration-N.(svg|webp)
```

- Files **must** be named `illustration-<n>.<ext>` where `<n>` starts at `1`.
- Numbering should be **contiguous** (1, 2, 3, … N). The build reads them in
  numeric order, so a gap just means that slot is skipped.
- **Mixed formats are allowed** — some can be `.svg`, others `.webp`.
- Anything not matching `illustration-<n>.(svg|webp)` is ignored (including this
  `README.md`).

## Supported formats

| Format  | Use it for                                              |
| ------- | ------------------------------------------------------- |
| `.svg`  | Flat vector flowers — crispest, smallest, preferred.    |
| `.webp` | Raster art / textured or painted flowers.               |

## Art guidelines

- **Aspect:** roughly **square** (e.g. `200×200` viewBox or `400×400` raster).
  The render rotates each flower 180° on hover, so off-square art will wobble.
- **Background:** **transparent** — these sit on top of colored sections.
- **Target count:** **7–10 variants** for a varied scatter. Fewer works; the
  field just repeats less.
- **Palette:** stick to the redesign palette in `DESIGN.md` (red `#F23A2E`,
  cobalt `#1B2BD6`, sky `#6FC5E8`, marigold `#F2A900`, pink `#F58FB5`, orange
  `#FA5B1C`) with ink `#141414` outlines so flowers read in both light and dark
  mode.

## Current seed assets

`illustration-1.svg` … `illustration-6.svg` plus `illustration-7.webp` and
`illustration-8.webp` are **placeholder** flowers generated from the palette.
Replace them with final art when ready — same names, drop them in, done.
