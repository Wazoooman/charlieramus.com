import Image from "next/image";
import Link from "next/link";
import Flower from "@/components/v3/flower";
import Reveal from "@/components/v3/reveal";

// "Tiny fraction of my work" (V14 S1) — the mockup's `#work` section: the
// `.head`, then a `.proj` column of alternating `.band`s (each = a `.panel` with
// a device-card `.stage` + a `.stack` of a colored flower tile and a white tile),
// with the full-width grey `.touch` "get in touch / Case study" bar between the
// bands. Layout/CSS (`.proj` / `.band` / `.panel` / `.stage` / `.stack` /
// `.tile` / `.card` / `.touch`) was ported into v3.css in V12 — this component
// only fills it with Charlie's REAL projects.
//
// The mockup's four gradient placeholders ("Project One–Four") are replaced by
// Charlie's actual work: his portfolio site, WELandscape Co., the Personal
// Journal app, and the graphic-design portfolio — each band a <Link> to its real
// route (/web-projects or /design) and each device card a real screenshot
// (`next/image`). The source arrays live in "use client" modules
// (components/WebProjectEntry.tsx, components/projects.tsx), so — exactly as in
// digital-home (V13) — importing them into this SERVER component would hand back
// client references, not data; the real routes + assets are declared inline.

type Band = {
  title: string;
  /** Short "medium, tags" caption shown next to the title in the label. */
  tags: string;
  /** Real in-app route this project's case study lives on. */
  href: string;
  /** 1–2 real screenshots, laid out as the mockup's rotated device cards. */
  shots: { src: string; alt: string }[];
  /** The colored flower tile that sits beside the panel. */
  tile: { bg: string; petal: string; core: string };
};

const PROJECTS: Band[] = [
  {
    title: "charlieramus.com",
    tags: "web · next.js",
    href: "/web-projects",
    shots: [
      {
        src: "/images/This-Site/Screenshot-2026-06-10-040649_webp.webp",
        alt: "The charlieramus.com homepage, designed and built from scratch",
      },
      {
        src: "/images/This-Site/Screenshot-2026-06-10-040701_webp.webp",
        alt: "The charlieramus.com photography gallery",
      },
    ],
    tile: { bg: "var(--blue)", petal: "yellow", core: "#FFCB41" },
  },
  {
    title: "WELandscape Co.",
    tags: "web · marketing site",
    href: "/web-projects",
    shots: [
      {
        src: "/images/WELandscape/Screenshot-2026-06-10-040846_webp.webp",
        alt: "The WELandscape Co. landing page",
      },
      {
        src: "/images/WELandscape/Screenshot-2026-06-10-040855_webp.webp",
        alt: "The WELandscape Co. services and pricing section",
      },
    ],
    tile: { bg: "var(--pink)", petal: "blue", core: "#0015D4" },
  },
  {
    title: "Personal Journal",
    tags: "data · self-tracking",
    href: "/web-projects",
    shots: [
      {
        src: "/images/PersonalJournal/Screenshot-2026-06-15-171428.webp",
        alt: "The Personal Journal dashboard tracking sleep and finances",
      },
      {
        src: "/images/PersonalJournal/Screenshot-2026-06-15-171446.webp",
        alt: "The Personal Journal writing and documentation view",
      },
    ],
    tile: { bg: "var(--yellow)", petal: "red", core: "#F32317" },
  },
  {
    title: "Graphic Design",
    tags: "brand · visual identity",
    href: "/design",
    shots: [
      {
        src: "/images/For-Projects-Placeholder-Cards/Frame-4_webp.webp",
        alt: "A selection of Charlie's brand and graphic design work",
      },
    ],
    tile: { bg: "var(--blue)", petal: "yellow", core: "#FFCB41" },
  },
];

// One band: a linked panel (device cards + label) beside a tile stack. `flip`
// swaps the panel/stack sides (handled entirely by the ported `.band.flip` CSS);
// alternating the card rotations keeps the collage from looking mechanical.
function ProjectBand({ project, flip }: { project: Band; flip: boolean }) {
  const [primary, secondary] = project.shots;
  // Mirror the card tilt on flipped bands so the row reads as a scatter.
  const primaryRot = flip ? 4 : -4;
  const secondaryRot = flip ? -5 : 5;

  return (
    <Reveal className={`band${flip ? " flip" : ""}`}>
      <Link
        className="panel"
        href={project.href}
        aria-label={`${project.title} — ${project.tags}`}
      >
        <div className="stage">
          <span
            className="card"
            style={{
              left: "2%",
              top: "8%",
              width: "62%",
              height: 180,
              transform: `rotate(${primaryRot}deg)`,
            }}
          >
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              sizes="(max-width: 700px) 60vw, 560px"
              style={{ objectFit: "cover" }}
            />
          </span>

          {secondary && (
            <span
              className="card"
              style={{
                right: "2%",
                bottom: "6%",
                width: "40%",
                height: 140,
                transform: `rotate(${secondaryRot}deg)`,
              }}
            >
              <Image
                src={secondary.src}
                alt={secondary.alt}
                fill
                sizes="(max-width: 700px) 40vw, 360px"
                style={{ objectFit: "cover" }}
              />
            </span>
          )}

          <div className="label">
            <b>{project.title}</b>
            <span>{project.tags}</span>
          </div>
        </div>
      </Link>

      <div className="stack">
        <div className="tile" style={{ background: project.tile.bg }}>
          <Flower petal={project.tile.petal} core={project.tile.core} petals={6} />
        </div>
        <div className="tile white" />
      </div>
    </Reveal>
  );
}

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <Reveal className="head">
          <h2>Tiny fraction of my work</h2>
          <p>
            A mix of things I&apos;ve designed and built — portfolio sites, small
            business work, and tools I made to scratch my own itch.
          </p>
        </Reveal>

        <div className="proj">
          <ProjectBand project={PROJECTS[0]} flip={false} />
          <ProjectBand project={PROJECTS[1]} flip={true} />

          <Reveal className="touch">
            <p>
              Every one of these has a longer story behind it — the stack, the
              screens, the decisions. Reach out any time to dig into the full
              case study.
            </p>
            <Link className="btn" href="/web-projects">
              Case study
            </Link>
          </Reveal>

          <ProjectBand project={PROJECTS[2]} flip={false} />
          <ProjectBand project={PROJECTS[3]} flip={true} />
        </div>
      </div>
    </section>
  );
}
