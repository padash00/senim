"use client";

import { useEffect } from "react";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Что-то пошло не так</h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        Мы записали ошибку и уже разбираемся. Попробуйте обновить страницу.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Попробовать снова</Button>
      </div>
      {error.digest && <p className="mt-6 text-xs text-muted-foreground">Code: {error.digest}</p>}
    </Container>
  );
}
