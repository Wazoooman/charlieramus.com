"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Link2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";
import { aboutParagraphs } from "@/components/about";
import { entries } from "@/components/experience";
import { projects } from "@/components/projects";
import { stories } from "@/components/stories";

/**
 * Zone B — the dashboard (Log V6). A horizontal, scroll-snap row of bordered
 * `.panel` cards (V3 primitive), each headed by a mono `.label` + section-color
 * dot. Stage 1 builds the scroll container + panel shell; Stage 2 maps the real
 * homepage components (About, Experience, Projects, Stories) into the panels,
 * reusing their data arrays — no data changes. Stage 3 layers dot/arrow nav on
 * top; Stage 4 makes the career cards expand to fullscreen.
 */

/** First 4-digit year in a date-range string, for the timeline year column. */
function startYear(dates: string): string {
  return dates.match(/\d{4}/)?.[0] ?? dates;
}

/** Shared panel shell: section-color dot + mono label header, then content. */
function Panel({
  label,
  dotClass,
  children,
}: {
  label: string;
  dotClass: string;
  children: ReactNode;
}) {
  return (
    <article className="panel snap-start flex h-full w-[85vw] shrink-0 flex-col overflow-hidden sm:w-110 md:w-120">
      <header className="mb-6 flex items-center gap-2.5">
        <span className={`size-2 shrink-0 rounded-full ${dotClass}`} />
        <span className="label">{label}</span>
      </header>
      <div className="dashboard-scroll min-h-0 flex-1 overflow-y-auto pr-1">
        {children}
      </div>
    </article>
  );
}

const tagClass =
  "text-[11px] font-medium px-2.5 py-1 bg-rule text-accent rounded-sm";

export default function Dashboard() {
  // Project thumbnails are theme-dependent (mirrors components/projects.tsx).
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <section id="dashboard" className="py-20">
      {/* Section head — Fraunces title + mono hint. */}
      <div className="mb-8 flex items-end justify-between gap-4 px-6 md:px-16">
        <div>
          <p className="label mb-2">Zone B · Dashboard</p>
          <h2 className="display-md text-fg">The dashboard</h2>
        </div>
        <p className="label hidden whitespace-nowrap sm:block">scroll →</p>
      </div>

      {/* Horizontal scroll-snap row. Native (styled) scrollbar is the primary
          affordance; dot/arrow controls arrive in Stage 3. */}
      <div className="dashboard-scroll flex h-[78vh] max-h-160 snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-16">
        {/* About */}
        <Panel label="About" dotClass="bg-orange">
          <div className="space-y-4 text-[14px] leading-[1.7] text-fg">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Panel>

        {/* Career Journey — vertical year-axis timeline (cobalt). */}
        <Panel label="Career Journey" dotClass="bg-c-experience">
          <ol className="flex flex-col">
            {entries.map((entry, i) => (
              <li key={i} className="flex gap-3">
                {/* Year column */}
                <div className="w-12 shrink-0 pt-0.5">
                  <span className="label text-c-experience">
                    {startYear(entry.dates)}
                  </span>
                </div>
                {/* Colored stem + dot */}
                <div className="relative shrink-0">
                  <span className="absolute left-1/2 top-1 size-2.5 -translate-x-1/2 rounded-full bg-c-experience" />
                  {i < entries.length - 1 && (
                    <span className="absolute left-1/2 top-1 h-full w-px -translate-x-1/2 bg-c-experience/30" />
                  )}
                  <span className="block w-2.5" />
                </div>
                {/* Detail */}
                <div className="min-w-0 flex-1 pb-8">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-1.5">
                    <span className="text-[14px] font-medium text-fg">
                      {entry.title}
                    </span>
                    {entry.org &&
                      (entry.href ? (
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-[13px] text-accent hover:opacity-80"
                        >
                          {entry.org}
                          <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <span className="text-[13px] text-accent">
                          {entry.org}
                        </span>
                      ))}
                  </div>
                  <p className="mb-2 text-[12px] text-muted">{entry.dates}</p>
                  {entry.links.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-3">
                      {entry.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-fg"
                        >
                          <Link2 size={11} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="mb-3 text-[13px] leading-[1.6] text-muted">
                    {entry.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className={tagClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        {/* Highlighted Work — project tiles (red). */}
        <Panel label="Highlighted Work" dotClass="bg-c-work">
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <Link
                key={project.title}
                href={project.href}
                className="group flex items-start gap-4"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm">
                  <img
                    src={isDark ? project.thumbnailDark : project.thumbnailLight}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="mb-1 inline-flex items-center gap-1 text-[14px] font-medium text-fg group-hover:text-accent">
                    {project.title}
                    <ArrowUpRight size={14} className="shrink-0" />
                  </span>
                  <p className="mb-2 text-[13px] leading-[1.6] text-muted">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className={tagClass}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        {/* Side Projects — supporting route links (pink). */}
        <Panel label="Side Projects" dotClass="bg-c-design">
          <p className="mb-5 text-[13px] leading-[1.7] text-muted">
            Smaller builds, experiments, and the full archive — the things that
            don&apos;t fit neatly into a single project.
          </p>
          <ul className="flex flex-col divide-y divide-rule">
            {[
              { label: "Web Projects", href: "/web-projects", external: false },
              { label: "Design Portfolio", href: "/design", external: false },
              {
                label: "GitHub Archive",
                href: "https://github.com/charlieramus",
                external: true,
              },
            ].map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 text-[14px] text-fg hover:text-accent"
                >
                  {item.label}
                  <ArrowUpRight size={14} className="text-muted" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3 text-[14px] text-fg hover:text-accent"
                >
                  {item.label}
                  <ArrowUpRight size={14} className="text-muted" />
                </Link>
              ),
            )}
          </ul>
        </Panel>

        {/* Exploring — writing / essays (marigold). */}
        <Panel label="Exploring" dotClass="bg-c-writing">
          <div className="flex flex-col divide-y divide-rule">
            {stories.map((story) => (
              <Link
                key={story.slug}
                href={`/writing/${story.slug}`}
                className="group flex items-center gap-4 py-4 first:pt-0"
                onClick={() => sessionStorage.setItem("articleReferrer", "home")}
              >
                <Image
                  src={story.thumbnail}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-sm object-cover"
                />
                <div className="min-w-0">
                  <p className="label mb-1 text-c-writing">{story.year}</p>
                  <h3 className="inline-flex items-start gap-1.5 text-[14px] font-medium leading-snug text-fg group-hover:text-accent">
                    {story.title}
                    <ArrowUpRight
                      size={14}
                      className="mt-0.5 shrink-0 text-muted"
                    />
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/writing"
            className="mt-5 inline-block text-[13px] text-fg hover:text-accent"
          >
            View All Writing →
          </Link>
        </Panel>
      </div>
    </section>
  );
}
