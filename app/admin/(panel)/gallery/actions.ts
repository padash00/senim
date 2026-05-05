"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, sr, translations, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    image_url: sr(fd, "image_url"),
    ...translations(fd, "caption"),
    category: s(fd, "category"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
}

export async function createGalleryItem(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("gallery_items").insert(payload);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.gallery);
  bustPaths("/[locale]/about");
  redirect("/admin/gallery");
}

export async function updateGalleryItem(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("gallery_items").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.gallery);
  bustPaths("/[locale]/about");
  return { ok: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.gallery);
  bustPaths("/[locale]/about");
  return { ok: true };
}
