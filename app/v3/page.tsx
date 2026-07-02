import Hero from "@/components/v3/hero";
import PersonalBento from "@/components/v3/personal-bento";

// V3 homepage — V13 S1 adds the nav + hero above the V12 "A little more personal"
// bento. The "digital home" carousel (V13 S2), work, services, contact, and
// finale sections arrive in later stages. Everything is scoped by `.v3-root`
// (v3.css) so none of the live site's chrome / design system leaks.
export default function V3Page() {
  return (
    <main>
      <Hero />

      <section id="personal">
        <div className="wrap">
          <PersonalBento />
        </div>
      </section>
    </main>
  );
}
