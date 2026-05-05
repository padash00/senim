import { ImageResponse } from "next/og";

export const alt = "Сенім — коррекционно-развивающий центр в Шымкенте";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, hsl(36, 38%, 97%) 0%, hsl(212, 70%, 94%) 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "hsl(212, 60%, 45%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            С
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: "hsl(215, 28%, 17%)" }}>
            Сенім · Шымкент
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              color: "hsl(215, 28%, 17%)",
              maxWidth: 980,
            }}
          >
            Коррекционно-развивающий центр для детей и подростков
          </div>
          <div style={{ fontSize: 28, color: "hsl(215, 16%, 45%)", maxWidth: 900 }}>
            Развиваем речь, коммуникацию, внимание и самостоятельность в спокойной среде.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            fontSize: 22,
            color: "hsl(215, 28%, 17%)",
          }}
        >
          <span style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "hsl(212, 60%, 45%)", color: "white" }}>
            Оставить заявку
          </span>
          <span style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "white", border: "1px solid hsl(215, 16%, 90%)" }}>
            WhatsApp
          </span>
        </div>
      </div>
    ),
    size,
  );
}
