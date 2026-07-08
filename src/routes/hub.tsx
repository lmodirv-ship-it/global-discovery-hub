import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
      { name: "description", content: "مركز التحكم الشامل لمنظومة HN — 127 موقعاً حياً في لوحة واحدة." },
    ],
  }),
});

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

// ————— System Map (the wow) —————
type Node = { id: string; name: string; x: number; y: number; users: number; db: string; storage: string; status: "ok" | "warn" | "err"; color: string };
const NODES: Node[] = [
  { id: "souk",   name: "souk-hn.com",   x: 18, y: 30, users: 12421, db: "3.2 GB", storage: "1.8 TB", status: "ok",   color: "#22d3ee" },
  { id: "islam",  name: "islamiat.net",  x: 82, y: 30, users: 7821,  db: "1.3 GB", storage: "780 GB", status: "ok",   color: "#22d3ee" },
  { id: "adkar",  name: "adkar-app.com", x: 15, y: 62, users: 8752,  db: "1.7 GB", storage: "890 GB", status: "ok",   color: "#34d399" },
  { id: "news",   name: "news-hn.com",   x: 85, y: 62, users: 5421,  db: "2.8 GB", storage: "1.5 TB", status: "warn", color: "#facc15" },
  { id: "tv",     name: "tv-maroc.com",  x: 22, y: 88, users: 6245,  db: "2.1 GB", storage: "1.2 TB", status: "ok",   color: "#a78bfa" },
  { id: "forum",  name: "forum-hn.com",  x: 78, y: 88, users: 3591,  db: "950 MB", storage: "650 GB", status: "ok",   color: "#22d3ee" },
];

function SystemMap() {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_at_center,oklch(0.2_0.06_260/0.6),oklch(0.11_0.02_275)_70%)]">
      {/* grid */}
      <div className="absolute inset-0 opacity-40"
           style={{ backgroundImage: "linear-gradient(oklch(1_0_0/.05) 1px,transparent 1px),linear-gradient(90deg,oklch(1_0_0/.05) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* radial rings */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[220, 340, 460].map((s, i) => (
          <motion.div key={s}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: [0.5, 0.1, 0.5], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20"
            style={{ width: s, height: s, left: 0, top: 0 }}
          />
        ))}
      </div>

      {/* SVG connections */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {NODES.map((n, i) => (
          <g key={n.id}>
            <line x1="50" y1="50" x2={n.x} y2={n.y} stroke={n.color} strokeOpacity="0.25" strokeWidth="0.15" />
            <circle r="0.8" fill={n.color}>
              <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite"
                path={`M50,50 L${n.x},${n.y}`} />
            </circle>
            <circle r="0.6" fill="#ffffff">
              <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}
                path={`M${n.x},${n.y} L50,50`} />
            </circle>
          </g>
        ))}
      </svg>

      {/* Center SUPER CORE */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ boxShadow: ["0 0 60px #22d3ee88", "0 0 120px #22d3eebb", "0 0 60px #22d3ee88"] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="grid h-36 w-36 place-items-center rounded-full border border-cyan-300/40 bg-[radial-gradient(circle_at_30%_30%,#67e8f9,#0891b2_60%,#164e63)] md:h-44 md:w-44"
        >
          <div className="text-center">
            <div className="font-display text-xl font-black text-white md:text-2xl">SUPER</div>
            <div className="font-display text-xl font-black text-white md:text-2xl -mt-1">CORE</div>
          </div>
        </motion.div>
      </div>

      {/* Nodes */}
      {NODES.map((n, i) => (
        <motion.div
          key={n.id}
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="group relative min-w-[180px] rounded-xl border bg-black/40 p-3 backdrop-blur-md transition-transform hover:scale-105"
               style={{ borderColor: `${n.color}66`, boxShadow: `0 0 24px ${n.color}44` }}>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${n.color}22`, border: `1px solid ${n.color}55` }}>
                <Database className="h-4 w-4" style={{ color: n.color }} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-white">{n.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className={`h-1.5 w-1.5 rounded-full ${n.status === "ok" ? "bg-emerald-400" : n.status === "warn" ? "bg-yellow-400" : "bg-red-400"}`} />
                  {n.status === "ok" ? "Online" : n.status === "warn" ? "تحذير" : "خطر"}
                </div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
              <div><span className="text-white/80">Users</span> : {n.users.toLocaleString()}</div>
              <div><span className="text-white/80">DB</span> : {n.db}</div>
              <div><span className="text-white/80">Storage</span> : {n.storage}</div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* header labels */}
      <div className="absolute right-5 top-5 flex items-center gap-2 text-xs">
        <h3 className="font-display font-bold text-white">خريطة النظام المباشرة</h3>
      </div>
      <div className="absolute left-5 top-5 flex items-center gap-3 text-[10px]">
        <span className="flex items-center gap-1 text-emerald-400"><span className="h-2 w-2 rounded-sm bg-emerald-400" /> نشط</span>
        <span className="flex items-center gap-1 text-yellow-400"><span className="h-2 w-2 rounded-sm bg-yellow-400" /> تحذير</span>
        <span className="flex items-center gap-1 text-red-400"><span className="h-2 w-2 rounded-sm bg-red-400" /> خطر</span>
      </div>

      {/* footer button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur hover:bg-white/10">
          عرض جميع المواقع (127)
        </button>
      </div>
    </div>
  );
}

// ————— Sidebar —————
function SideItem({ icon: Icon, label, badge, active }: { icon: any; label: string; badge?: string; active?: boolean }) {
  return (
    <button className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-gradient-to-l from-cyan-500/20 to-transparent text-white border border-cyan-400/30" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      {badge && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px]">{badge}</span>}
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 border-l border-white/10 bg-[oklch(0.13_0.02_275)]/80 p-5 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40">
          <Crown className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="font-display text-sm font-black text-white">SUPER ADMIN</div>
          <div className="text-[10px] text-muted-foreground">Central Database Hub</div>
        </div>
      </div>

      <SideItem icon={LayoutDashboard} label="لوحة التحكم الرئيسية" active />

      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">إدارة المواقع</div>
        <div className="space-y-1">
          <SideItem icon={Layers} label="جميع المواقع" badge="127" />
          <SideItem icon={Globe} label="المواقع النشطة" badge="120" />
          <SideItem icon={Bell} label="المواقع المتوقفة" badge="7" />
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

// ————— Resource wave chart —————
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

// ————— Donut —————
function HealthDonut() {
  const items = [
    { label: "سليم",   value: 120, pct: 94.5, color: "#22c55e" },
    { label: "تحذير",  value: 5,   pct: 3.9,  color: "#facc15" },
    { label: "خطر",    value: 2,   pct: 1.6,  color: "#ef4444" },
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
              <div className="font-display text-2xl font-black text-white">127</div>
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

// ————— Main —————
function Hub() {
  const sites = useCount(127);
  const users = useCount(48251);
  const revenue = useCount(34500);
  const orders = useCount(8921);

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.02_275)] text-white" dir="rtl">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 overflow-hidden p-5 md:p-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-black md:text-3xl">
                <span className="inline-block">👑</span> مرحباً بك في مركز التحكم الشامل
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">لوحة التحكم المركزية لإدارة جميع قواعد البيانات والمواقع والتخزين</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="البحث في النظام..." className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pr-10 pl-4 text-sm outline-none focus:border-cyan-400/50" />
              </div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"><Sun className="h-4 w-4" /></button>
              <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-fuchsia-500 text-[10px] font-bold">9+</span>
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"><Maximize2 className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Globe}        label="المواقع النشطة"   value={sites.toString()}                sub="+ 8 هذا الشهر"   tone="#22d3ee" delay={0.0} />
            <StatCard icon={Users}        label="إجمالي المستخدمين" value={users.toLocaleString()}          sub="+ 2,451 هذا الأسبوع" tone="#a78bfa" delay={0.05} />
            <StatCard icon={Database}     label="قواعد البيانات"    value="127"                              sub="كل المواقع متصلة"     tone="#22d3ee" delay={0.10} />
            <StatCard icon={CloudUpload}  label="التخزين المستخدم"  value="12.7 TB"                          sub="من أصل 50 TB"        tone="#38bdf8" delay={0.15} />
            <StatCard icon={ShoppingCart} label="الطلبات اليوم"      value={orders.toLocaleString()}         sub="+ 18.7%"             tone="#f472b6" delay={0.20} />
            <StatCard icon={DollarSign}   label="الأرباح اليوم"      value={`${revenue.toLocaleString()} DH`} sub="+ 22.5%"             tone="#facc15" delay={0.25} />
          </div>

          {/* Grid: map + right column */}
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
            <SystemMap />
            <div className="flex flex-col gap-4">
              {/* DB monitor */}
              <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">مراقبة قاعدة البيانات</h3>
                  <button className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">آخر 24 ساعة <ChevronDown className="h-3 w-3" /></button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { l: "الاتصالات النشطة", v: "89", d: "+7.1%", c: "text-emerald-400" },
                    { l: "الأخطاء", v: "12", d: "-4.2%", c: "text-red-400" },
                    { l: "متوسط الاستجابة", v: "120ms", d: "-8.7%", c: "text-emerald-400" },
                    { l: "عدد الاستعلامات", v: "128,654", d: "+15.3%", c: "text-emerald-400" },
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
              <HealthDonut />
            </div>
          </div>

          {/* Third row */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Storage Explorer */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Storage Explorer</h3>
                <button className="text-xs text-cyan-400 hover:underline">عرض جميع الملفات</button>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { i: ImageIcon, n: "images/",    c: "2,451 ملف", s: "2.7 TB", color: "text-cyan-400" },
                  { i: Film,      n: "videos/",    c: "842 ملف",   s: "5.8 TB", color: "text-fuchsia-400" },
                  { i: FileText,  n: "documents/", c: "1,245 ملف", s: "1.3 TB", color: "text-emerald-400" },
                  { i: Archive,   n: "backups/",   c: "312 ملف",   s: "2.9 TB", color: "text-yellow-400" },
                  { i: Trash2,    n: "temp/",      c: "124 ملف",   s: "320 GB", color: "text-red-400" },
                ].map(({ i: I, n, c, s, color }) => (
                  <div key={n} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs">
                    <span className="flex items-center gap-2"><I className={`h-4 w-4 ${color}`} /><span className="font-mono text-white/80">{n}</span></span>
                    <span className="text-muted-foreground">{c}</span>
                    <span className="tabular-nums text-white/70">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Command */}
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

            {/* Backup */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Backup Center</h3>
                <button className="text-xs text-cyan-400 hover:underline">عرض جميع النسخ</button>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
                <div className="text-[10px] text-muted-foreground">آخر نسخة احتياطية</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-black">02:30 AM</span>
                  <span className="text-[10px] text-emerald-400">(نجاح)</span>
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">اليوم</div>
              </div>
              <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 hover:opacity-90">
                Backup All Sites
              </button>
              <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs hover:bg-white/10">
                <RefreshCw className="h-3.5 w-3.5" /> Restore
              </button>
            </div>
          </div>

          {/* Fourth row */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_320px]">
            {/* Activities */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">آخر الأنشطة</h3>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { d: "منذ 3 دقائق",  t: "تم إنشاء نسخة احتياطية شاملة للنظام", color: "bg-emerald-400" },
                  { d: "منذ 15 دقيقة", t: "تم تفعيل الموقع الجديد لخدمات (souk-hn.com)", color: "bg-cyan-400" },
                  { d: "منذ 28 دقيقة", t: "تم تسجيل دخول جديد من 192.168.1.101", color: "bg-yellow-400" },
                  { d: "منذ 45 دقيقة", t: "تم إضافة موقع جديد (tech-hn.com)", color: "bg-fuchsia-400" },
                ].map((a) => (
                  <div key={a.t} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-sm ${a.color}`} />
                    <div className="flex-1"><div className="text-white/90">{a.t}</div></div>
                    <div className="text-[10px] text-muted-foreground">{a.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">تنبيهات النظام</h3>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  { d: "منذ 10 دقائق", t: "استخدام التخزين في news-hn.com وصل 85%", color: "text-yellow-400", dot: "bg-yellow-400" },
                  { d: "منذ 25 دقيقة", t: "استهلاك CPU مرتفع في قاعدة بيانات forum-hn.com", color: "text-red-400", dot: "bg-red-400" },
                  { d: "منذ ساعة",    t: "انتهاء صلاحية شهادة SSL لموقع islamiat.net خلال 5 أيام", color: "text-red-400", dot: "bg-red-400" },
                ].map(a => (
                  <div key={a.t} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-sm ${a.dot}`} />
                    <div className={`flex-1 ${a.color}`}>{a.t}</div>
                    <div className="text-[10px] text-muted-foreground">{a.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick access */}
            <div className="rounded-2xl border border-white/10 bg-[oklch(0.16_0.02_275)]/70 p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold">الوصول السريع</h3>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[
                  { i: Globe, l: "جميع المواقع", c: "from-cyan-500 to-blue-600" },
                  { i: Database, l: "قواعد البيانات", c: "from-fuchsia-500 to-purple-600" },
                  { i: CloudUpload, l: "التخزين", c: "from-emerald-500 to-teal-600" },
                  { i: Save, l: "النسخ الاحتياطية", c: "from-yellow-500 to-orange-600" },
                  { i: FileBarChart, l: "التقارير", c: "from-pink-500 to-rose-600" },
                ].map(({ i: I, l, c }) => (
                  <button key={l} className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-2.5 text-[10px] transition hover:bg-white/10">
                    <div className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${c} shadow-lg`}>
                      <I className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/70">{l}</span>
                  </button>
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
