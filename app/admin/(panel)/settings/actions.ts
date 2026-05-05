"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { REVALIDATE_TAGS } from "@/lib/constants";
import { bustPaths, bustTags, s, translations, type ActionResult } from "@/lib/admin/forms";

export async function updateSiteSettings(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const id = s(fd, "id");
  const payload = {
    site_name: s(fd, "site_name") ?? "Сенім",
    default_locale: (s(fd, "default_locale") ?? "kk") as "kk" | "ru" | "en",
    ...translations(fd, "seo_title"),
    ...translations(fd, "seo_description"),
  };

  const q = id
    ? supabase.from("site_settings").update(payload).eq("id", id)
    : supabase.from("site_settings").insert(payload);

  const { error } = await q;
  if (error) return { ok: false, error: error.message };

  bustTags(REVALIDATE_TAGS.settings);
  bustPaths("/", "/[locale]");
  return { ok: true };
}

export async function updateContacts(_: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const id = s(fd, "id");

  const buildHours = () => {
    const v: Record<string, string | null> = {};
    for (const day of ["mon_fri", "sat", "sun"] as const) {
      for (const loc of ["kk", "ru", "en"] as const) {
        v[`${day}_${loc}`] = s(fd, `wh_${day}_${loc}`);
      }
    }
    return v;
  };

  const payload = {
    phone: s(fd, "phone"),
    whatsapp: s(fd, "whatsapp"),
    email: s(fd, "email"),
    instagram: s(fd, "instagram"),
    ...translations(fd, "address"),
    working_hours: buildHours(),
    map_iframe: s(fd, "map_iframe"),
  };

  const q = id
    ? supabase.from("contacts").update(payload).eq("id", id)
    : supabase.from("contacts").insert(payload);

  const { error } = await q;
  if (error) return { ok: false, error: error.message };

  bustTags(REVALIDATE_TAGS.contacts);
  bustPaths("/", "/[locale]", "/[locale]/contacts");
  return { ok: true };
}

// Used by various forms that just toggle is_published or sort order without
// changing other fields.
export async function togglePublished(table: string, id: string, value: boolean): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table as never).update({ is_published: value }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
