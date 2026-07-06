import Hero from "@/components/v3/hero";
import DigitalHome from "@/components/v3/digital-home";
import PersonalBento from "@/components/v3/personal-bento";
import Work from "@/components/v3/work";
import Services from "@/components/v3/services";
import AboutCollage from "@/components/v3/about-collage";
import Contact from "@/components/v3/contact";
import Finale from "@/components/v3/finale";

// V3 homepage — final section order (V15 S3), matching hellodani-mockup.html
// top-to-bottom: hero → "Step into my digital home" carousel → the "A little more
// personal" explore bento (mockup places this ABOVE work) → "Tiny fraction of my
// work" bands → "I've got your back with…" services → "Behind the pixels" about
// collage → red "Get in touch" contact card → full-bleed flower-grid finale.
// Everything is scoped by `.v3-root` (v3.css) so none of the live site's chrome /
// design system leaks.
export default function V3Page() {
  return (
    <main>
      <Hero />

      {/* Full-bleed — NOT inside .wrap; the carousel pads itself with --edge. */}
      <DigitalHome />

      {/* Explore bento — sits above work per the mockup (line 337). */}
      <section id="personal">
        <div className="wrap">
          <PersonalBento />
        </div>
      </section>

      {/* Each renders its own <section><div class="wrap"> like the mockup. */}
      <Work />
      <Services />
      <AboutCollage />

      {/* V15 S1 — red "Get in touch" card; sits above the flower-grid finale.
          Renders its own <section class="contact"> like the mockup. */}
      <Contact />

      {/* V15 S2 — full-bleed flower-grid finale + centered quote + legal line.
          Full-bleed: NOT inside .wrap. Last thing on the page. */}
      <Finale />
    </main>
  );
}
