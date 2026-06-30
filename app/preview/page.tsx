import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Dashboard from "@/components/dashboard";
import Bento from "@/components/bento";
import ClosingQuote from "@/components/closing-quote";
import ContactCard from "@/components/contact-card";
import Footer from "@/components/footer";

/**
 * Redesign preview — a stable place to watch the reskin come together while the
 * live homepage (app/page.tsx) stays on the old layout. Assembles the finished
 * zones so far: V5 hero (Zone A) + V6 dashboard (Zone B) + V7 bento (Zone C) +
 * V8 closing flower-field quote (Zone D) + V11 "Get in touch" contact card.
 * More zones get added here as later logs land; final assembly into the
 * homepage is its own log.
 */
export default function Preview() {
  return (
    <>
      <Nav />
      <Hero />
      <Dashboard />
      <Bento />
      <ContactCard />
      <ClosingQuote />
      <Footer />
    </>
  );
}
