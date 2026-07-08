import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن — HN Studio" },
      { name: "description", content: "HN Group: استوديو رقمي متكامل يبني منظومات ذكية بجودة عالمية." },
      { property: "og:title", content: "من نحن — HN Studio" },
      { property: "og:description", content: "HN Group: استوديو رقمي متكامل." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const pillars = [
    { t: "التصميم أولاً", d: "نستوحي من أفضل المواقع العالمية — Apple، Linear، Stripe، Vercel — لنمنح كل مشروع حضوراً بصرياً فريداً." },
    { t: "بنية تحتية جادة", d: "قواعد بيانات، APIs، مصادقة، تخزين — كل مشروع يقف على أساس هندسي متين." },
    { t: "منظومة متكاملة", d: "من الذكاء الاصطناعي إلى النقل والوسائط والتجارة — كلها تتحدث نفس اللغة." },
  ];
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-black md:text-7xl">
          نحن <span className="gold-text">HN</span>.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-6 text-lg leading-relaxed text-muted-foreground">
          استوديو رقمي يبني منظومة متكاملة من المنتجات الرقمية — أكثر من 99 موقعاً حياً، تعمل معاً كأنها كائن واحد.
          نُصمِّم، نُبرمِج، ونُدير كل شيء من الفكرة إلى الإنتاج.
        </motion.p>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div key={p.t}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6">
              <div className="gold-text font-display text-2xl font-black">0{i + 1}</div>
              <h3 className="mt-3 font-display text-lg font-bold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
