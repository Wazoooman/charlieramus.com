"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * Article back link (restyled to the V9 mono chrome). Mirrors the shared
 * PageHeader back link — same Space Mono micro-label + ArrowLeft — but stays a
 * client component because the destination is decided at runtime: articles
 * opened from /writing return there, everything else returns Home (via the
 * `articleReferrer` flag set in the writing list).
 */
export default function BackButton() {
  const router = useRouter();
  const [dest, setDest] = useState<"/" | "/writing">("/");

  useEffect(() => {
    const ref = sessionStorage.getItem("articleReferrer");
    sessionStorage.removeItem("articleReferrer");
    if (ref === "writing") setDest("/writing");
  }, []);

  return (
    <button
      onClick={() => router.push(dest)}
      className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:text-fg"
    >
      <ArrowLeft size={13} />
      {dest === "/writing" ? "Writing" : "Home"}
    </button>
  );
}
