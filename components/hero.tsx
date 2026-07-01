import FlowerField from "@/components/flower-field";

/**
 * Zone A — the hero (Log V5). Full-viewport, centered composition: mono kicker,
 * oversized Fraunces name, a short intro with one section-colored accent, and a
 * quiet scroll cue. A sparse `<FlowerField>` scatters spinning flowers around
 * the edges, behind the text. Copy is unchanged from the prior hero — visual only.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Stage 2 — sparse scatter, behind the text (`.flower-layer` is z-0). */}
      <FlowerField preset="scatter" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        <p className="label mb-6">Boulder, CO · High School Junior · Builder</p>

        <h1 className="display-hero text-fg">
          Charlie
          <br />
          Ramus
        </h1>

        <p className="mt-7 max-w-130 text-base leading-relaxed text-muted">
          {"Building software, growing "}
          <span className="font-medium text-c-work">communities</span>, and
          exploring the intersection of computation and biology.
        </p>
      </div>

      {/* Stage 4 — quiet scroll cue. */}
      <a
        href="#about"
        className="scroll-cue label absolute bottom-8 left-1/2 z-10 -translate-x-1/2 hover:text-fg"
        aria-label="Scroll down"
      >
        ↓ scroll
      </a>
    </section>
  );
}
