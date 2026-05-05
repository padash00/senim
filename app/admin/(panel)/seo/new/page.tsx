import { PageHeader } from "@/components/admin/PageHeader";
import { SeoForm } from "../SeoForm";

export const dynamic = "force-dynamic";

export default function NewSeoPage() {
  return (
    <div>
      <PageHeader title="Новая SEO-настройка" backHref="/admin/seo" />
      <SeoForm row={null} />
    </div>
  );
}
