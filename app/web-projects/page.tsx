import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WebProjects from "@/components/WebProjectEntry";

export const metadata: Metadata = {
  title: "Web Projects",
  description: "Sites and web experiences designed and built by Charlie Ramus.",
};

export default function WebProjectsPage() {
  return (
    <div className="min-h-screen bg-bg text-fg px-8 py-10 overflow-x-hidden">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-fg transition-colors duration-200 mb-10 text-[13px]"
        >
          <ArrowLeft size={14} />
          Back
        </Link>

        <h1 className="text-4xl font-bold mb-2">Web Projects</h1>
        <p className="text-muted text-[15px] mb-16">
          Sites and web experiences designed and built.
        </p>

        <WebProjects />
      </div>
    </div>
  );
}
