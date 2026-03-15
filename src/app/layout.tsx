import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import I18nClientProvider from "@/components/i18n/I18nClientProvider";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://my-germany-guide.vercel.app";
const description = "Your complete step-by-step guide for navigating German bureaucracy. Get help with visas, city registration, health insurance, bank accounts, and more. Available in 11 languages including English, German, Arabic, Turkish, and Ukrainian.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Germany Guide - Navigate German Bureaucracy with Confidence",
    template: "%s | Germany Guide",
  },
  description,
  keywords: [
    "Germany guide",
    "German bureaucracy",
    "visa application Germany",
    "Anmeldung",
    "city registration Germany",
    "Blue Card Germany",
    "student visa Germany",
    "health insurance Germany",
    "migrant guide Germany",
    "expat Germany",
    "settle in Germany",
    "German residence permit",
    "Aufenthaltstitel",
    "work permit Germany",
    "international students Germany",
  ],
  authors: [{ name: "Germany Guide" }],
  creator: "Germany Guide",
  publisher: "Germany Guide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Germany Guide",
    title: "Germany Guide - Navigate German Bureaucracy with Confidence",
    description,
    images: [
      {
        url: "https://my-germany-guide.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Germany Guide - Navigate German Bureaucracy with Confidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Germany Guide - Navigate German Bureaucracy with Confidence",
    description,
    images: [
      {
        url: "https://my-germany-guide.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "Germany Guide - Navigate German Bureaucracy with Confidence",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-3388930204483365",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3388930204483365"
          crossOrigin="anonymous"
        />
        <script
          async
          src="https://fundingchoicesmessages.google.com/i/pub-3388930204483365?ers=1"
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <I18nClientProvider>
          <StructuredData />
          {children}
        </I18nClientProvider>
      </body>
    </html>
  );
}