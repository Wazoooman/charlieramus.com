"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Copy, Check } from "lucide-react";
import { photos } from "@/data/photos";

function isMothersDayToday(): boolean {
  const now = new Date();
  if (now.getMonth() !== 4) return false;

  // Find the second Sunday of May (Mother's Day)
  let sundays = 0;
  const d = new Date(now.getFullYear(), 4, 1);
  let mothersDayDate = 0;

  while (d.getMonth() === 4) {
    if (d.getDay() === 0) {
      sundays++;
      if (sundays === 2) {
        mothersDayDate = d.getDate();
        break;
      }
    }
    d.setDate(d.getDate() + 1);
  }

  // Only show on Mother's Day itself
  return now.getDate() === mothersDayDate;
}

function MothersDayCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="fd-overlay-in fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4"
      onClick={onDismiss}
    >
      {/* Contact-card language (Log V11, Stage 2): rounded panel on tokens,
          Fraunces heading, sans body, a red section accent. */}
      <div
        className="fd-card-in relative w-full max-w-105 overflow-hidden rounded-3xl border border-border bg-panel p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)] sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-5 top-5 text-muted transition-colors duration-150 hover:text-fg"
        >
          <X size={18} />
        </button>

        {/* Red accent rule — the card-language section marker. */}
        <div className="mb-7 flex items-center justify-center">
          <span className="h-0.5 w-12 rounded-full bg-red" />
        </div>

        {/* CUSTOMIZE: heading line */}
        <h2 className="display-sm text-center text-fg">Happy Mother&apos;s Day</h2>

        {/* CUSTOMIZE: I know I'm not always great at saying it, but I think about how lucky I am to have you as my mom more than you'd guess. You have always been there, and always supported me. */}
        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted">
          <p>
            I know I&apos;m not always great at saying it, but I think about how lucky I am to have you as my mom more than you&apos;d guess. You have always been there, and always supported me. I hope we have another wonderful year together, and I can&apos;t wait to see what new trips and adventures we get to share. I hope that when we part (college), this site can be used as another form of link between our realities, it features a website I will update frequently with all my photos and hopefully videos eventually.
          </p>
          <p>Love you so much.</p>
        </div>

        {/* CUSTOMIZE: closing line */}
        <p className="label mt-7 text-right">— Charlie</p>
      </div>
    </div>
  );
}

function InquireModal({ onDismiss }: { onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  const email = "charlie@charlieramus.com";
  const mailtoHref = "mailto:charlie@charlieramus.com?subject=I%27d%20Love%20a%20Print!&body=Hi%20Charlie!%0A%0AI%27m%20interested%20in%20ordering%20a%20print.%20Here%20are%20the%20photo%20code(s)%20I%27d%20like%3A%0A%0A(Paste%20the%20code(s)%20here%20%E2%80%94%20click%20a%20photo%20and%20check%20the%20bottom%20right%20corner%20to%20find%20the%20code)"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fd-overlay-in fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4"
      onClick={onDismiss}
    >
      {/* Contact-card language (Log V11, Stage 2): rounded panel on tokens,
          Fraunces heading, and a red invert-on-hover primary action that mirrors
          the contact card (red → surface on hover). */}
      <div
        className="fd-card-in relative w-full max-w-95 overflow-hidden rounded-3xl border border-border bg-panel p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-5 top-5 text-muted transition-colors duration-150 hover:text-fg"
        >
          <X size={18} />
        </button>

        <h2 className="display-sm text-fg">Get in touch</h2>
        {/* CUSTOMIZE: e.g. "For print inquiries, commissions or licensing." */}
        <p className="mt-1.5 text-[13px] text-muted">
          For print inquiries, commissions or licensing.
        </p>

        {/* Primary action — reuses the contact-card invert: red/white at rest,
            surface/red on hover (the global reduced-motion guard softens it). */}
        <button
          onClick={() => {
            window.location.href = mailtoHref;
          }}
          className="mt-6 w-full rounded-full border border-transparent bg-red px-4 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-border hover:bg-surface hover:text-red"
        >
          Open in Mail
        </button>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="label text-[10px]!">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-[13px] text-fg">{email}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy email"
            className="flex items-center text-muted transition-colors duration-150 hover:text-fg"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>

        {/* CUSTOMIZE: e.g. "Please include the photo code(s) from the gallery, They are at the bottom left of each photo when clicked on. " */}
        <p className="mt-5 text-center text-[13px] leading-relaxed text-muted">
          Please include the photo code(s) from the gallery, They are at the bottom left of each photo when clicked on.
        </p>
      </div>
    </div>
  );
}


export default function PhotographyGallery() {
  const pathname = usePathname();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [captionOpen, setCaptionOpen] = useState(true);
  const [showMothersDay, setShowMothersDay] = useState(false);
  const [showInquire, setShowInquire] = useState(false);

  useEffect(() => {
    const key = `mothers-day-dismissed-${new Date().getFullYear()}`;
    if (isMothersDayToday() && !sessionStorage.getItem(key)) {
      setShowMothersDay(true);
    }
  }, []);

  const dismissMothersDay = () => {
    sessionStorage.setItem(`mothers-day-dismissed-${new Date().getFullYear()}`, "1");
    setShowMothersDay(false);
  };

  useEffect(() => {
    setCaptionOpen(true);
  }, [lightboxIdx]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx]);

  return (
    <>
      {showMothersDay && <MothersDayCard onDismiss={dismissMothersDay} />}
      {showInquire && <InquireModal onDismiss={() => setShowInquire(false)} />}

      {/* Floating Inquire button — fixed bottom-left, only on /photography */}
      {pathname === "/photography" && (
        <button
          onClick={() => setShowInquire(true)}
          className="fixed bottom-6 left-6 z-40 rounded-full border border-sky/50 bg-bg/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-sky backdrop-blur-md transition-colors duration-200 hover:border-sky hover:bg-sky/10"
        >
          Inquire
        </button>
      )}

      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 max-w-4xl mx-auto">
        {photos.map((photo, idx) => (
          <div key={photo.src || String(idx)} className="group break-inside-avoid mb-4">
            {photo.placeholder ? (
              <div
                className="w-full rounded-sm bg-surface"
                style={{ aspectRatio: String(photo.ratio) }}
              />
            ) : (
              <button
                onClick={() => setLightboxIdx(idx)}
                className="relative block w-full cursor-pointer overflow-hidden rounded-sm bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                style={{ aspectRatio: String(photo.ratio) }}
              >
                <Image
                  src={photo.thumb}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  priority={idx < 4}
                  {...(photo.blurDataURL
                    ? { placeholder: "blur", blurDataURL: photo.blurDataURL }
                    : {})}
                />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-3">
        <p className="label">That&apos;s everything for now — more adventures are in the works.</p>
        <Link
          href="/gear"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-sky transition-colors duration-150 hover:text-fg"
        >
          Gear List →
        </Link>
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setLightboxIdx(null)}
        >
          <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Image
                src={photos[lightboxIdx].src}
                alt={photos[lightboxIdx].alt}
                width={1200}
                height={900}
                className="max-w-[75vw] max-h-[75vh] w-auto h-auto rounded-sm"
                sizes="75vw"
                priority
              />
              <button
                onClick={() => setLightboxIdx(null)}
                aria-label="Close photo"
                className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors duration-150"
              >
                <X size={20} />
              </button>
            </div>

            {/* Bottom row: code (left) + Show description (right) */}
            {(photos[lightboxIdx].code || photos[lightboxIdx].caption) && (
              <div className="flex items-center justify-between w-full max-w-[75vw] mt-3">
                {photos[lightboxIdx].code ? (
                  <span className="rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-sky">
                    #{photos[lightboxIdx].code}
                  </span>
                ) : (
                  <span />
                )}
                {photos[lightboxIdx].caption && (
                  <button
                    onClick={() => setCaptionOpen((o) => !o)}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors duration-150 focus:outline-none"
                  >
                    {captionOpen ? "Hide description" : "Show description"}
                  </button>
                )}
              </div>
            )}

            {photos[lightboxIdx].caption && (
              <div
                style={{
                  maxHeight: captionOpen ? "200px" : "0",
                  overflow: "hidden",
                  transition: "max-height 250ms ease",
                }}
              >
                <div className="mt-2 px-4 py-3 rounded-lg max-w-[75vw] bg-black/8 dark:bg-black/40">
                  <p className="text-sm text-neutral-400 text-center">
                    {photos[lightboxIdx].caption}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
