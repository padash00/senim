import { PageHeader } from "@/components/admin/PageHeader";
import { FaqForm } from "../FaqForm";

export const dynamic = "force-dynamic";

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader title="Новый вопрос" backHref="/admin/faqs" />
      <FaqForm faq={null} />
    </div>
  );
}
