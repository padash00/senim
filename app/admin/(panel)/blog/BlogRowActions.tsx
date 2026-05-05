"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteBlogPost } from "./actions";

export function BlogRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/blog/${id}/edit`}
      onDelete={async () => {
        const res = await deleteBlogPost(id);
        if (res.ok) router.refresh();
        return res;
      }}
      confirmText="Удалить статью?"
    />
  );
}
