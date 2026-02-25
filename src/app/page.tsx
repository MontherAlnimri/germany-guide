'use client';

import Link from 'next/link';
import { useDict } from '@/lib/i18n/context';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function Home() {
  const dict = useDict();

  const features = [
    { icon: '\uD83D\uDCCB', ...dict.landing.features.visa },
    { icon: '\u2705', ...dict.landing.features.progress },
    { icon: '\uD83D\uDCC1', ...dict.landing.features.documents },
    { icon: '\u23F0', ...dict.landing.features.deadlines },
    { icon: '\uD83C\uDFE0', ...dict.landing.features.registration },
    { icon: '\uD83C\uDFE5', ...dict.landing.features.insurance },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="w-full flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{'\uD83C\uDDE9\uD83C\uDDEA'}</span>
          <span className="font-bold text-xl text-gray-900">{dict.common.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            {dict.landing.signIn}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            {dict.landing.heroTitle1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {dict.landing.heroTitle2}
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {dict.landing.heroDesc}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 w-full sm:w-auto text-center">
              {dict.landing.getStarted}
            </Link>
            <Link href="/login" className="px-8 py-3 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors border border-gray-200 w-full sm:w-auto text-center">
              {dict.landing.haveAccount}
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center text-sm text-gray-500">
          {dict.landing.footer}
        </div>
      </main>
    </div>
  );
}