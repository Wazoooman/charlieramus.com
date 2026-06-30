import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/nav";
import PageHeader from "@/components/page-header";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thoughts on software, biology, building things, and whatever else is worth writing about.",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-24">
        <PageHeader eyebrow="Journal" title="Writing" />
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug} className="py-8 first:pt-0 last:pb-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h2 className="text-base font-medium text-foreground group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="text-xs text-muted shrink-0"
                  >
                    {formatDate(post.date)}
                  </time>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
