import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Страница не найдена</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Возможно, ссылка устарела или страница была перемещена.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">На главную</Link>
      </Button>
    </Container>
  );
}
