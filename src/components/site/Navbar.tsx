import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, loading } = useAuth();
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-black shadow-lg shadow-primary/20">
            HN
          </div>
          <span className="font-display text-lg font-bold tracking-tight">HN Studio</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition-colors">الرئيسية</Link>
          <Link to="/projects" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition-colors">المشاريع</Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition-colors">من نحن</Link>
          <Link to="/hub" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition-colors">المركز</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="text-muted-foreground hover:text-foreground transition-colors">تواصل</Link>
        </div>
        {loading ? (
          <div className="h-9 w-24 rounded-full bg-white/5 animate-pulse" />
        ) : user ? (
          <Link to="/dashboard" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition">
            حسابي
          </Link>
        ) : (
          <Link to="/auth" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition">
            دخول
          </Link>
        )}
      </nav>
    </header>
  );
}
