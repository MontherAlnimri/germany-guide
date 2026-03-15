import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 48, display: "flex" }}>{"🇩🇪"}</div>
        <div
          style={{
            color: "white",
            fontSize: 32,
            fontWeight: 900,
            fontFamily: "sans-serif",
            display: "flex",
          }}
        >
          GG
        </div>
      </div>
    ),
    { ...size }
  );
}