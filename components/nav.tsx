import Link from "next/link";

// Absolute hash targets (`/#about`, not `#about`) so the bar wayfinds back to
// the homepage sections from any route — the V9 subpages render it too.
const links = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#photography", label: "Photography" },
  { href: "/#writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Zone A top bar (Log V5). Blurred translucent bar pinned to the top, Space Mono
 * name + nav links. The theme toggle lives globally in `app/layout.tsx` as a
 * fixed pill in the top-right corner, so the bar reserves right padding (`pr-24`)
 * to clear it rather than embedding a second toggle.
 */
export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:pr-24">
        <Link
          href="/"
          className="font-mono text-sm font-bold tracking-tight text-fg transition-colors hover:text-muted"
        >
          Charlie Ramus
        </Link>
        <div className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
