import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Icon() {
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
          fontSize: 22,
          fontFamily: "system-ui",
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        С
      </div>
    ),
    size,
  );
}
