import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { HomepageSectionForm } from "./HomepageSectionForm";

export const dynamic = "force-dynamic";

export default async function HomepageAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("homepage_sections").select("*").order("sort_order");
  return (
    <div>
      <PageHeader
        title="Главная страница"
        description="Редактирование текстов и порядка блоков на главной"
      />
      <div className="grid gap-8">
        {(data ?? []).map((s) => (
          <HomepageSectionForm key={s.id} section={s} />
        ))}
      </div>
    </div>
  );
}
