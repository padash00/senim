"use client";

import { useRouter } from "next/navigation";
import { RowActions } from "@/components/admin/RowActions";
import { deleteCertificate } from "./actions";

export function CertificateRowActions({ id }: { id: string }) {
  const router = useRouter();
  return (
    <RowActions
      editHref={`/admin/certificates/${id}/edit`}
      onDelete={async () => {
        const res = await deleteCertificate(id);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
