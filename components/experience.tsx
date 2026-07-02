import { ArrowUpRight, Link2 } from "lucide-react";
import { entries } from "@/data/experience";

// Re-exported so existing importers (dashboard.tsx) keep working while the data
// itself now lives in data/experience.ts (the shared source of truth).
export { entries };

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
