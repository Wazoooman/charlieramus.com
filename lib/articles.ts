import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const articlesDir = path.join(process.cwd(), "content", "articles");

export type ArticleFrontmatter = {
  title: string;
  date: string;
  author: string;
  headerImage?: string;
  externalLink?: string;
  externalLinkLabel?: string;
};

export type ArticleListItem = ArticleFrontmatter & { slug: string };

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getArticleSource(slug: string): string | null {
  const filePath = path.join(articlesDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

function parseArticleDate(str: string): number {
  const cleaned = str.replace(/(\d+)(st|nd|rd|th)/gi, "$1");
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export function getAllArticles(): ArticleListItem[] {
  return getArticleSlugs()
    .map((slug) => {
      const source = getArticleSource(slug);
      if (!source) return null;
      const { data } = matter(source);
      return { slug, ...(data as ArticleFrontmatter) };
    })
    .filter(Boolean)
    .sort((a, b) => parseArticleDate(b!.date) - parseArticleDate(a!.date)) as ArticleListItem[];
}
