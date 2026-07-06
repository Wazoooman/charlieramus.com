import Reveal from "@/components/v3/reveal";
import { socialLinks } from "@/components/social-links";

// Contact card (V15 S1) — the mockup's centered red "Get in touch" block plus the
// grey pill tabs tucked behind its bottom edge. Layout/CSS (`.contact .box`,
// `.peace`, `.vibe`, `.huge`, `.pills`) was ported into v3.css in V12; this
// component fills it with Charlie's real contact + socials. Sits ABOVE the flower
// grid finale. Server component: pure render, scroll fade-up via <Reveal>.

const CONTACT_EMAIL = "charlie.ramus12@gmail.com";

// Pull real hrefs from the single social source of truth (drop cleanly to "#" if
// a label ever gets renamed there).
const socialHref = (label: string) =>
  socialLinks.find((s) => s.label === label)?.href ?? "#";

// The mockup's pills were works/garden/x/linkedIn/dribbble — two on-page anchors
// plus socials. Charlie has no X or Dribbble, so those drop; the rest map to his
// real socials. Lowercase labels keep the mockup's quiet pill voice. Internal
// anchors (href starting "#") open in place; socials open in a new tab.
const pills: { label: string; href: string }[] = [
  { label: "works", href: "#work" },
  { label: "garden", href: "#garden" },
  { label: "linkedIn", href: socialHref("LinkedIn") },
  { label: "github", href: socialHref("GitHub") },
  { label: "photography", href: socialHref("Instagram Photography") },
  { label: "letterboxd", href: socialHref("Letterboxd") },
];

export default function Contact() {
  return (
    <section className="contact">
      <div className="wrap">
        <Reveal className="box">
          <div className="peace" aria-hidden="true">
            <svg viewBox="0 0 40 48" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 27 L10.5 13 a2.4 2.4 0 0 1 4.8 -0.6 L17 25" />
              <path d="M17 25 L17 10 a2.4 2.4 0 0 1 4.8 0 L22 26" />
              <path d="M22 26 L24 18.5 a2.3 2.3 0 0 1 4.5 1.1 L27 30" />
              <path d="M13 27 c-4.2 2 -5.2 6.2 -3.2 11 2 4.8 6 7.6 11.7 7.6 6.7 0 10.5 -4.6 10.5 -11.4" />
            </svg>
          </div>
          <div className="vibe">Think we vibe?</div>
          <a className="huge" href={`mailto:${CONTACT_EMAIL}`}>
            Get in touch
          </a>
        </Reveal>

        <Reveal className="pills">
          {pills.map(({ label, href }) => {
            const internal = href.startsWith("#");
            return (
              <a
                key={label}
                href={href}
                {...(internal
                  ? {}
                  : { target: "_blank", rel: "noreferrer noopener" })}
              >
                {label}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
