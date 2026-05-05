"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { arr, b, bustPaths, bustTags, n, s, translations, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    ...translations(fd, "full_name"),
    ...translations(fd, "position"),
    ...translations(fd, "bio"),
    ...translations(fd, "education"),
    ...translations(fd, "languages"),
    photo_url: s(fd, "photo_url"),
    experience_years: n(fd, "experience_years"),
    directions: arr(fd, "directions"),
    certificates: arr(fd, "certificates"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
}

export async function createSpecialist(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("specialists").insert(buildPayload(fd));
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.specialists);
  bustPaths("/", "/[locale]", "/[locale]/specialists");
  redirect("/admin/specialists");
}

export async function updateSpecialist(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("specialists").update(buildPayload(fd)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.specialists);
  bustPaths("/", "/[locale]", "/[locale]/specialists");
  return { ok: true };
}

export async function deleteSpecialist(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("specialists").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.specialists);
  bustPaths("/", "/[locale]/specialists");
  return { ok: true };
}
