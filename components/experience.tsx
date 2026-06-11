import { ArrowUpRight, Link2 } from "lucide-react";

const entries = [
  {
    // CUSTOMIZE: date range string
    dates: "2026 — Present",
    // CUSTOMIZE: position name
    title: "Stealth Startup",
    // CUSTOMIZE: company or org name
    org: "",
    // CUSTOMIZE: org link URL, set "" to hide arrow icon
    href: "",
    // CUSTOMIZE: reference links, or set to []
    links: [{ label: "Github", href: "https://github.com/charlieramus/Summer-Project-V1-" }],
    // CUSTOMIZE: 2-4 sentence description of what you did and learned
    description: "An app for door-to-door salespeople to optimize their work... Built for salesman or enterpises",
    // CUSTOMIZE: skill tag strings
    tags: ["JavaScript, Chrome Extensions, Branding, Product Design"],
  },
  // --- ENTRY 2: copy structure above ---
  {
    // CUSTOMIZE: date range string
    dates: "2025 — Present",
    // CUSTOMIZE: position name
    title: "Content Creator & Builder",
    // CUSTOMIZE: company or org name
    org: "",
    // CUSTOMIZE: org link URL, set "tas" to hide arrow icon
    href: "",
    // CUSTOMIZE: reference links, or set to []
    links: [],
    // CUSTOMIZE: 2-4 sentence description of what you did and learned
    description: "Built an architecture community. Designed and shared original architectural builds grabbing 300,000+ interactions, created tutorial content, and engaged a community of fellow builders.",
    // CUSTOMIZE: skill tag strings
    tags: ["Community Building, Online Content Creation, Figma (Software), 3D Modeling "],
  },
  // --- ENTRY 3: copy structure above ---
  {
    // CUSTOMIZE: date range string
    dates: "2021 — Present",
    // CUSTOMIZE: position name
    title: "Independent Photographer & Videographer",
    // CUSTOMIZE: company or org name
    org: "",
    // CUSTOMIZE: org link URL, set "" to hide arrow icon
    href: "",
    // CUSTOMIZE: reference links, or set to []
    links: [],
    // CUSTOMIZE: 2-4 sentence description of what you did and learned
    description: "Independent photographer focused on landscape, outdoor, and documentary photography across the Colorado Front Range & Various traveling excursions.",
    // CUSTOMIZE: skill tag strings
    tags: ["Photography, Videography, Adobe Lightroom, Visual Storytelling"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-10 md:px-16">
      <div className="flex flex-col gap-12 max-w-165">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-6 md:gap-8 -mx-3 px-3 py-2 rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-200">
            <div className="w-28 shrink-0 pt-0.5">
              <span className="text-[12px] text-muted leading-tight">{entry.dates}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-1.5 mb-1">
                <span className="text-[15px] font-medium text-fg">{entry.title}</span>
                {entry.href ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-accent hover:opacity-80 transition-opacity duration-200"
                  >
                    <span className="text-[15px]">{entry.org}</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <span className="text-[15px] text-accent">{entry.org}</span>
                )}
              </div>
              {entry.links.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-2">
                  {entry.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-fg transition-colors duration-200"
                    >
                      <Link2 size={11} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              <p className="text-[14px] text-muted leading-[1.7] mb-3">
                {entry.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium px-2.5 py-1 bg-rule text-accent rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
