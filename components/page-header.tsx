import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Shared subpage chrome (Log V9, Stage 1). One header for every secondary route
 * so the site reads as a single system: a mono back link, a mono `.label`
 * eyebrow, a Fraunces (`display-lg`) title, and an optional subtitle.
 *
 * Everything is token-driven (no hardcoded hex) so the global theme toggle
 * works on every page. `accent` is an optional CSS color (e.g. "var(--sky)")
 * that the per-section stages (V9 S2-S4) pass to tint the eyebrow; unset, the
 * eyebrow keeps the muted `.label` grey. `eyebrow`/`title`/`subtitle` copy is
 * passed per page, so editing a header is a one-line change at the call site.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Home",
  accent,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  accent?: string;
}) {
  return (
    <header className="mb-12">
      <Link
        href={backHref}
        className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:text-fg"
      >
        <ArrowLeft size={13} />
        {backLabel}
      </Link>
      {eyebrow && (
        <p className="label mb-3" style={accent ? { color: accent } : undefined}>
          {eyebrow}
        </p>
      )}
      <h1 className="display-lg text-fg">{title}</h1>
      {subtitle && <p className="mt-4 max-w-prose text-muted">{subtitle}</p>}
    </header>
  );
}
