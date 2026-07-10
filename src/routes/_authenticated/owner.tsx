import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useMyRoles } from "@/hooks/useRoles";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/owner")({
  component: OwnerPage,
});

const ALL_ROLES = ["owner", "supervisor", "customer", "visitor"] as const;

function OwnerPage() {
  const { user } = useAuth();
  const rolesQ = useMyRoles(user?.id);
  const isOwner = (rolesQ.data ?? []).includes("owner");
  const qc = useQueryClient();
  const [msg, setMsg] = useState<string | null>(null);

  const profilesQ = useQuery({
    queryKey: ["all-profiles"],
    enabled: isOwner,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const allRolesQ = useQuery({
    queryKey: ["all-user-roles"],
    enabled: isOwner,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });

  const grant = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as "owner" });
      if (error) throw error;
    },
    onSuccess: () => { setMsg("تم منح الدور"); qc.invalidateQueries({ queryKey: ["all-user-roles"] }); },
    onError: (e) => setMsg("خطأ: " + (e as Error).message),
  });

  const revoke = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "owner");
      if (error) throw error;
    },
    onSuccess: () => { setMsg("تم سحب الدور"); qc.invalidateQueries({ queryKey: ["all-user-roles"] }); },
    onError: (e) => setMsg("خطأ: " + (e as Error).message),
  });

  if (rolesQ.isLoading) return <Shell><div className="text-center py-20">جاري التحميل...</div></Shell>;
  if (!isOwner) return (
    <Shell>
      <div className="mx-auto max-w-md text-center py-20">
        <h2 className="text-xl font-bold">غير مصرح</h2>
        <p className="mt-2 text-sm text-muted-foreground">هذه الصفحة للمالك فقط.</p>
        <Link to="/dashboard" className="mt-6 inline-block text-primary">← العودة للوحة</Link>
      </div>
    </Shell>
  );

  const rolesByUser = new Map<string, Set<string>>();
  for (const r of allRolesQ.data ?? []) {
    if (!rolesByUser.has(r.user_id)) rolesByUser.set(r.user_id, new Set());
    rolesByUser.get(r.user_id)!.add(r.role);
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link to="/dashboard" className="text-xs text-muted-foreground">← لوحة التحكم</Link>
          <h1 className="mt-2 gold-text text-3xl font-black">إدارة المستخدمين والصلاحيات</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            امنح أو اسحب الأدوار: مالك، مشرف، عميل، زائر. حسابات المالك المحمية لا يمكن حذفها.
          </p>
        </div>

        {msg && <div className="mb-4 rounded-md bg-primary/10 border border-primary/30 p-3 text-sm">{msg}</div>}

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-right">المستخدم</th>
                <th className="px-4 py-3 text-right">البريد</th>
                <th className="px-4 py-3 text-right">الأدوار</th>
                <th className="px-4 py-3 text-right">تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(profilesQ.data ?? []).map((p) => {
                const has = rolesByUser.get(p.id) ?? new Set();
                return (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      {p.full_name ?? "-"}
                      {p.is_protected && <span className="mr-2 rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">محمي</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {[...has].map((r) => (
                          <span key={r} className="rounded bg-white/10 px-2 py-0.5 text-xs">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {ALL_ROLES.map((r) => {
                          const active = has.has(r);
                          const isProtectedOwnerRow = p.is_protected && r === "owner";
                          return (
                            <button key={r}
                              disabled={isProtectedOwnerRow || grant.isPending || revoke.isPending}
                              onClick={() => active ? revoke.mutate({ userId: p.id, role: r }) : grant.mutate({ userId: p.id, role: r })}
                              className={`rounded px-2 py-1 text-xs border transition ${
                                active ? "bg-primary text-primary-foreground border-primary" : "border-white/10 hover:bg-white/10"
                              } ${isProtectedOwnerRow ? "opacity-60 cursor-not-allowed" : ""}`}
                              title={isProtectedOwnerRow ? "لا يمكن سحب دور المالك من حساب محمي" : ""}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar />{children}</div>;
}
