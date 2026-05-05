import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value).replace(/"/g, '""');
  return /[",\n;]/.test(str) ? `"${str}"` : str;
}

export async function GET() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("applications")
    .select(
      "created_at, parent_name, phone, child_age, preferred_contact, preferred_language, status, source, comment, admin_note",
    )
    .order("created_at", { ascending: false });

  const header = [
    "created_at", "parent_name", "phone", "child_age", "preferred_contact",
    "preferred_language", "status", "source", "comment", "admin_note",
  ];
  const rows = (data ?? []).map((r) => header.map((h) => csvCell((r as Record<string, unknown>)[h])).join(","));
  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="senim-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
