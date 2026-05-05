"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteGalleryItem } from "./actions";

export function GalleryRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="rounded-full bg-background/90 backdrop-blur">
      <RowActions
        editHref={`/admin/gallery/${id}/edit`}
        onDelete={async () => {
          const res = await deleteGalleryItem(id);
          if (res.ok) router.refresh();
          return res;
        }}
      />
    </div>
  );
}
