"use client";

import Link from "next/link";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { useDict } from "@/lib/i18n/context";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const dict = useDict();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <Link href="/" className="text-lg sm:text-xl font-bold text-blue-700 dark:text-blue-400">
            {dict.common?.appName || "Germany Guide"}
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex gap-3 sm:gap-4 text-sm">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400">
                {dict.privacy?.title || "Privacy"}
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400">
                {dict.terms?.title || "Terms"}
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400">
                {dict.about?.title || "About"}
              </Link>
            </div>
            <LanguageSwitcher compact />
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 flex-1">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-6">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-2">
            <Link href="/privacy" className="hover:text-blue-700 dark:hover:text-blue-400">
              {dict.privacy?.title || "Privacy Policy"}
            </Link>
            <Link href="/terms" className="hover:text-blue-700 dark:hover:text-blue-400">
              {dict.terms?.title || "Terms of Service"}
            </Link>
            <Link href="/about" className="hover:text-blue-700 dark:hover:text-blue-400">
              {dict.about?.title || "About"}
            </Link>
          </div>
          <p>{"\u00A9"} {new Date().getFullYear()} {dict.common?.appName || "Germany Guide"}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
