import Flower from "@/components/v3/flower";
import Reveal from "@/components/v3/reveal";

// V3 homepage — Stage 2 adds the shared motion primitives (Flower wind-spin +
// Reveal fade-up) with a small decorative cluster to exercise them. The "A
// little more personal" bento replaces this cluster in Stage 3 (see
// UPDATELOGV12.md); hero/work/finale land in V13–V15. Everything is scoped by
// `.v3-root` (v3.css) so none of the live site's chrome / design system leaks in.

// A little garden of daisies — varied petal colors, counts, and indices so the
// wind-spin looks flowy rather than synchronized.
const GARDEN = [
  { petal: "red", core: "#F4F3EE", petals: 8 },
  { petal: "blue", core: "#FFCB41", petals: 6 },
  { petal: "yellow", core: "#0015D4", petals: 7 },
  { petal: "pink", core: "#ffffff", petals: 5 },
  { petal: "cyan", core: "#F32317", petals: 6 },
  { petal: "red", core: "#84DEF9", petals: 7 },
] as const;

export default function V3Page() {
  return (
    <main
      className="wrap"
      style={{ minHeight: "100vh", paddingBlock: "clamp(46px,6vw,80px)" }}
    >
      <Reveal className="inner" style={{ textAlign: "center", margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "var(--serif)",
            fontWeight: 400,
            fontSize: "clamp(26px,4vw,52px)",
          }}
        >
          V3 preview
        </h1>
        <p className="lede" style={{ color: "var(--ink-soft)", marginTop: 12 }}>
          Scaffold + motion primitives in place. Sections land in the coming
          stages.
        </p>
      </Reveal>

      {/* Temporary garden — verifies the Flower wind-spin + Reveal fade-up.
          Replaced by the personal bento in Stage 3. */}
      <Reveal
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 6,
          maxWidth: 520,
          margin: "48px auto 0",
          justifyItems: "center",
        }}
      >
        {GARDEN.map((f, i) => (
          <Flower
            key={i}
            index={i}
            petal={f.petal}
            core={f.core}
            petals={f.petals}
            style={{ width: 72, height: 72 }}
          />
        ))}
      </Reveal>
    </main>
  );
}
