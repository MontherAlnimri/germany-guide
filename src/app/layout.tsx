import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nClientProvider from "@/components/i18n/I18nClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Germany Guide - Navigate German Bureaucracy with Confidence",
    template: "%s | Germany Guide",
  },
  description:
    "Step-by-step guidance for visas, city registration, health insurance, and settling in Germany. Available in 11 languages. Free for migrants and international students.",
  keywords: [
    "Germany visa guide",
    "German bureaucracy",
    "Anmeldung",
    "city registration Germany",
    "student visa Germany",
    "Blue Card Germany",
    "health insurance Germany",
    "settle in Germany",
    "migrant guide Germany",
    "international students Germany",
    "Aufenthaltstitel",
    "residence permit Germany",
    "work permit Germany",
    "family reunion visa Germany",
    "freelance visa Germany",
  ],
  authors: [{ name: "Germany Guide" }],
  creator: "Germany Guide",
  publisher: "Germany Guide",
  metadataBase: new URL("https://my-germany-guide.vercel.app"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Germany Guide - Navigate German Bureaucracy with Confidence",
    description:
      "Step-by-step guidance for visas, registration, and settling in Germany. Available in 11 languages.",
    url: "https://my-germany-guide.vercel.app",
    siteName: "Germany Guide",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Germany Guide - Navigate German Bureaucracy with Confidence",
    description:
      "Step-by-step guidance for visas, registration, and settling in Germany. Available in 11 languages.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-3388930204483365",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3388930204483365"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <I18nClientProvider>{children}</I18nClientProvider>
      </body>
    </html>
  );
}