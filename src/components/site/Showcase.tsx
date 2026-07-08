import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROJECTS } from "@/data/projects";
import { ArrowUpLeft } from "lucide-react";

export function Showcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const picks = PROJECTS.slice(0, 6);

  return (
    <section ref={ref} className="relative mx-auto max-w-7xl px-6 py-32">
      <motion.div style={{ y: y1 }} className="pointer-events-none absolute -top-10 left-10 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
      <motion.div style={{ y: y2 }} className="pointer-events-none absolute right-10 top-40 h-96 w-96 rounded-full bg-violet-500/20 blur-[140px]" />

      <div className="relative mb-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70">Selected Work</p>
        <h2 className="mt-4 font-display text-4xl font-black md:text-6xl">
          <span className="gold-text">أعمال</span> صنعت بشغف
        </h2>
      </div>

      <div className="space-y-24">
        {picks.map((p, i) => (
          <motion.a
            key={p.domain}
            href={`https://${p.domain}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative grid grid-cols-1 items-center gap-8 md:grid-cols-12 ${i % 2 ? "md:[direction:ltr]" : ""}`}
          >
            <div className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}>
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={`https://image.thum.io/get/width/1200/crop/750/noanimate/https://${p.domain}`}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent opacity-60 transition-opacity group-hover:opacity-30" />
              </div>
            </div>
            <div className={`md:col-span-5 ${i % 2 ? "md:order-1 md:pr-8 md:text-right" : "md:pl-4"}`} dir="rtl">
              <div className="text-xs uppercase tracking-[0.2em] text-primary/80">{String(i + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}</div>
              <h3 className="mt-3 font-display text-3xl font-black leading-tight md:text-5xl">
                {p.title}
              </h3>
              <p className="mt-4 text-muted-foreground">{p.domain}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                زيارة الموقع <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
