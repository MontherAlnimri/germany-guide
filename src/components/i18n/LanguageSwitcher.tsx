"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { i18n, localeNames, localeFlags, getDirection } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { trackEvent } from "@/lib/analytics";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLocale: Locale) => {
    trackEvent("language_changed", { from: locale, to: newLocale });
    setLocale(newLocale);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[36px] min-w-[36px] justify-center"
        aria-label="Change language"
        type="button"
      >
        <span className="text-base">{localeFlags[locale]}</span>
        {!compact && (
          <span className="hidden sm:inline text-gray-700">
            {localeNames[locale]}
          </span>
        )}
        <svg
          className={"w-3 h-3 text-gray-500 transition-transform " + (open ? "rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-[200px] max-h-[60vh] overflow-y-auto">
          {i18n.locales.map((loc) => {
            const isActive = loc === locale;
            const dir = getDirection(loc);
            let cls = "text-gray-700 hover:bg-gray-50";
            if (isActive) cls = "bg-blue-50 text-blue-700 font-medium";
            return (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className={"w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors min-h-[44px] " + cls}
                dir={dir}
                type="button"
              >
                <span className="text-base">{localeFlags[loc]}</span>
                <span className="flex-1 text-left" dir={dir}>
                  {localeNames[loc]}
                </span>
                {isActive && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}