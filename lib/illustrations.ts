import "server-only";

import fs from "fs";
import path from "path";

const illustrationsDir = path.join(process.cwd(), "public", "illustrations");

// Matches the drop-in convention documented in public/illustrations/README.md:
// illustration-<n>.svg | illustration-<n>.webp
const ILLUSTRATION_RE = /^illustration-(\d+)\.(svg|webp)$/i;

/**
 * Reads the drop-in illustration folder at build/request time and returns the
 * public paths (e.g. "/illustrations/illustration-1.svg") sorted numerically by
 * their `<n>` index.
 *
 * Server-only: imports `fs`, so it must never be pulled into a client bundle.
 * The `server-only` import above turns accidental client usage into a
 * build-time error. Returns `[]` if the folder is missing or empty — no flowers,
 * no crash.
 */
export function getIllustrationPaths(): string[] {
  let entries: string[];
  try {
    entries = fs.readdirSync(illustrationsDir);
  } catch {
    // Folder missing (or unreadable) — degrade gracefully to no illustrations.
    return [];
  }

  return entries
    .map((name) => {
      const match = name.match(ILLUSTRATION_RE);
      return match ? { name, index: Number(match[1]) } : null;
    })
    .filter((item): item is { name: string; index: number } => item !== null)
    .sort((a, b) => a.index - b.index)
    .map((item) => `/illustrations/${item.name}`);
}
