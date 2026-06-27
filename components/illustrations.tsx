"use client";

import type { FlowerPlacement } from "@/components/flower-layouts";

type IllustrationsProps = {
  /** Public paths from `getIllustrationPaths()` (server-read). */
  paths: string[];
  /** Resolved placement preset (see `flower-layouts.ts`). */
  layout: FlowerPlacement[];
  /** Eager-load the images (hero is intentionally left non-priority). */
  priority?: boolean;
  /** Extra classes on the absolute layer. */
  className?: string;
};

/**
 * Scatters illustrations across a positioned parent and spins each 180° on
 * hover. Decorative only — the layer is `aria-hidden` and the images carry empty
 * alt text. Placement is deterministic (driven by the `layout` prop), so SSR and
 * CSR match with no hydration warning. Files cycle if there are more positions
 * than assets, so adding/removing a file in `public/illustrations/` changes the
 * render with no code edit.
 */
export function Illustrations({
  paths,
  layout,
  priority = false,
  className,
}: IllustrationsProps) {
  if (paths.length === 0 || layout.length === 0) return null;

  return (
    <div className={`flower-layer${className ? ` ${className}` : ""}`} aria-hidden="true">
      {layout.map((pos, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative drop-in art; images are already optimized (next.config unoptimized) and we mix .svg/.webp
        <img
          key={i}
          src={paths[i % paths.length]}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="flower"
          style={
            {
              left: pos.left,
              top: pos.top,
              width: `${pos.size}rem`,
              height: `${pos.size}rem`,
              "--flower-rot": `${pos.rotate ?? 0}deg`,
            } as React.CSSProperties
          }
          data-mobile-hide={pos.hideOnMobile ? "" : undefined}
        />
      ))}
    </div>
  );
}
