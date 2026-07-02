// Experience / career data — the single source of truth.
//
// Both the live homepage timeline (components/experience.tsx) and the redesign
// components (dashboard.tsx, the V12 Career Journey card) import `entries` from
// here, so you enter each role ONCE and every layout renders it.
//
// To add a role: copy an entry, fill the CUSTOMIZE fields. The optional timeline
// fields (logo/logoBg/logoFg/start/end) are only used by the V12 Career Journey
// card — omit them and it falls back to a neutral chip + the dates string.

export type ExperienceLink = { label: string; href: string };

export type Experience = {
  /** CUSTOMIZE: date range string shown as-is, e.g. "2026 — Present" */
  dates: string;
  /** CUSTOMIZE: position / role name */
  title: string;
  /** CUSTOMIZE: company or org name ("" hides it) */
  org: string;
  /** CUSTOMIZE: org link URL ("" hides the arrow icon) */
  href: string;
  /** CUSTOMIZE: reference links, or [] */
  links: ExperienceLink[];
  /** CUSTOMIZE: 2-4 sentence description of what you did and learned */
  description: string;
  /** CUSTOMIZE: skill tag strings */
  tags: string[];

  // ── Optional V12 timeline fields (Career Journey card) ──
  /** Single-letter mark shown in the logo chip. Defaults to org/title initial. */
  logo?: string;
  /** CSS color for the logo chip background (defaults to the cobalt accent). */
  logoBg?: string;
  /** CSS color for the logo chip letter (defaults to white). */
  logoFg?: string;
  /** Numeric start year, for vertical timeline placement. */
  start?: number;
  /** Numeric end year; null = present. */
  end?: number | null;
};

export const entries: Experience[] = [
  {
    dates: "2026 — Present",
    title: "Stealth Startup",
    org: "",
    href: "",
    links: [{ label: "Github", href: "https://github.com/charlieramus/ostiara" }],
    description:
      "An app for door-to-door salespeople to optimize their work... Built for salesman or enterpises",
    tags: ["JavaScript, Auth, Branding, Algorithims, UI/UX Design, Database Management"],
    logo: "S",
    logoBg: "var(--cobalt)",
    logoFg: "#fff",
    start: 2026,
    end: null,
  },
  {
    dates: "2026 — Present",
    title: "Liberty Puzzles TA & Media Manager (Seasonal)",
    org: "Liberty Puzzles",
    href: "https://libertypuzzles.com/pages/about-us",
    links: [],
    description:
      "Puzzle assembly and customer tours for a high-end puzzle company. Managed social media accounts, created content, and engaged with the puzzle community.",
    tags: ["Photography, Videography, Adobe Lightroom, Visual Storytelling, Exacto knives (Lol)"],
    logo: "L",
    logoBg: "var(--red)",
    logoFg: "#fff",
    start: 2026,
    end: null,
  },
  {
    dates: "2025 — Present",
    title: "Content Creator & Builder",
    org: "",
    href: "",
    links: [],
    description:
      "Built an architecture community. Designed and shared original architectural builds grabbing 300,000+ interactions, created tutorial content, and engaged a community of fellow builders.",
    tags: ["Community Building, Online Content Creation, Figma (Software), 3D Modeling "],
    logo: "C",
    logoBg: "var(--marigold)",
    logoFg: "#141414",
    start: 2025,
    end: null,
  },
];
