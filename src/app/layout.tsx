import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";
import ClientProviders from "@/components/ClientProviders";

// Step 8: Font Optimization with display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Step 2: Metadata API
export const metadata: Metadata = {
  metadataBase: new URL("https://portofolio-akbarr.vercel.app"),
  title: "Akbar Maulana - Web Developer Portfolio",
  description:
    "Portfolio Akbar Maulana, Web Developer Next.js & React. Fokus membangun produk digital yang cepat, bersih, dan memberikan pengalaman pengguna terbaik.",
  keywords: ["web developer", "next.js", "react", "portfolio", "frontend developer", "Akbar Maulana"],
  openGraph: {
    type: "website",
    url: "https://portofolio-akbarr.vercel.app",
    title: "Akbar Maulana - Web Developer",
    description: "Portfolio personal web developer Next.js & React",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akbar Maulana - Web Developer",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Set tema sebelum React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try {
              const theme = localStorage.getItem('theme');
              const d = document.documentElement;
              if (theme === 'dark') {
                d.classList.add('dark');
              } else if (theme === 'light') {
                d.classList.remove('dark');
              } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                d.classList.add('dark');
              }
            } catch (e) {} })();`,
          }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
