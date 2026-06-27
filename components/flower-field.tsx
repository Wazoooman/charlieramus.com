import { getIllustrationPaths } from "@/lib/illustrations";
import { Illustrations } from "@/components/illustrations";
import { flowerLayouts, type FlowerLayoutName } from "@/components/flower-layouts";

// How many times a single asset may repeat across a field. Keeps a tiny asset
// set from carpeting a dense preset while still allowing gentle repetition.
const MAX_REPEAT = 3;

type FlowerFieldProps = {
  /** `scatter` (sparse, hero edges) or `field` (dense ring, closing quote). */
  preset?: FlowerLayoutName;
  /** Hard cap on the number of flowers, regardless of preset/asset count. */
  max?: number;
  /** Eager-load (hero is intentionally non-priority — leave default). */
  priority?: boolean;
  /** Extra classes forwarded to the absolute layer. */
  className?: string;
};

/**
 * Server component: reads the drop-in illustration folder, picks a placement
 * preset, caps density by available assets + the `max` prop, and hands the paths
 * to the client `<Illustrations>` renderer. `fs` stays server-side.
 *
 * Render inside a `position: relative` parent — the layer is `position:
 * absolute; inset: 0`.
 */
export default function FlowerField({
  preset = "scatter",
  max,
  priority = false,
  className,
}: FlowerFieldProps) {
  const paths = getIllustrationPaths();
  if (paths.length === 0) return null; // no assets → no flowers, no crash

  const layout = flowerLayouts[preset];
  // Density capped by: the preset length, the optional `max`, and the asset
  // count (allowing up to MAX_REPEAT repeats so few assets don't over-fill).
  const cap = Math.min(layout.length, max ?? layout.length, paths.length * MAX_REPEAT);
  const placements = layout.slice(0, cap);

  return (
    <Illustrations
      paths={paths}
      layout={placements}
      priority={priority}
      className={className}
    />
  );
}
