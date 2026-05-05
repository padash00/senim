import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SpecialistForm } from "../../SpecialistForm";

export const dynamic = "force-dynamic";

export default async function EditSpecialistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: specialist } = await supabase.from("specialists").select("*").eq("id", id).maybeSingle();
  if (!specialist) notFound();
  return (
    <div>
      <PageHeader title={specialist.full_name_ru || specialist.full_name_kk || "Специалист"} backHref="/admin/specialists" />
      <SpecialistForm specialist={specialist} />
    </div>
  );
}
