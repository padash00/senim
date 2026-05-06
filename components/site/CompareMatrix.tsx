import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type Props = { locale: Locale };

const COPY: Record<Locale, { intro: string; cols: string[]; rows: { label: string; values: boolean[] }[] }> = {
  kk: {
    intro: "Барлық бағдарламалар үшін ортақ нәрсе:",
    cols: ["Жеке", "Шағын топ", "Бастапқы консультация"],
    rows: [
      { label: "Жеке бағдарлама", values: [true, true, true] },
      { label: "Прогресс мониторингі", values: [true, true, true] },
      { label: "Ата-анамен әңгіме", values: [true, true, true] },
      { label: "Қажетсіз материалдар жоқ", values: [true, true, true] },
    ],
  },
  ru: {
    intro: "Что общего у всех программ:",
    cols: ["Индивид.", "Малая группа", "Первая консультация"],
    rows: [
      { label: "Индивидуальный план", values: [true, true, true] },
      { label: "Мониторинг прогресса", values: [true, true, true] },
      { label: "Разговор с родителями", values: [true, true, true] },
      { label: "Без лишних обещаний", values: [true, true, true] },
    ],
  },
  en: {
    intro: "What every programme shares:",
    cols: ["1-on-1", "Small group", "First consultation"],
    rows: [
      { label: "Individual plan", values: [true, true, true] },
      { label: "Progress tracking", values: [true, true, true] },
      { label: "Parent debriefs", values: [true, true, true] },
      { label: "No empty promises", values: [true, true, true] },
    ],
  },
};

export function CompareMatrix({ locale }: Props) {
  const data = COPY[locale];
  return (
    <div className="overflow-hidden rounded-3xl border border-border/70 bg-card">
      <div className="border-b border-border/70 px-6 py-4">
        <p className="text-sm font-medium text-muted-foreground">{data.intro}</p>
      </div>
      <div className="grid grid-cols-[1.5fr_repeat(3,1fr)] text-sm">
        <div className="bg-secondary/40 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          —
        </div>
        {data.cols.map((c) => (
          <div key={c} className="bg-secondary/40 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {c}
          </div>
        ))}
        {data.rows.map((row) => (
          <RowGroup key={row.label} label={row.label} values={row.values} />
        ))}
      </div>
    </div>
  );
}

function RowGroup({ label, values }: { label: string; values: boolean[] }) {
  return (
    <>
      <div className="border-t border-border/50 px-6 py-3 font-medium">{label}</div>
      {values.map((v, i) => (
        <div key={i} className="flex items-center justify-center border-t border-border/50 px-3 py-3">
          {v ? <Check className="h-4 w-4 text-success" /> : <span className="text-muted-foreground/50">—</span>}
        </div>
      ))}
    </>
  );
}
