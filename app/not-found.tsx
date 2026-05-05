import Link from "next/link";

export default function RootNotFound() {
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
          <p style={{ letterSpacing: ".2em", fontSize: 12, color: "hsl(215, 16%, 45%)" }}>404</p>
          <h1 style={{ marginTop: 8, fontSize: 32, fontWeight: 700 }}>Страница не найдена</h1>
          <p style={{ marginTop: 12, color: "hsl(215, 16%, 45%)" }}>
            Возможно, ссылка устарела.
          </p>
          <Link
            href="/kk"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 999,
              background: "hsl(212, 60%, 45%)",
              color: "white",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            На главную
          </Link>
        </main>
      </body>
    </html>
  );
}
