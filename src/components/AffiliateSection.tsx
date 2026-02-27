'use client';

import { useDict } from '@/lib/i18n';

interface AffiliateLink {
  name: string;
  descKey: string;
  url: string;
  icon: string;
  gradient: string;
  category: string;
  cta: string;
}

const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    name: 'N26',
    descKey: 'bankingDesc',
    url: 'https://n26.com',
    icon: '\u{1F3E6}',
    gradient: 'from-teal-500 to-emerald-600',
    category: 'banking',
    cta: 'openAccount',
  },
  {
    name: 'TK (Techniker)',
    descKey: 'insuranceDesc',
    url: 'https://www.tk.de/en',
    icon: '\u{1F3E5}',
    gradient: 'from-blue-500 to-indigo-600',
    category: 'insurance',
    cta: 'getQuote',
  },
  {
    name: 'Fraenk',
    descKey: 'mobileDesc',
    url: 'https://www.fraenk.de',
    icon: '\u{1F4F1}',
    gradient: 'from-purple-500 to-pink-600',
    category: 'mobile',
    cta: 'viewPlans',
  },
  {
    name: 'WG-Gesucht',
    descKey: 'housingDesc',
    url: 'https://www.wg-gesucht.de',
    icon: '\u{1F3E0}',
    gradient: 'from-orange-500 to-red-500',
    category: 'housing',
    cta: 'findHousing',
  },
];

export default function AffiliateSection() {
  const dict = useDict();

  const getDesc = (key: string): string => {
    const descMap: Record<string, string> = {
      bankingDesc: dict.affiliates.bankingDesc,
      insuranceDesc: dict.affiliates.insuranceDesc,
      mobileDesc: dict.affiliates.mobileDesc,
      housingDesc: dict.affiliates.housingDesc,
    };
    return descMap[key] || '';
  };

  const getCta = (ctaKey: string): string => {
    const ctaMap: Record<string, string> = {
      openAccount: dict.affiliates.openAccount,
      getQuote: dict.affiliates.getQuote,
      viewPlans: dict.affiliates.viewPlans,
      findHousing: dict.affiliates.findHousing,
    };
    return ctaMap[ctaKey] || dict.affiliates.learn;
  };

  const getCategoryLabel = (cat: string): string => {
    const catMap: Record<string, string> = {
      banking: dict.affiliates.banking,
      insurance: dict.affiliates.insurance,
      mobile: dict.affiliates.mobile,
      housing: dict.affiliates.housing,
    };
    return catMap[cat] || cat;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-bold text-white">
          {dict.affiliates.recommended}
        </h2>
        <p className="text-blue-100 text-xs mt-0.5">
          {dict.affiliates.subtitle}
        </p>
      </div>

      <div className="p-4 space-y-3">
        {AFFILIATE_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-gray-900">{link.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium uppercase tracking-wide">
                    {getCategoryLabel(link.category)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {getDesc(link.descKey)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {getCta(link.cta)}
                  <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-300">{'\u2192'}</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          {dict.affiliates.disclaimer}
        </p>
      </div>
    </div>
  );
}