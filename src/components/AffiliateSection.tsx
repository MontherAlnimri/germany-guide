'use client';

import { useDict } from '@/lib/i18n';

interface AffiliateLink {
  name: string;
  description: string;
  url: string;
  logo: string;
  category: string;
  cta: string;
}

const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    name: 'N26',
    description: 'Free German bank account, no paperwork. Open in 8 minutes.',
    url: 'https://n26.com',
    logo: '🏦',
    category: 'banking',
    cta: 'openAccount',
  },
  {
    name: 'TK (Techniker)',
    description: 'Germany\'s largest public health insurance. English support available.',
    url: 'https://www.tk.de/en',
    logo: '🏥',
    category: 'insurance',
    cta: 'getQuote',
  },
  {
    name: 'Fraenk',
    description: 'Simple mobile plans starting at €10/month. No contract.',
    url: 'https://www.fraenk.de',
    logo: '📱',
    category: 'mobile',
    cta: 'viewPlans',
  },
  {
    name: 'WG-Gesucht',
    description: 'Germany\'s #1 platform for shared apartments and housing.',
    url: 'https://www.wg-gesucht.de',
    logo: '🏠',
    category: 'housing',
    cta: 'findHousing',
  },
];

export default function AffiliateSection() {
  const dict = useDict();

  const getCta = (ctaKey: string) => {
    const ctaMap: Record<string, string> = {
      openAccount: dict.affiliates.openAccount,
      getQuote: dict.affiliates.getQuote,
      viewPlans: dict.affiliates.viewPlans,
      findHousing: dict.affiliates.findHousing,
    };
    return ctaMap[ctaKey] || dict.affiliates.learn;
  };

  const getCategoryLabel = (cat: string) => {
    const catMap: Record<string, string> = {
      banking: dict.affiliates.banking,
      insurance: dict.affiliates.insurance,
      mobile: dict.affiliates.mobile,
      housing: dict.affiliates.housing,
    };
    return catMap[cat] || cat;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
        {dict.affiliates.recommended}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {dict.affiliates.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AFFILIATE_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition group"
          >
            <span className="text-3xl">{link.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">{link.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded">
                  {getCategoryLabel(link.category)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{link.description}</p>
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                {getCta(link.cta)} →
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 mt-4 text-center">
        {dict.affiliates.disclaimer}
      </p>
    </div>
  );
}