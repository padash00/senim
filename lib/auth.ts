import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serverEnv } from "@/lib/env";

export type AdminUser = {
  id: string;
  email: string;
  role: "admin" | "editor";
};

/**
 * Returns the signed-in admin or null. An "admin" is a Supabase Auth user
 * that either has a matching row in admin_profiles OR is whitelisted via
 * ADMIN_ALLOWED_EMAILS (useful before you create the admin_profiles row).
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, email, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile) {
    return { id: profile.user_id, email: profile.email ?? user.email, role: profile.role };
  }

  const allowed = serverEnv().ADMIN_ALLOWED_EMAILS;
  if (allowed.includes(user.email.toLowerCase())) {
    return { id: user.id, email: user.email, role: "admin" };
  }

  return null;
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
