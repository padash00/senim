"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { b, bustPaths, bustTags, n, s, sr, translations, type ActionResult } from "@/lib/admin/forms";
import { slugify } from "@/lib/utils";

function buildPayload(fd: FormData) {
  return {
    slug: sr(fd, "slug").toLowerCase(),
    ...translations(fd, "title"),
    ...translations(fd, "short_description"),
    ...translations(fd, "full_description"),
    ...translations(fd, "suitable_for"),
    ...translations(fd, "skills_developed"),
    ...translations(fd, "how_it_works"),
    ...translations(fd, "result"),
    ...translations(fd, "price_note"),
    age_range: s(fd, "age_range"),
    duration_minutes: n(fd, "duration_minutes"),
    price: n(fd, "price"),
    icon: s(fd, "icon"),
    image_url: s(fd, "image_url"),
    is_published: b(fd, "is_published"),
    sort_order: n(fd, "sort_order") ?? 0,
  };
}

export async function createService(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try {
    payload = buildPayload(fd);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (!payload.slug) payload.slug = slugify(s(fd, "title_kk") ?? "service");

  const { error } = await supabase.from("services").insert(payload);
  if (error) return { ok: false, error: error.message };

  bustTags(REVALIDATE_TAGS.services);
  bustPaths("/", "/[locale]/services", "/[locale]");
  redirect("/admin/services");
}

export async function updateService(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  let payload;
  try {
    payload = buildPayload(fd);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.services);
  bustPaths("/", "/[locale]/services", `/[locale]/services/${payload.slug}`);
  return { ok: true };
}

export async function deleteService(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustTags(REVALIDATE_TAGS.services);
  bustPaths("/", "/[locale]/services");
  return { ok: true };
}
