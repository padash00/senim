"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, sr, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    parent_name: sr(fd, "parent_name"),
    rating: n(fd, "rating"),
    text_kk: s(fd, "text_kk"),
    text_ru: s(fd, "text_ru"),
    text_en: s(fd, "text_en"),
    language: (s(fd, "language") ?? "ru") as "kk" | "ru" | "en",
    reviewed_at: s(fd, "reviewed_at"),
    photo_url: s(fd, "photo_url"),
    is_featured: b(fd, "is_featured"),
    is_published: b(fd, "is_published"),
  };
}

export async function createReview(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("reviews").insert(payload);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.reviews);
  bustPaths("/", "/[locale]", "/[locale]/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("reviews").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.reviews);
  bustPaths("/", "/[locale]", "/[locale]/reviews");
  return { ok: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.reviews);
  bustPaths("/", "/[locale]/reviews");
  return { ok: true };
}
