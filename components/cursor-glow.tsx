"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

// Ambient cursor glow — dark mode only, skipped on the media-heavy pages. The
// pointer position is written straight to the node via a ref (CSS variables),
// so tracking the cursor never triggers a React re-render. Coarse pointers and
// reduced-motion users get no listener at all.
const HIDDEN_PATHS = ["/photography", "/design", "/web-projects"];

export default function CursorGlow() {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const hidden =
    HIDDEN_PATHS.includes(pathname) || pathname.startsWith("/writing/");
  const active = mounted && resolvedTheme !== "light" && !hidden;

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      el.style.setProperty("--gx", `${e.clientX}px`);
      el.style.setProperty("--gy", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "radial-gradient(600px at var(--gx, 50%) var(--gy, 50%), rgba(250,91,28,0.08), transparent 70%)",
      }}
    />
  );
}
