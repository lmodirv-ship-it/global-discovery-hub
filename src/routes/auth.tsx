import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: fullName } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="gold-text text-3xl font-black text-center">
          {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          للوصول إلى لوحة التحكم HN Studio
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="الاسم الكامل" required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm" />
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني" required autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور" required minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm" />

          {error && <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300">{error}</div>}

          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-50">
            {loading ? "..." : mode === "signin" ? "دخول" : "تسجيل"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>ليس لديك حساب؟{" "}
              <button onClick={() => setMode("signup")} className="text-primary">أنشئ حساباً</button>
            </>
          ) : (
            <>لديك حساب بالفعل؟{" "}
              <button onClick={() => setMode("signin")} className="text-primary">تسجيل الدخول</button>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}
