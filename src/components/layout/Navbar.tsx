"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";

export default function Navbar() {
  const dict = useDict();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { isPremium } = useSubscription();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: dict.nav.dashboard, icon: "\u{1F4CA}" },
    { href: "/flow", label: dict.nav.flows, icon: "\u{1F504}" },
    { href: "/documents", label: dict.nav.documents, icon: "\u{1F4C4}" },
    { href: "/deadlines", label: dict.nav.deadlines, icon: "\u{1F4C5}" },
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <span className="text-lg flex-shrink-0">{"\u{1F1E9}\u{1F1EA}"}</span>
              <span className="font-bold text-gray-900 hidden sm:inline truncate">
                {dict.common.appName}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    pathname.startsWith(item.href)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {isPremium ? (
                <Link
                  href="/premium"
                  className="flex items-center gap-1 px-2 py-1 sm:px-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full"
                >
                  {"\u{1F451}"} <span className="hidden xs:inline">{dict.premium.premiumBadge}</span>
                </Link>
              ) : (
                <Link
                  href="/premium"
                  className="flex items-center gap-1 px-2 py-1 sm:px-2.5 bg-blue-600 text-white text-[10px] sm:text-xs font-medium rounded-full hover:bg-blue-700 transition"
                >
                  {"\u26A1"} <span className="hidden xs:inline">{dict.nav.upgrade}</span>
                </Link>
              )}

              <Link
                href="/support"
                className="text-gray-500 hover:text-gray-700 text-sm hidden sm:inline p-1"
                title="Support"
              >
                {"\u2615"}
              </Link>

              <LanguageSwitcher compact />

              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                title={dict.common.logout}
              >
                {"\u{1F6AA}"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-bottom">
        <div className="flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center min-w-[64px] min-h-[44px] justify-center rounded-lg px-2 py-1 transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 active:bg-gray-100"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] mt-0.5 leading-none font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}