import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleSource, getArticleSlugs } from "@/lib/articles";
import matter from "gray-matter";
import type { ArticleFrontmatter } from "@/lib/articles";
import Nav from "@/components/nav";
import BackButton from "@/components/back-button";

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const source = getArticleSource(slug);
  if (!source) return {};
  const { data } = matter(source);
  const fm = data as ArticleFrontmatter;
  return { title: fm.title };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = getArticleSource(slug);
  if (!source) notFound();

  const { data, content } = matter(source);
  const fm = data as ArticleFrontmatter;

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-24">
        <div className="mb-10">
          <BackButton />
        </div>

      {fm.headerImage && (
        <div className="relative w-full mb-6 overflow-hidden rounded-sm">
          <img
            src={fm.headerImage}
            alt={fm.title}
            className="w-full h-auto object-cover max-h-64"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg" />
        </div>
      )}

      <h1 className="display-md text-fg mb-4">
        {fm.title}
      </h1>

      <div className="flex items-center justify-between mb-3">
        <span className="label">{fm.author}</span>
        <span className="label">{fm.date}</span>
      </div>
      <hr className="border-rule mb-6" />

      {fm.externalLink && (
        <div className="mb-6">
          <a
            href={fm.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-rule rounded px-3 py-1.5 text-sm text-muted hover:text-fg transition-colors"
          >
            {fm.externalLinkLabel || "Read full article"}
          </a>
        </div>
      )}

      <article className="article-body text-fg">
        <MDXRemote source={content} />
      </article>
      </main>
    </>
  );
}
