"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { applicationSchema } from "@/lib/validators/application";

export type SubmitApplicationResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fields?: Record<string, string> };

/**
 * Public-facing application submit.
 *
 * Uses the service-role client because:
 *   - we want server-side spam checks (honeypot, length caps) before any DB hit
 *   - we want to return clean error messages instead of leaking RLS errors
 *   - RLS still allows anon insert, this is just defence-in-depth
 */
export async function submitApplication(formData: FormData): Promise<SubmitApplicationResult> {
  const raw = {
    parent_name: formData.get("parent_name"),
    phone: formData.get("phone"),
    child_age: formData.get("child_age"),
    comment: formData.get("comment"),
    preferred_contact: formData.get("preferred_contact") || undefined,
    preferred_language: formData.get("preferred_language") || undefined,
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    service_id: formData.get("service_id") || undefined,
    specialist_id: formData.get("specialist_id") || undefined,
    source: formData.get("source") || undefined,
    website: formData.get("website") || "",
  };

  const parsed = applicationSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path[0];
      if (typeof path === "string" && !fields[path]) fields[path] = issue.message;
    }
    return { ok: false, error: "form.errors.generic", fields };
  }

  const data = parsed.data;
  if (data.website && data.website.length > 0) {
    // honeypot tripped — silently succeed so bots don't iterate
    return { ok: true, id: "honeypot" };
  }

  const supabase = createSupabaseAdminClient();

  // Dedup / soft rate limit: if the same phone submitted within the last 60s,
  // pretend success without creating a duplicate row. Catches double-clicks,
  // accidental refresh resubmissions, and bots that bypass the honeypot.
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { data: recent } = await supabase
    .from("applications")
    .select("id")
    .eq("phone", data.phone)
    .gte("created_at", oneMinuteAgo)
    .limit(1);
  const dup = recent?.[0];
  if (dup) {
    return { ok: true, id: dup.id };
  }

  const { data: row, error } = await supabase
    .from("applications")
    .insert({
      parent_name: data.parent_name,
      phone: data.phone,
      child_age: data.child_age ?? null,
      comment: data.comment || null,
      preferred_contact: data.preferred_contact ?? null,
      preferred_language: data.preferred_language ?? null,
      consent: true,
      service_id: data.service_id ?? null,
      specialist_id: data.specialist_id ?? null,
      source: data.source ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error("submitApplication failed", error);
    return { ok: false, error: "form.errors.generic" };
  }

  // The dashboard /admin reads applications via a force-dynamic page, so it
  // already sees the new row on next request — no cache to bust here.
  return { ok: true, id: row.id };
}
