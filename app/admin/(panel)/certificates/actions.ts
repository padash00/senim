"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, translations, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    ...translations(fd, "title"),
    ...translations(fd, "description"),
    image_url: s(fd, "image_url"),
    pdf_url: s(fd, "pdf_url"),
    issued_at: s(fd, "issued_at"),
    specialist_id: s(fd, "specialist_id"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
}

export async function createCertificate(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("certificates").insert(buildPayload(fd));
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.certificates);
  bustPaths("/[locale]/about");
  redirect("/admin/certificates");
}

export async function updateCertificate(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("certificates").update(buildPayload(fd)).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.certificates);
  bustPaths("/[locale]/about");
  return { ok: true };
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.certificates);
  bustPaths("/[locale]/about");
  return { ok: true };
}
