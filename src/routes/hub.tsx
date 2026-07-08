import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Globe, Users, Database, CloudUpload, ShoppingCart, DollarSign,
  LayoutDashboard, Layers, Activity, HardDrive, ShieldCheck, KeyRound,
  LogIn, Sparkles, FileBarChart, Settings, Lock, Save, Bell, Maximize2,
  Search, Sun, Send, RefreshCw, ChevronDown, Crown, BadgeCheck, MoreVertical,
  FolderOpen, Image as ImageIcon, Film, FileText, Archive, Trash2,
} from "lucide-react";

export const Route = createFileRoute("/hub")({
  component: Hub,
  head: () => ({
    meta: [
      { title: "SUPER CORE — HN Control Hub" },
      { name: "description", content: "مركز التحكم الشامل لمنظومة HN — كل المواقع وقواعد البيانات في لوحة واحدة." },
    ],
  }),
});

// ————— Data hooks (Lovable Cloud) —————
type Site = {
  id: number; domain: string; title: string | null; category: string;
  status: string; users_count: number; database_size_mb: number;
  storage_size_mb: number; server_id: number | null; ssl_expires_at: string | null;
};

function useHubData() {
  const sites = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sites").select("*").order("users_count", { ascending: false });
      if (error) throw error;
      return data as Site[];
    },
  });
  const activities = useQuery({
    queryKey: ["activity_logs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });
  const backups = useQuery({
    queryKey: ["backups-latest"],
    queryFn: async () => {
      const { data, error } = await supabase.from("backups").select("*").order("created_at", { ascending: false }).limit(1);
      if (error) throw error;
      return data ?? [];
    },
  });
  return { sites, activities, notifications, backups };
}

function fmtMB(mb: number) {
  if (mb >= 1024 * 1024) return (mb / (1024 * 1024)).toFixed(1) + " TB";
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  return mb + " MB";
}

// ————— Small helpers —————
function useCount(target: number, duration = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function StatCard({ icon: Icon, label, value, sub, tone, delay }: {
  icon: any; label: string; value: string; sub: string; tone: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl"
    >
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-30 blur-3xl" style={{ background: tone }} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] font-medium text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-black tabular-nums text-white">{value}</div>
          <div className="mt-1 text-[11px] text-emerald-400">{sub}</div>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10" style={{ background: `linear-gradient(135deg, ${tone}, transparent)`, boxShadow: `0 0 30px ${tone}55` }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

// ————— System Map: nodes from real sites —————
function SystemMap({ sites }: { sites: Site[] }) {
  const picks = sites.slice(0, 6);
  const positions = [
    { x: 18, y: 30 }, { x: 82, y: 30 },
    { x: 15, y: 62 }, { x: 85, y: 62 },
    { x: 22, y: 88 }, { x: 78, y: 88 },
  ];
  const colorFor = (s: string) => s === "danger" ? "#ef4444" : s === "warning" ? "#facc15" : "#22d3ee";
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,oklch(0.2_0.06_260/0.6),oklch(0.11_0.02_275)_70%)]">
      <div className="absolute inset-0 opacity-40"
           style={{ backgroundImage: "linear-gradient(oklch(1_0_0/.05) 1px,transparent 1px),linear-gradient(90deg,oklch(1_0_0/.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[220, 300, 400].map((s, i) => (
          <motion.div key={s}
            animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full border border-cyan-400/30"
            style={{ width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2 }} />
        ))}
      </div>
      <svg className="absolute inset-0 h-full w-full">
        {picks.map((n, i) => {
          const p = positions[i];
          return (
            <line key={n.id} x1="50%" y1="50%" x2={`${p.x}%`} y2={`${p.y}%`}
                  stroke={colorFor(n.status)} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 6" />
          );
        })}
      </svg>
      {/* Core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
          className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-cyan-500 shadow-[0_0_80px_rgba(168,85,247,.6)]">
          <div className="text-center">
            <div className="font-display text-sm font-black tracking-wider text-white">SUPER</div>
            <div className="font-display text-xs font-bold text-white/80">CORE</div>
            <div className="mt-1 text-[9px] text-white/60">{sites.length} SITES</div>
          </div>
        </motion.div>
      </div>
      {/* Nodes */}
      {picks.map((n, i) => {
        const p = positions[i];
        const c = colorFor(n.status);
        return (
          <motion.div key={n.id}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="rounded-xl border border-white/10 bg-black/60 p-2 backdrop-blur-xl min-w-[130px]"
                 style={{ boxShadow: `0 0 20px ${c}66` }}>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                <span className="truncate text-[10px] font-bold text-white">{n.domain}</span>
              </div>
              <div className="mt-1 text-[9px] text-white/60">👥 {n.users_count.toLocaleString()}</div>
              <div className="text-[9px] text-white/60">💾 {fmtMB(n.database_size_mb)}</div>
              <div className="text-[9px] text-white/60">📦 {fmtMB(n.storage_size_mb)}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function SideItem({ icon: Icon, label, active, badge }: { icon: any; label: string; active?: boolean; badge?: string }) {
  return (
    <div className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-xs transition
      ${active ? "bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}>
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/80">{badge}</span>}
    </div>
  );
}

function Sidebar({ totalSites, onlineSites, offlineSites }: { totalSites: number; onlineSites: number; offlineSites: number }) {
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col gap-6 border-l border-white/5 bg-[oklch(0.13_0.02_275)]/80 p-5 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/30">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-display text-sm font-black text-white">SUPER ADMIN</div>
          <div className="text-[10px] text-muted-foreground">Central Database Hub</div>
        </div>
      </div>

      <Link to="/hub"><SideItem icon={LayoutDashboard} label="لوحة التحكم الرئيسية" active /></Link>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">إدارة المواقع</div>
        <div className="space-y-1">
          <Link to="/sites"><SideItem icon={Layers} label="جميع المواقع" badge={String(totalSites)} /></Link>
          <SideItem icon={Globe} label="المواقع النشطة" badge={String(onlineSites)} />
          <SideItem icon={Bell} label="المواقع المتوقفة" badge={String(offlineSites)} />
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">قواعد البيانات</div>
        <div className="space-y-1">
          <SideItem icon={Database} label="جميع قواعد البيانات" />
          <SideItem icon={Activity} label="مراقبة الأداء" />
          <SideItem icon={Save} label="النسخ الاحتياطية" />
          <SideItem icon={FileText} label="سجلات النظام" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">التخزين السحابي</div>
        <div className="space-y-1">
          <SideItem icon={HardDrive} label="ملفات التخزين" />
          <SideItem icon={Activity} label="مراقبة الاستخدام" />
          <SideItem icon={FolderOpen} label="المجلدات العامة" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">الأمان</div>
        <div className="space-y-1">
          <SideItem icon={ShieldCheck} label="مركز الحماية" />
          <SideItem icon={Lock} label="محاولات الاختراق" />
          <SideItem icon={KeyRound} label="مفاتيح API" />
          <SideItem icon={LogIn} label="سجلات الدخول" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">الذكاء الاصطناعي</div>
        <div className="space-y-1">
          <SideItem icon={Sparkles} label="AI Command Center" />
          <SideItem icon={FileBarChart} label="التقارير الذكية" />
          <SideItem icon={Activity} label="تحليل البيانات" />
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">الإعدادات</div>
        <div className="space-y-1">
          <SideItem icon={Settings} label="إعدادات النظام" />
          <SideItem icon={ShieldCheck} label="إعدادات الأمان" />
          <SideItem icon={Save} label="إعدادات النسخ الاحتياطية" />
        </div>
      </div>

      <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="relative">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-xs font-bold text-white">A</div>
          <BadgeCheck className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full bg-background text-cyan-400" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-white">المالك</div>
          <div className="text-[10px] text-muted-foreground">superadmin@hub.com</div>
        </div>
        <MoreVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </aside>
  );
}

function ResourceChart() {
  const gen = (seed: number) =>
    Array.from({ length: 40 }, (_, i) => 40 + Math.sin(i / 3 + seed) * 20 + Math.cos(i / 5 + seed) * 15);
  const cpu = gen(0), ram = gen(2), disk = gen(4);
  const path = (data: number[]) =>
    "M " + data.map((y, i) => `${(i / (data.length - 1)) * 100},${100 - y}`).join(" L ");
  return (
    <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">استخدام الموارد</h3>
        <div className="flex gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-cyan-400"><span className="h-2 w-2 rounded-sm bg-cyan-400" /> CPU</span>
          <span className="flex items-center gap-1 text-fuchsia-400"><span className="h-2 w-2 rounded-sm bg-fuchsia-400" /> RAM</span>
          <span className="flex items-center gap-1 text-emerald-400"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> Disk</span>
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-40 w-full">
        {[0, 25, 50, 75, 100].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="white" strokeOpacity="0.05" strokeWidth="0.3" />)}
        <path d={path(cpu)} stroke="#22d3ee" strokeWidth="0.8" fill="none" />
        <path d={path(ram)} stroke="#e879f9" strokeWidth="0.8" fill="none" />
        <path d={path(disk)} stroke="#34d399" strokeWidth="0.8" fill="none" />
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        {["00:00","04:00","08:00","12:00","16:00","20:00","24:00"].map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}

function HealthDonut({ ok, warn, err }: { ok: number; warn: number; err: number }) {
  const total = Math.max(1, ok + warn + err);
  const items = [
    { label: "سليم",   value: ok,   pct: +(ok / total * 100).toFixed(1),   color: "#22c55e" },
    { label: "تحذير",  value: warn, pct: +(warn / total * 100).toFixed(1), color: "#facc15" },
    { label: "خطر",    value: err,  pct: +(err / total * 100).toFixed(1),  color: "#ef4444" },
  ];
  const c = 2 * Math.PI * 40;
  let offset = 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
      <h3 className="text-sm font-bold text-white">الحالة العامة للنظام</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="oklch(0.25 0.02 275)" strokeWidth="12" />
            {items.map((it) => {
              const len = (it.pct / 100) * c;
              const el = <circle key={it.label} cx="50" cy="50" r="40" fill="none" stroke={it.color} strokeWidth="12" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} strokeLinecap="round" />;
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-2xl font-black text-white">{total}</div>
              <div className="text-[10px] text-muted-foreground">إجمالي</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-xs">
          {items.map(it => (
            <div key={it.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/80"><span className="h-2 w-2 rounded-full" style={{ background: it.color }} />{it.label}</span>
              <span className="tabular-nums text-white/70">{it.value} ({it.pct}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `منذ ${s} ث`;
  const m = Math.floor(s / 60); if (m < 60) return `منذ ${m} د`;
  const h = Math.floor(m / 60); if (h < 24) return `منذ ${h} س`;
  return `منذ ${Math.floor(h / 24)} يوم`;
}

// ————— Main —————
function Hub() {
  const { sites, activities, notifications, backups } = useHubData();
  const list = sites.data ?? [];

  const totalSites = list.length;
  const onlineSites = list.filter(s => s.status === "online").length;
  const warnSites = list.filter(s => s.status === "warning").length;
  const errSites = list.filter(s => s.status === "danger" || s.status === "offline").length;
  const totalUsers = list.reduce((a, s) => a + s.users_count, 0);
  const totalStorageMB = list.reduce((a, s) => a + s.storage_size_mb, 0);
  const totalDBs = list.length;

  const sitesCount = useCount(totalSites);
  const usersCount = useCount(totalUsers);

  const lastBackup = backups.data?.[0];

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.02_275)] text-white" dir="rtl">
      <div className="flex">
        <Sidebar totalSites={totalSites} onlineSites={onlineSites} offlineSites={errSites} />

        <main className="flex-1 overflow-hidden p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-black md:text-3xl">
                <span className="inline-block">👑</span> مرحباً بك في مركز التحكم الشامل
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">لوحة مركزية متصلة بقاعدة بيانات حية لإدارة كل المواقع والتخزين والأمان</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="البحث في النظام..." className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pr-10 pl-4 text-sm outline-none focus:border-cyan-400/50" />
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"><Sun className="h-4 w-4" /></button>
              <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                {(notifications.data?.length ?? 0) > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-fuchsia-500 text-[10px] font-bold">{notifications.data!.length}</span>
                )}
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"><Maximize2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Globe}        label="المواقع النشطة"    value={sitesCount.toString()}                sub={`${onlineSites} على الإنترنت`} tone="#22d3ee" delay={0.0} />
            <StatCard icon={Users}        label="إجمالي المستخدمين" value={usersCount.toLocaleString()}          sub="مباشر من DB"                    tone="#a78bfa" delay={0.05} />
            <StatCard icon={Database}     label="قواعد البيانات"     value={totalDBs.toString()}                  sub="كل المواقع متصلة"               tone="#22d3ee" delay={0.10} />
            <StatCard icon={CloudUpload}  label="التخزين المستخدم"   value={fmtMB(totalStorageMB)}                sub="مجموع كل المواقع"               tone="#38bdf8" delay={0.15} />
            <StatCard icon={ShoppingCart} label="التحذيرات"          value={warnSites.toString()}                 sub="تحتاج مراجعة"                   tone="#f472b6" delay={0.20} />
            <StatCard icon={DollarSign}   label="مشاكل حرجة"         value={errSites.toString()}                  sub="تدخل فوري"                     tone="#facc15" delay={0.25} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
            <SystemMap sites={list} />
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">مراقبة قاعدة البيانات</h3>
                  <button className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">آخر 24 ساعة <ChevronDown className="h-3 w-3" /></button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { l: "الاتصالات النشطة", v: String(Math.floor(totalUsers / 500)), d: "+7.1%", c: "text-emerald-400" },
                    { l: "التحذيرات",       v: String(warnSites),                     d: "-4.2%", c: "text-red-400" },
                    { l: "متوسط الاستجابة", v: "120ms",                                d: "-8.7%", c: "text-emerald-400" },
                    { l: "قواعد البيانات",  v: totalDBs.toLocaleString(),              d: "+15.3%", c: "text-emerald-400" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[10px] text-muted-foreground">{s.l}</div>
                      <div className="mt-1 font-display text-xl font-black tabular-nums">{s.v}</div>
                      <div className={`text-[10px] ${s.c}`}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <ResourceChart />
              <HealthDonut ok={onlineSites} warn={warnSites} err={errSites} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Storage Explorer — top 5 sites by storage */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Storage Explorer</h3>
                <Link to="/sites" className="text-xs text-cyan-400 hover:underline">عرض جميع المواقع</Link>
              </div>
              <div className="mt-4 space-y-2">
                {[...list].sort((a, b) => b.storage_size_mb - a.storage_size_mb).slice(0, 5).map((s, i) => {
                  const icons = [ImageIcon, Film, FileText, Archive, Trash2];
                  const colors = ["text-cyan-400","text-fuchsia-400","text-emerald-400","text-yellow-400","text-red-400"];
                  const I = icons[i];
                  return (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
                      <span className="flex items-center gap-2 min-w-0"><I className={`h-4 w-4 shrink-0 ${colors[i]}`} /><span className="truncate font-mono text-white/80">{s.domain}</span></span>
                      <span className="shrink-0 text-muted-foreground">{s.users_count.toLocaleString()} 👥</span>
                      <span className="shrink-0 tabular-nums text-white/70">{fmtMB(s.storage_size_mb)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">AI Command Center</h3>
                <span className="rounded-md bg-fuchsia-500/20 px-1.5 py-0.5 text-[10px] font-bold text-fuchsia-300 border border-fuchsia-400/30">Beta</span>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-2">
                <input placeholder="اكتب أمراً أو استفساراً..." className="flex-1 bg-transparent px-2 text-xs outline-none" />
                <button className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500"><Send className="h-3.5 w-3.5" /></button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                {["تحسين قاعدة البيانات","تحليل الأداء","إنشاء جدول جديد","فحص الأمان","فحص الأخطاء","تنظيف البيانات"].map(t => (
                  <button key={t} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 hover:bg-white/10">{t}</button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Backup Center</h3>
                <button className="text-xs text-cyan-400 hover:underline">عرض جميع النسخ</button>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
                <div className="text-[10px] text-muted-foreground">آخر نسخة احتياطية</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black">
                    {lastBackup ? new Date(lastBackup.created_at).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }) : "—"}
                  </span>
                  <span className="text-[10px] text-emerald-400">({lastBackup?.status ?? "—"})</span>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">{lastBackup ? timeAgo(lastBackup.created_at) : ""}</div>
              </div>
              <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 hover:opacity-90">
                Backup All Sites
              </button>
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs hover:bg-white/10">
                <RefreshCw className="h-3.5 w-3.5" /> Restore
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_320px]">
            {/* Activities from DB */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">آخر الأنشطة</h3>
              <div className="mt-3 space-y-2 text-xs">
                {(activities.data ?? []).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-sm bg-cyan-400" />
                    <div className="flex-1"><div className="text-white/90">{a.action}{a.target ? ` — ${a.target}` : ""}</div><div className="text-[10px] text-muted-foreground">بواسطة {a.actor}</div></div>
                    <div className="text-[10px] text-muted-foreground">{timeAgo(a.created_at)}</div>
                  </div>
                ))}
                {activities.data && activities.data.length === 0 && <div className="text-muted-foreground text-center py-4">لا يوجد نشاط</div>}
              </div>
            </div>

            {/* Notifications from DB */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">تنبيهات النظام</h3>
              <div className="mt-3 space-y-2 text-xs">
                {(notifications.data ?? []).map((n: any) => {
                  const color = n.level === "critical" ? "text-red-400" : n.level === "warning" ? "text-yellow-400" : "text-cyan-400";
                  const dot = n.level === "critical" ? "bg-red-400" : n.level === "warning" ? "bg-yellow-400" : "bg-cyan-400";
                  return (
                    <div key={n.id} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-sm ${dot}`} />
                      <div className={`flex-1 ${color}`}><div className="font-semibold">{n.title}</div>{n.body && <div className="text-white/60 text-[10px] mt-0.5">{n.body}</div>}</div>
                      <div className="text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">الوصول السريع</h3>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[
                  { i: Globe, l: "المواقع", c: "from-cyan-500 to-blue-600", to: "/sites" as const },
                  { i: Database, l: "DBs", c: "from-fuchsia-500 to-purple-600", to: "/sites" as const },
                  { i: CloudUpload, l: "التخزين", c: "from-emerald-500 to-teal-600", to: "/sites" as const },
                  { i: Save, l: "النسخ", c: "from-yellow-500 to-orange-600", to: "/sites" as const },
                  { i: FileBarChart, l: "التقارير", c: "from-pink-500 to-rose-600", to: "/sites" as const },
                ].map(({ i: I, l, c, to }) => (
                  <Link key={l} to={to} className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2.5 text-[10px] transition hover:bg-white/10">
                    <div className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${c} shadow-lg`}>
                      <I className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/70">{l}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="h-6" />
        </main>
      </div>
    </div>
  );
}
