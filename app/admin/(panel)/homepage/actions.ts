"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, translations, type ActionResult } from "@/lib/admin/forms";

export async function updateHomepageSection(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const payload = {
    ...translations(fd, "title"),
    ...translations(fd, "subtitle"),
    ...translations(fd, "body"),
    ...translations(fd, "cta_label"),
    cta_href: s(fd, "cta_href"),
    image_url: s(fd, "image_url"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
  const { error } = await supabase.from("homepage_sections").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.homepage);
  bustPaths("/", "/[locale]");
  return { ok: true };
}
