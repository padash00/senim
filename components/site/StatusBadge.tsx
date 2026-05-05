import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const VARIANTS: Record<ApplicationStatus, { variant: "default" | "warning" | "secondary" | "success" | "muted"; label: string }> = {
  new:         { variant: "warning",   label: "Новая" },
  in_progress: { variant: "default",   label: "В обработке" },
  contacted:   { variant: "secondary", label: "Связались" },
  scheduled:   { variant: "success",   label: "Записан" },
  closed:      { variant: "muted",     label: "Закрыта" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const v = VARIANTS[status];
  return <Badge variant={v.variant}>{v.label}</Badge>;
}
