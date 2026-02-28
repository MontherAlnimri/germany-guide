"use client";

import { useDict } from "@/lib/i18n/context";

interface AffiliateLink {
  name: string;
  descKey: string;
  url: string;
  icon: string;
  gradient: string;
  categoryKey: string;
}

const AFFILIATE_LINKS: AffiliateLink[] = [
  {
    name: "N26",
    descKey: "bankingDesc",
    url: "https://n26.com",
    icon: "\u{1F3E6}",
    gradient: "from-teal-500 to-emerald-600",
    categoryKey: "bankingTag",
  },
  {
    name: "TK (Techniker)",
    descKey: "insuranceDesc",
    url: "https://www.tk.de/en",
    icon: "\u{1F3E5}",
    gradient: "from-blue-500 to-indigo-600",
    categoryKey: "insuranceTag",
  },
  {
    name: "Fraenk",
    descKey: "mobileDesc",
    url: "https://www.fraenk.de",
    icon: "\u{1F4F1}",
    gradient: "from-purple-500 to-pink-600",
    categoryKey: "mobileTag",
  },
  {
    name: "WG-Gesucht",
    descKey: "housingDesc",
    url: "https://www.wg-gesucht.de",
    icon: "\u{1F3E0}",
    gradient: "from-orange-500 to-red-500",
    categoryKey: "housingTag",
  },
];

export default function AffiliateSection() {
  const dict = useDict();
  const a = dict.affiliates;

  const getDesc = (key: string): string => {
    const descMap: Record<string, string> = {
      bankingDesc: a.bankingDesc,
      insuranceDesc: a.insuranceDesc,
      mobileDesc: a.mobileDesc,
      housingDesc: a.housingDesc,
    };
    return descMap[key] || "";
  };

  const getCategoryLabel = (key: string): string => {
    return (a as any)[key] || "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-lg font-bold text-white">
          {a.title}
        </h2>
        <p className="text-blue-100 text-xs mt-0.5">
          {a.subtitle}
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
                    {getCategoryLabel(link.categoryKey)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {getDesc(link.descKey)}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {a.visitSite}
                  <span className="ml-1 group-hover:translate-x-0.5 transition-transform duration-300">{"\u2192"}</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          {a.sponsored}
        </p>
      </div>
    </div>
  );
}