import type { CSSProperties } from "react";

// Flower (V12 S2) — React port of the mockup's `flowerSVG(petal, core, n)`
// generator. Pure render + CSS animation (the wind-spin lives in v3.css), so
// this is a server component: no hooks, no inline <script>, no dangerouslySet.
//
// The wind-spin's per-flower variance (`--spin-dur` / `--spin-delay`) is derived
// *deterministically* from the `index` prop, so the same values render on the
// server and the client — no hydration mismatch. (Random-at-render would.)

// The mockup's named-palette shorthand for the petal color.
const NAMED: Record<string, string> = {
  red: "#F32317",
  blue: "#0015D4",
  yellow: "#FFCB41",
  pink: "#FF8FCA",
  cyan: "#84DEF9",
};

// Deterministic pseudo-random in [0, 1) from an integer seed (mulberry32).
// Used only to scatter spin timing by index — never for anything rendered as
// text, so server and client agree.
function hash01(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export interface FlowerProps {
  /** Petal color — a NAMED key (`red`/`blue`/…) or any CSS color string. */
  petal?: string;
  /** Center/core color — any CSS color string. */
  core?: string;
  /** Petal count (mockup default 7; clamped to a minimum of 3). */
  petals?: number;
  /** Position within a field — varies the wind-spin timing deterministically. */
  index?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Flower({
  petal = "red",
  core = "#F4F3EE",
  petals = 7,
  index = 0,
  className,
  style,
}: FlowerProps) {
  const fill = NAMED[petal] ?? petal;
  const n = Math.max(3, Math.round(petals));

  // Wind-spin variance from index: duration 6–11s, delay 0–6s (see v3.css).
  const dur = 6 + hash01(index) * 5;
  const delay = hash01(index * 7 + 1) * 6;

  // Same math as the mockup's flowerSVG loop.
  const petalEls = Array.from({ length: n }, (_, i) => {
    const a = (360 / n) * i;
    const rx = 12 + (i % 2 ? 1.2 : -0.8);
    const ry = 19 + (i % 3 ? 0 : 1.2);
    return (
      <ellipse
        key={i}
        cx="50"
        cy="28"
        rx={rx}
        ry={ry}
        fill={fill}
        transform={`rotate(${a} 50 50)`}
      />
    );
  });

  const spinStyle = {
    "--spin-dur": `${dur.toFixed(2)}s`,
    "--spin-delay": `${delay.toFixed(2)}s`,
    ...style,
  } as CSSProperties;

  return (
    <span
      className={["flower", className].filter(Boolean).join(" ")}
      style={spinStyle}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100">
        {petalEls}
        <circle cx="50" cy="50" r="11" fill={core} />
      </svg>
    </span>
  );
}
