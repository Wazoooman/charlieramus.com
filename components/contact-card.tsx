import { socialLinks } from "@/components/social-links";

/**
 * "Get in touch" contact card (Log V11, Stage 1). A full-width rounded card that
 * is the contact zone for the redesign. Default state is a solid `--red` card
 * with white type; on hover the whole thing inverts to the page surface with red
 * type (pure CSS — the global reduced-motion guard in globals.css neutralizes the
 * color transition). A row of square tabs hangs OUT of the card's bottom edge —
 * flush/square where they meet the card, rounded only on their bottom corners.
 *
 * Reused on app/preview/page.tsx as the contact zone (V5–V8 convention: homepage
 * zones land on /preview first; final homepage assembly is its own log).
 *
 * Everything copy-facing lives in the constants below, so swapping the headline,
 * the lead-in line, or the email is a one-line edit. The tabs come straight from
 * `components/social-links.tsx` (single source of truth for Charlie's socials).
 */
const EMAIL = "charlie.ramus12@gmail.com";
const LEAD_IN = "Like what you see?";
const HEADLINE = "Get in touch";
/** Peace hand with the text-presentation selector (U+FE0E) so it renders
 *  monochrome and inherits `currentColor` — letting it invert with the card. */
const PEACE = "✌︎";

/**
 * Optional per-social logo override, keyed by the social's `label` from
 * social-links.tsx. Drop a file in `public/socials/` and add one line, e.g.:
 *   GitHub: "/socials/github.webp"
 * The image is rendered through a CSS mask filled with `currentColor`, so ANY
 * webp (even a colored logo) shows up as a clean black/white silhouette that
 * follows the theme automatically — no separate light/dark assets needed. Labels
 * with no entry here fall back to the line-icon SVG (already theme-adaptive).
 */
const TAB_LOGOS: Record<string, string> = {};

/** Renders a logo override as a theme-adaptive (currentColor) masked silhouette. */
function maskStyle(src: string) {
  return {
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  } as const;
}

export default function ContactCard() {
  return (
    <section className="px-6 py-24 md:px-16">
      <div className="relative mx-auto max-w-225">
        {/* Social tabs — square slabs that hang out of the card's bottom edge:
            square where they meet the card (no top border / top radius), rounded
            only on the bottom corners. They sit behind the card (z-0) with a small
            overlap so the seam is hidden and they read as growing out of it. */}
        <div className="absolute inset-x-0 bottom-0 z-0 flex translate-y-[calc(100%-0.5rem)] flex-wrap items-start justify-center gap-2 px-6">
          {socialLinks.map(({ href, label, icon }) => {
            const logo = TAB_LOGOS[label];
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-16 w-16 items-center justify-center rounded-b-xl border border-t-0 border-border bg-surface text-muted shadow-[0_10px_18px_-10px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-panel hover:text-fg [&>svg]:h-7 [&>svg]:w-7"
              >
                {logo ? (
                  <span
                    aria-hidden="true"
                    className="h-7 w-7 bg-current"
                    style={maskStyle(logo)}
                  />
                ) : (
                  icon
                )}
              </a>
            );
          })}
        </div>

        {/* Card — a mailto link so the whole surface is the call to action.
            Default red/white; `hover:` inverts both background and (inherited)
            text to surface/red. */}
        <a
          href={`mailto:${EMAIL}`}
          className="group relative z-10 flex min-h-88 flex-col justify-between overflow-hidden rounded-4xl bg-red px-8 py-10 text-white shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition-colors duration-500 hover:bg-surface hover:text-red sm:px-11 md:min-h-108"
        >
          {/* Top center — peace hand + the lead-in line in Fraunces. */}
          <div className="flex flex-col items-center text-center">
            <span aria-hidden="true" className="text-5xl leading-none">
              {PEACE}
            </span>
            <p className="serif mt-4 text-2xl sm:text-3xl">{LEAD_IN}</p>
          </div>

          {/* Bottom-left — the big headline hugging the lower edge. display-xl
              (not display-hero) so it stays in proportion with the smaller card. */}
          <h2 className="display-xl -mb-1 text-left">{HEADLINE}</h2>
        </a>
      </div>
    </section>
  );
}
