import type { ReactNode } from "react";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: ReactNode;
};

const posts: Post[] = [
  {
    slug: "building-this-portfolio",
    title: "Building This Portfolio",
    date: "2026-05-07",
    excerpt:
      "The decisions, trade-offs, and lessons from building a portfolio site that is also meant to be a portfolio piece.",
    content: (
      <div>
        <p>
          I built this site for one reason: when someone Googles me, I want them
          to find something real.
        </p>
        <p>
          I am a junior at Boulder High School sending cold emails to biotech
          professors, applying to programs, and eventually to colleges. A
          LinkedIn profile and a GitHub with sparse commits does not tell the
          full story. A portfolio does, or at least it can.
        </p>
        <h2>The stack</h2>
        <p>
          Next.js 16, TypeScript, Tailwind CSS v4, and Vercel for deployment.
          These are the same tools I would pick for a real client project. The
          alternative was a website builder or a static site generator, both
          faster to set up, but the wrong call. Using a website builder to prove
          you can build for the web is circular.
        </p>
        <p>
          One thing worth noting: Next.js 16 is meaningfully different from the
          tutorials you will find online. Route params are now Promises, which
          means you have to <code>await</code> them before accessing route data.
          Tailwind v4 dropped the config file entirely in favor of CSS-native
          configuration. The docs ship inside the package now. You have to read
          them.
        </p>
        <p>
          This is how I prefer to work: read the actual docs, not a tutorial
          written against a version from two years ago.
        </p>
        <h2>Design decisions</h2>
        <p>
          I looked at a lot of portfolios before building this one. The tempting
          move is to add animations, 3D effects, and clever hover states to
          prove technical range. I did the opposite.
        </p>
        <p>
          The people reading this site are admissions readers reviewing hundreds
          of applications, professors deciding whether to respond to a cold
          email, and future employers doing a quick scan. Heavy animations read
          as showing off. A clean, fast, readable site reads as confident. I
          borrowed the visual sensibility from rauno.me and leerob.io:
          near-monochrome, warm off-white background, generous whitespace, type
          doing the heavy lifting.
        </p>
        <p>No skill progress bars. No currently learning sections. Just work.</p>
        <h2>The code is part of the portfolio</h2>
        <p>
          This repo is public on GitHub. That is intentional. I am not just
          saying I can write clean code. You can read it. The component
          structure, the commit history, the decisions made in real time. If
          someone wants to know how I build things, they can look.
        </p>
        <h2>What is next</h2>
        <p>
          The photography gallery and code projects sections are placeholders
          right now. This summer I am pushing real projects to GitHub and adding
          photos from the wildfire documentation work. The site is built to be
          updated incrementally, not rebuilt every time something changes.
        </p>
        <p>
          For anyone building their own portfolio: resist the urge to make it
          clever. Make it clear.
        </p>
      </div>
    ),
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
