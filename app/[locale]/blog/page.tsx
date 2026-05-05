import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { listBlogPosts } from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/blog",
    locale: locale as Locale,
    fallbackTitle: "Полезные материалы · Сенім",
  });
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const posts = await listBlogPosts();

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
          <SectionTitle
            eyebrow="Блог"
            title={loc === "kk" ? "Пайдалы материалдар" : loc === "en" ? "Resources" : "Полезные материалы"}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          {posts.length === 0 ? (
            <p className="text-muted-foreground">Статьи появятся здесь.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => {
                const title = tField(p, "title", loc);
                const excerpt = tField(p, "excerpt", loc);
                return (
                  <Link
                    key={p.id}
                    /* @ts-expect-error typed-routes */
                    href={`/blog/${p.slug}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                  >
                    <Card className="h-full overflow-hidden">
                      {p.cover_url && (
                        <div className="relative aspect-[16/10] bg-secondary">
                          <Image
                            src={p.cover_url}
                            alt={title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="space-y-2 p-6">
                        <h2 className="font-display text-lg font-semibold leading-snug">{title}</h2>
                        {excerpt && <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{excerpt}</p>}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
