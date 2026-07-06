import Hero from "@/components/v3/hero";
import DigitalHome from "@/components/v3/digital-home";
import Work from "@/components/v3/work";
import Services from "@/components/v3/services";
import AboutCollage from "@/components/v3/about-collage";
import PersonalBento from "@/components/v3/personal-bento";

// V3 homepage — V13 adds the nav + hero and the "Step into my digital home"
// carousel; V14 adds the "Tiny fraction of my work" project bands (S1), the
// "I've got your back with…" services section (S2), and the "Behind the pixels"
// about collage (S3). These mount between the carousel and the V12 "A little more
// personal" bento. The contact block and finale arrive in V15, which also fixes
// the final section order. Everything is scoped by `.v3-root` (v3.css) so none of
// the live site's chrome / design system leaks.
export default function V3Page() {
  return (
    <main>
      <Hero />

      {/* Full-bleed — NOT inside .wrap; the carousel pads itself with --edge. */}
      <DigitalHome />

      {/* V14 — each renders its own <section><div class="wrap"> like the mockup. */}
      <Work />
      <Services />
      <AboutCollage />

      <section id="personal">
        <div className="wrap">
          <PersonalBento />
        </div>
      </section>
    </main>
  );
}
