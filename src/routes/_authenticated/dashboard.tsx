import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useMyRoles, highestRole } from "@/hooks/useRoles";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const rolesQ = useMyRoles(user?.id);
  const profileQ = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const role = highestRole(rolesQ.data ?? []);

  useEffect(() => { /* no auto redirect; show role-specific area */ }, [role]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const label: Record<string, string> = {
    owner: "المالك", supervisor: "المشرف", customer: "العميل", visitor: "الزائر",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">مرحباً بك</div>
            <h1 className="gold-text text-3xl font-black">{profileQ.data?.full_name ?? user?.email}</h1>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
              دورك الحالي: <span className="font-bold text-primary">{label[role]}</span>
              {profileQ.data?.is_protected && <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">محمي</span>}
            </div>
          </div>
          <button onClick={signOut} className="rounded-full border border-white/10 px-4 py-2 text-sm hover:bg-white/5">
            تسجيل الخروج
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {role === "owner" && (
            <>
              <DashCard to="/owner" title="إدارة المستخدمين" desc="منح الأدوار والصلاحيات لكل مستخدم" />
              <DashCard to="/hub" title="مركز التحكم" desc="مؤشرات المواقع والخوادم والنسخ الاحتياطية" />
              <DashCard to="/sites" title="المواقع" desc="إدارة كل مواقع HN" />
            </>
          )}
          {role === "supervisor" && (
            <>
              <DashCard to="/hub" title="لوحة الإشراف" desc="مراقبة النظام وأداء المواقع" />
              <DashCard to="/sites" title="المواقع" desc="مراجعة حالة المواقع" />
            </>
          )}
          {role === "customer" && (
            <>
              <DashCard to="/sites" title="مواقعي" desc="حالة مواقعك والنسخ الاحتياطية" />
              <DashCard to="/contact" title="الدعم" desc="تواصل مع فريق HN" />
            </>
          )}
          {role === "visitor" && (
            <>
              <DashCard to="/projects" title="استكشف الأعمال" desc="اطلع على معرض HN" />
              <DashCard to="/contact" title="اطلب خدمة" desc="ابدأ مشروعك معنا" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DashCard({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-primary/40 hover:bg-white/10">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 text-xs text-primary">فتح ←</div>
    </Link>
  );
}
