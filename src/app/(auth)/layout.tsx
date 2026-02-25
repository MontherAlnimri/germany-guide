'use client';

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <header className="w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{'\uD83C\uDDE9\uD83C\uDDEA'}</span>
          <span className="font-bold text-lg text-gray-900">Germany Guide</span>
        </div>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}