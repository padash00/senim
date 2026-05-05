"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { s, type ActionResult } from "@/lib/admin/forms";
import { revalidatePath } from "next/cache";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const VALID_STATUSES: ApplicationStatus[] = ["new", "in_progress", "contacted", "scheduled", "closed"];

export async function updateApplication(id: string, _: ActionResult | undefined, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const status = s(fd, "status");
  if (!status || !VALID_STATUSES.includes(status as ApplicationStatus)) {
    return { ok: false, error: "Некорректный статус" };
  }
  const { error } = await supabase
    .from("applications")
    .update({ status, admin_note: s(fd, "admin_note") })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
  return { ok: true };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  return { ok: true };
}
