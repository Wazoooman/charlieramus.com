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
- [ ] Horizontal snap row of panels renders with mono labels + section dots
- [ ] Panel shell matches V3 primitive; scrollbar styled
- Issues:

---

# Stage 2 — Map existing components into panels

- About panel ← `components/about.tsx`.
- Career Journey panel ← `components/experience.tsx`, restyled as a vertical
  year-axis timeline (year column + colored stems + tags) using the real entries.
- Highlighted Work panel ← `components/projects.tsx` / `WebProjects.tsx` tiles.
- Side Projects + Exploring panels ← `components/stories.tsx` / supporting content.
- No data changes; reuse existing arrays/content.

# Stage 2 Report
- [ ] All homepage components render inside panels, content intact
- [ ] Experience renders as a colored timeline with real entries
- Issues:

---

# Stage 3 — Tappable nav (dots + arrows) + snap

- Add prev/next arrow buttons and a row of position dots below/above the row;
  both scroll the container to the target panel (smooth, snap-aligned).
- Keep the native scrollbar too. Dots/arrows are primarily for short/touch screens.
- Sync active-dot state to scroll position.

# Stage 3 Report
- [ ] Arrow buttons page through panels; dots jump to a panel
- [ ] Active dot tracks scroll position
- [ ] Native scroll still works; controls usable on touch/short screens
- Issues:

---

# Stage 4 — Career-card expand-to-fullscreen

- Make each Career Journey entry clickable. On click it expands in-place into a
  fullscreen overlay (animated grow, not a route change) showing fuller detail
  (longer description, all links/tags, optional media).
- Use a shared-element-style transition (FLIP or scale-from-origin) + overlay;
  Esc / backdrop / close button to collapse back. Lock body scroll while open.

# Stage 4 Report
- [ ] Clicking a career entry expands it to fullscreen in-place (no navigation)
- [ ] Expanded view shows extended detail + interactions
- [ ] Esc/backdrop/close collapses; body scroll locked while open
- [ ] Animation smooth both directions, respects reduced-motion
- Issues:

---

# Stage 5 — Responsive + accessibility

- Short screens: confirm dots/arrows make every panel reachable without hunting.
- Keyboard: panels and the expand interaction are focusable/operable; overlay
  traps focus and returns it on close. ARIA labels on nav controls.

# Stage 5 Report
- [ ] Every panel reachable via dots/arrows on small screens
- [ ] Full keyboard operability; focus trap + restore on overlay
- [ ] ARIA labels on controls; tab order sane
- Issues:
