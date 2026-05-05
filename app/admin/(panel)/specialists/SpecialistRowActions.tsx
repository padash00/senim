"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteSpecialist } from "./actions";

export function SpecialistRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/specialists/${id}/edit`}
      onDelete={async () => {
        const res = await deleteSpecialist(id);
        if (res.ok) router.refresh();
        return res;
      }}
      confirmText="Удалить специалиста?"
    />
  );
}
