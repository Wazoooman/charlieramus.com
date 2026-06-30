import FlowerField from "@/components/flower-field";

/**
 * Zone D — the closing flower-field quote (Log V8). A full-viewport finale: a
 * short, memorable line set in Fraunces, centred and ringed by a dense
 * `<FlowerField>` (`field` preset) that fills the screen around it. The
 * drop-in flower assets still spin 180° on hover here. Edit `QUOTE` (and
 * optional `ATTRIBUTION`) to change the copy — nothing else needs to move.
 */
const QUOTE = "Build the thing you wish existed, then keep it growing.";
const ATTRIBUTION = "Charlie Ramus";

export default function ClosingQuote() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Dense ring of spinning flowers behind the quote (`.flower-layer` is z-0). */}
      <FlowerField preset="field" />

      <figure className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <blockquote className="display-lg text-fg text-balance">
          &ldquo;{QUOTE}&rdquo;
        </blockquote>
        <figcaption className="label mt-7">{ATTRIBUTION}</figcaption>
      </figure>
    </section>
  );
}
