"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="kk">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "hsl(36, 38%, 97%)",
          color: "hsl(215, 28%, 17%)",
        }}
      >
        <main style={{ textAlign: "center", padding: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Что-то пошло не так</h1>
          <p style={{ marginTop: 12, color: "hsl(215, 16%, 45%)" }}>Мы уже разбираемся.</p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 999,
              background: "hsl(212, 60%, 45%)",
              color: "white",
              border: 0,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Перезагрузить
          </button>
          {error.digest && (
            <p style={{ marginTop: 16, fontSize: 12, color: "hsl(215, 16%, 60%)" }}>Code: {error.digest}</p>
          )}
        </main>
      </body>
    </html>
  );
}
