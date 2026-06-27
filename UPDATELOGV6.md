# REDESIGN — LOG V6: ZONE B (HORIZONTAL DASHBOARD)

The dense, ref-1 dashboard: bordered panels in a horizontal scroll with mono
labels and section-colored dots. Includes tappable nav for short screens and the
career-card expand-to-fullscreen interaction. Depends on Logs V3, V5.

---

# Stage 1 — Horizontal scroll container + panel shell

- New section below the hero on `app/page.tsx`: a horizontal, scroll-snap row of
  `.panel` cards (from V3), each with a mono `.label` header + section-color dot.
- Section head: Fraunces title ("The dashboard") + mono hint.
- Keep the existing homepage components as the panel contents (wired in Stage 2).

# Stage 1 Report
- [x] Horizontal snap row of panels renders with mono labels + section dots — new
  `components/dashboard.tsx` (Zone B). A `.dashboard-scroll` row (`overflow-x-auto
  snap-x snap-mandatory`, `h-[78vh] max-h-160`) holds 5 `.panel` cards
  (`snap-start`, `w-[85vw] sm:w-110 md:w-120`). Each panel header = a `size-2`
  section-color dot + a mono `.label`: About (orange `bg-orange`), Career Journey
  (cobalt `bg-c-experience`), Highlighted Work (red `bg-c-work`), Side Projects
  (pink `bg-c-design`), Exploring (marigold `bg-c-writing`). Section head above
  the row = `.label` kicker ("Zone B · Dashboard") + Fraunces `.display-md` title
  ("The dashboard") + a mono "scroll →" hint. Verified live: 5 panels, labels
  read `About | Career Journey | Highlighted Work | Side Projects | Exploring`,
  row overflows (`scrollWidth 2608 > clientWidth 1280`) so it scrolls/snaps.
- [x] Panel shell matches V3 primitive; scrollbar styled — cards use the V3
  `.panel` primitive (`--panel` fill, `1px --border`, `0.75rem` radius) unchanged;
  verified computed panel bg cream `rgb(251,250,246)` light / `#1a1a1a` dark,
  border `#e3e1da`/`#2a2a2a`. New `.dashboard-scroll` rule in `app/globals.css`
  slims the native scrollbar (`scrollbar-width: thin`, `8px` webkit track,
  rounded `--border` thumb → `--muted` on hover); applied to both the horizontal
  row and each panel's vertical overflow.
- Issues: consistent with V5, the live `app/page.tsx` (old sidebar layout) is left
  untouched — Zone B is built as a self-contained `<Dashboard>` component and
  verified on a throwaway `app/dashtest/` route (removed after; `npm run build`
  clean, back to 14 routes). Assembly of Zones A/B/C into the homepage remains a
  later log per the redesign plan.

---

# Stage 2 — Map existing components into panels

- About panel ← `components/about.tsx`.
- Career Journey panel ← `components/experience.tsx`, restyled as a vertical
  year-axis timeline (year column + colored stems + tags) using the real entries.
- Highlighted Work panel ← `components/projects.tsx` / `WebProjects.tsx` tiles.
- Side Projects + Exploring panels ← `components/stories.tsx` / supporting content.
- No data changes; reuse existing arrays/content.

# Stage 2 Report
- [x] All homepage components render inside panels, content intact — to reuse the
  exact data with zero duplication, the source arrays are now exported and the
  dashboard imports them: `aboutParagraphs` (new export from `components/about.tsx`,
  which now maps over it itself), `entries` (`experience.tsx`), `projects`
  (`projects.tsx`), `stories` (`stories.tsx`). All four exports are additive —
  the old sidebar components still render unchanged. Panels: **About** = the 3
  paragraphs verbatim; **Highlighted Work** = the 2 project tiles (theme-aware
  thumbnails via `useTheme`, same `isDark` logic as `projects.tsx`) linking to
  `/web-projects` + `/design`; **Side Projects** = supporting route links
  (Web Projects, Design Portfolio, GitHub archive — all real existing hrefs);
  **Exploring** = the 3 writing stories (thumbnail + marigold year + title,
  `/writing/{slug}`, `articleReferrer` sessionStorage preserved) + "View All
  Writing →". Verified live in both modes, content intact, zero console errors.
- [x] Experience renders as a colored timeline with real entries — Career Journey
  panel is an `<ol>` year-axis timeline from the real `entries`: a mono `.label`
  year column (`text-c-experience`, first 4-digit year via `startYear()` →
  2026/2026/2025), a cobalt stem (`bg-c-experience/30` vertical rule between
  entries) with a `bg-c-experience` node dot per entry, then title + org link
  (`ArrowUpRight` when `href`) + dates + reference links (`Link2`) + description +
  tag chips. Confirmed live: cobalt dot computed `rgb(79,97,232)` (dark) /
  `#1b2bd6` (light), stems connect the three entries.
- Issues: the brief lists separate "Side Projects" and "Exploring" panels both
  sourced from `stories.tsx`/"supporting content". There's no dedicated
  side-projects dataset, so to honor "no data changes" I mapped Exploring → the
  writing `stories` and Side Projects → existing route links (no invented data).
  Also: the `Github` lucide icon isn't exported in this repo's `lucide-react`
  (1.14.0) — dropped it; Side Projects links use the same `ArrowUpRight` affordance
  as the rest of the site. `npm run build` clean.

---

# Stage 3 — Tappable nav (dots + arrows) + snap

- Add prev/next arrow buttons and a row of position dots below/above the row;
  both scroll the container to the target panel (smooth, snap-aligned).
- Keep the native scrollbar too. Dots/arrows are primarily for short/touch screens.
- Sync active-dot state to scroll position.

# Stage 3 Report
- [x] Arrow buttons page through panels; dots jump to a panel — a control bar
  below the row (`[‹] • • • • • [›]`) in `components/dashboard.tsx`. Prev/Next
  call `scrollToIndex(active ∓ 1)` (clamped, `disabled` at the ends); each dot is
  a `size-7` tap target wrapping a `size-2.5` visual dot and calls
  `scrollToIndex(i)`. `scrollToIndex` scrolls the row to `panel.offsetLeft - paddingLeft`
  (smooth, or instant under reduced-motion). Verified live: Next×2 from About →
  Highlighted Work; clicking each dot (About…Exploring) jumps to and selects that
  panel, at 1280 **and** 375.
- [x] Active dot tracks scroll position — rAF-throttled `onScroll` handler picks
  the `[data-panel]` whose left edge is closest to `scrollLeft` and sets `active`
  (drives `aria-selected` + the section-color fill/scale on the dot). Fixed the
  end-of-row case where the last panels shared one scroll position and their dots
  could never activate: a resize-aware **trailing spacer**
  (`clientWidth − lastPanelWidth − pad`) lets every panel reach start-alignment,
  so all five dots are distinct and selectable (confirmed Exploring/Side
  Projects/About each resolve to their own dot).
- [x] Native scroll still works; controls usable on touch/short screens — the row
  keeps `overflow-x-auto snap-x snap-mandatory` with the styled `.dashboard-scroll`
  bar; the controls are additive. Arrows are `size-10` (40px) and dots `size-7`
  (28px) hit areas — comfortable on touch. Verified all 5 panels reachable via
  dots at 375×812 with **no** horizontal page overflow, zero console errors.
- Issues: none. The trailing spacer is `aria-hidden` and excluded from panel
  indexing/active-detection via the `[data-panel]` selector.

---

# Stage 4 — Career-card expand-to-fullscreen

- Make each Career Journey entry clickable. On click it expands in-place into a
  fullscreen overlay (animated grow, not a route change) showing fuller detail
  (longer description, all links/tags, optional media).
- Use a shared-element-style transition (FLIP or scale-from-origin) + overlay;
  Esc / backdrop / close button to collapse back. Lock body scroll while open.

# Stage 4 Report
- [x] Clicking a career entry expands it to fullscreen in-place (no navigation) —
  each timeline entry is now a real `<button>` that calls `openEntry(i, e)`,
  captures the click-origin center, and sets `expanded=i`. A `fixed inset-0
  z-50` overlay (`role="dialog" aria-modal`) renders a centered `.panel` card —
  no route change. The card grows from the clicked entry: inline `--dx/--dy`
  (dampened offset from the entry to viewport center) bias the `dashCardIn`
  keyframe's start transform, so it appears to "explode" out of the card.
- [x] Expanded view shows extended detail + interactions — collapsed cards clamp
  the description (`line-clamp-2`) and show a hover/focus "View details ↗" hint;
  the overlay shows the **full** description, the org as a real link (when
  `href`), all reference links (`Link2`), the mono date, and all tag chips.
  Verified: title "Stealth Startup", GitHub link, full body, and tags all render.
- [x] Esc/backdrop/close collapses; body scroll locked while open — `closeModal`
  is wired to the close `X` button, a backdrop click, and the `Escape` key; an
  effect sets `document.body.style.overflow = "hidden"` on open and restores it
  on close. Verified live: open → `body.overflow = "hidden"`; Esc → dialog gone,
  overflow restored to `""`.
- [x] Animation smooth both directions, respects reduced-motion — `dashOverlayIn/Out`
  + `dashCardIn/Out` keyframes in `app/globals.css` (cubic-bezier grow in, scale-back
  out). Close keeps the card mounted for the exit (260ms) then unmounts; under
  `prefers-reduced-motion` the unmount delay drops to 0 (read via `matchMedia`)
  and the global reduced-motion guard neutralizes the keyframes.
- Issues: the data has no separate "long" description or media, so the overlay
  reuses the single `description` with more room + the links/tags that are
  de-emphasized (org as text, links hidden) in the collapsed card — this also
  keeps the collapsed card a valid `<button>` with no nested interactives.

---

# Stage 5 — Responsive + accessibility

- Short screens: confirm dots/arrows make every panel reachable without hunting.
- Keyboard: panels and the expand interaction are focusable/operable; overlay
  traps focus and returns it on close. ARIA labels on nav controls.

# Stage 5 Report
- [x] Every panel reachable via dots/arrows on small screens — verified at
  375×812: clicking each of the 5 dots scrolls to and selects its panel, prev/next
  page through, and there is no horizontal page overflow
  (`scrollWidth === clientWidth`). Hit targets are touch-sized (arrows 40px, dots
  28px).
- [x] Full keyboard operability; focus trap + restore on overlay — career entries
  are native `<button>`s (focusable, Enter/Space activate) with a
  `focus-visible` cobalt outline; nav arrows/dots are buttons too. On open, focus
  moves to the close button (verified `activeElement` = "Close"); `Tab`/`Shift+Tab`
  cycle within the overlay (`trapTab` wraps first↔last focusable); on close, focus
  returns to the triggering entry (`prevFocusRef` captures `e.currentTarget` at
  open, so restore is reliable regardless of pointer/keyboard activation).
- [x] ARIA labels on controls; tab order sane — arrows `aria-label="Previous/Next
  panel"` (`disabled` at ends), dots `role="tab"` + `aria-label="Go to {label}
  panel"` + `aria-selected`, dot group `role="tablist"`; overlay is
  `role="dialog" aria-modal="true"` labelled by the `#career-modal-title`
  heading; the trailing spacer is `aria-hidden`. Tab order follows DOM:
  panels → controls, and within the modal close → links in reading order.
- Issues: none. `npm run build` clean (TypeScript passes, 15 routes incl. the
  `/preview` harness). Verified live in dark + light, both desktop and mobile,
  zero console errors.
