import Flower from "@/components/v3/flower";
import Reveal from "@/components/v3/reveal";
import Nav from "@/components/v3/nav";

// Hero (V13 S1) — the mockup's <header class="hero">: two big daisies bleeding
// ~9vw off the L/R edges, the nav cluster, the rainbow arc, "Hi, I'm Charlie
// Ramus", the thin-serif headline, a real lede in Charlie's voice, the dashed
// rule, and the black "Chat with me" pill. Layout/CSS is `.hero` / `.bloom` /
// `.rainbow` / `.hi` / `.rule` / `.btn` in v3.css (ported from the mockup).
//
// The blooms reuse the V12 <Flower> primitive (they wind-spin, varied per index)
// with the mockup's exact palette: cyan petal + blue core (7) on the left, red
// petal + paper core (8) on the right. `pointer-events:none` on .bloom keeps
// them clear of the text; the vw-based .bloom width preserves proportional bleed.

// Charlie's real public contact link (same mailto used in components/contact.tsx).
const CONTACT = "mailto:charlie.ramus12@gmail.com";

export default function Hero() {
  return (
    <header className="hero">
      <div className="bloom left">
        <Flower petal="cyan" core="#0015D4" petals={7} index={0} />
      </div>
      <div className="bloom right">
        <Flower petal="red" core="#F4F3EE" petals={8} index={1} />
      </div>

      <Nav />

      <Reveal className="inner">
        <svg className="rainbow" viewBox="0 0 100 55" aria-hidden="true">
          <g fill="none" strokeWidth="6" strokeLinecap="round">
            <path d="M8 52 A42 42 0 0 1 92 52" stroke="#F32317" />
            <path d="M18 52 A32 32 0 0 1 82 52" stroke="#FFCB41" />
            <path d="M28 52 A22 22 0 0 1 72 52" stroke="#0015D4" />
          </g>
        </svg>
        <div className="hi">Hi, I&apos;m Charlie Ramus</div>
        <h1>
          Charlie Ramus
        </h1>
        <p className="lede">
          I&apos;m a high-school junior who likes making things: web apps that
          actually ship, communities that stick, and photos worth a second look.
          Design runs through all of it.
        </p>
        <div className="rule" />
        <a className="btn" href={CONTACT}>
          Chat with me
        </a>
      </Reveal>
    </header>
  );
}
