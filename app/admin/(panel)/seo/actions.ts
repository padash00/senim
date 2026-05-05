"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { arr, bustPaths, bustTags, s, sr, translations, type ActionResult } from "@/lib/admin/forms";

function buildPayload(fd: FormData) {
  return {
    path: sr(fd, "path"),
    ...translations(fd, "meta_title"),
    ...translations(fd, "meta_description"),
    og_image_url: s(fd, "og_image_url"),
    canonical_url: s(fd, "canonical_url"),
    keywords: arr(fd, "keywords"),
  };
}

export async function createPageSeo(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("pages_seo").insert(payload);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.pagesSeo);
  bustPaths("/", payload.path);
  redirect("/admin/seo");
}

export async function updatePageSeo(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("pages_seo").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.pagesSeo);
  bustPaths("/", payload.path);
  return { ok: true };
}

export async function deletePageSeo(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("pages_seo").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.pagesSeo);
  return { ok: true };
}
