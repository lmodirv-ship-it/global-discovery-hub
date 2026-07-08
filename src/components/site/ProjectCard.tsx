import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, type Project } from "@/data/projects";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const cat = CATEGORIES[project.category];
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
      style={{ ["--cat-color" as string]: cat.color }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
           style={{ background: `radial-gradient(400px circle at 50% 0%, ${cat.color}18, transparent 60%)` }} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-lg"
                style={{ backgroundColor: `${cat.color}22`, color: cat.color }}>
            {cat.icon}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{cat.ar}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold leading-tight" dir="ltr">
        {project.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground truncate" dir="ltr">
        {project.domain}
      </p>
    </motion.a>
  );
}
