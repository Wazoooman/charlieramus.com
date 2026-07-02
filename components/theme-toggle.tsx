"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Theme toggle (Log V5). Restyled to a mono pill: blurred translucent capsule
 * with an icon + Space Mono label. Stays mounted globally in `app/layout.tsx`
 * (fixed, top-right) so every page keeps a working toggle. Drives `next-themes`;
 * renders a stable placeholder until mounted to avoid a hydration flash.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The /v3 "mini app" ships its own chrome — keep the live-site toggle off it.
  if (pathname.startsWith("/v3")) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="fixed right-4 top-3.5 z-50 flex items-center gap-2 rounded-full border border-border bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted backdrop-blur-md transition-colors duration-200 hover:text-fg"
    >
      {mounted ? (
        <>
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </>
      ) : (
        <span className="inline-block h-3.25 w-12" />
      )}
    </button>
  );
}
