import type { Metadata } from "next";
import Nav from "@/components/nav";
import PageHeader from "@/components/page-header";
import { getAllArticles } from "@/lib/articles";
import WritingArticleList from "@/components/writing-article-list";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles and essays by Charlie Ramus.",
};

export default function WritingPage() {
  const articles = getAllArticles();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-24">
        <PageHeader
          eyebrow="Essays & Notes"
          title="Writing"
          accent="var(--marigold)"
        />
        <WritingArticleList articles={articles} />
      </main>
    </>
  );
}
