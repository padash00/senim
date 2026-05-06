import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Props = { locale: Locale; className?: string };

const DAY: Record<Locale, { time: string; label: string; sub: string }[]> = {
  kk: [
    { time: "09:00", label: "Қарсы алу", sub: "Жайбарақат бөлмеде сәлемдесу, балаға бейімделу" },
    { time: "09:15", label: "Бастапқы әңгіме", sub: "Маманмен танысу, бүгінгі тапсырмалар" },
    { time: "09:30", label: "Жеке сабақ", sub: "Сөйлеу / зейін / қозғалыс" },
    { time: "10:15", label: "Сенсорлық үзіліс", sub: "Тыныш бөлме, тыныс алу, өзін-өзі реттеу" },
    { time: "10:45", label: "Топтық ойын", sub: "Қарым-қатынас және ынтымақтастық" },
    { time: "11:30", label: "Ата-анамен әңгіме", sub: "Бүгінгі прогресс және үйде не істеуге болады" },
  ],
  ru: [
    { time: "09:00", label: "Встреча", sub: "Спокойное приветствие, ребёнок осваивается" },
    { time: "09:15", label: "Краткий разговор", sub: "Знакомство со специалистом, план дня" },
    { time: "09:30", label: "Индивидуальное занятие", sub: "Речь / внимание / движение" },
    { time: "10:15", label: "Сенсорная пауза", sub: "Тихая комната, дыхание, саморегуляция" },
    { time: "10:45", label: "Групповая игра", sub: "Общение и сотрудничество" },
    { time: "11:30", label: "Разговор с родителями", sub: "Прогресс дня и что попробовать дома" },
  ],
  en: [
    { time: "09:00", label: "Welcome", sub: "Quiet greeting; the child settles in" },
    { time: "09:15", label: "Brief check-in", sub: "Meeting the specialist, plan for the day" },
    { time: "09:30", label: "One-to-one session", sub: "Speech / attention / movement" },
    { time: "10:15", label: "Sensory break", sub: "Quiet room, breathing, self-regulation" },
    { time: "10:45", label: "Small-group play", sub: "Connection and cooperation" },
    { time: "11:30", label: "Parent debrief", sub: "Today's progress, what to try at home" },
  ],
};

export function DayTimeline({ locale, className }: Props) {
  return (
    <ol className={cn("relative space-y-2 border-l border-dashed border-border/80 pl-8", className)}>
      {DAY[locale].map((step, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[2.4rem] top-3 inline-flex h-9 w-12 items-center justify-center rounded-full bg-card font-mono text-[10px] font-semibold text-primary border border-border/70">
            {step.time}
          </span>
          <div className="rounded-2xl bg-card px-5 py-4 shadow-soft lift">
            <p className="font-display text-base font-semibold leading-tight">{step.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.sub}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
