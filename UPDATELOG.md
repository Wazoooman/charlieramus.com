# Completed 

# WEB PROJECTS PAGE — FULL REVAMP
> Stage 1, then fill in the Stage 1 Report before moving to Stage 2."

---

# Stage 1 — Rename card + page scaffold

On the main projects page rename the "This Site" card to "Web Projects".
Update the description to reflect sites and web experiences designed and built
from scratch. // CUSTOMIZE: rewrite description as needed
The href stays pointing to /web-projects.

Delete all existing content inside /web-projects. Scaffold a fresh page with
the same dark minimal style as /photography and /design. Same back button
top left returning to home. Add /web-projects to the usePathname check so
cursor glow is disabled on this page.

Page header:
- Title: "Web Projects" — Inter Bold, large
- One muted subtext line // CUSTOMIZE: e.g. "Sites designed and built from scratch."

# Stage 1 Report
- [x] Renamed "This Site" card to "Web Projects" in projects.tsx; href changed to internal /web-projects; description updated
- [x] Scaffolded fresh /web-projects page — dark minimal style matching /photography and /design, back button top left, Inter Bold title, muted subtext; old WebProjects placeholder component removed
- [x] Cursor glow already excluded on /web-projects (was pre-existing)
- Issues: none

---

# Stage 2 — Project entry component

Build a reusable WebProjectEntry component. Each entry flows top to bottom:

1. Project name — Inter Bold, medium-large
   // CUSTOMIZE: name of the site

2. Live site link — small muted text, ArrowUpRight icon inline, opens in new tab
   // CUSTOMIZE: full URL e.g. "https://welandscapeco.com"

3. Description paragraph — muted, readable line width, 2-4 sentences
   // CUSTOMIZE: describe the site, who it was for, what you built

4. Skill pills row — light grey background, dark text, small, rounded
   These are NOT orange. Grey only regardless of light or dark mode.
   // CUSTOMIZE: add skill strings to the tags array

5. Screenshots row — 2-3 laptop-ratio screenshots (16/10 aspect ratio) in a
   horizontal row, object-cover, slight border-radius, full entry width divided
   equally between screenshots. If fewer than 3 are provided only render what
   exists, no empty placeholder boxes.
   // CUSTOMIZE: add webp paths to the screenshots array

Entries are separated by a thin horizontal rule and generous whitespace.

Data structure:
```ts
// components/WebProjectEntry.tsx
type WebProject = {
  name: string          // CUSTOMIZE: project name
  url: string           // CUSTOMIZE: live site URL
  description: string   // CUSTOMIZE: 2-4 sentence description
  skills: string[]      // CUSTOMIZE: skill pill strings
  screenshots: string[] // CUSTOMIZE: 2-3 webp paths in public/images/web/
}
```

# Stage 2 Report
- [x] Created components/WebProjectEntry.tsx — WebProject type, webProjects data array, internal WebProjectEntry (single entry), default WebProjects list renderer with hr separators
- [x] Entry layout: Bold name, muted URL link w/ ArrowUpRight, muted description, grey skill pills (bg-[#383838] text-[#c4c4c4], no orange), 16:10 screenshot row (flex-1 per screenshot, only renders what exists)
- [x] Wired into app/web-projects/page.tsx
- Issues: none

---

# Stage 3 — Populate first entry: WELandscape

Add the first real project entry using this data:

```ts
{
  name: "WELandscape Co.",
  url: "https://welandscapeco.com",
  description: "",
  // CUSTOMIZE: suggested copy below, rewrite freely:
  // "A clean marketing site for a Boulder-based lawn care and landscaping
  // business. Built to communicate services and pricing clearly, with a
  // simple quote request flow. Designed partially in Figma."
  skills: ["HTML", "CSS", "Figma"],
  screenshots: [
    "/images/web/welandscape-1.webp", // CUSTOMIZE: add your screenshot files
    "/images/web/welandscape-2.webp", // CUSTOMIZE: add your screenshot files
  ]
}
```

Add screenshots to public/images/web/ and reference them above.
Leave a clear comment above the screenshots array explaining the file location.

# Stage 3 Report
- [x] WELandscape Co. entry added to webProjects array in WebProjectEntry.tsx with description, skills, and screenshot paths
- [x] Created public/images/web/ directory (with .gitkeep); screenshot comment added above screenshots array in component
- [x] Pending: drop welandscape-1.webp and welandscape-2.webp into public/images/web/ to complete the entry
- Issues: Screenshots are physical assets — need to be added manually before the entry is fully visible

---

# Stage 4 — Populate second entry: This Portfolio

Add the second project entry:

```ts
{
  name: "charlieramus.com",
  url: "https://charlieramus.com", // CUSTOMIZE: update to real URL when live
  description: "",
  // CUSTOMIZE: suggested copy:
  // "Personal portfolio designed and built from scratch. Two-column fixed
  // sidebar layout with dark and light mode, cursor glow tracking, photography
  // gallery with print inquiry flow and a writing section."
  skills: ["Next.js", "TypeScript", "Tailwind", "Figma"],
  screenshots: [
    "/images/web/portfolio-1.webp", // CUSTOMIZE: add screenshots
    "/images/web/portfolio-2.webp", // CUSTOMIZE: add screenshots
  ]
}
```

# Stage 4 Report
- [x] charlieramus.com entry added with description, Next.js/TypeScript/Tailwind/Figma skills, and screenshot paths
- [x] Pending: drop portfolio-1.webp and portfolio-2.webp into public/images/web/
- Issues: Screenshots need to be added manually

---

# Stage 5 — Future project slots + instructions

Add 2 empty pre-built project slots below the existing entries with every field
commented out and a // CUSTOMIZE note above each one. Add a comment block at the
top of the data file explaining exactly how to add a new project:

```ts
// HOW TO ADD A NEW WEB PROJECT:
// 1. Copy one entry object below and fill in all fields
// 2. Add 2-3 laptop screenshots (16/10 ratio, WebP, max 200KB each)
//    to public/images/web/ and reference them in the screenshots array
// 3. The entry renders automatically, no other files need to be changed
```

# Stage 5 Report
- [x] HOW TO ADD comment block added above webProjects array in WebProjectEntry.tsx
- [x] Two commented-out empty project slots added below existing entries, each with CUSTOMIZE notes on every field
- Issues: none

# Stage 6 — Polish + visual consistency pass

## LAYOUT + TYPOGRAPHY
Make the project name larger, closer to a headline size than a label.
Description text should be #f4f3ee in dark mode and #141414 in light mode,
full brightness, not muted. Only the secondary info (URL, date) stays muted.

## LINKS
All external links (live site URL) render in orange (#FA5B1C) in dark mode
and #141414 in black in light mode, consistent with how accents work everywhere
else on the site. Each link has a small ArrowUpRight icon inline to the right
of the text, same icon used on project titles throughout the rest of the site.
The arrow inherits the same color as the link text.

## LIGHT/DARK THEME
This page currently has no light/dark support. Wire it up to the same
next-themes setup used everywhere else on the site. Do not create a new
toggle, the existing sidebar toggle should control this page the same way
it controls all other pages.

## SCREENSHOT LIGHTBOX — CAROUSEL EFFECT
Replace the static screenshot row with an interactive lightbox that matches
the graphic design page carousel behavior exactly. Clicking any screenshot
opens a fullscreen lightbox overlay. Inside the lightbox:
- The active image is centered, large, full readable size
- Clicking left or right arrows (or swiping on touch) cycles through the
  2-3 screenshots for that project
- Transitioning between images: the outgoing image fades out and rotates
  slightly (around 3-5deg) as it exits, the incoming image fades in from
  the opposite rotation. 250ms ease. Same feel as the graphic design tab.
- Clicking outside the image or an X button dismisses the lightbox
- Background scrim rgba(0,0,0,0.85)
- If a project only has one screenshot, no arrows render

Reuse or extract the lightbox component from the graphic design page rather
than rebuilding it. If it is not already a standalone component, refactor it
into components/CarouselLightbox.tsx so both pages share the same code.

# Stage 6 Report
- [x] TYPOGRAPHY — project name bumped to text-[22px] font-bold; description changed from text-muted to text-fg (full brightness); only URL stays muted
- [x] LINKS — URL link uses text-accent (orange dark / black light) with ArrowUpRight; hover:opacity-75 for subtle feedback
- [x] SKILL PILLS — bg-rule + text-[#3d3d3d] dark:text-[#c4c4c4]; grey in both modes, no orange; hr separator uses border-rule
- [x] LIGHT/DARK THEME — web-projects page replaced all hardcoded #141414/#f4f3ee with bg-bg/text-fg/text-muted; controlled by existing sidebar toggle via next-themes
- [x] LIGHTBOX — components/CarouselLightbox.tsx created; fade+rotate keyframes (lbEnterForward/Backward, lbExitForward/Backward) added to globals.css; 250ms ease, outgoing rotates 4deg out, incoming rotates in from opposite; scrim rgba(0,0,0,0.85); X button + click-outside close; arrows hidden if single image; keyboard (Escape/Left/Right); touch swipe
- [x] SHARED CODE — DesignProjects.tsx updated to use CarouselLightbox too; clicking any carousel slide opens fullscreen lightbox for that project at the clicked index
- [x] BUILD — `npx tsc --noEmit` clean, `next build` clean (14/14 pages)
- Issues: none