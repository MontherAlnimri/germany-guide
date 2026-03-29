'use client';

import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* Decorative floating blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-40 right-10 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-blob delay-300" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob delay-500" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <header className="relative w-full flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{'\uD83C\uDDE9\uD83C\uDDEA'}</span>
          <span className="font-bold text-lg text-white">Germany Guide</span>
        </div>
        <LanguageSwitcher />
      </header>
      <main className="relative flex-1 flex items-center justify-center px-4 py-8">
        <div className="animate-scale-in">
          {children}
        </div>
      </main>
    </div>
  );
}