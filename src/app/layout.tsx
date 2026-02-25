import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import I18nClientProvider from '@/components/i18n/I18nClientProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'Germany Guide - Navigate German Bureaucracy',
  description: 'Your personal step-by-step companion for visa applications, city registration, and everything you need as a newcomer in Germany.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nClientProvider>
          {children}
        </I18nClientProvider>
      </body>
    </html>
  );
}