import type { Metadata } from "next";
import { Inter, Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import CursorGlow from "@/components/cursor-glow";
import ThemeToggle from "@/components/theme-toggle";
import FathersDayModal from "@/components/fathers-day-modal";

// Body grotesque — variable font, self-hosted, no external request.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Display serif — variable font with optical sizing enabled. Weight is left
// variable (covers the 400/600/900 the type scale uses) so the `opsz` axis can
// stay on; next/font only allows axes when weight is unset/variable.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

// Mono — labels, meta, timeline years. Space Mono is not a variable font,
// so the weights are listed explicitly.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Charlie Ramus",
    template: "%s | Charlie Ramus",
  },
  description:
    "High school sophomore in Boulder building software, growing communities and exploring the intersection of computation and biology.",
  openGraph: {
    title: "Charlie Ramus",
    description:
      "High school sophomore in Boulder building software, growing communities and exploring the intersection of computation and biology.",
    url: "https://charlieramus.com",
    siteName: "Charlie Ramus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Charlie Ramus",
    description:
      "High school sophomore in Boulder building software, growing communities and exploring the intersection of computation and biology.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg antialiased font-sans">
        <Providers>
          <CursorGlow />
          <ThemeToggle />
          <FathersDayModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}
