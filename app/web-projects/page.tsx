import type { Metadata } from "next";
import Nav from "@/components/nav";
import PageHeader from "@/components/page-header";
import WebProjects from "@/components/WebProjectEntry";

export const metadata: Metadata = {
  title: "Web Projects",
  description: "Sites and web experiences designed and built by Charlie Ramus.",
};

export default function WebProjectsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen overflow-x-hidden bg-bg px-6 pb-24 pt-24 text-fg sm:px-8">
        <div className="mx-auto max-w-3xl">
          <PageHeader
            eyebrow="Selected Builds"
            title="Web Projects"
            subtitle="Sites and web experiences designed and built."
            accent="var(--red)"
          />
          <WebProjects />
        </div>
      </main>
    </>
  );
}
