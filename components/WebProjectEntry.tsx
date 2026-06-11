"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import CarouselLightbox from "./CarouselLightbox";

export type WebProject = {
  name: string;
  url: string;
  description: string;
  skills: string[];
  screenshots: string[];
};

// HOW TO ADD A NEW WEB PROJECT:
// 1. Copy one entry object below and fill in all fields
// 2. Add 2-3 laptop screenshots (16/10 ratio, WebP, max 200KB each)
//    to public/images/web/ and reference them in the screenshots array
// 3. The entry renders automatically, no other files need to be changed

const webProjects: WebProject[] = [
  {
    name: "WELandscape Co.",
    url: "https://welandscapeco.com",
    description:
      "A clean marketing site for a Boulder-based lawn care and landscaping business. Built to communicate services and pricing clearly, with a simple quote request flow. Designed partially in Figma.",
    skills: ["HTML", "CSS", "Figma"],
    // Screenshots live in public/images/web/ — reference them as "/images/web/<filename>.webp"
    screenshots: [
      "/images/WELandscape/Screenshot-2026-06-10-040846_webp.webp",
      "/images/WELandscape/Screenshot-2026-06-10-040855_webp.webp",
      "/images/WELandscape/Screenshot-2026-06-10-040911_webp.webp",
    ],
  },
  {
    name: "charlieramus.com",
    url: "https://charlieramus.com",
    description:
      "Personal portfolio designed and built from scratch. Two-column fixed sidebar layout with dark and light mode, cursor glow tracking, photography gallery with print inquiry flow and a writing section.",
    skills: ["Next.js", "TypeScript", "Tailwind", "Figma"],
    screenshots: [
      "/images/This-Site/Screenshot-2026-06-10-040649_webp.webp",
      "/images/This-Site/Screenshot-2026-06-10-040701_webp.webp",
      "/images/This-Site/Screenshot-2026-06-10-040724_webp.webp",
    ],
  },

  // CUSTOMIZE: new project slot — copy, uncomment, and fill in all fields
  // {
  //   name: "",               // CUSTOMIZE: project name
  //   url: "",                // CUSTOMIZE: live site URL
  //   description: "",        // CUSTOMIZE: 2-4 sentence description
  //   skills: [],             // CUSTOMIZE: skill pill strings
  //   // Screenshots live in public/images/web/ — reference them as "/images/web/<filename>.webp"
  //   screenshots: [],        // CUSTOMIZE: 2-3 webp paths
  // },

  // CUSTOMIZE: new project slot — copy, uncomment, and fill in all fields
  // {
  //   name: "",               // CUSTOMIZE: project name
  //   url: "",                // CUSTOMIZE: live site URL
  //   description: "",        // CUSTOMIZE: 2-4 sentence description
  //   skills: [],             // CUSTOMIZE: skill pill strings
  //   // Screenshots live in public/images/web/ — reference them as "/images/web/<filename>.webp"
  //   screenshots: [],        // CUSTOMIZE: 2-3 webp paths
  // },
];

function WebProjectEntry({
  project,
  onScreenshotClick,
}: {
  project: WebProject;
  onScreenshotClick: (i: number) => void;
}) {
  return (
    <div className="py-12">
      {/* Name — headline-scale, full-brightness fg */}
      <h2 className="text-[22px] font-bold text-fg mb-1">{project.name}</h2>

      {/* Live site link — accent color (orange dark / black light), ArrowUpRight inline */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[13px] text-accent hover:opacity-75 transition-opacity duration-150 mb-4"
      >
        {project.url}
        <ArrowUpRight size={12} className="shrink-0" />
      </a>

      {/* Description — full-brightness, only URL stays muted */}
      {project.description && (
        <p className="text-[14px] text-fg leading-[1.7] max-w-prose mb-5">
          {project.description}
        </p>
      )}

      {/* Skill pills — grey only, never orange, adapts to theme */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.skills.map((skill) => (
          <span
            key={skill}
            className="text-[11px] font-medium px-2.5 py-1 bg-rule text-[#3d3d3d] dark:text-[#c4c4c4] rounded-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Screenshots — 16:10, clickable, open lightbox */}
      {project.screenshots.length > 0 && (
        <div className="flex gap-3">
          {project.screenshots.map((src, i) => (
            <div
              key={i}
              className="flex-1 aspect-[8/5] rounded-md overflow-hidden cursor-pointer transition-opacity duration-150 hover:opacity-85"
              onClick={() => onScreenshotClick(i)}
            >
              <img
                src={src}
                alt={`${project.name} screenshot ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WebProjects() {
  const [lightbox, setLightbox] = useState<{
    screenshots: string[];
    index: number;
  } | null>(null);

  return (
    <>
      <div>
        {webProjects.map((project, i) => (
          <div key={project.name}>
            <WebProjectEntry
              project={project}
              onScreenshotClick={(imgIdx) =>
                setLightbox({ screenshots: project.screenshots, index: imgIdx })
              }
            />
            {i < webProjects.length - 1 && <hr className="border-rule" />}
          </div>
        ))}
      </div>

      {lightbox && (
        <CarouselLightbox
          images={lightbox.screenshots}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
