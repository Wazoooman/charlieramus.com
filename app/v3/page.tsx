import Hero from "@/components/v3/hero";
import DigitalHome from "@/components/v3/digital-home";
import PersonalBento from "@/components/v3/personal-bento";

// V3 homepage — V13 adds the nav + hero (S1) and the full-bleed "Step into my
// digital home" carousel (S2) above the V12 "A little more personal" bento. The
// work, services, contact, and finale sections arrive in later stages.
// Everything is scoped by `.v3-root` (v3.css) so none of the live site's chrome
// / design system leaks.
export default function V3Page() {
  return (
    <main>
      <Hero />

      {/* Full-bleed — NOT inside .wrap; the carousel pads itself with --edge. */}
      <DigitalHome />

      <section id="personal">
        <div className="wrap">
          <PersonalBento />
        </div>
      </section>
    </main>
  );
}
