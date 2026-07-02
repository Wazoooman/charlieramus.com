"use client";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

// Reveal (V12 S2) — React port of the mockup's `.reveal` fade-up. Adds the `.in`
// class once the element scrolls into view (IntersectionObserver, threshold
// .12, unobserved after firing), matching the mockup's inferred scroll motion.
//
// Polymorphic via `as` so the reveal + layout classes land on the *same* node
// the mockup uses (e.g. `<Reveal as="article" className="cj p-career">`), which
// matters for grid placement — an extra wrapper div would break grid-column.
//
// Reduced motion is handled entirely in v3.css (`.reveal` forced visible under
// `prefers-reduced-motion`), so this component's only state change happens in
// the async observer callback — never synchronously inside the effect.

type RevealProps<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export default function Reveal<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["reveal", inView ? "in" : "", className].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  );
}
