"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselLightbox from "./CarouselLightbox";

// PEEK=24 means each side shows 24% of the carousel = ~50% of the center slide width.
// 2×24 + 48 + 2×2 = 100. STEP = 48 + 4 = 52.
const PEEK = 24;
const GAP = 2;
const SLIDE = 100 - PEEK * 2 - GAP * 2; // 48
const STEP = SLIDE + GAP * 2;            // 52

const projects = [
  {
    title: "Notion Brand Pitch",
    date: "2025",
    description: "A 10-slide brand strategy pitch for Notion built as a class project. Covers a full brand audit, problem framing, target market, competitive landscape, repositioning strategy, and a new visual identity concept. Produced all in Figma.",
    images: [
      "/images/Notion/01-Titlemp4.webp",
      "/images/Notion/02-Brand-Auditmp4.webp",
      "/images/Notion/03-The-Problemmp4.webp",
      "/images/Notion/04-Target-Marketmp4.webp",
      "/images/Notion/05-Competitor-Landscapemp4.webp",
      "/images/Notion/06-New-Positioningmp4.webp",
      "/images/Notion/07-New-Identitymp4.webp",
      "/images/Notion/08-Feature-AI-Agentsmp4.webp",
      "/images/Notion/09-Feature-Mail-and-Calendarmp4.webp",
      "/images/Notion/10-Financialsmp4.webp",
    ],
  },
  {
    title: "Spotify IMC Campaign",
    date: "2025",
    description: "A 6-panel integrated marketing communications poster board for Spotify, developed for a high school marketing course. Covers campaign strategy, target audience, creative direction, media planning, and budget allocation.",
    images: [
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board1mp4.webp",
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board2mp4.webp",
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board3mp4.webp",
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board4mp4.webp",
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board5mp4.webp",
      "/images/Spotify-6-Slide/IMC-6-Slide-Poster-Board6mp4.webp",
    ],
  },
  {
    title: "Photography Presentation UI",
    date: "2024",
    description: "Presentation UI designed around personal travel photography sets. Built in Figma to explore editorial layout, typography-forward design, and how to let images carry the visual weight of a slide. Space at the bottom of each frame is reserved for Instagram caption overlays.",
    images: [
      "/images/Photography-Presentation-UI/My-Trip-to-Floridamp4.webp",
      "/images/Photography-Presentation-UI/My-Trip-to-Florida2mp4.webp",
      "/images/Photography-Presentation-UI/My-Trip-to-Florida3mp4.webp",
      "/images/Photography-Presentation-UI/The-British-Virgin-Islands-Pt-2.webp",
      "/images/Photography-Presentation-UI/The-British-Virgin-Islands-Pt-2mp4.webp",
    ],
  },
];

function Slide({
  src,
  title,
  j,
  onClick,
}: {
  src: string;
  title: string;
  j: number;
  onClick?: () => void;
}) {
  const [tall, setTall] = useState(false);
  return (
    <div
      style={{
        width: `${SLIDE}%`,
        flexShrink: 0,
        marginInline: `${GAP}%`,
        ...(tall && { height: "clamp(330px, 57vh, 630px)" }),
      }}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : undefined}
    >
      <img
        src={src}
        alt={`${title} ${j}`}
        className={`w-full block rounded-sm${tall ? " h-full object-contain" : " h-auto"}`}
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalHeight > img.naturalWidth * 1.1) setTall(true);
        }}
      />
    </div>
  );
}

function Carousel({
  images,
  title,
  onSlideClick,
}: {
  images: string[];
  title: string;
  onSlideClick?: (index: number) => void;
}) {
  const n = images.length;
  // Bookend with clones so the wrap-around peek works seamlessly
  const extended = [images[n - 1], ...images, images[0]];

  // pos is index inside `extended`; real slides live at 1..n
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const busy = useRef(false);

  const prev = () => {
    if (busy.current) return;
    busy.current = true;
    setAnimate(true);
    setPos((p) => p - 1);
  };

  const next = () => {
    if (busy.current) return;
    busy.current = true;
    setAnimate(true);
    setPos((p) => p + 1);
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    busy.current = false;
    // Snap to real position after landing on a clone
    if (pos === 0) {
      setAnimate(false);
      setPos(n);
    } else if (pos === n + 1) {
      setAnimate(false);
      setPos(1);
    }
  };

  // Re-enable CSS transition one frame after a no-animation snap
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const tx = `${PEEK - pos * STEP}%`;

  return (
    <div
      className="relative mb-12 select-none"
      style={{ width: "100vw", marginLeft: "calc(50% - 50vw)" }}
    >
      {/* Left ombre — page background fades into the peeking slide (token, so it
          tracks light/dark) */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-bg to-transparent pointer-events-none z-10" />
      {/* Right ombre */}
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-bg to-transparent pointer-events-none z-10" />

      {/* Clipping wrapper — clips the track but not the arrow buttons */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(${tx})`,
            transition: animate ? "transform 320ms ease-in-out" : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {extended.map((src, j) => {
            const realIdx = j === 0 ? n - 1 : j === n + 1 ? 0 : j - 1;
            return (
              <Slide
                key={j}
                src={src}
                title={title}
                j={j}
                onClick={onSlideClick ? () => onSlideClick(realIdx) : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Left arrow — centered on the dark gap between peek and center slide */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute inset-y-0 flex items-center justify-center text-muted hover:text-pink transition-colors duration-150 cursor-pointer"
        style={{ left: `calc(${PEEK}% - 24px)`, width: "48px" }}
      >
        <ChevronLeft size={26} strokeWidth={1.5} />
      </button>

      {/* Right arrow — centered on the dark gap between center and peek slide */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute inset-y-0 flex items-center justify-center text-muted hover:text-pink transition-colors duration-150 cursor-pointer"
        style={{ right: `calc(${PEEK}% - 24px)`, width: "48px" }}
      >
        <ChevronRight size={26} strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function DesignProjects() {
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  return (
    <>
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <div key={i}>
            {i > 0 && <hr className="border-rule mb-12" />}

            <div className="flex items-baseline justify-between mb-3">
              <h2 className="display-sm text-fg">{project.title}</h2>
              <span className="label ml-4 shrink-0">{project.date}</span>
            </div>

            {project.description && (
              <p className="text-[14px] text-muted leading-[1.7] max-w-[65ch] mb-6">
                {project.description}
              </p>
            )}

            {project.images.length > 1 ? (
              <Carousel
                images={project.images}
                title={project.title}
                onSlideClick={(slideIdx) =>
                  setLightbox({ images: project.images, index: slideIdx })
                }
              />
            ) : (
              <div
                className="mb-12 cursor-pointer inline-block"
                onClick={() => setLightbox({ images: project.images, index: 0 })}
              >
                <img
                  src={project.images[0]}
                  alt={`${project.title} 1`}
                  className="max-h-80 w-auto object-contain rounded-sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {lightbox && (
        <CarouselLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
