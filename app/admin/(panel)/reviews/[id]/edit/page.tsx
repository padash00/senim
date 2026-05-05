import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewForm } from "../../ReviewForm";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: review } = await supabase.from("reviews").select("*").eq("id", id).maybeSingle();
  if (!review) notFound();
  return (
    <div>
      <PageHeader title={review.parent_name} backHref="/admin/reviews" />
      <ReviewForm review={review} />
    </div>
  );
}
