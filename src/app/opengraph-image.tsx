// Step 3: OG Image - Dynamic Open Graph Image
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akbar Maulana - Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 64,
                    background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ fontSize: 72, fontWeight: "bold", marginBottom: 20 }}>
                    Akbar Maulana
                </div>
                <div style={{ fontSize: 36, opacity: 0.9 }}>Web Developer</div>
            </div>
        ),
        { ...size }
    );
}
