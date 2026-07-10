import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"] extends { app_role: infer R } ? R : "owner" | "supervisor" | "customer" | "visitor";

export function useMyRoles(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["my-roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as string);
    },
  });
}

export function highestRole(roles: string[]): "owner" | "supervisor" | "customer" | "visitor" {
  if (roles.includes("owner")) return "owner";
  if (roles.includes("supervisor")) return "supervisor";
  if (roles.includes("customer")) return "customer";
  return "visitor";
}
