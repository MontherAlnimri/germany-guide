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
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            opacity: 0.08,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "2px solid white",
                top: Math.random() * 630 - 50,
                left: Math.random() * 1200 - 50,
                display: "flex",
              }}
            />
          ))}
        </div>

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

        {/* Flag emoji */}
        <div style={{ fontSize: 72, marginBottom: 16, display: "flex" }}>
          {"🇩🇪"}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
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

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            marginBottom: 32,
            display: "flex",
          }}
        >
          Navigate German Bureaucracy with Confidence
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Step-by-Step Guides", "11 Languages", "Document Tracking", "Free to Use"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 24,
                  padding: "10px 24px",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* Bottom URL bar */}
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