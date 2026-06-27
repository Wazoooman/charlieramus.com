// Flower placement presets (Log V4 — illustration system).
//
// Pure data + deterministic math only. No `Math.random()` and no `fs`, so this
// module is safe to import from both server and client components and renders
// identically on the server and the client (no hydration mismatch).

export type FlowerPlacement = {
  /** Horizontal position, as a % of the field's width. */
  left: string;
  /** Vertical position, as a % of the field's height. */
  top: string;
  /** Flower box size, in rem. */
  size: number;
  /** Resting tilt in degrees (deterministic). Hover spins +180° from here. */
  rotate?: number;
  /** Hidden on small screens to cut clutter / overflow (Stage 5). */
  hideOnMobile?: boolean;
};

/** Sparse scatter for the hero — flowers hug the edges, clear of the headline.
 *  Sizes mirror the mockup's larger decorations (~90-160px ≈ 5.5-10rem). */
const scatter: FlowerPlacement[] = [
  { left: "3%", top: "14%", size: 8.5, rotate: -8 },
  { left: "87%", top: "9%", size: 9.5, rotate: 12, hideOnMobile: true },
  { left: "78%", top: "60%", size: 7.5, rotate: 20 },
  { left: "8%", top: "68%", size: 10, rotate: -14, hideOnMobile: true },
  { left: "92%", top: "38%", size: 6.5, rotate: 6, hideOnMobile: true },
  { left: "1%", top: "44%", size: 6.5, rotate: -22, hideOnMobile: true },
  { left: "63%", top: "12%", size: 5.5, rotate: 30, hideOnMobile: true },
  { left: "30%", top: "84%", size: 7.5, rotate: -6 },
];

/**
 * Dense ring around a centred quote (Log V8 closing field). Positions are
 * derived purely from the index, so the layout is deterministic.
 */
function buildField(): FlowerPlacement[] {
  const out: FlowerPlacement[] = [];
  const count = 18;
  const sizes = [3, 4, 3.5, 4.5, 3.25];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    // Alternate the radius so the ring reads organic, not a perfect circle.
    const radius = i % 2 === 0 ? 44 : 37;
    const left = 50 + radius * Math.cos(angle);
    const top = 50 + radius * Math.sin(angle);
    out.push({
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      size: sizes[i % sizes.length],
      rotate: ((i * 37) % 60) - 30,
      // Thin the ring to every other flower on mobile.
      hideOnMobile: i % 2 === 1,
    });
  }
  return out;
}

const field: FlowerPlacement[] = buildField();

export const flowerLayouts = { scatter, field } as const;

export type FlowerLayoutName = keyof typeof flowerLayouts;
