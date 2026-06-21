"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

// Show only on Father's Day 2026 (today). After this date the modal never renders.
const FATHERS_DAY = "2026-06-21";
const STORAGE_KEY = "fathers-day-2026-dismissed";

export default function FathersDayModal() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
    if (today !== FATHERS_DAY) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    // small delay so it animates in after the page settles
    const t = setTimeout(() => setOpen(true), 350);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setClosing(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 280);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${
        closing ? "fd-overlay-out" : "fd-overlay-in"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Happy Father's Day"
      onClick={dismiss}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="fd-confetti absolute block"
            style={{
              left: c.left,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.round ? "9999px" : "2px",
              animationDelay: c.delay,
              animationDuration: c.duration,
            }}
          />
        ))}
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-rule bg-surface shadow-2xl ${
          closing ? "fd-card-out" : "fd-card-in"
        }`}
      >
        {/* decorative accent bar */}
        <div className="h-1.5 w-full bg-orange" />

        {/* close */}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-bg/70 text-muted backdrop-blur transition-colors hover:bg-bg hover:text-fg"
        >
          <X size={16} />
        </button>

        <div className="px-6 pb-7 pt-6 sm:px-8">
          {/* heading */}
          <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-orange">
            June 21, 2026
          </p>
          <h2 className="mt-2 text-center text-2xl font-bold leading-tight text-fg sm:text-3xl">
            Happy Father&rsquo;s Day
          </h2>

          {/* polaroid-framed photo */}
          <div className="mt-6 flex justify-center">
            <div className="-rotate-2 rounded-md bg-white p-2.5 pb-6 shadow-xl ring-1 ring-black/5 transition-transform duration-300 hover:rotate-0">
              <div className="relative aspect-[4/5] w-44 overflow-hidden rounded-sm bg-neutral-200 sm:w-52">
                <Image
                  src="/images/fathers-day-images/fathers-day.webp"
                  alt="Happy Father's Day"
                  fill
                  sizes="208px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* the card / written note */}
          <div className="relative mt-6 rounded-xl border border-rule bg-bg/60 p-5">
            <span className="absolute -top-2.5 left-5 bg-surface px-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
              A note for Dad
            </span>
            <p className="fd-note text-center text-[17px] leading-relaxed text-fg">
              Thank you for everything you do, for the good conversations, and for
              showing me what it means to lead with heart. Happy Father&rsquo;s
              Day, Dad — I love you.
            </p>
            <p className="fd-note mt-3 text-right text-base text-muted">— Charlie</p>
          </div>

          <button
            onClick={dismiss}
            className="mt-6 w-full rounded-full bg-orange py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const CONFETTI = [
  { left: "4%", size: "10px", color: "#FA5B1C", round: true, delay: "0s", duration: "3.4s" },
  { left: "11%", size: "7px", color: "#FBBF24", round: false, delay: "0.4s", duration: "3.9s" },
  { left: "18%", size: "9px", color: "#34D399", round: true, delay: "0.9s", duration: "3.2s" },
  { left: "24%", size: "6px", color: "#FA5B1C", round: false, delay: "0.2s", duration: "4.2s" },
  { left: "31%", size: "11px", color: "#60A5FA", round: true, delay: "1.1s", duration: "3.6s" },
  { left: "37%", size: "8px", color: "#FBBF24", round: false, delay: "0.6s", duration: "4.0s" },
  { left: "44%", size: "9px", color: "#F472B6", round: true, delay: "0.1s", duration: "3.3s" },
  { left: "50%", size: "7px", color: "#FA5B1C", round: false, delay: "1.5s", duration: "3.7s" },
  { left: "56%", size: "10px", color: "#60A5FA", round: true, delay: "0.3s", duration: "3.1s" },
  { left: "62%", size: "8px", color: "#34D399", round: false, delay: "1.0s", duration: "4.1s" },
  { left: "69%", size: "9px", color: "#F472B6", round: true, delay: "0.7s", duration: "3.5s" },
  { left: "75%", size: "7px", color: "#FBBF24", round: false, delay: "0.5s", duration: "3.8s" },
  { left: "81%", size: "11px", color: "#FA5B1C", round: true, delay: "1.2s", duration: "3.3s" },
  { left: "87%", size: "8px", color: "#60A5FA", round: false, delay: "0.2s", duration: "4.0s" },
  { left: "93%", size: "10px", color: "#34D399", round: true, delay: "0.9s", duration: "3.6s" },
  { left: "97%", size: "7px", color: "#F472B6", round: false, delay: "1.4s", duration: "3.4s" },
] as const;
