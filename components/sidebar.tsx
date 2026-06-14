"use client";
import Link from "next/link";
import { useState, useEffect, type ReactNode } from "react";

const NAV_LINKS = [
  { href: "#about", label: "ABOUT", id: "about" },
  { href: "#experience", label: "EXPERIENCE", id: "experience" },
  { href: "#projects", label: "PROJECTS", id: "projects" },
  { href: "#stories", label: "STORIES", id: "stories" },
] as const;

const SECTION_IDS = ["about", "experience", "projects", "stories"] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight / 3;
      let current = "about";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return active;
}

type SocialLink = { href: string; label: string; icon: ReactNode; topLabel?: string; bottomLabel?: string };

const instagramIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const socialLinks: SocialLink[] = [
  {
    href: "https://www.linkedin.com/in/charlie-ramus-776366398/",
    label: "LinkedIn",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect width="4" height="12" x="2" y="9"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    href: "https://github.com/charlieramus",
    label: "GitHub",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
        <path d="M9 18c-4.51 2-5-2-7-2"/>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/chahramii/",
    label: "Instagram Photography",
    bottomLabel: "photography insta",
    icon: instagramIcon,
  },
  {
    href: "https://www.instagram.com/charlieramus_/",
    label: "Instagram Personal",
    topLabel: "personal insta",
    icon: instagramIcon,
  },
  {
    href: "https://letterboxd.com/cwramus/",
    label: "Letterboxd",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="5.3" cy="12" r="4"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="18.7" cy="12" r="4"/>
      </svg>
    ),
  },
];

function SocialRow() {
  const n = socialLinks.length;
  return (
    <div
      className="grid gap-x-5 gap-y-1"
      style={{ gridTemplateColumns: `repeat(${n}, 24px)` }}
    >
      {/* Row 1 — top labels (↓ arrow points at icon below) */}
      {socialLinks.map(({ label, topLabel }) => (
        <div key={`top-${label}`} className="flex flex-col items-center justify-end">
          {topLabel && (
            <>
              <span className="text-[9px] font-bold text-muted text-center whitespace-nowrap leading-none">{topLabel}</span>
              <svg width="10" height="28" viewBox="0 0 10 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5">
                <line x1="5" y1="1" x2="5" y2="20"/>
                <polyline points="1,20 5,26 9,20"/>
              </svg>
            </>
          )}
        </div>
      ))}

      {/* Row 2 — icons */}
      {socialLinks.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex items-center justify-center text-muted hover:text-accent transition-colors duration-200"
        >
          {icon}
        </a>
      ))}

      {/* Row 3 — bottom labels (↑ arrow points at icon above) */}
      {socialLinks.map(({ label, bottomLabel }) => (
        <div key={`bottom-${label}`} className="flex flex-col items-center justify-start">
          {bottomLabel && (
            <>
              <svg width="10" height="28" viewBox="0 0 10 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted mb-0.5">
                <polyline points="1,8 5,2 9,8"/>
                <line x1="5" y1="8" x2="5" y2="27"/>
              </svg>
              <span className="text-[9px] font-bold text-muted text-center whitespace-nowrap leading-none">{bottomLabel}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const activeSection = useActiveSection();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full md:w-[24%] lg:w-[30%] xl:w-[39%] flex-col items-center z-40 px-10 pt-22 pb-14">
        <div className="flex flex-col items-start h-full">
          {/* Name block */}
          <div className="mb-8 text-left">
            {/* CUSTOMIZE: name */}
            <p className="text-[44px] font-bold text-fg leading-tight tracking-tight">
              Charlie Ramus
            </p>
            {/* CUSTOMIZE: role line — 1 line, medium weight */}
            <p className="text-[14px] font-medium text-fg mt-8">
              High School Junior · Builder
            </p>
            {/* CUSTOMIZE: 1-2 sentence description, casual plain language */}
            <p className="text-[13px] text-muted mt-2 leading-[1.6]">
              Building with anything I can get my hands on.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex-1">
            <ul className="space-y-5">
              {NAV_LINKS.map(({ href, label, id }) => {
                const isActive = activeSection === id;
                return (
                  <li key={id} className="flex items-center justify-start gap-4">
                    <span
                      className={`h-px shrink-0 transition-all duration-200 ${
                        isActive ? "w-16 bg-fg" : "w-8 bg-muted/30"
                      }`}
                    />
                    <a
                      href={href}
                      className={`text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                        isActive ? "text-fg" : "text-muted hover:text-fg"
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
              <li className="flex items-center justify-start gap-4">
                <span className="h-px w-8 shrink-0 bg-transparent" />
                <Link
                  href="/photography"
                  className="text-[11px] tracking-[0.12em] uppercase text-muted hover:text-fg transition-colors duration-200"
                >
                  PHOTOGRAPHY
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social icons — left aligned near bottom */}
          <div className="mt-8">
            <SocialRow />
          </div>
        </div>
      </aside>

      {/* ── Mobile hero (no fixed header bar) ── */}
      <div className="md:hidden px-10 pt-8 pb-4">
        <p className="text-[32px] font-bold text-fg leading-tight tracking-tight">
          Charlie Ramus
        </p>
        <p className="text-[13px] font-medium text-fg mt-5">
          High School Sophomore · Builder
        </p>
        <div className="mt-4">
          <SocialRow />
        </div>
        <div className="mt-3">
          <Link
            href="/photography"
            className="text-[11px] tracking-[0.12em] uppercase text-muted hover:text-fg transition-colors duration-200"
          >
            PHOTOGRAPHY
          </Link>
        </div>
        <p className="text-[13px] text-muted mt-3 leading-[1.6]">
          Building with anything I can get my hands on.
        </p>
      </div>
    </>
  );
}
