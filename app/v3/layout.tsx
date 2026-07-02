import type { Metadata } from "next";
import { Libre_Baskerville, Inter, Caveat } from "next/font/google";
import "./v3.css";

// V3 "mini app" fonts — scoped to /v3 only (NOT app/layout.tsx). These reproduce
// the mockup's type system: Libre Baskerville (serif), Inter (sans), Caveat
// (script). Each is exposed as a CSS variable that v3.css maps onto the mockup's
// --serif / --sans / --script tokens inside .v3-root.

// Serif — Libre Baskerville is not a variable font, so weights are explicit.
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-v3-serif",
});

// Sans — the mockup uses Inter 400/500/600.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-v3-sans",
});

// Script — Caveat for the logo / display flourishes.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-v3-script",
});

export const metadata: Metadata = {
  title: "V3 preview",
  // Work-in-progress redesign — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function V3Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`v3-root ${libreBaskerville.variable} ${inter.variable} ${caveat.variable}`}
    >
      {children}
    </div>
  );
}
