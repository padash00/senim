import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "../ServiceForm";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div>
      <PageHeader title="Новая услуга" backHref="/admin/services" />
      <ServiceForm service={null} />
    </div>
  );
}
