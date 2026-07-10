import { createFileRoute } from "@tanstack/react-router";

const OWNERS = [
  { email: "lmodirv@gmail.com", password: "Hiba@1982nn+", full_name: "المالك الأول" },
  { email: "info@hnchat.net", password: "Hiba@1982nn", full_name: "المالك الثاني" },
];

export const Route = createFileRoute("/api/public/bootstrap-owners")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const results: Array<{ email: string; status: string }> = [];
        for (const o of OWNERS) {
          const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
          const found = existing.users.find((u) => (u.email ?? "").toLowerCase() === o.email.toLowerCase());
          if (found) {
            // reset password to ensure known credentials
            await supabaseAdmin.auth.admin.updateUserById(found.id, {
              password: o.password,
              email_confirm: true,
            });
            results.push({ email: o.email, status: "updated" });
          } else {
            const { error } = await supabaseAdmin.auth.admin.createUser({
              email: o.email,
              password: o.password,
              email_confirm: true,
              user_metadata: { full_name: o.full_name },
            });
            results.push({ email: o.email, status: error ? `error: ${error.message}` : "created" });
          }
        }
        return Response.json({ ok: true, results });
      },
    },
  },
});
