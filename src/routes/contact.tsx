import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Globe } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل — HN Studio" },
      { name: "description", content: "تواصل مع فريق HN Group لبدء مشروعك القادم." },
      { property: "og:title", content: "تواصل — HN Studio" },
      { property: "og:description", content: "تواصل مع HN Group." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-24">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-black md:text-7xl">
          لنبنِ شيئاً <span className="gold-text">معاً</span>.
        </motion.h1>
        <p className="mt-6 text-lg text-muted-foreground">
          سواء كنت تبحث عن شريك تقني أو ترغب في زيارة أحد مواقعنا، نحن هنا.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <a href="mailto:contact@hn-groupe.net" className="glass group flex items-center gap-4 rounded-2xl p-6 transition hover:border-primary/40">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
              <div className="font-display font-bold" dir="ltr">contact@hn-groupe.net</div>
            </div>
          </a>
          <a href="https://hn-groupe.net" target="_blank" rel="noopener noreferrer" className="glass group flex items-center gap-4 rounded-2xl p-6 transition hover:border-primary/40">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">الموقع الرئيسي</div>
              <div className="font-display font-bold" dir="ltr">hn-groupe.net</div>
            </div>
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
