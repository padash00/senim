import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FaqForm } from "../../FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: faq } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();
  if (!faq) notFound();
  return (
    <div>
      <PageHeader title={faq.question_ru || faq.question_kk || "Вопрос"} backHref="/admin/faqs" />
      <FaqForm faq={faq} />
    </div>
  );
}
