"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

export default function CarouselLightbox({
  images,
  initialIndex = 0,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [outSrc, setOutSrc] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Refs so event handlers always read the latest values without re-registering
  const indexRef = useRef(index);
  indexRef.current = index;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Prevent background scrolling while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      const next = (indexRef.current + dir + images.length) % images.length;
      setOutSrc(images[indexRef.current]);
      setDirection(dir);
      setAnimKey((k) => k + 1);
      setIndex(next);
    },
    [images]
  );

  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigateRef.current(1);
      if (e.key === "ArrowLeft") navigateRef.current(-1);
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Touch swipe
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) navigateRef.current(dx > 0 ? 1 : -1);
    touchX.current = null;
  };

  const enterAnim =
    direction === 1
      ? "lbEnterForward 250ms ease forwards"
      : "lbEnterBackward 250ms ease forwards";
  const exitAnim =
    direction === 1
      ? "lbExitForward 250ms ease forwards"
      : "lbExitBackward 250ms ease forwards";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors duration-150 z-10"
        aria-label="Close lightbox"
      >
        <X size={22} />
      </button>

      {/* Image stage — stopPropagation so clicking the image doesn't dismiss */}
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Outgoing image — absolute overlay, plays exit animation, removes itself when done */}
        {outSrc && (
          <img
            key={`out-${animKey}`}
            src={outSrc}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain rounded-lg pointer-events-none"
            style={{ animation: exitAnim }}
            onAnimationEnd={() => setOutSrc(null)}
          />
        )}

        {/* Incoming image — plays enter animation on each navigation */}
        <img
          key={`in-${animKey}`}
          src={images[index]}
          alt={`Screenshot ${index + 1} of ${images.length}`}
          className="block rounded-lg"
          style={{
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            animation: animKey > 0 ? enterAnim : "none",
          }}
        />
      </div>

      {/* Arrows — omitted when there is only one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateRef.current(-1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-150 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateRef.current(1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-150 z-10"
            aria-label="Next image"
          >
            <ChevronRight size={36} strokeWidth={1.5} />
          </button>
        </>
      )}
    </div>
  );
}
