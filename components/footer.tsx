import { socialLinks } from "@/components/social-links";

/**
 * Zone D footer (Log V8). Restyled to the mono system: a single rule-topped bar
 * with the meta line (name · location · year) in the `.label` mono face on the
 * left and the shared social set (reused from the sidebar via
 * `components/social-links`) on the right. Server component — the year is read
 * once at render, no client JS.
 */
const NAME = "Charlie Ramus";
const LOCATION = "Boulder, CO";
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p className="label flex items-center gap-2">
          <span className="text-fg">{NAME}</span>
          <span aria-hidden="true">·</span>
          <span>{LOCATION}</span>
          <span aria-hidden="true">·</span>
          <span>{YEAR}</span>
        </p>

        <div className="flex items-center gap-5">
          {socialLinks.map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-muted transition-colors duration-200 hover:text-accent [&>svg]:h-5 [&>svg]:w-5"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
