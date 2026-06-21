import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import CursorGlow from "@/components/cursor-glow";
import ThemeToggle from "@/components/theme-toggle";
import FathersDayModal from "@/components/fathers-day-modal";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
