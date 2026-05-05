import { Badge } from "@/components/ui/badge";

export function PublishedBadge({ value }: { value: boolean }) {
  return value ? <Badge variant="success">Опубликовано</Badge> : <Badge variant="muted">Скрыто</Badge>;
}
