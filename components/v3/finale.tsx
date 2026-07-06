import Flower from "@/components/v3/flower";

// Flower-grid finale (V15 S2) — the mockup's full-bleed 8-column flower grid with
// the centered serif quote floating over it, plus a small real legal line. CSS
// (`.finale`, `.grid-flowers`, `.center-text`, `.legal-min`) was ported to v3.css
// in V12. Server component: the grid is built at render (no inline <script>), each
// cell is a <Flower> whose wind-spin variance comes from its index (deterministic,
// CSS transforms only, disabled under prefers-reduced-motion — see flower.tsx /
// v3.css). No <Reveal> here: the mockup reveals neither the grid nor the quote,
// and a reveal transform would clobber the quote's translate(-50%,-50%) centering.

// The mockup's finale palettes, ported verbatim.
const PET = ["#FF8FCA", "#0015D4", "#84DEF9", "#F32317", "#FFCB41"];
const COR = ["#ffffff", "#FFCB41", "#0015D4", "#84DEF9", "#FF8FCA", "#F32317"];
const FLOWER_COUNT = 40;

// Same index math as the mockup's grid builder: petal/core cycle through the
// palettes, core falls back to white if it collides with the petal, petal count
// walks 5–8.
const flowers = Array.from({ length: FLOWER_COUNT }, (_, i) => {
  const petal = PET[(i * 3 + (i % 2)) % PET.length];
  let core = COR[(i * 5) % COR.length];
  if (core === petal) core = "#ffffff";
  return { petal, core, petals: 5 + (i % 4) };
});

export default function Finale() {
  const year = new Date().getFullYear();

  return (
    <>
      <section className="finale">
        <div className="grid-flowers" aria-hidden="true">
          {flowers.map((f, i) => (
            <Flower
              key={i}
              petal={f.petal}
              core={f.core}
              petals={f.petals}
              index={i}
            />
          ))}
        </div>
        <p className="center-text">
          Great design is always
          <br />
          hidden in the plain sight.
        </p>
      </section>

      <div className="legal-min">© {year} Charlie Ramus</div>
    </>
  );
}
