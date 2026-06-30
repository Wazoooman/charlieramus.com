# REDESIGN — LOG V11: CONTACT CARD + PHOTOGRAPHY REWORK

Brainstormed at the end of V9. Two threads: (1) a signature "Get in touch"
contact card with a color-invert hover and social tabs, then bring the
photography modals into that same card language; (2) rethink the photography
page feel — bigger images, editorial interstitials, more interactive. Plus
cleanup deferred from V9.

Design rules carried over from V9: palette/tokens/themes are fine; no other new
"extreme" motifs without checking first. The dotted/halftone photo overlay is
dead — the blue Charlie likes is the sky TEXT/accent color, not an overlay.

---

# Stage 1 — "Get in touch" contact card

Build a new `components/contact-card.tsx` matching the two reference screenshots
(default + hover):

- **Default state:** full-width rounded card, `--red` background, white text. Top
  center: a peace-hand (✌) icon, then "Think we vibe?" in Fraunces (serif). A
  huge "Get in touch" set bottom-left in the grotesque sans (Inter), display-hero
  scale, hugging the lower edge.
- **Hover state:** the whole card inverts — background goes to the page
  cream/surface, and the icon + both type blocks go `--red`. Smooth color
  transition; honor `prefers-reduced-motion`.
- **Social tabs:** a row of pill tabs tucked UNDER the card's bottom edge (sitting
  behind the card, peeking down ~half a pill), in the neutral `bg-surface` style.
  Use Charlie's real links from `components/social-links.tsx` (LinkedIn, GitHub,
  Instagram(s), Letterboxd) plus any site tabs we want (e.g. Works, Photography).
- Place it on `app/preview/page.tsx` as the contact zone (V5–V8 convention:
  homepage zones land on /preview; final homepage assembly is its own log).
- Copy ("Think we vibe?", "Get in touch") and the tab set in top-of-file
  constants so they are one-line edits.

# Stage 1 Report
- [x] Contact card matches reference (default red/white, hover cream/red), tabs tucked under
- [x] Theme-aware + reduced-motion safe; copy/tabs easily editable
- Built `components/contact-card.tsx` (server component, no client JS — invert is
  pure CSS `hover:`). Default `bg-red`/white; `hover:bg-surface hover:text-red`
  inverts the whole card, child type inherits the color. Peace hand uses the
  ✌︎ text-presentation selector (U+FE0E) so it's monochrome and inverts via
  `currentColor`. Top-center vibe line in Fraunces (`.serif`); `display-hero`
  "Get in touch" hugs the lower-left edge. The card is a `mailto:` link.
- Tabs are socials only now (Works/Photography site tabs dropped), pulled from
  `components/social-links.tsx`. They are square slabs that HANG OUT of the card's
  bottom edge — square/flush where they meet the card (`border-t-0`, no top
  radius), rounded only on the bottom corners (`rounded-b-xl`); sit behind the
  card at `z-0` with a small overlap so they read as growing out of it. Icon-only,
  each warms to `text-fg` on hover.
- Webp override is one line: `TAB_LOGOS["GitHub"] = "/socials/github.webp"`. The
  image renders through a CSS mask filled with `currentColor`, so any webp (even
  colored) becomes a clean black/white silhouette that follows the theme
  automatically — no separate light/dark assets. No override → the existing
  line-icon SVG (already theme-adaptive).
- Theme-aware: all colors are tokens (`bg-red`, `bg-surface`, `text-red`,
  `border-border`, `text-muted/fg`). Reduced motion is covered by the global guard
  in `app/globals.css`.
- Copy (`LEAD_IN` — now "Like what you see?", `HEADLINE`, `EMAIL`, `PEACE`) and the
  tab set (`socialLinks` + `TAB_LOGOS`) are top-of-file constants.
- Placement: the big card moved UP to sit right after the explore bento (the
  contact moment), with `ClosingQuote` now the finale before the footer. The old
  small red "Get in touch" tile in `components/bento.tsx` was removed; its slot is
  now a cobalt **Blog** tile → `/blog` (the journal feed, distinct from the
  marigold essays/Writing tile), with the latest post title previewed.
- Issues: No reference screenshots were in the repo, so the hang depth / square
  size were built to the description — easy to nudge once Charlie eyes it live.
  Whole-card-as-mailto remains a default choice.

---

# Stage 2 — Photography modals → contact-card language

Restyle the two modals in `components/photography-gallery.tsx`
(`MothersDayCard`, `InquireModal`) to share the contact-card visual language
instead of the current bespoke white cards:

- Move them onto tokens (no hardcoded `#fff`/`#1a1a1a`/greys); adopt the card
  shape, type (Fraunces heading + mono/sans body), and a section/`--red` accent.
- Keep all behavior: Mother's-Day date gate + dismiss, Inquire mailto + copy-email
  + photo-code instructions.
- The Inquire primary action can reuse the contact-card invert-on-hover treatment.

# Stage 2 Report
- [x] Both modals reskinned to the card language, on tokens, theme-aware
- [x] Behavior intact (date gate, dismiss, mailto, copy email)
- Reskinned `MothersDayCard` + `InquireModal` in `components/photography-gallery.tsx`
  to the contact-card language. All bespoke inline styles and hardcoded colors
  (`#fff`, `#1a1a1a`, the grey ramp, inline `boxShadow`/`onMouseEnter` color
  swaps) are gone — both are now token-based Tailwind: `bg-panel` + `border-border`
  rounded panels, `display-sm` (Fraunces) headings, sans body in `text-fg`/
  `text-muted`, and a `--red` accent. Theme-aware in light + dark by construction.
- Mother's Day: a red accent rule (`bg-red`) replaces the grey divider; the note
  moves to sans on tokens; sign-off is the mono `.label`. The `CUSTOMIZE` comments
  are preserved so the copy stays a quick edit.
- Inquire: the primary "Open in Mail" reuses the contact-card invert — red/white
  at rest, `hover:bg-surface hover:text-red` (border fades in for definition). The
  "or" divider, mono email, and copy button are all on tokens.
- Added the existing `fd-overlay-in` / `fd-card-in` entrance classes (already in
  `app/globals.css`, reduced-motion guarded) for a soft open — no new keyframes.
- Behavior untouched: the Mother's-Day date gate + session dismiss live in the
  parent (unchanged); Inquire still fires the same `mailtoHref`, copies the same
  `email`, and shows the photo-code instructions.
- Issues: none. The lightbox and the sky floating "Inquire" button were left as-is
  (out of scope — Stage 2 is just the two modals).

---

# Stage 3 — Photography section rework (EXPLORATORY — needs sign-off)

Rethink the photography page feel. Direction from Charlie (specifics TBD before
building):

- Increase the average photo size in the gallery (fewer columns / larger tiles).
- Add large editorial interstitial headers between photo groups — e.g. "CREATE."
  then, a few lines down, "ART." — Fraunces display, used as section breaks.
- Make the section more interactive (exact interactions to be decided).
- Preserve all V2 image performance (next/image, blur placeholders, theme-aware
  skeleton, `unoptimized`) and the lightbox.

OPEN: needs Charlie's sign-off on column count / tile size, the interstitial copy
+ placement, and what "more interactive" means before this stage is built.

# Stage 3 Report
- [ ] Larger photos + editorial interstitials, layout approved
- [ ] Interactivity added; V2 perf + lightbox preserved
- Issues:

---

# Stage 4 — Cleanup + consistency

- Delete dead `components/WebProjects.tsx` (unused; the page uses
  `WebProjectEntry`'s default export).
- Sweep the new card/modals for spacing, type-scale, and motion consistency with
  the rest of the system.

# Stage 4 Report
- [ ] Dead component removed; build clean
- [ ] Card/modals consistent with the system
- Issues:
