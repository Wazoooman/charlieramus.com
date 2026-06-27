// Shared so Zone B's dashboard (Log V6) can reuse the exact copy — no duplication.
export const aboutParagraphs = [
  "I'm a high school junior in Boulder who builds software, creates content, and plenty more. I taught myself web development and Python, ship projects on GitHub, and have launched a few e-commerce stores (none took off in true honesty), but they've been great teachers about business as much as coding.",
  "On the side, I create architecture content that has grown into a community of builders from around the world, with over 300,000 impressions across my work. It started as something I genuinely enjoyed and turned into an exercise in showing up consistently and building something real with people online.",
  "Right now I'm focused on tools for academics and I plan on continuing building projects well into the future. I have a lot of ideas I want to bring to life in the next few years, and I hope to keep sharing the journey as I go.",
];

export default function About() {
  return (
    <section id="about" className="py-20 px-10 md:px-16">
      <div className="max-w-[560px] space-y-5 text-[15px] leading-[1.7] text-fg">
        {aboutParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
