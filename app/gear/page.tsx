import type { Metadata } from "next";
import Nav from "@/components/nav";
import PageHeader from "@/components/page-header";
import GearList from "@/components/GearList";

export const metadata: Metadata = {
  title: "Gear",
  description: "What I shoot with.",
};

export default function GearPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg px-6 pb-24 pt-24 text-fg sm:px-8">
        <div className="max-w-lg">
          <PageHeader
            eyebrow="Kit"
            title="Gear"
            subtitle="What I shoot with."
            backHref="/photography"
            backLabel="Photography"
            accent="var(--cobalt)"
          />
          <GearList />
        </div>
      </main>
    </>
  );
}
