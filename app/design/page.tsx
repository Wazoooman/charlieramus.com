import type { Metadata } from "next";
import Nav from "@/components/nav";
import PageHeader from "@/components/page-header";
import DesignProjects from "@/components/DesignProjects";

export const metadata: Metadata = {
  title: "Design",
  description: "Graphic design portfolio — Figma work, brand projects and visual experiments.",
};

export default function DesignPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen overflow-x-hidden bg-bg px-6 pb-24 pt-24 text-fg sm:px-8">
        <div className="mx-auto max-w-3xl">
          <PageHeader
            eyebrow="Visual Work"
            title="Design"
            subtitle="Figma work, brand projects and visual experiments."
          />
          <DesignProjects />
        </div>
      </main>
    </>
  );
}
