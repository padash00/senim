import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CertificateForm } from "../CertificateForm";

export const dynamic = "force-dynamic";

export default async function NewCertificatePage() {
  const supabase = await createSupabaseServerClient();
  const { data: specialists } = await supabase
    .from("specialists")
    .select("id, full_name_ru, full_name_kk")
    .order("sort_order");
  return (
    <div>
      <PageHeader title="Новый сертификат" backHref="/admin/certificates" />
      <CertificateForm certificate={null} specialists={specialists ?? []} />
    </div>
  );
}
