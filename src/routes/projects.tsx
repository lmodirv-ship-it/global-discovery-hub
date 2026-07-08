import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ProjectCard } from "@/components/site/ProjectCard";
import { PROJECTS, CATEGORIES, type Category } from "@/data/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "المشاريع — HN Studio" },
      { name: "description", content: "استكشف أكثر من 99 موقعاً بنيناها في مختلف القطاعات." },
      { property: "og:title", content: "المشاريع — HN Studio" },
      { property: "og:description", content: "معرض شامل لمواقع HN Group." },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
  component: ProjectsPage,
});

type Filter = Category | "all";

function ProjectsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!query) return true;
      return p.domain.toLowerCase().includes(query) || p.title.toLowerCase().includes(query);
    });
  }, [q, filter]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-black md:text-6xl">
          المعرض <span className="gold-text">الكامل</span>
        </motion.h1>
        <p className="mt-3 text-muted-foreground">
          {filtered.length} من أصل {PROJECTS.length} موقعاً
        </p>

        {/* Search */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالنطاق أو الاسم..."
              className="w-full rounded-full border border-white/10 bg-card px-5 py-3 pr-12 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")} label="الكل" count={PROJECTS.length} />
            {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([k, c]) => {
              const count = PROJECTS.filter((p) => p.category === k).length;
              if (count === 0) return null;
              return (
                <FilterPill
                  key={k}
                  active={filter === k}
                  onClick={() => setFilter(k)}
                  label={`${c.icon} ${c.ar}`}
                  count={count}
                  color={c.color}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
            لا توجد نتائج مطابقة.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <ProjectCard key={p.domain} project={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FilterPill({ active, onClick, label, count, color }: { active: boolean; onClick: () => void; label: string; count: number; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20"
      }`}
      style={active && color ? { borderColor: `${color}80`, backgroundColor: `${color}18`, color } : undefined}
    >
      <span>{label}</span>
      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">{count}</span>
    </button>
  );
}
