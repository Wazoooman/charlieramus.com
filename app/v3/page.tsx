import PersonalBento from "@/components/v3/personal-bento";

// V3 homepage — Stage 3 renders the "A little more personal" bento (mockup
// layout, Charlie's real data, Stage 2 motion primitives). The hero, work,
// services, contact, and finale sections arrive in V13–V15. Everything is scoped
// by `.v3-root` (v3.css) so none of the live site's chrome / design system leaks.
export default function V3Page() {
  return (
    <main>
      <section id="personal">
        <div className="wrap">
          <PersonalBento />
        </div>
      </section>
    </main>
  );
}
