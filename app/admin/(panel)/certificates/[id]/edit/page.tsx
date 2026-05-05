import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CertificateForm } from "../../CertificateForm";

export const dynamic = "force-dynamic";

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: certificate }, { data: specialists }] = await Promise.all([
    supabase.from("certificates").select("*").eq("id", id).maybeSingle(),
    supabase.from("specialists").select("id, full_name_ru, full_name_kk").order("sort_order"),
  ]);
  if (!certificate) notFound();
  return (
    <div>
      <PageHeader title={certificate.title_ru || certificate.title_kk || "Сертификат"} backHref="/admin/certificates" />
      <CertificateForm certificate={certificate} specialists={specialists ?? []} />
    </div>
  );
}
