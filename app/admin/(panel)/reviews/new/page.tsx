import { PageHeader } from "@/components/admin/PageHeader";
import { ReviewForm } from "../ReviewForm";

export const dynamic = "force-dynamic";

export default function NewReviewPage() {
  return (
    <div>
      <PageHeader title="Новый отзыв" backHref="/admin/reviews" />
      <ReviewForm review={null} />
    </div>
  );
}
