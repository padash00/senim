import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SiteSettingsForm, ContactsForm } from "./SettingsForms";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: settings }, { data: contacts }] = await Promise.all([
    supabase.from("site_settings").select("*").maybeSingle(),
    supabase.from("contacts").select("*").maybeSingle(),
  ]);

  return (
    <div>
      <PageHeader
        title="Настройки"
        description="Глобальные параметры сайта и контактные данные центра"
      />
      <div className="grid gap-8">
        <SiteSettingsForm settings={settings} />
        <ContactsForm contacts={contacts} />
      </div>
    </div>
  );
}
