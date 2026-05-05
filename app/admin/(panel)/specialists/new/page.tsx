import { PageHeader } from "@/components/admin/PageHeader";
import { SpecialistForm } from "../SpecialistForm";

export const dynamic = "force-dynamic";

export default function NewSpecialistPage() {
  return (
    <div>
      <PageHeader title="Новый специалист" backHref="/admin/specialists" />
      <SpecialistForm specialist={null} />
    </div>
  );
}
