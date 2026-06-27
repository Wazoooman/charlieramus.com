import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { stories } from "@/data/stories";
import { photos } from "@/data/photos";

/**
 * Zone C — the "more of me" bento (Log V7). A vertical, section-colored bento
 * grid that links every tile to its real route. Built as a server component:
 * the data (curated `stories`, generated `photos`) is plain imports and all the
 * motion is CSS, so no client boundary is needed.
 *
 *   Stage 1: responsive bento grid + section-colored tiles wired to real routes.
 *   Stage 2: expanded ~2-3x with varied tile sizes, a stats strip, feature
 *            blurbs, and recent writing/photo previews from real data.
 *   Stage 3: halftone treatment on the photography tile/previews.
 *   Stage 4: confirm previews resolve to the real content sources.
 *   Stage 5: full 4→2→1 responsive pass.
 *
 * Section colors follow the wayfinding palette (see DESIGN.md): photography=sky,
 * writing=marigold, web=red, design=pink, gear=orange, contact=ink.
 */

/** Latest few photo thumbnails for the photography tile preview. */
const previewPhotos = photos.slice(0, 4);

/** Shared tile chrome: a section-colored top rule, mono label, and lift-on-hover.
 *  `tone` selects the wayfinding color used for the rule, dot, label, and arrow. */
const toneMap = {
  photo: { rule: "border-t-c-photo", text: "text-c-photo", dot: "bg-c-photo" },
  writing: {
    rule: "border-t-c-writing",
    text: "text-c-writing",
    dot: "bg-c-writing",
  },
  work: { rule: "border-t-c-work", text: "text-c-work", dot: "bg-c-work" },
  design: {
    rule: "border-t-c-design",
    text: "text-c-design",
    dot: "bg-c-design",
  },
  gear: { rule: "border-t-orange", text: "text-orange", dot: "bg-orange" },
} as const;

type Tone = keyof typeof toneMap;

function TileShell({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`panel group relative flex flex-col overflow-hidden border-t-2 transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}

/** A section tile: label + Fraunces title + blurb + arrow affordance. */
function SectionTile({
  tone,
  label,
  title,
  blurb,
  href,
  className = "",
  children,
}: {
  tone: Tone;
  label: string;
  title: string;
  blurb: string;
  href: string;
  className?: string;
  children?: ReactNode;
}) {
  const t = toneMap[tone];
  return (
    <Link href={href} className={`contents`}>
      <TileShell className={`${t.rule} ${className}`}>
        <header className="mb-4 flex items-center gap-2.5">
          <span className={`size-2 shrink-0 rounded-full ${t.dot}`} />
          <span className={`label ${t.text}`}>{label}</span>
        </header>
        <h3 className="display-sm mb-2 text-fg">{title}</h3>
        <p className="mb-4 max-w-prose text-[13px] leading-[1.6] text-muted">
          {blurb}
        </p>
        {children}
        <span
          className={`mt-auto inline-flex items-center gap-1 pt-2 text-[11px] font-medium uppercase tracking-[0.12em] ${t.text}`}
        >
          Explore
          <ArrowUpRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </TileShell>
    </Link>
  );
}

export default function Bento() {
  return (
    <section id="explore" className="px-6 py-20 md:px-16">
      {/* Content is centered in a ~1080px column (like the mockup's `.zoneC`),
          so the bento sits with whitespace gutters rather than full-bleed. The
          head + grid are centered as siblings so they share the same edges. */}
      {/* Section head — Fraunces title + mono kicker. */}
      <div className="mx-auto mb-10 flex max-w-270 items-end justify-between gap-4">
        <div>
          <p className="label mb-2">Zone C · Explore</p>
          <h2 className="display-md text-fg">More of me</h2>
        </div>
        <p className="label hidden max-w-50 text-right sm:block">
          Six ways in — pick a thread and pull
        </p>
      </div>

      <div className="mx-auto grid max-w-270 auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* ── Photography — the big anchor tile (sky), with a photo preview ── */}
        <Link
          href="/photography"
          className="contents"
          aria-label="Photography"
        >
          <TileShell className="border-t-c-photo sm:col-span-2 sm:row-span-2 lg:col-span-2">
            <header className="mb-4 flex items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full bg-c-photo" />
              <span className="label text-c-photo">Photography</span>
            </header>
            <h3 className="display-sm mb-2 text-fg">Through the viewfinder</h3>
            <p className="mb-5 max-w-prose text-[13px] leading-[1.6] text-muted">
              Birds, mountains, and machines — from Boulder snowstorms to the
              Icelandic coast. My signature medium.
            </p>
            {/* 2×2 thumbnail preview. The halftone motif lands here in Stage 3. */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              {previewPhotos.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-square overflow-hidden rounded-md bg-surface"
                >
                  <Image
                    src={photo.thumb}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 220px"
                    placeholder={photo.blurDataURL ? "blur" : "empty"}
                    blurDataURL={photo.blurDataURL}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              ))}
            </div>
            <span className="mt-auto inline-flex items-center gap-1 pt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-c-photo">
              View the gallery
              <ArrowUpRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </TileShell>
        </Link>

        {/* ── Writing — wide tile (marigold) ── */}
        <SectionTile
          tone="writing"
          label="Writing"
          title="Essays & arguments"
          blurb="Long-form on AI bias, moral psychology, and the things I can't stop thinking about."
          href="/writing"
          className="sm:col-span-2"
        >
          <p className="mb-4 line-clamp-2 border-l-2 border-c-writing/40 pl-3 text-[13px] italic leading-normal text-fg">
            “{stories[0].title}”
          </p>
        </SectionTile>

        {/* ── Web Projects (red) + Design (pink) — a pair of square tiles ── */}
        <SectionTile
          tone="work"
          label="Web Projects"
          title="Things I've built"
          blurb="Shipped sites, tools, and experiments."
          href="/web-projects"
        />
        <SectionTile
          tone="design"
          label="Design"
          title="Visual work"
          blurb="Layouts, identities, and interface studies."
          href="/design"
        />

        {/* ── Stats strip — full-width band, real counts where available ── */}
        <div className="panel col-span-1 grid grid-cols-2 gap-6 border-t-2 border-t-rule sm:col-span-2 sm:grid-cols-4 lg:col-span-4">
          {[
            { value: "300k+", label: "Impressions reached" },
            { value: `${photos.length}`, label: "Photographs published" },
            { value: `${stories.length}`, label: "Essays written" },
            { value: "6", label: "Threads to explore" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="display-md text-fg">{stat.value}</span>
              <span className="label mt-1">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── Recent writing — wide preview list pulled from real stories ── */}
        <div className="panel col-span-1 flex flex-col border-t-2 border-t-c-writing sm:col-span-2">
          <header className="mb-4 flex items-center gap-2.5">
            <span className="size-2 shrink-0 rounded-full bg-c-writing" />
            <span className="label text-c-writing">Latest writing</span>
          </header>
          <ul className="flex flex-1 flex-col divide-y divide-rule">
            {stories.map((story) => (
              <li key={story.slug}>
                <Link
                  href={`/writing/${story.slug}`}
                  className="group/item flex items-center gap-4 py-3 first:pt-0"
                >
                  <Image
                    src={story.thumbnail}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-sm object-cover"
                  />
                  <div className="min-w-0">
                    <p className="label mb-1 text-c-writing">{story.year}</p>
                    <h4 className="line-clamp-2 text-[13px] font-medium leading-snug text-fg group-hover/item:text-accent">
                      {story.title}
                    </h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Pull-quote — a change of texture between the grids ── */}
        <figure className="panel col-span-1 flex flex-col justify-center border-t-2 border-t-rule sm:col-span-2">
          <blockquote className="serif text-[1.4rem] leading-[1.3] text-fg">
            “The best photo is the one that makes you stop scrolling — so is the
            best argument.”
          </blockquote>
          <figcaption className="label mt-4">Charlie Ramus</figcaption>
        </figure>

        {/* ── Gear (orange) — feature blurb tile ── */}
        <SectionTile
          tone="gear"
          label="Gear"
          title="What's in the bag"
          blurb="The cameras, lenses, and kit behind the photographs — and why each earns its place."
          href="/gear"
          className="sm:col-span-2"
        />

        {/* ── Contact — solid red CTA tile to close the section ── */}
        <a
          href="mailto:charlie.ramus12@gmail.com"
          className="group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl bg-[#fd1e1f] p-6 text-[#f4f3ee] transition duration-300 hover:-translate-y-1 sm:col-span-2"
        >
          <div>
            <h3 className="display-md mb-2">Get in touch</h3>
            <p className="max-w-prose text-[13px] leading-[1.6] text-[#f4f3ee]/70">
              Research, internships, collaboration, or a cold hello — my inbox is
              open.
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.12em]">
            charlie.ramus12@gmail.com
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </a>
      </div>
    </section>
  );
}
