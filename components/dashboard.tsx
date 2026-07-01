"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Link2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { aboutParagraphs } from "@/components/about";
import { entries } from "@/components/experience";
import { projects } from "@/components/projects";
import { stories } from "@/components/stories";

/**
 * Zone B — the dashboard (Log V6). A horizontal, scroll-snap row of bordered
 * `.panel` cards (V3 primitive), each headed by a mono `.label` + section-color
 * dot.
 *
 *   Stage 1: scroll container + panel shell.
 *   Stage 2: real homepage components (About/Experience/Projects/Stories)
 *            mapped into panels, reusing their data arrays — no data changes.
 *   Stage 3: tappable dot + arrow nav, active dot synced to scroll position.
 *   Stage 4: career cards expand to a fullscreen overlay (grow-from-origin).
 *   Stage 5: keyboard operability, focus trap + restore, ARIA, reduced-motion.
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
    <article
      data-panel
      className="panel snap-start flex h-full w-[85vw] shrink-0 flex-col overflow-hidden sm:w-110 md:w-120"
    >
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

  // ── Stage 3: horizontal nav (arrows + dots, active synced to scroll) ──────
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const prefersReduced = useRef(false);
  const [active, setActive] = useState(0);
  // Trailing spacer width so the last panel can reach start-alignment (without
  // it, the final panels share the same end scroll position and their dots
  // can never become active). Recomputed on resize.
  const [spacerW, setSpacerW] = useState(0);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    const compute = () => {
      const els = c.querySelectorAll<HTMLElement>("[data-panel]");
      const last = els[els.length - 1];
      if (!last) return;
      const pad = parseFloat(getComputedStyle(c).paddingLeft) || 0;
      setSpacerW(Math.max(0, c.clientWidth - last.offsetWidth - pad - 20));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const scrollToIndex = useCallback((i: number) => {
    const c = scrollRef.current;
    if (!c) return;
    const panel = c.querySelectorAll<HTMLElement>("[data-panel]")[i];
    if (!panel) return;
    const pad = parseFloat(getComputedStyle(c).paddingLeft) || 0;
    c.scrollTo({
      left: panel.offsetLeft - pad,
      behavior: prefersReduced.current ? "auto" : "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const c = scrollRef.current;
      if (!c) return;
      const pad = parseFloat(getComputedStyle(c).paddingLeft) || 0;
      const sl = c.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      c.querySelectorAll<HTMLElement>("[data-panel]").forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - pad - sl);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    });
  }, []);

  // ── Stage 4: career card → fullscreen overlay ─────────────────────────────
  const [expanded, setExpanded] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const openEntry = (
    i: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const r = e.currentTarget.getBoundingClientRect();
    prevFocusRef.current = e.currentTarget;
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    setClosing(false);
    setExpanded(i);
  };

  const closeModal = useCallback(() => {
    setClosing(true);
    window.setTimeout(
      () => {
        setExpanded(null);
        setClosing(false);
      },
      prefersReduced.current ? 0 : 260,
    );
  }, []);

  // Stage 5: focus trap inside the overlay.
  const trapTab = useCallback((e: KeyboardEvent) => {
    const root = modalRef.current;
    if (!root) return;
    const focusable = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Stage 4/5: lock body scroll, focus the close button, Esc + Tab handling,
  // and restore focus to the trigger on close.
  useEffect(() => {
    if (expanded === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusT = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      } else if (e.key === "Tab") {
        trapTab(e);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusT);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocusRef.current?.focus?.();
    };
  }, [expanded, closeModal, trapTab]);

  // ── Panels (data mapped in Stage 2) ───────────────────────────────────────
  const panels: { label: string; dotClass: string; content: ReactNode }[] = [
    {
      label: "About",
      dotClass: "bg-orange",
      content: (
        <div className="space-y-4 text-[14px] leading-[1.7] text-fg">
          {aboutParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ),
    },
    {
      label: "Career Journey",
      dotClass: "bg-c-experience",
      content: (
        <ol className="flex flex-col">
          {entries.map((entry, i) => (
            <li key={i} className="flex gap-3">
              <div className="w-12 shrink-0 pt-1">
                <span className="label text-c-experience">
                  {startYear(entry.dates)}
                </span>
              </div>
              <div className="relative shrink-0">
                <span className="absolute left-1/2 top-1.5 size-2.5 -translate-x-1/2 rounded-full bg-c-experience" />
                {i < entries.length - 1 && (
                  <span className="absolute left-1/2 top-1.5 h-full w-px -translate-x-1/2 bg-c-experience/30" />
                )}
                <span className="block w-2.5" />
              </div>
              <button
                type="button"
                onClick={(e) => openEntry(i, e)}
                aria-label={`Expand details for ${entry.title}`}
                className="group -mx-2 mb-6 min-w-0 flex-1 rounded-lg px-2 py-1 text-left transition-colors duration-200 hover:bg-[rgba(0,0,0,0.05)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-c-experience dark:hover:bg-[rgba(255,255,255,0.05)]"
              >
                <span className="block text-[14px] font-medium text-fg">
                  {entry.title}
                </span>
                {entry.org && (
                  <span className="mt-0.5 block text-[13px] text-accent">
                    {entry.org}
                  </span>
                )}
                <span className="mb-2 mt-1 block text-[12px] text-muted">
                  {entry.dates}
                </span>
                <p className="mb-2 line-clamp-2 text-[13px] leading-[1.6] text-muted">
                  {entry.description}
                </p>
                <div className="mb-2 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className={tagClass}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em] text-c-experience opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  View details <ArrowUpRight size={12} />
                </span>
              </button>
            </li>
          ))}
        </ol>
      ),
    },
    {
      label: "Highlighted Work",
      dotClass: "bg-c-work",
      content: (
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
      ),
    },
    {
      label: "Side Projects",
      dotClass: "bg-c-design",
      content: (
        <>
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
        </>
      ),
    },
    {
      label: "Exploring",
      dotClass: "bg-c-writing",
      content: (
        <>
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
        </>
      ),
    },
  ];

  // Overlay geometry: dampened offset so the card appears to grow from the
  // clicked entry rather than flying in from the corner.
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const dx = origin ? (origin.x - vw / 2) * 0.25 : 0;
  const dy = origin ? (origin.y - vh / 2) * 0.25 : 0;
  const expandedEntry = expanded !== null ? entries[expanded] : null;

  return (
    <section id="dashboard" className="py-20">
      {/* Section head — Fraunces title + mono hint. Centered at ~1280px so the
          dashboard is squeezed in from the page edges a little (wider than the
          bento's 1080px column below it). */}
      <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between gap-4 px-6 md:px-16">
        <div>
          <p className="label mb-2">Zone B · Dashboard</p>
          <h2 className="display-md text-fg">The dashboard</h2>
        </div>
        <p className="label hidden whitespace-nowrap sm:block">scroll →</p>
      </div>

      {/* Horizontal scroll-snap row. Native (styled) scrollbar stays as the
          primary affordance on pointer devices; the controls below add
          tappable nav for short/touch screens. */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="dashboard-scroll relative mx-auto flex h-[78vh] max-h-160 max-w-7xl snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-16"
      >
        {panels.map((p) => (
          <Panel key={p.label} label={p.label} dotClass={p.dotClass}>
            {p.content}
          </Panel>
        ))}
        {/* Trailing room so the last panel can scroll to start-alignment. */}
        <div aria-hidden="true" className="shrink-0" style={{ width: spacerW }} />
      </div>

      {/* Stage 3 — tappable nav: [‹] dots [›]. Active dot tracks scroll. */}
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-center gap-5 px-6 md:px-16">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous panel"
          className="flex size-10 items-center justify-center rounded-full border border-border text-fg transition-colors duration-200 hover:bg-surface disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1" role="tablist" aria-label="Dashboard panels">
          {panels.map((p, i) => (
            <button
              key={p.label}
              type="button"
              role="tab"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${p.label} panel`}
              aria-selected={active === i}
              className="flex size-7 items-center justify-center"
            >
              <span
                className={`block size-2.5 rounded-full transition-all duration-200 ${
                  active === i ? `${p.dotClass} scale-125` : "bg-border"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(panels.length - 1, active + 1))}
          disabled={active === panels.length - 1}
          aria-label="Next panel"
          className="flex size-10 items-center justify-center rounded-full border border-border text-fg transition-colors duration-200 hover:bg-surface disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Stage 4 — career card expanded to a fullscreen overlay. */}
      {expandedEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="career-modal-title"
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
              closing ? "dash-overlay-out" : "dash-overlay-in"
            }`}
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            ref={modalRef}
            style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}
            className={`panel relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden ${
              closing ? "dash-card-out" : "dash-card-in"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="size-2 shrink-0 rounded-full bg-c-experience" />
                <span className="label">Career Journey</span>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted transition-colors duration-200 hover:bg-surface hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="dashboard-scroll min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="label mb-2 text-c-experience">
                {expandedEntry.dates}
              </p>
              <h3
                id="career-modal-title"
                className="display-sm mb-2 text-fg"
              >
                {expandedEntry.title}
              </h3>
              {expandedEntry.org &&
                (expandedEntry.href ? (
                  <a
                    href={expandedEntry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 inline-flex items-center gap-1 text-[15px] text-accent hover:opacity-80"
                  >
                    {expandedEntry.org}
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <p className="mb-4 text-[15px] text-accent">
                    {expandedEntry.org}
                  </p>
                ))}
              {expandedEntry.links.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-4">
                  {expandedEntry.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-fg"
                    >
                      <Link2 size={13} />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              <p className="mb-6 text-[15px] leading-[1.8] text-fg">
                {expandedEntry.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {expandedEntry.tags.map((tag) => (
                  <span key={tag} className={tagClass}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
