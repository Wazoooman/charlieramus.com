# V3 REDESIGN — MASTER BRIEF

**Read this file first.** Every `UPDATELOGV12–V15.md` assumes it. Each updatelog
runs in its own fresh Claude Code chat, so this brief is the shared context.

---

## What we're building

A faithful port of `mockups/hellodani-mockup.html` into the Next.js app as a new
homepage, living at the **`/v3`** route. The mockup's layout **and CSS are the
design system** — we reproduce it near-verbatim, then fill it with Charlie's
real data and polish it. This is intentionally its own "mini app": it shares
**only data** with the live site, not styling.

- **DO** port the mockup's CSS, palette, fonts (Libre Baskerville / Inter /
  Caveat), and section layout as-is.
- **DO NOT** use the live site's house design system for `/v3` — not the Tailwind
  tokens in `app/globals.css` (`--bg`, `c-experience`, `.panel`, `.display-*`,
  Fraunces/Space Mono, `.halftone`, etc.). Those belong to the current site and
  `/preview`. `/v3` is a different look.
- Keep the live homepage (`app/page.tsx`) and the older reskin (`app/preview`)
  **completely untouched**.

The mockup's placeholder copy ("Project One", "Hi I'm [your name]") is replaced
with Charlie's real content and voice — see the data map below. Charlie is a high
school junior in Boulder (software, communities, photography, design). Don't
invent a fake résumé; derive things like the career timeline's year range from
the **real** entries (2025–2026), not the mockup's fake 2020–2027 axis.

---

## Architecture

Route: **`app/v3/`** (normal folder → URL `/v3`). **Not** a route group —
`app/(v3)/` has empty parens, adds no URL segment, and would collide with `/`.

```
app/v3/
  layout.tsx   ← nested layout: loads Libre Baskerville / Inter / Caveat via
                 next/font/google (scoped here, NOT in app/layout.tsx); imports
                 ./v3.css; wraps children in <div className="v3-root"> which sets
                 the paper bg / base font / color.
  v3.css       ← the mockup's entire <style> block, ported. Every selector is
                 namespaced under `.v3-root` so it cannot collide with globals.css
                 or Tailwind. The mockup's :root vars go on `.v3-root { … }`.
  page.tsx     ← assembles the section components in order.
components/v3/  ← one component per mockup section + shared primitives
                 (flower.tsx, reveal.tsx, etc.).
```

**Global chrome must not bleed onto `/v3`.** The root `app/layout.tsx` renders
`<ThemeToggle/>` and `<CursorGlow/>` globally. In V12 S1, make each return `null`
when `usePathname()` starts with `/v3` (they're already client components). Do
**not** restructure the root layout — this keeps the live site zero-risk.

CSS-porting rules:
- Paste the mockup CSS into `v3.css`; wrap so every rule is scoped, e.g. put the
  `:root` custom properties on `.v3-root`, and prefix component rules with
  `.v3-root ` (or wrap the whole sheet in `.v3-root { … }` using nesting).
- The mockup uses `vw/vh` units for proportional scale — keep them; that's how it
  holds proportions. Do a responsive pass per section (mockup has an
  `@media (max-width: …)` block — port it too).
- Convert the mockup's inline `<script>` to React (see Motion below). No inline
  `<script>` tags.

---

## Motion

The mockup's JS becomes React. Two shared primitives (build in V12 S2, reuse
everywhere):

**`components/v3/flower.tsx`** — ports the mockup's `flowerSVG(petal, core, n)`
generator to a React component that renders the daisy SVG. Fills the role of the
mockup's `[data-flower]` elements. Used in hero, tiles, and the finale grid.

**Flower wind-spin animation** (replaces the mockup's tiny hover-shift). Full
360° continuous rotation eased like a gust of wind — slow build → fast middle →
ease out → brief rest → loop — and **varied per flower** so the field looks
flowy, never synchronized:

```css
@keyframes windspin {
  0%   { transform: rotate(0deg); }     /* rest */
  18%  { transform: rotate(24deg); }    /* slow build */
  55%  { transform: rotate(300deg); }   /* gust — fast middle */
  82%  { transform: rotate(360deg); }   /* ease out */
  100% { transform: rotate(360deg); }   /* hold, then loop */
}
.v3-root .flower {
  animation: windspin var(--spin-dur, 8s) ease-in-out infinite;
  animation-delay: var(--spin-delay, 0s);
}
@media (prefers-reduced-motion: reduce) {
  .v3-root .flower { animation: none; }  /* keep the resting tilt only */
}
```

Per-flower `--spin-dur` (~6–11s) and `--spin-delay` create the variance.
**Derive them deterministically from the flower's index** (e.g. a small hash of
`i`), NOT `Math.random()` at render — random-at-render causes SSR/hydration
mismatches. (If you must randomize, set the vars in a `useEffect` after mount.)

**`components/v3/reveal.tsx`** — a client wrapper that adds an `.in` class when
the element scrolls into view (IntersectionObserver), reproducing the mockup's
`.reveal` fade-up. Respect `prefers-reduced-motion` (show immediately, no
transition).

All motion honors `prefers-reduced-motion`.

---

## Data map (share only data with the live site)

Read the actual file for exact shapes before wiring — don't assume fields.

| Content | Import / source | Notes |
|---|---|---|
| Experience / career | `import { entries } from "@/data/experience"` | Already extracted. `Experience` type: `dates,title,org,href,links,description,tags` + optional `logo,logoBg,logoFg,start,end`. Newest-first. |
| Photos / gallery | `import { photos } from "@/data/photos"` | `Photo`: `src,thumb,alt,ratio,caption?,code?,blurDataURL?`. Author via `public/photos/gallery.json` → `npm run sync-gallery` (handles webp downscale, thumbs, blur). Use `next/image` with `placeholder="blur"`. |
| Essays | `getAllArticles()` from `@/lib/articles` (server-only) | `slug,title,date,author,headerImage?,externalLink?`. Sorted newest-first. MDX in `content/articles/`. Route `/writing/[slug]`. |
| Blog / journal | `getAllPosts()` from `@/lib/posts` | `Post` incl. `title`. Route `/blog/[slug]`. |
| Web projects | `components/projects.tsx` / `WebProjectEntry.tsx` | Route `/web-projects`. Check the file for an exported array. |
| Design work | `components/DesignProjects.tsx` | Route `/design`. |
| Gear | `components/GearList.tsx` | Route `/gear`. |
| Socials | `components/social-links.tsx` | Real links for the contact section. |
| Bio / about | `components/about.tsx` (exports `aboutParagraphs`) | For the "Behind the pixels" collage. |
| Stories | `data/stories.ts` | Supporting content. |

If a section needs data that doesn't exist yet (e.g. services copy), add it as a
typed file in `data/` with `// CUSTOMIZE` comments (the house pattern) rather than
hardcoding into JSX — keeps content easy for Charlie to edit.

---

## Constraints & gotchas

- **This is a modified Next.js 16.2.6** (see `AGENTS.md`). Read the relevant guide
  in `node_modules/next/dist/docs/` before writing Next code — especially
  `01-app/01-getting-started/13-fonts.md`, `.../03-layouts-and-pages.md`,
  `.../11-css.md`, `.../12-images.md`. Heed deprecations.
- **Do NOT run a dev server or browser automation** — both have crashed this
  machine. Verify work statically: `npx tsc --noEmit` and
  `npx eslint <changed paths>`. To view, push the `redesign-v12` branch → Vercel
  auto-builds a preview URL (this never touches prod/`main`).
- `lucide-react` is **v1.14.0** — some icons (e.g. `Github`) are not exported.
  Check the import resolves before using.
- All animation respects `prefers-reduced-motion`.
- Branch: **`redesign-v12`**. Don't commit or push unless Charlie asks.
- Build each section as a self-contained component rendered on `/v3`; the live
  homepage and `/preview` stay untouched.

## Working style for updatelog chats

Each `UPDATELOGVXX.md` has numbered stages. For each stage: implement it, then
fill in its **`# Stage N Report`** with `- [x]` bullets describing exactly what
was built (files, classes, how data flows) and an **`Issues:`** line — matching
the style of `UPDATELOGV6.md`. Keep the live site untouched; verify with
tsc/eslint; don't commit unless asked.
