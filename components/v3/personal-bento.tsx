import Image from "next/image";
import Flower from "@/components/v3/flower";
import Reveal from "@/components/v3/reveal";
import { entries } from "@/data/experience";
import { photos } from "@/data/photos";
import { getAllArticles } from "@/lib/articles";
import { getAllPosts } from "@/lib/posts";

// "A little more personal" bento (V12 S3) — the mockup's personal grid, wired to
// Charlie's real data. Server component: it calls the server-only getAllArticles,
// then hands server-rendered children to the client <Reveal> wrappers. Layout
// classes (.pbento, .pcard, .cj*, .pgrid, .ptile) come straight from v3.css.
//
// Slot map vs. the mockup: the tall Career Journey stays on the left; the six
// right cells hold Photography / Graphic design / Latest writing / From the blog
// / Web projects / Gear (the mockup's placeholder "Playground" is dropped for
// Charlie's real routes). The mockup's in-grid flower tiles become the full-width
// .p-flowers strip below, so all six sections get a cell of their own.

const TL_H = 308; // .cj-timeline height (px), matches v3.css

const firstYear = (s?: string) => s?.match(/20\d{2}/)?.[0] ?? "";

// "2026-05-07" → "May 26" (mockup blog-date style).
function shortDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const mon = d.toLocaleString("en-US", { month: "short" });
  return `${mon} ${String(d.getFullYear()).slice(2)}`;
}

function CareerJourney() {
  const startYears = entries
    .map((e) => e.start)
    .filter((y): y is number => typeof y === "number");
  const maxY = startYears.length ? Math.max(...startYears) : new Date().getFullYear();
  const minY = startYears.length ? Math.min(...startYears) : maxY;

  // Year axis derived from the REAL entries (e.g. 2025–2026), newest at the top.
  const years: number[] = [];
  for (let y = maxY; y >= minY; y--) years.push(y);
  const yearTop = (i: number) =>
    years.length > 1 ? (i / (years.length - 1)) * (TL_H - 16) : 0;

  // Role chips distributed evenly down the timeline; each carries its real date
  // string, so the exact timing reads from the chip rather than fragile overlap
  // math when several roles share a start year.
  const n = entries.length;
  const chipTop = (k: number) =>
    n > 1 ? 6 + (k * (TL_H - 72)) / (n - 1) : (TL_H - 72) / 2;

  return (
    <Reveal as="article" className="cj p-career">
      <div className="cj-title">Career Journey</div>
      <div className="cj-timeline">
        {years.map((y, i) => (
          <div key={`g-${y}`}>
            <div className="cj-line" style={{ top: yearTop(i) }} />
            <div className="cj-year" style={{ top: yearTop(i) }}>
              {y}
            </div>
          </div>
        ))}

        <div className="cj-band">
          <span>Ongoing &amp; side projects</span>
        </div>

        {entries.map((e, k) => (
          <div
            className="role"
            key={e.title}
            style={{ top: chipTop(k), left: 92, right: 12 }}
          >
            <span
              className="lg"
              style={{ background: e.logoBg ?? "var(--cobalt)", color: e.logoFg ?? "#fff" }}
            >
              {e.logo ?? (e.org || e.title).charAt(0)}
            </span>
            <span className="rt">
              {e.title}
              {e.org ? <span> · {e.org}</span> : null}
            </span>
            <span className="dt">{e.dates}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function PersonalBento() {
  const articles = getAllArticles().slice(0, 2);
  const posts = getAllPosts().slice(0, 3);
  const gallery = photos.slice(0, 4);

  return (
    <>
      <Reveal className="head">
        <h2>A little more personal</h2>
        <p>
          Beyond the résumé — the photos I chase, the essays I write, the code I
          ship, and the path that got me here.
        </p>
      </Reveal>

      <div className="pbento">
        <CareerJourney />

        {/* Photography — real thumbnails, halftone dots from .pgrid i::after */}
        <Reveal
          as="a"
          href="/photography"
          className="pcard p-photo"
          aria-label="Photography — view the gallery"
        >
          <span className="kick">
            <span className="fdot" style={{ background: "var(--cyan)" }} /> Photography
          </span>
          <h3>Through the viewfinder</h3>
          <div className="pgrid">
            {gallery.map((p) => (
              <i key={p.code ?? p.src}>
                <Image
                  src={p.thumb}
                  alt={p.alt}
                  fill
                  sizes="80px"
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </i>
            ))}
          </div>
          <span className="go">View the gallery ↗</span>
        </Reveal>

        {/* Graphic design — decorative gradient thumbnails (mockup-faithful) */}
        <Reveal as="a" href="/design" className="pcard p-graphic">
          <span className="kick">
            <span className="fdot" style={{ background: "var(--red)" }} /> Graphic design
          </span>
          <h3>Brand &amp; pitch decks</h3>
          <div className="pgrid">
            <i style={{ background: "linear-gradient(150deg,#F32317,#FFCB41)" }} />
            <i style={{ background: "linear-gradient(150deg,#0015D4,#84DEF9)" }} />
            <i style={{ background: "linear-gradient(150deg,#14140f,#5a5a5a)" }} />
          </div>
          <span className="go">See the portfolio ↗</span>
        </Reveal>

        {/* Latest writing — real essays, newest first */}
        <Reveal as="a" href="/writing" className="pcard p-writing">
          <span className="kick">
            <span className="fdot" style={{ background: "var(--yellow)" }} /> Latest writing
          </span>
          <ul className="wlist">
            {articles.map((a) => (
              <li key={a.slug}>
                <span
                  className="thumb"
                  style={{
                    background: a.headerImage
                      ? `center/cover url(${a.headerImage})`
                      : "linear-gradient(135deg,#2b3d55,#84def9)",
                  }}
                />
                <div>
                  <div className="yr">{firstYear(a.date)}</div>
                  <div className="wt">{a.title}</div>
                </div>
              </li>
            ))}
          </ul>
          <span className="go">Read all essays ↗</span>
        </Reveal>

        {/* From the blog — real posts */}
        <Reveal as="a" href="/blog" className="pcard p-blog">
          <span className="kick">
            <span className="fdot" style={{ background: "var(--blue)" }} /> From the blog
          </span>
          <ul className="blist">
            {posts.map((p) => (
              <li key={p.slug}>
                {p.title} <span>{shortDate(p.date)}</span>
              </li>
            ))}
          </ul>
          <span className="go">Read the blog ↗</span>
        </Reveal>

        {/* Web projects */}
        <Reveal as="a" href="/web-projects" className="pcard p-web">
          <span className="kick">
            <span className="fdot" style={{ background: "var(--blue)" }} /> Web projects
          </span>
          <h3>Things I&apos;ve shipped</h3>
          <p className="sub">
            Sites and tools built from scratch — Next.js, TypeScript, design
            through deploy.
          </p>
          <span className="go">See the projects ↗</span>
        </Reveal>

        {/* Gear */}
        <Reveal as="a" href="/gear" className="pcard p-gear">
          <span className="kick">
            <span className="fdot" style={{ background: "var(--cyan)" }} /> Gear
          </span>
          <h3>What&apos;s in the bag</h3>
          <p className="sub">
            The bodies, lenses, and bags I actually shoot with.
          </p>
          <span className="go">See the kit ↗</span>
        </Reveal>
      </div>

      {/* Flower accent strip — wind-spinning daisies (Stage 2 primitive) */}
      <Reveal className="p-flowers">
        <div className="ptile" style={{ background: "var(--pink)" }}>
          <Flower petal="blue" core="#0015D4" petals={6} index={30} />
        </div>
        <div className="ptile white">
          <Flower petal="red" core="#F32317" petals={6} index={31} />
        </div>
        <div className="ptile" style={{ background: "var(--cyan)" }}>
          <Flower petal="yellow" core="#0015D4" petals={7} index={32} />
        </div>
        <div className="ptile white">
          <Flower petal="pink" core="#ffffff" petals={5} index={33} />
        </div>
      </Reveal>
    </>
  );
}
