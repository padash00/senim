import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SeoForm } from "../../SeoForm";

export const dynamic = "force-dynamic";

export default async function EditSeoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase.from("pages_seo").select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  return (
    <div>
      <PageHeader title={row.path} backHref="/admin/seo" />
      <SeoForm row={row} />
    </div>
  );
}
