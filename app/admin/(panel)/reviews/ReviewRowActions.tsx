"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteReview } from "./actions";

export function ReviewRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/reviews/${id}/edit`}
      onDelete={async () => {
        const res = await deleteReview(id);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
