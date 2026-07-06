import Reveal from "@/components/v3/reveal";
import { services } from "@/data/services";

// "I've got your back with…" (V14 S2) — the mockup's `#garden` services section:
// the `.head`, a decorative fanned card stack (`.fan` of `.fc` cards), and the
// 3-column dashed-underline `.svc-grid` service list. Layout/CSS was ported into
// v3.css in V12; this component ports the mockup's two inline-`<script>` builders
// (the fan) to React and wires the list to Charlie's real skills (data/services).
//
// Server component: pure render, no hooks. The scroll fade-up lives on the
// `<Reveal>` wrappers (client). The fan is purely decorative, so it's
// `aria-hidden` — the meaningful content is the service list.

// The mockup's fan palette (`fanColors`), ported verbatim — a run of dark and
// pastel cards that fan out from a shared bottom-center pivot.
const FAN_COLORS = [
  "#1c1c1c",
  "#f4f3ee",
  "#111",
  "#dff5e1",
  "#111",
  "#e7ecff",
  "#cfe9d6",
  "#0b0b0b",
  "#f7c8e0",
];

// The mockup laid the cards out from a left origin (left = i·44, rotate =
// (i − n/2)·7°). Centering the whole run under the heading keeps it from hugging
// the left edge / overflowing on the ported layout — the total width is known, so
// we offset every card by half of it.
function Fan() {
  const step = 44;
  const cardWidth = 90;
  const spread = (FAN_COLORS.length - 1) * step + cardWidth;

  return (
    <Reveal className="fan" aria-hidden="true">
      {FAN_COLORS.map((color, i) => {
        const angle = (i - FAN_COLORS.length / 2) * 7;
        const left = `calc(50% - ${spread / 2}px + ${i * step}px)`;
        return (
          <div
            key={i}
            className="fc"
            style={{
              left,
              transform: `rotate(${angle}deg)`,
              zIndex: i,
              background: color,
            }}
          />
        );
      })}
    </Reveal>
  );
}

export default function Services() {
  return (
    <section id="garden">
      <div className="wrap">
        <Reveal className="head">
          <h2>I&apos;ve got your back with…</h2>
          <p>
            The overlap of design, code, and a camera — whatever a project needs
            to look good and actually work.
          </p>
        </Reveal>

        <Fan />

        <Reveal className="svc-grid">
          {services.map((service) => (
            <div key={service}>{service}</div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
