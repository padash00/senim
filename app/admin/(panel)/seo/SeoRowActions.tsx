"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deletePageSeo } from "./actions";

export function SeoRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/seo/${id}/edit`}
      onDelete={async () => {
        const res = await deletePageSeo(id);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
