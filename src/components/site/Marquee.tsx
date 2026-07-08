import { PROJECTS } from "@/data/projects";

export function Marquee() {
  const items = [...PROJECTS.slice(0, 20), ...PROJECTS.slice(0, 20)];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-gradient-to-r from-transparent via-primary/5 to-transparent py-8">
      <div className="flex gap-12 animate-marquee whitespace-nowrap">
        {items.map((p, i) => (
          <div key={i} className="flex items-center gap-4 shrink-0">
            <span className="font-display text-3xl font-black text-white/40 hover:text-primary transition-colors md:text-5xl">
              {p.title}
            </span>
            <span className="h-2 w-2 rounded-full bg-primary/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
