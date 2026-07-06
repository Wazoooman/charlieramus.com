import Image from "next/image";
import Reveal from "@/components/v3/reveal";
import { aboutParagraphs } from "@/components/about";
import { photos } from "@/data/photos";

// "Behind the pixels" (V14 S3) — the mockup's about section: the `.head`, then
// the `.about-grid` of a scattered polaroid `.collage` (four tilted `.ph` frames)
// beside the `.bio`. Layout/CSS (`.about-grid` / `.collage` / `.ph.p1–p4`) was
// ported into v3.css in V12; this component fills it with REAL content — real
// photography (with next/image blur) and Charlie's REAL bio.
//
// Server component: `aboutParagraphs` is a plain export from the (server)
// components/about.tsx, so it imports cleanly here — his actual voice, shared
// with the live About section, no duplication. The scroll fade-up rides the V12
// <Reveal> wrappers.

// A curated slice of the gallery for the collage — four visually distinct frames
// (Iceland + Boulder) that represent Charlie's photography. Each keeps its own
// descriptive `alt` from data/photos, so the collage images have real accessible
// names. Indices are a hand-picked selection, defended against a shorter gallery.
const COLLAGE_INDICES = [0, 4, 7, 12];
const collagePhotos = COLLAGE_INDICES.map((i) => photos[i]).filter(Boolean);

export default function AboutCollage() {
  return (
    <section id="about">
      <div className="wrap">
        <Reveal className="head">
          <h2>Behind the pixels</h2>
          <p>
            A quick peek behind the work — where I&apos;m based, what I point a
            camera at, and how I like to build.
          </p>
        </Reveal>

        <Reveal className="about-grid">
          <div className="collage">
            {collagePhotos.map((photo, i) => (
              <span key={photo.src} className={`ph p${i + 1}`}>
                <Image
                  src={photo.thumb}
                  alt={photo.alt}
                  fill
                  sizes="150px"
                  placeholder={photo.blurDataURL ? "blur" : "empty"}
                  blurDataURL={photo.blurDataURL}
                  style={{ objectFit: "cover" }}
                />
              </span>
            ))}
          </div>

          <div className="bio">
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
