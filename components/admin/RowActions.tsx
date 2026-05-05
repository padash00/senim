"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  editHref?: string;
  onDelete?: () => Promise<{ ok: boolean; error?: string } | void>;
  confirmText?: string;
};

export function RowActions({ editHref, onDelete, confirmText = "Удалить запись?" }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!onDelete) return;
    if (!confirm(confirmText)) return;
    startTransition(async () => {
      const res = await onDelete();
      if (res && "ok" in res && !res.ok) {
        toast.error(res.error || "Не удалось удалить");
      } else {
        toast.success("Удалено");
      }
    });
  }

  return (
    <div className="flex justify-end gap-1">
      {editHref && (
        <Button asChild variant="ghost" size="icon" aria-label="Редактировать">
          <Link href={editHref}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
          aria-label="Удалить"
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
