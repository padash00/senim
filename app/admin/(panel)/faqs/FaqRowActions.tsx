"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteFaq } from "./actions";

export function FaqRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/faqs/${id}/edit`}
      onDelete={async () => {
        const res = await deleteFaq(id);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
