"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteService } from "./actions";

export function ServiceRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/services/${id}/edit`}
      onDelete={async () => {
        const res = await deleteService(id);
        if (res.ok) router.refresh();
        return res;
      }}
      confirmText="Удалить услугу? Это действие необратимо."
    />
  );
}
