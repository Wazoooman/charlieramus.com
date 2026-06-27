// Curated "Exploring" writing list. Plain data (no "use client") so it can be
// imported from both client components (components/stories.tsx, dashboard) and
// server components (components/bento.tsx) alike.

export type Story = {
  year: string;
  title: string;
  slug: string;
  thumbnail: string;
};

export const stories: Story[] = [
  {
    year: "2026",
    title:
      "When Bigger Means More Biased: How Scale Transforms LLMs into Confident Amplifiers of Majority Perspectives",
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
    title:
      "The Architecture of Self-Justification: How Pride Disguises Moral Failure",
    slug: "article-one",
    thumbnail: "/images/Article-1_webp.webp",
  },
];
