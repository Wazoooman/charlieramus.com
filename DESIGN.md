# DESIGN.md — charlieramus.com design system

Source of truth for the full reskin. The site keeps every existing route,
component, and file; only design tokens, typography, layout, and motion change.
This document is written after Log 01 (Foundation) and is the contract the
feature logs (02–10) build against.

Two modes, one layout, two skins:

- **Light mode** — warm cream / playful editorial. Big characterful serif, bright
  primary palette, hand-drawn flower illustrations. (ref: "Daniella")
- **Dark mode** — charcoal / dashboard. Dense bordered panels, mono micro-labels,
  timelines. (ref: "Mackenzie Child")

---

## 1. Color

All colors are CSS custom properties in [app/globals.css](app/globals.css),
exposed to Tailwind via `@theme inline` (utilities: `bg-panel`, `text-cobalt`,
`border-border`, `text-c-experience`, …). Existing variable names are preserved
so nothing downstream breaks.

### Base

| Token        | Light       | Dark        | Role                              |
|--------------|-------------|-------------|-----------------------------------|
| `--bg`       | `#f4f3ee`   | `#141414`   | page canvas (cream / charcoal)    |
| `--fg`       | `#141414`   | `#f4f3ee`   | primary text (ink / cream)        |
| `--muted`    | `#878680`   | `#717171`   | secondary text                    |
| `--rule`     | `#dddcd7`   | `#272727`   | hairline dividers                 |
| `--surface`  | `#eaeae5`   | `#1e1e1e`   | inset surfaces, code blocks       |
| `--panel`    | `#fbfaf6`   | `#1a1a1a`   | dashboard card fill               |
| `--border`   | `#e3e1da`   | `#2a2a2a`   | dashboard card border             |
| `--accent`   | `#141414`   | `#fa5b1c`   | interactive accent (ink / orange) |

### Section palette (wayfinding, not decoration)

Each content area owns a signature color. Values are tuned **per mode** for
legibility as text/borders — bright on charcoal, deepened on cream.

| Token         | Light       | Dark        | Brand hue   |
|---------------|-------------|-------------|-------------|
| `--red`       | `#f23a2e`   | `#f23a2e`   | red         |
| `--cobalt`    | `#1b2bd6`   | `#4f61e8`   | cobalt      |
| `--sky`       | `#2f9cc9`   | `#6fc5e8`   | sky         |
| `--marigold`  | `#c2890c`   | `#f7b500`   | marigold    |
| `--pink`      | `#e86ca0`   | `#f58fb5`   | pink        |
| `--orange`    | `#fa5b1c`   | `#fa5b1c`   | orange      |

Tuning rationale: raw `--cobalt` is dark-on-dark on charcoal, so dark mode
brightens it; raw `--sky`/`--marigold`/`--pink` are light-on-cream, so light mode
deepens them. The bright brand hex is retained in the mode where it reads well.
If a later log needs the bright hue for backgrounds/illustration in *both* modes,
add `-bright` variant tokens rather than overloading these.

### Semantic aliases (reference the role, not the hue)

| Token            | → maps to     | Content area              |
|------------------|---------------|---------------------------|
| `--c-experience` | `--cobalt`    | Experience / career       |
| `--c-work`       | `--red`       | Projects / web            |
| `--c-photo`      | `--sky`       | Photography               |
| `--c-writing`    | `--marigold`  | Writing / stories         |
| `--c-design`     | `--pink`      | Design                    |

Components must reference the `--c-*` role token, not the raw color, so a palette
change in one place propagates everywhere.

---

## 2. Typography

Loaded with `next/font/google` (self-hosted, `display: "swap"`, latin subset, no
external request) in [app/layout.tsx](app/layout.tsx). Variables wired on `<html>`
and mapped in `@theme inline`.

| Role     | Family       | next/font var       | `@theme` token   | Tailwind   | Use                                   |
|----------|--------------|---------------------|------------------|------------|---------------------------------------|
| Display  | Fraunces     | `--font-fraunces`   | `--font-display` | `font-display` | hero, headings (variable wght, `opsz` on) |
| Mono     | Space Mono   | `--font-space-mono` | `--font-mono`    | `font-mono`    | labels, meta, timeline years (400/700)|
| Body     | Inter        | `--font-inter`      | `--font-sans`    | `font-sans`    | body copy (400/500/700), default `body`|

Note: Fraunces is loaded as a variable font (weight left variable so the `opsz`
optical-sizing axis can stay on — next/font rejects `axes` alongside an explicit
weight array). The variable face covers the 400/600/900 the scale uses.

### Type scale (utility classes in globals.css)

Fluid via `clamp()`, no layout shift.

| Class         | Weight | `font-size` clamp                        | line-height | Use                |
|---------------|--------|------------------------------------------|-------------|--------------------|
| `.display-xl` | 900    | `clamp(2.75rem, 6vw + 1rem, 5.5rem)`     | 0.95        | hero name          |
| `.display-lg` | 600    | `clamp(2rem, 4vw + 1rem, 3.5rem)`        | 1.0         | zone headers       |
| `.display-md` | 600    | `clamp(1.5rem, 2vw + 1rem, 2.25rem)`     | 1.1         | card / panel titles|
| `.display-sm` | 600    | `clamp(1.25rem, 1.2vw + 1rem, 1.6rem)`   | 1.15        | sub-headings       |
| `.serif`      | 400    | inherit                                  | inherit     | family helper only |
| `.label`      | 400    | `11px`, uppercase, `letter-spacing .14em`, `--muted` | — | mono micro-labels |

Body baseline: `15px / 1.7`, `--font-sans`. `.article-body` keeps its readable
serif body but retargets headings to `--font-display`.

---

## 3. Spacing & shape

- Card primitive `.panel`: `--panel` fill, `1px solid --border`, radius `0.75rem`,
  padding `1.5rem`. This is the dashboard card Log 04 (Zone B) is built on.
- Radius scale: `0.75rem` cards, smaller insets at `0.2–0.375rem` (code/pre).
- Hairlines use `--rule`; card edges use `--border`.

---

## 4. Three-zone page architecture

The homepage is composed of three stacked zones (built in Logs 05–08):

- **Zone A — Hero.** Big serif (`.display-xl`) header with scattered, hover-spinning
  flower illustrations. (Log 05)
- **Zone B — Dashboard.** Horizontal-scroll dense bordered `.panel` cards: About,
  Career Journey timeline, Highlighted Work, Side Projects, Exploring. Dot + arrow
  nav for short screens (kept alongside the scrollbar). Career-journey cards are
  clickable and explode/expand to fullscreen in place. (Log 06)
- **Zone C — Bento.** Vertical bento tiles (photography, writing, web, design, gear,
  contact), expanded 2–3× longer while staying interesting. Every tile/card links
  to a real route. (Log 07)
- **Closing — Flower field.** Full-screen memorable quote ringed by flower
  illustrations; reusable "quote surrounded by flowers" section type. (Log 08)

Motion respects `prefers-reduced-motion: reduce` via a global guard in globals.css
(neutralizes animation, transition, and smooth-scroll).

---

## 5. Illustration system contract (Log 02)

Drop-in, zero-code-edit illustration system:

- Folder: `public/illustrations/`, files `illustration-1..10.svg` / `.webp`
  (7–10 variants, customizable).
- A **server component** reads the directory at build time and passes the file
  list down.
- A **client component** scatters the illustrations across a zone and spins each
  ~180° on hover.
- Swapping/adding files in the folder updates the site with no code changes.

Signature motif: a halftone / dithered treatment on the portrait and photo
thumbnails (Charlie's photographer-flavored counterpart to the flowers).

---

## 6. Build & verification

`npm run build` is clean (no errors, no Tailwind unknown-utility warnings). Both
modes verified rendering correctly with the new tokens + fonts: light resolves to
cream `#f4f3ee`, dark to charcoal `#141414`, theme toggle flips with no white
flash, no console errors, nothing unstyled.
