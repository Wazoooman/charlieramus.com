import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/nav";
import PhotographyGallery from "@/components/photography-gallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Photography by Charlie Ramus — aerial and sailing photography from regattas and coastal landscapes.",
};

export default function PhotographyPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg px-6 pb-24 pt-24 text-fg sm:px-8">
        <div className="mx-auto max-w-4xl">
          {/* No page header — the gallery speaks for itself. Keep the shared
              mono back link (matches PageHeader) for return-to-home wayfinding. */}
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={13} />
            Home
          </Link>
          <PhotographyGallery />
        </div>
      </main>
    </>
  );
}
