"use client";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/articles";

export default function WritingArticleList({
  articles,
}: {
  articles: ArticleListItem[];
}) {
  return (
    <ul className="divide-y divide-rule">
      {articles.map((article) => (
        <li key={article.slug} className="py-6 first:pt-0 last:pb-0">
          <Link
            href={`/writing/${article.slug}`}
            className="group block"
            onClick={() =>
              sessionStorage.setItem("articleReferrer", "writing")
            }
          >
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h2 className="text-base font-medium text-fg group-hover:text-marigold transition-colors">
                {article.title}
              </h2>
              <span className="text-xs text-muted shrink-0">
                {article.date}
              </span>
            </div>
            <p className="text-sm text-muted">{article.author}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
