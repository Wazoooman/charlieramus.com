// V3 homepage — Stage 1 is just the paper-background shell. The "A little more
// personal" bento arrives in Stage 3 (see UPDATELOGV12.md); the hero, work, and
// finale land in V13–V15. Everything below is scoped by `.v3-root` (v3.css) so
// none of the live site's chrome or design system bleeds in.
export default function V3Page() {
  return (
    <main className="wrap" style={{ minHeight: "100vh", paddingBlock: "clamp(46px,6vw,80px)" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "clamp(26px,4vw,52px)" }}>
        V3 preview
      </h1>
      <p className="lede" style={{ color: "var(--ink-soft)", marginTop: 12 }}>
        Scaffold in place. Sections land in the coming stages.
      </p>
    </main>
  );
}
