import Link from "next/link";

// V3 nav (V13 S1) — the mockup's centered, NON-sticky works/wordmark/garden
// cluster. It lives inside <header class="hero"> and scrolls away with the hero
// (no position:sticky). Styling is `nav` / `nav a` / `nav .logo` in v3.css.
//
// Links point at Charlie's real routes: works → /web-projects, garden → /writing
// (next/link for client-side nav; the rule requires it for in-app routes). The
// wordmark is Charlie's name in Caveat (script), matching the mockup's logo.

export default function Nav() {
  return (
    <nav aria-label="Primary">
      <Link href="/web-projects">works</Link>
      <span className="logo">Charlie Ramus</span>
      <Link href="/writing">garden</Link>
    </nav>
  );
}
