import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GalleryForm } from "../../GalleryForm";

export const dynamic = "force-dynamic";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: item } = await supabase.from("gallery_items").select("*").eq("id", id).maybeSingle();
  if (!item) notFound();
  return (
    <div>
      <PageHeader title="Изображение галереи" backHref="/admin/gallery" />
      <GalleryForm item={item} />
    </div>
  );
}
