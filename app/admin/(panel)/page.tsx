import Link from "next/link";
import { Briefcase, Inbox, Star, Users2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createSupabaseServerClient();
  const [apps, services, specialists, reviews, recentApps] = await Promise.all([
    supabase.from("applications").select("id, status", { count: "exact", head: false }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("specialists").select("id", { count: "exact", head: true }),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("id, parent_name, phone, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const newCount = (apps.data ?? []).filter((a) => a.status === "new").length;
  return {
    applicationsTotal: apps.count ?? 0,
    applicationsNew: newCount,
    servicesTotal: services.count ?? 0,
    specialistsTotal: specialists.count ?? 0,
    reviewsTotal: reviews.count ?? 0,
    recent: recentApps.data ?? [],
  };
}

export default async function AdminDashboard() {
  const s = await getStats();

  return (
    <div>
      <PageHeader title="Дашборд" description="Сводка по сайту и недавняя активность" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Inbox} label="Заявок всего" value={s.applicationsTotal} hint={`${s.applicationsNew} новых`} accent={s.applicationsNew > 0} />
        <Stat icon={Briefcase} label="Услуги" value={s.servicesTotal} />
        <Stat icon={Users2} label="Специалисты" value={s.specialistsTotal} />
        <Stat icon={Star} label="Отзывы" value={s.reviewsTotal} />
      </div>

      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Недавние заявки</h2>
            <Link href="/admin/applications" className="text-sm text-primary hover:underline">
              Все заявки →
            </Link>
          </div>
          {s.recent.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Заявок пока нет.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border/70">
              {s.recent.map((app) => (
                <li key={app.id}>
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 hover:bg-secondary/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{app.parent_name}</p>
                      <p className="text-xs text-muted-foreground">{app.phone}</p>
                    </div>
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <QuickAction href="/admin/services/new" title="Добавить услугу" />
        <QuickAction href="/admin/specialists/new" title="Добавить специалиста" />
        <QuickAction href="/admin/blog/new" title="Новая статья" />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
          {hint && (
            <div className="mt-2">
              {accent ? <Badge variant="warning">{hint}</Badge> : <Badge variant="muted">{hint}</Badge>}
            </div>
          )}
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function QuickAction({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary-soft/30"
    >
      {title}
    </Link>
  );
}
