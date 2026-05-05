import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(212, 60%, 45%)",
          color: "white",
          fontSize: 110,
          fontFamily: "system-ui",
          fontWeight: 700,
          borderRadius: 36,
        }}
      >
        С
      </div>
    ),
    size,
  );
}
