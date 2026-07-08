import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProjectCard } from "@/components/site/ProjectCard";
import { Marquee } from "@/components/site/Marquee";
import { Showcase } from "@/components/site/Showcase";
import { RevealText } from "@/components/site/Reveal";
import { PROJECTS, CATEGORIES, type Category } from "@/data/projects";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = PROJECTS.slice(0, 8);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const catCounts = PROJECTS.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            استوديو رقمي متكامل · HN Group
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-8 font-display text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
          >
            <span className="gold-text">99 موقعاً.</span>
            <br />
            رؤية واحدة.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            نبني منظومة رقمية متكاملة تجمع بين الأناقة السينمائية للمواقع العالمية،
            والدقّة الهندسية، وسرعة التنفيذ. كل موقع قصة — وكلها قصة واحدة.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/projects" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition hover:opacity-90">
              اكتشف كل المشاريع
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
              تعرف علينا
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-4"
          >
            {[
              { n: "99+", l: "موقع منشور" },
              { n: "11", l: "قطاع مختلف" },
              { n: "24/7", l: "بنية تحتية حيّة" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl px-4 py-6 text-center">
                <div className="gold-text font-display text-3xl font-black md:text-4xl">{s.n}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black md:text-4xl">قطاعاتنا</h2>
            <p className="mt-2 text-muted-foreground">من الذكاء الاصطناعي إلى النقل الذكي والتجارة</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass group relative overflow-hidden rounded-2xl p-5 transition-all hover:border-primary/30"
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                   style={{ backgroundColor: cat.color }} />
              <div className="relative">
                <div className="text-3xl">{cat.icon}</div>
                <h3 className="mt-3 font-display font-bold">{cat.ar}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {catCounts[key] || 0} موقع
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-black md:text-4xl">مختارات</h2>
            <p className="mt-2 text-muted-foreground">لمحة سريعة من المعرض</p>
          </div>
          <Link to="/projects" className="hidden shrink-0 text-sm text-primary hover:underline md:inline-flex items-center gap-1">
            كل المشاريع <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProjectCard key={p.domain} project={p} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
