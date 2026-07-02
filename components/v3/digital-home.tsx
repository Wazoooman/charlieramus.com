import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/v3/reveal";
import { photos } from "@/data/photos";
import { getAllArticles } from "@/lib/articles";
import { getAllPosts } from "@/lib/posts";

// Portfolio previews — these mirror the two entries in components/projects.tsx,
// but that file is a "use client" module: importing its `projects` array into
// this SERVER component would hand back a client *reference* (a function proxy),
// not the data — it crashes on destructure. So the two real routes + thumbnails
// (real assets on the live site) live inline here instead.
const PORTFOLIO = [
  {
    title: "Web Projects",
    href: "/web-projects",
    thumb: "/images/For-Projects-Placeholder-Cards/Frame-5_webp.webp",
    cta: "see the projects",
  },
  {
    title: "Graphic Design",
    href: "/design",
    thumb: "/images/For-Projects-Placeholder-Cards/Frame-4_webp.webp",
    cta: "see the portfolio",
  },
] as const;

// "Step into my digital home" (V13 S2) — the mockup's `.step` heading + the
// full-bleed `.carousel` of browser-chrome "shot" cards, wired to Charlie's REAL
// content instead of the mockup's placeholder gradients. Server component: it
// reads server-only sources (getAllArticles) and hands server-rendered cards to
// the client <Reveal> wrapper (the mockup put `.reveal` on the carousel as a
// whole, so each shot stays a plain <Link> — no per-card observer).
//
// Card sources (all link to their real route): landscape photos → /photography,
// the two portfolio entries in components/projects.tsx → /web-projects & /design,
// the latest essay's header image → /writing/[slug], and the newest blog post as
// a serif text card → /blog. Layout/CSS is `.step` / `.carousel` / `.shot` /
// `.bbar` / `.body` in v3.css; `.shot-img` (added there) makes the browser body
// a positioned, padding-free frame for a `fill` <Image>.

type Shot =
  | {
      kind: "image";
      href: string;
      label: string;
      src: string;
      blurDataURL?: string;
    }
  | { kind: "text"; href: string; label: string; tone: string; title: string };

// Browser chrome (the three faux traffic-light dots) — decorative.
function Bbar() {
  return (
    <span className="bbar" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function DigitalHome() {
  // Landscape photos read best in the 330×210 shot; take two from different
  // parts of the gallery so the row isn't two near-identical frames.
  const landscape = photos.filter((p) => p.ratio >= 1.4);
  const photoA = landscape[0];
  const photoB = landscape[Math.min(7, landscape.length - 1)];

  const latestEssay = getAllArticles()[0];
  const latestPost = getAllPosts()[0];

  const [webProject, designProject] = PORTFOLIO;

  // Assembled in a rhythm of real previews; the blog card is the one serif text
  // "shot" (echoing the mockup's gradient cards) so the row isn't all imagery.
  const shots: Shot[] = [];

  if (photoA)
    shots.push({
      kind: "image",
      href: "/photography",
      label: "Photography — view the gallery",
      src: photoA.thumb,
      blurDataURL: photoA.blurDataURL,
    });

  if (webProject)
    shots.push({
      kind: "image",
      href: webProject.href,
      label: `${webProject.title} — ${webProject.cta}`,
      src: webProject.thumb,
    });

  if (latestEssay?.headerImage)
    shots.push({
      kind: "image",
      href: `/writing/${latestEssay.slug}`,
      label: `Read: ${latestEssay.title}`,
      src: latestEssay.headerImage,
    });

  if (photoB)
    shots.push({
      kind: "image",
      href: "/photography",
      label: "Photography — view the gallery",
      src: photoB.thumb,
      blurDataURL: photoB.blurDataURL,
    });

  if (designProject)
    shots.push({
      kind: "image",
      href: designProject.href,
      label: `${designProject.title} — ${designProject.cta}`,
      src: designProject.thumb,
    });

  if (latestPost)
    shots.push({
      kind: "text",
      href: "/blog",
      label: `From the blog: ${latestPost.title}`,
      tone: "s-lav",
      title: latestPost.title,
    });

  return (
    <>
      <Reveal className="step">
        <span className="bm" aria-hidden="true">
          🔖
        </span>
        <span className="t">Step into my digital home</span>
      </Reveal>

      <Reveal className="carousel">
        {shots.map((shot, i) =>
          shot.kind === "image" ? (
            <Link
              key={`${shot.href}-${i}`}
              href={shot.href}
              className="shot"
              aria-label={shot.label}
            >
              <Bbar />
              <span className="body shot-img">
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  sizes="330px"
                  placeholder={shot.blurDataURL ? "blur" : "empty"}
                  blurDataURL={shot.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </span>
            </Link>
          ) : (
            <Link
              key={`${shot.href}-${i}`}
              href={shot.href}
              className={`shot ${shot.tone}`}
              aria-label={shot.label}
            >
              <Bbar />
              <span className="body">{shot.title}</span>
            </Link>
          ),
        )}
      </Reveal>
    </>
  );
}
