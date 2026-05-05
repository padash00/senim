import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Card, CardContent } from "@/components/ui/card";
import { listFaqs } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/parents",
    locale: locale as Locale,
    fallbackTitle: "Для родителей · Сенім",
    fallbackDescription: "На что обратить внимание, как подготовиться к первой встрече и что происходит на консультации.",
  });
}

const SIGNS = {
  kk: [
    "Сөйлеу кешеуілдеуі",
    "Қарым-қатынас қиындықтары",
    "Жиі айқай-шу немесе істерик",
    "Зейіннің төмен болуы",
    "Оқу қиындықтары",
    "Сенсорлық сезімталдық",
    "Қозғалыс қиындықтары",
  ],
  ru: [
    "Задержка речи",
    "Трудности в общении",
    "Частые истерики",
    "Сложности с вниманием",
    "Трудности с обучением",
    "Сенсорная чувствительность",
    "Сложности с движением",
  ],
  en: [
    "Speech delay",
    "Communication difficulties",
    "Frequent meltdowns",
    "Attention difficulties",
    "Learning difficulties",
    "Sensory sensitivity",
    "Movement difficulties",
  ],
};

const PREP = {
  kk: [
    "Балаға не болатынын алдын ала айтыңыз — бірлесіп ойнаймыз, әңгімелесеміз.",
    "Ұнамды зат немесе ойыншық алыңыз.",
    "Сергек уақытты таңдаңыз — толық ұйықтаған және тамақтанған соң.",
    "Бар болса, бұрынғы қорытындылар мен медициналық анықтамаларды алыңыз.",
  ],
  ru: [
    "Заранее расскажите ребёнку, что его ждёт — будем играть и общаться.",
    "Возьмите любимую игрушку или знакомую вещь.",
    "Выберите бодрое время дня — после сна и еды.",
    "Если есть, возьмите предыдущие заключения и медицинские справки.",
  ],
  en: [
    "Tell the child in advance what to expect — playing and talking together.",
    "Bring a favourite or familiar item.",
    "Pick a time when the child is well-rested and fed.",
    "Bring previous specialist reports if you have them.",
  ],
};

const FIRST_VISIT = {
  kk: "Бастапқы консультация — бұл жайбарақат әңгіме. Маман баланы бақылайды, ата-анамен сөйлеседі, мақсаттарды талқылайды. Қорытындысында бағдарламаның жобасы мен ыңғайлы кесте ұсынылады.",
  ru: "Первичная консультация — это спокойная встреча. Специалист наблюдает за ребёнком, общается с родителями, обсуждает цели. По итогам предлагается проект программы и удобный график.",
  en: "The initial consultation is a calm meeting. The specialist observes the child, talks with parents and discusses goals. Afterwards we propose a draft programme and a comfortable schedule.",
};

const DISCLAIMER = {
  kk: "Сайттағы ақпарат танысу мақсатында берілген және дәрігер консультациясын немесе профильді маманның қорытындысын алмастырмайды.",
  ru: "Сайт не заменяет медицинскую диагностику, но помогает родителям понять, куда обратиться за поддержкой.",
  en: "This site does not replace medical diagnosis but helps parents understand where to seek support.",
};

export default async function ParentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const faqs = await listFaqs();

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
          <SectionTitle
            eyebrow={loc === "kk" ? "Ата-аналарға" : loc === "en" ? "For parents" : "Для родителей"}
            title={
              loc === "kk"
                ? "Балаға қолдау қажет екенін қалай түсінуге болады"
                : loc === "en"
                  ? "How to tell whether your child may need support"
                  : "Как понять, что ребёнку может понадобиться поддержка"
            }
            subtitle={
              loc === "kk"
                ? "Бұл белгілер диагноз емес — олар маманмен әңгімелесу үшін бағыт береді."
                : loc === "en"
                  ? "These signs are not a diagnosis — they are a starting point for a conversation with a specialist."
                  : "Это не диагноз, а ориентиры для разговора со специалистом."
            }
          />
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-warning/15 text-warning">
                  <AlertCircle className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-semibold">
                  {loc === "kk" ? "Неге назар аударуға болады" : loc === "en" ? "Signs to look out for" : "На что обратить внимание"}
                </h2>
              </div>
              <ul className="space-y-2.5 text-sm">
                {SIGNS[loc].map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-success/15 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-semibold">
                  {loc === "kk" ? "Бірінші келуге қалай дайындалу керек" : loc === "en" ? "How to prepare for the first visit" : "Как подготовиться к первому визиту"}
                </h2>
              </div>
              <ol className="space-y-2.5 text-sm">
                {PREP[loc].map((p, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-semibold text-primary">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Section bleed="muted">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <SectionTitle
            title={loc === "kk" ? "Бастапқы консультацияда не болады" : loc === "en" ? "What happens at the initial consultation" : "Что происходит на первичной консультации"}
            subtitle={FIRST_VISIT[loc]}
          />
          <Card>
            <CardContent className="p-6 text-sm leading-relaxed text-muted-foreground">
              <p>{DISCLAIMER[loc]}</p>
            </CardContent>
          </Card>
        </Container>
      </Section>

      {faqs.length > 0 && (
        <Section>
          <Container className="max-w-3xl">
            <SectionTitle title={loc === "kk" ? "Жиі қойылатын сұрақтар" : loc === "en" ? "Frequently asked questions" : "Частые вопросы"} />
            <div className="mt-10">
              <FaqAccordion items={faqs} locale={loc} />
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
