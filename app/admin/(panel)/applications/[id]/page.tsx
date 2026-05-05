import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ApplicationEditForm } from "./ApplicationEditForm";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: app } = await supabase
    .from("applications")
    .select("*, services(slug, title_ru, title_kk), specialists(full_name_ru, full_name_kk)")
    .eq("id", id)
    .maybeSingle();
  if (!app) notFound();

  const waMessage = `Здравствуйте, ${app.parent_name}! Это центр Сенім. Получили вашу заявку.`;

  return (
    <div>
      <PageHeader
        title={app.parent_name}
        description={`Заявка от ${new Date(app.created_at).toLocaleString("ru-RU")}`}
        backHref="/admin/applications"
        actions={<StatusBadge status={app.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <Row label="Телефон">
              <div className="flex flex-wrap items-center gap-2">
                <a href={formatPhoneHref(app.phone)} className="font-mono text-base hover:text-primary">{app.phone}</a>
                <Button asChild size="sm" variant="outline">
                  <a href={formatPhoneHref(app.phone)}><Phone className="h-3.5 w-3.5" />Позвонить</a>
                </Button>
                <Button asChild size="sm" variant="success">
                  <a href={formatWhatsAppHref(app.phone, waMessage)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-3.5 w-3.5" />WhatsApp
                  </a>
                </Button>
              </div>
            </Row>
            <Row label="Возраст ребёнка">{app.child_age ?? "—"}</Row>
            <Row label="Удобный канал связи">{app.preferred_contact ?? "—"}</Row>
            <Row label="Язык общения">{app.preferred_language ?? "—"}</Row>
            <Row label="Источник">{app.source ?? "—"}</Row>
            {app.services && (
              <Row label="Услуга">
                {(app.services as { title_ru?: string; title_kk?: string; slug?: string }).title_ru ??
                  (app.services as { title_kk?: string }).title_kk}
              </Row>
            )}
            {app.specialists && (
              <Row label="Специалист">
                {(app.specialists as { full_name_ru?: string; full_name_kk?: string }).full_name_ru ??
                  (app.specialists as { full_name_kk?: string }).full_name_kk}
              </Row>
            )}
            {app.comment && (
              <Row label="Комментарий">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{app.comment}</p>
              </Row>
            )}
          </CardContent>
        </Card>

        <ApplicationEditForm id={app.id} status={app.status} adminNote={app.admin_note} />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
