"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, translations, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    ...translations(fd, "question"),
    ...translations(fd, "answer"),
    category: s(fd, "category"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
}

export async function createFaq(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faqs").insert(buildPayload(fd));
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.faqs);
  bustPaths("/[locale]/parents");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faqs").update(buildPayload(fd)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.faqs);
  bustPaths("/[locale]/parents");
  return { ok: true };
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.faqs);
  bustPaths("/[locale]/parents");
  return { ok: true };
}
