import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            display: "flex",
          }}
        >
          <div style={{ flex: 1, backgroundColor: "#000000" }} />
          <div style={{ flex: 1, backgroundColor: "#DD0000" }} />
          <div style={{ flex: 1, backgroundColor: "#FFCC00" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Germany Guide
          </div>
          <div
            style={{
              fontSize: "32px",
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              maxWidth: "800px",
              display: "flex",
            }}
          >
            Navigate German Bureaucracy with Confidence
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {["Visa Guide", "Registration", "11 Languages", "Step-by-Step"].map(
              (text) => (
                <div
                  key={text}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  {text}
                </div>
              )
            )}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.7)",
            display: "flex",
          }}
        >
          my-germany-guide.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}