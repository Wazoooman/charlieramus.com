"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const stories = [
  {
    year: "2026",
    title: "When Bigger Means More Biased: How Scale Transforms LLMs into Confident Amplifiers of Majority Perspectives",
    slug: "article-two",
    thumbnail: "/images/Article-2_webp.webp",
  },
  {
    year: "2026",
    title: "The Third Rotation",
    slug: "article-three",
    thumbnail: "/images/Article-3_webp.webp",
  },
  {
    year: "2025",
    title: "The Architecture of Self-Justification: How Pride Disguises Moral Failure",
    slug: "article-one",
    thumbnail: "/images/Article-1_webp.webp",
  },
];

export default function Stories() {
  return (
    <section id="stories" className="py-20 px-10 md:px-16">
      <div className="flex flex-col divide-y divide-rule max-w-165">
        {stories.map((story, i) => (
          <Link
            key={i}
            href={`/writing/${story.slug}`}
            className="flex items-center gap-5 py-5 -mx-3 px-3 rounded-lg hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-200"
            onClick={() => sessionStorage.setItem("articleReferrer", "home")}
          >
            <Image
              src={story.thumbnail}
              alt=""
              width={80}
              height={80}
              className="shrink-0 rounded-sm object-cover"
            />
            <div className="min-w-0">
              <p className="text-[12px] text-muted mb-1">{story.year}</p>
              <h3 className="text-[15px] font-medium text-fg inline-flex items-center gap-1.5 leading-snug">
                {story.title}
                <ArrowUpRight size={14} className="text-muted shrink-0" />
              </h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href="/writing"
          className="text-[13px] text-fg hover:text-accent transition-colors duration-200"
        >
          View All Writing →
        </Link>
      </div>
    </section>
  );
}
