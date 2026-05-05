import { PageHeader } from "@/components/admin/PageHeader";
import { GalleryForm } from "../GalleryForm";

export const dynamic = "force-dynamic";

export default function NewGalleryPage() {
  return (
    <div>
      <PageHeader title="Новая фотография" backHref="/admin/gallery" />
      <GalleryForm item={null} />
    </div>
  );
}
