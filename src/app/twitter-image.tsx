import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Germany Guide - Navigate German Bureaucracy with Confidence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* German flag stripe at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, background: "#000000", display: "flex" }} />
          <div style={{ flex: 1, background: "#DD0000", display: "flex" }} />
          <div style={{ flex: 1, background: "#FFCC00", display: "flex" }} />
        </div>

        <div style={{ fontSize: 72, marginBottom: 16, display: "flex" }}>
          {"🇩🇪"}
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 12,
            display: "flex",
          }}
        >
          Germany Guide
        </div>

        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Step-by-step visa guides, document tracking, and deadline reminders in 11 languages
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 48,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: 18,
          }}
        >
          my-germany-guide.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}