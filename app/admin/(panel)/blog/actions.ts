"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, s, sr, translations, type ActionResult } from "@/lib/admin/forms";
import { slugify } from "@/lib/utils";

function buildPayload(fd: FormData) {
  const payload = {
    slug: sr(fd, "slug").toLowerCase(),
    ...translations(fd, "title"),
    ...translations(fd, "excerpt"),
    ...translations(fd, "body"),
    cover_url: s(fd, "cover_url"),
    ...translations(fd, "seo_title"),
    ...translations(fd, "seo_description"),
    is_published: b(fd, "is_published"),
    published_at: s(fd, "published_at"),
  };
  if (payload.is_published && !payload.published_at) {
    payload.published_at = new Date().toISOString();
  }
  return payload;
}

export async function createBlogPost(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  if (!payload.slug) {
    payload.slug = slugify(s(fd, "title_kk") ?? s(fd, "title_ru") ?? "post");
  }
  const { error } = await supabase.from("blog_posts").insert(payload);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.blog);
  bustPaths("/[locale]/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try { payload = buildPayload(fd); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.blog);
  bustPaths("/[locale]/blog", `/[locale]/blog/${payload.slug}`);
  return { ok: true };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.blog);
  bustPaths("/[locale]/blog");
  return { ok: true };
}
