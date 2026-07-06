// Services / skills data — the source of truth for the V3 "I've got your back
// with…" section (components/v3/services.tsx). Kept as a typed list here rather
// than hardcoded into JSX so it's easy to edit without touching layout code.
//
// The mockup showed a 3×3 grid, so nine reads best (it fills evenly), but the
// component maps whatever length this array is — add or remove freely.

export type Service = string;

// CUSTOMIZE: the things Charlie actually offers / is good at. Order flows
// left→right, top→bottom in the 3-column dashed-underline grid.
export const services: Service[] = [
  "Web Development",
  "Next.js / React",
  "UI / UX Design",
  "Brand & Visual Identity",
  "Photography",
  "Content & Community",
  "Design Systems",
  "Python / Automation",
  "Data & Analytics",
];
