import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Dashboard from "@/components/dashboard";

/**
 * Redesign preview — a stable place to watch the reskin come together while the
 * live homepage (app/page.tsx) stays on the old layout. Assembles the finished
 * zones so far: V5 hero (Zone A) + V6 dashboard (Zone B). More zones get added
 * here as later logs land; final assembly into the homepage is its own log.
 */
export default function Preview() {
  return (
    <>
      <Nav />
      <Hero />
      <Dashboard />
    </>
  );
}
