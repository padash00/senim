"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  redirect: z.string().optional(),
});

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function signIn(formData: FormData): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirect: formData.get("redirect") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: "Проверьте email и пароль (минимум 6 символов)." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: "Неверный email или пароль." };

  // Sanity-check that this user is actually allowed into /admin.
  const admin = await getCurrentAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "Этот аккаунт не имеет доступа к админке. Обратитесь к администратору.",
    };
  }

  const dest = parsed.data.redirect && parsed.data.redirect.startsWith("/admin") ? parsed.data.redirect : "/admin";
  redirect(dest);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
