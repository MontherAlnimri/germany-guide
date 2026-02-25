'use client';

import Link from 'next/link';
import { useDict, useLocale } from '@/lib/i18n';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function LandingPage() {
  const dict = useDict();
  const locale = useLocale();

  const features = [
    { icon: '\u{1F504}', title: dict.landing.featureFlows, desc: dict.landing.featureFlowsDesc },
    { icon: '\u{1F4C4}', title: dict.landing.featureDocs, desc: dict.landing.featureDocsDesc },
    { icon: '\u{1F4C5}', title: dict.landing.featureDeadlines, desc: dict.landing.featureDeadlinesDesc },
    { icon: '\u{1F30D}', title: dict.landing.featureI18n, desc: dict.landing.featureI18nDesc },
  ];

  const freeFeatures = [
    dict.landing.freeTier1,
    dict.landing.freeTier2,
    dict.landing.freeTier3,
    dict.landing.freeTier4,
  ];

  const premiumFeatures = [
    dict.landing.premiumTier1,
    dict.landing.premiumTier2,
    dict.landing.premiumTier3,
    dict.landing.premiumTier4,
    dict.landing.premiumTier5,
    dict.landing.premiumTier6,
    dict.landing.premiumTier7,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">DE</span>
          <span className="font-bold text-xl text-gray-900 dark:text-white">{dict.common.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition">
            {dict.landing.login}
          </Link>
          <Link href="/register" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
            {dict.landing.getStarted}
          </Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          {dict.landing.hero}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {dict.landing.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/25">
            {dict.landing.getStarted}
          </Link>
          <Link href="/login" className="px-6 py-3 text-gray-700 dark:text-gray-300 text-lg rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            {dict.landing.login}
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
          {dict.landing.features}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="font-bold text-gray-900 dark:text-white mt-3 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16" id="pricing">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          {dict.landing.pricing}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
          {dict.landing.pricingSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dict.landing.free}</h3>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">{'\u20AC'}0</p>
            <ul className="space-y-2 mb-6">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500">{'\u2713'}</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-2.5 text-center border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {dict.landing.getStarted}
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-500 p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {'\u2B50'} {dict.landing.premium}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{dict.landing.premium}</h3>
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{dict.landing.premiumPrice}</span>
              <span className="text-sm text-gray-500 ml-2">
                {dict.common.or} {dict.landing.premiumYearly}
                <span className="ml-1 text-green-600 font-medium">{dict.landing.saveYearly}</span>
              </span>
            </div>
            <ul className="space-y-2 mb-6">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-blue-500">{'\u2713'}</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full py-2.5 text-center bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              {dict.landing.upgrade}
            </Link>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>DE</span>
            <span className="text-sm text-gray-500">{dict.common.appName} {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/register" className="hover:text-blue-600">{dict.landing.getStarted}</Link>
            <Link href="/login" className="hover:text-blue-600">{dict.landing.login}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}