import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="relative overflow-hidden">
      {/* Soft mesh background that mirrors the home hero so the page still feels "ours" */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mesh-bg opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -right-24 top-12 -z-10 h-72 w-72 bg-accent/40 blur-3xl morph-soft" />
      <div aria-hidden className="pointer-events-none absolute -left-20 bottom-12 -z-10 h-64 w-64 bg-primary-soft/60 blur-3xl morph-soft" style={{ animationDelay: "-3s" }} />

      <Container className="grid min-h-[80vh] place-items-center py-24">
        <div className="max-w-2xl text-center reveal">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>

          <h1 className="mt-4 font-display text-[3rem] font-semibold leading-[1.05] tracking-tight md:text-[5rem]">
            <span className="block font-light text-muted-foreground/60">Эта страница</span>
            <span className="block text-gradient">убежала играть.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Но мы тут — рядом. Возвращайтесь на главную или напишите нам напрямую.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contacts">Написать нам</Link>
            </Button>
          </div>

          {/* Tiny floating dots — matches the home page decorative language */}
          <span aria-hidden className="absolute left-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-primary/40 float-soft" />
          <span aria-hidden className="absolute right-[14%] top-[36%] h-2 w-2 rotate-45 bg-accent-foreground/30 float-soft" style={{ animationDelay: "-2s" }} />
          <span aria-hidden className="absolute left-[22%] bottom-[20%] h-1 w-1 rounded-full bg-success/60 float-soft" style={{ animationDelay: "-4s" }} />
        </div>
      </Container>
    </main>
  );
}
