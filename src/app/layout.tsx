import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://portofolio-akbarr.vercel.app"),
  title: "Akbar Maulana | Web Developer",
  description:
    "Saya adalah web developer yang fokus membangun produk digital yang cepat, bersih, dan memberikan pengalaman pengguna terbaik. Saat ini prakerin di Ashari Tech.",
  keywords: [
    "Akbar Maulana",
    "Web Developer",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Indonesia",
  ],
  authors: [{ name: "Akbar Maulana" }],
  creator: "Akbar Maulana",
  publisher: "Akbar Maulana",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://portofolio-akbarr.vercel.app",
    siteName: "Akbar Maulana Portfolio",
    title: "Akbar Maulana | Web Developer",
    description:
      "Web developer yang fokus membangun produk digital yang cepat, bersih, dan memberikan pengalaman pengguna terbaik.",
    images: [
      {
        url: "/images/profile-dark.JPG",
        width: 1200,
        height: 630,
        alt: "Akbar Maulana - Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Akbar Maulana | Web Developer",
    description:
      "Web developer yang fokus membangun produk digital yang cepat, bersih, dan memberikan pengalaman pengguna terbaik.",
    images: ["/images/profile-dark.JPG"],
  },
  alternates: {
    canonical: "https://portofolio-akbarr.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
