import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, ArrowUpLeft, Database, HardDrive, Users, Crown, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/sites")({
  component: SitesPage,
  head: () => ({
    meta: [
      { title: "المواقع — SUPER CORE" },
      { name: "description", content: "جميع المواقع المُدارة داخل منظومة HN مع البحث والفلترة والحالة الحية." },
    ],
  }),
});

type Site = {
  id: number; domain: string; title: string | null; category: string;
  status: string; users_count: number; database_size_mb: number;
  storage_size_mb: number; ssl_expires_at: string | null;
};

function fmtMB(mb: number) {
  if (mb >= 1024 * 1024) return (mb / (1024 * 1024)).toFixed(1) + " TB";
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  return mb + " MB";
}

const CATS = ["all","ai","transport","database","chat","real-estate","finance","ecommerce","corporate","content","media"];

function SitesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");

  const { data = [], isLoading } = useQuery({
    queryKey: ["sites-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sites").select("*").order("users_count", { ascending: false });
      if (error) throw error;
      return data as Site[];
    },
  });

  const filtered = useMemo(() => data.filter(s => {
    if (cat !== "all" && s.category !== cat) return false;
    if (status !== "all" && s.status !== status) return false;
    if (q && !s.domain.toLowerCase().includes(q.toLowerCase()) && !(s.title ?? "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [data, cat, status, q]);

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.02_275)] text-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/30"><Crown className="h-5 w-5" /></div>
            <div>
              <h1 className="font-display text-2xl font-black">جميع المواقع</h1>
              <p className="text-xs text-muted-foreground">إدارة كل المواقع المُتصلة بالمنظومة</p>
            </div>
          </div>
          <Link to="/hub" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" /> العودة للوحة التحكم
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { l: "المجموع", v: data.length, c: "#22d3ee" },
            { l: "نشط", v: data.filter(s => s.status === "online").length, c: "#22c55e" },
            { l: "تحذير", v: data.filter(s => s.status === "warning").length, c: "#facc15" },
            { l: "حرج", v: data.filter(s => s.status === "danger" || s.status === "offline").length, c: "#ef4444" },
          ].map(s => (
            <div key={s.l} className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-4">
              <div className="text-[11px] text-muted-foreground">{s.l}</div>
              <div className="mt-1 font-display text-3xl font-black tabular-nums" style={{ color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث بالنطاق أو الاسم..." className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pr-10 pl-4 text-sm outline-none focus:border-cyan-400/50" />
          </div>
          <select value={cat} onChange={e => setCat(e.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none">
            {CATS.map(c => <option key={c} value={c} className="bg-[oklch(0.13_0.02_275)]">{c === "all" ? "كل الفئات" : c}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none">
            {["all","online","warning","danger","offline"].map(s => <option key={s} value={s} className="bg-[oklch(0.13_0.02_275)]">{s === "all" ? "كل الحالات" : s}</option>)}
          </select>
        </div>

        {/* Table / Grid */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 backdrop-blur-xl">
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr_0.8fr_auto] items-center gap-3 border-b border-white/10 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <div>الموقع</div><div>الفئة</div><div>المستخدمون</div><div>DB</div><div>التخزين</div><div>الحالة</div>
          </div>
          {isLoading && <div className="p-8 text-center text-muted-foreground text-sm">جارٍ التحميل…</div>}
          {!isLoading && filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">لا توجد نتائج</div>}
          <div className="divide-y divide-white/5">
            {filtered.map(s => {
              const c = s.status === "danger" || s.status === "offline" ? "#ef4444" : s.status === "warning" ? "#facc15" : "#22c55e";
              return (
                <a key={s.id} href={`https://${s.domain}`} target="_blank" rel="noreferrer"
                   className="grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr_0.8fr_auto] items-center gap-3 px-5 py-3 text-xs transition hover:bg-white/5">
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">{s.title ?? s.domain} <ArrowUpLeft className="h-3 w-3 text-muted-foreground" /></div>
                    <div className="text-[10px] text-muted-foreground font-mono">{s.domain}</div>
                  </div>
                  <div><span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/70">{s.category}</span></div>
                  <div className="flex items-center gap-1.5 text-white/80"><Users className="h-3 w-3 text-cyan-400" /> {s.users_count.toLocaleString()}</div>
                  <div className="flex items-center gap-1.5 text-white/80"><Database className="h-3 w-3 text-fuchsia-400" /> {fmtMB(s.database_size_mb)}</div>
                  <div className="flex items-center gap-1.5 text-white/80"><HardDrive className="h-3 w-3 text-emerald-400" /> {fmtMB(s.storage_size_mb)}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                    <span className="text-[10px] font-bold" style={{ color: c }}>{s.status}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
