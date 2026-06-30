import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/nav";
import { getPost, getAllPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-24">
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={13} />
            Writing
          </Link>
        </div>
        <article>
        <header className="mb-10">
          <time dateTime={post.date} className="label mb-3 block">
            {formatDate(post.date)}
          </time>
          <h1 className="display-md text-fg">
            {post.title}
          </h1>
        </header>
        <div className="article-body text-fg">{post.content}</div>
        </article>
      </main>
    </>
  );
}
