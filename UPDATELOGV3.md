# REDESIGN — LOG 01: FOUNDATION (TOKENS, TYPE, GLOBALS)

Full reskin of charlieramus.com. Keep every file, route, and component; change
only design tokens, typography, layout, and motion. This log lays the foundation:
the color system, fonts, and base styles every later log builds on. No layout
or component restructuring happens here.

Reference direction: light mode = cream/playful editorial; dark mode =
charcoal/dashboard. Section colors carry wayfinding, not decoration.

---

# Stage 1 — Color token system

Rewrite the `:root` and `.dark` blocks in `app/globals.css` to the new palette,
keeping the existing variable names so nothing downstream breaks.

- Base: `--bg` cream `#F4F3EE` / dark `#141414`; `--fg` ink `#141414` / cream `#F4F3EE`.
- Keep `--muted`, `--rule`, `--surface`; add `--panel` and `--border` for the
  dashboard cards (light `#FBFAF6` / `#E3E1DA`, dark `#1A1A1A` / `#2A2A2A`).
- Add the section palette as global tokens: `--red #F23A2E`, `--cobalt #1B2BD6`,
  `--sky #6FC5E8`, `--marigold #F7B500`, `--pink #F58FB5`, keep `--orange #FA5B1C`.
- Add semantic aliases so components reference roles, not raw colors:
  `--c-experience: var(--cobalt)`, `--c-work: var(--red)`,
  `--c-photo: var(--sky)`, `--c-writing: var(--marigold)`, `--c-design: var(--pink)`.
- Register everything under `@theme inline` so Tailwind utilities
  (`bg-panel`, `text-cobalt`, `border-border`, etc.) compile and resolve at runtime.
- Tune `--sky`/`--marigold` per mode if contrast needs it (sky reads darker on cream).

# Stage 1 Report
- [x] `:root` + `.dark` updated; existing variable names preserved (`--bg/--fg/--muted/--rule/--surface/--orange/--accent` all kept — no downstream breakage)
- [x] `--panel` / `--border` added for both modes (light `#fbfaf6` / `#e3e1da`, dark `#1a1a1a` / `#2a2a2a`)
- [x] Section palette + semantic `--c-*` aliases added (`--c-experience/-work/-photo/-writing/-design` → cobalt/red/sky/marigold/pink)
- [x] `@theme inline` exposes all new tokens as Tailwind utilities (`bg-panel`, `border-border`, `text-cobalt`, `text-c-experience`, …)
- [x] Contrast checked: section colors tuned per mode for legibility (see Issues)
- Issues: Per-mode tuning beyond the spec's sky/marigold note was needed for legibility as text/borders. Light mode: `--sky` darkened `#6fc5e8`→`#2f9cc9`, `--marigold` darkened `#f7b500`→`#c2890c`, `--pink` deepened `#f58fb5`→`#e86ca0`. Dark mode: `--cobalt` brightened `#1b2bd6`→`#4f61e8` (raw cobalt is dark-on-dark on charcoal). Bright brand values are retained in the mode where they read well. If later logs need the bright hues for backgrounds/illustration in *both* modes, add `-bright` variant tokens then.

---

# Stage 2 — Typography (Fraunces + Space Mono + body grotesque)

Swap the single Inter setup in `app/layout.tsx` for the new pairing using
`next/font/google` (self-hosted, no layout shift, no external request).

- Display: `Fraunces` (weights 400/600/900, opsz/optical-size on) → `--font-display`.
- Mono: `Space Mono` (400/700) → `--font-mono`, for labels, meta, timeline years.
- Body: keep `Inter` (or evaluate `Geist`) → `--font-sans`.
- Apply all three `.variable` classes on `<html>`; map in `@theme inline`:
  `--font-display`, `--font-mono`, `--font-sans`.
- Set body to `--font-sans`. Confirm `display: "swap"` and subsetting are on.

# Stage 2 Report
- [x] Fraunces, Space Mono, Inter loaded via `next/font/google` (kept Inter for body per spec)
- [x] Font CSS variables wired on `<html>` (`--font-fraunces`, `--font-space-mono`, `--font-inter`) and mapped in `@theme inline` (`--font-display`, `--font-mono`, `--font-sans`)
- [x] `display: "swap"` set on all three; `subsets: ["latin"]` on all three (self-hosted, no external request); `npm run build` clean, no CLS
- [x] No old standalone Inter import to remove — Inter retained as body; added Fraunces/Space Mono alongside it
- Issues: Fraunces is a variable font — next/font rejects `axes` together with an explicit `weight` array ("Axes can only be defined for variable fonts when the weight property is nonexistent or set to `variable`"). Dropped the `weight: ["400","600","900"]` and left it variable; the variable face covers the full 400–900 range the type scale needs while keeping the `opsz` optical-size axis on. Space Mono (non-variable) keeps its explicit `["400","700"]`.

---

# Stage 3 — Base globals, type scale, and utility classes

Establish the shared primitives later logs reuse, in `app/globals.css`.

- Body: cream/ink, `font-size` and `line-height` baseline; smooth scroll kept.
- `.label` utility: Space Mono, ~11px, uppercase, `letter-spacing .14em`, `--muted`.
- Display scale on `.serif`/headings using Fraunces with `clamp()` for fluid sizing.
- Reusable `.panel` shell (bg `--panel`, `1px` `--border`, radius, padding) as the
  dashboard card primitive Log 04 will consume.
- Keep `.article-body` but retarget headings to `--font-display` and verify it
  still reads well; keep `.scrollbar-hide`, lightbox + Father's Day keyframes intact.
- Add `@media (prefers-reduced-motion: reduce)` global guard for later motion.

# Stage 3 Report
- [ ] `.label`, display scale, `.panel` primitive added
- [ ] `.article-body` headings retargeted to display font, still legible
- [ ] Existing keyframes / `.scrollbar-hide` preserved
- [ ] `prefers-reduced-motion` global guard in place
- Issues:

---

# Stage 4 — Build verification + DESIGN.md source of truth

Lock the foundation before any feature log builds on it.

- Run `npm run build`; confirm zero errors and no Tailwind "unknown utility" warnings.
- Spot-check existing pages render with new tokens/fonts and nothing is unstyled
  (theme toggle still flips cleanly, no white flash regressions).
- Write `DESIGN.md`: palette + section colors, type pairing + scale, spacing,
  the three-zone architecture, and the illustration-system contract (Log 02).

# Stage 4 Report
- [ ] `npm run build` clean (no errors / unknown-utility warnings)
- [ ] Existing pages render correctly under new tokens + fonts, both modes
- [ ] `DESIGN.md` written as the design source of truth
- Issues:
