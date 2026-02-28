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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg">{"\u{1F1E9}\u{1F1EA}"}</span>
            <span className="font-bold text-gray-900 hidden sm:inline">
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

          <div className="flex items-center gap-2">
            {isPremium ? (
              <Link
                href="/premium"
                className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full"
              >
                {"\u{1F451}"} {dict.premium.premiumBadge}
              </Link>
            ) : (
              <Link
                href="/premium"
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition"
              >
                {"\u26A1"} {dict.nav.upgrade}
              </Link>
            )}

            <Link
              href="/support"
              className="text-gray-500 hover:text-gray-700 text-sm hidden sm:inline"
              title="Support"
            >
              {"\u2615"}
            </Link>

            <LanguageSwitcher />

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition"
              title={dict.common.logout}
            >
              {"\u{1F6AA}"}
            </button>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-around py-2 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs ${
                pathname.startsWith(item.href)
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}