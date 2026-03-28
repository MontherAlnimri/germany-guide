"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import { useEmailVerified } from "@/hooks/useEmailVerified";
import { resetAnalytics } from "@/lib/analytics";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dict = useDict();
  const nav = dict?.nav;
  const { isPremium, isTrialing, trialDaysLeft, loading: subLoading } = useSubscription();
  const { verified: isVerified } = useEmailVerified();

  const handleLogout = async () => {
    resetAnalytics();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: nav?.dashboard ?? "Dashboard", icon: "\uD83C\uDFE0" },
    { href: "/flow", label: nav?.flows ?? "Flows", icon: "\uD83D\uDCCB" },
    { href: "/documents", label: nav?.documents ?? "Documents", icon: "\uD83D\uDCC4" },
    { href: "/deadlines", label: nav?.deadlines ?? "Deadlines", icon: "\u23F0" },
  ];

  const isActive = (href: string) => pathname === href;

  const renderBadge = () => {
    if (subLoading) return null;
    if (isTrialing) {
      const daysText = trialDaysLeft === 1 ? "1d" : `${trialDaysLeft}d`;
      return (
        <Link
          href="/premium"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:from-blue-200 hover:to-indigo-200 transition-all dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300"
        >
          <span>{"\u2728"}</span>
          <span>Trial {daysText}</span>
        </Link>
      );
    }
    if (isPremium) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 shadow-sm dark:from-amber-900/50 dark:to-yellow-900/50 dark:text-amber-300">
          <span>{"\u2B50"}</span>
          <span>Premium</span>
        </span>
      );
    }
    return (
      <Link
        href="/premium"
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        {nav?.upgrade ?? "Upgrade"}
      </Link>
    );
  };

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:flex items-center justify-between px-6 py-3 glass-nav border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold text-gradient">
            {dict?.common?.appName ?? "Germany Guide"}
          </Link>
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {renderBadge()}
          {!isVerified && (
            <Link href="/settings" title="Email not verified">
              <span className="text-amber-500 text-lg">{"\u26A0\uFE0F"}</span>
            </Link>
          )}
          <LanguageSwitcher compact />
          <ThemeToggle compact />
          <Link
            href="/settings"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-200"
            title={nav?.settings ?? "Settings"}
          >
            {"\u2699\uFE0F"}
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {dict?.common?.logout ?? "Logout"}
          </button>
        </div>
      </nav>

      {/* Mobile hamburger top bar */}
      <nav className="md:hidden flex items-center justify-between px-4 py-3 glass-nav border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-40">
        <Link href="/dashboard" className="text-lg font-bold text-gradient">
          {dict?.common?.appName ?? "Germany Guide"}
        </Link>
        <div className="flex items-center gap-2">
          {!isVerified && (
            <Link href="/settings">
              <span className="text-amber-500">{"\u26A0\uFE0F"}</span>
            </Link>
          )}
          {isTrialing && !subLoading && (
            <Link
              href="/premium"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300"
            >
              {"\u2728"} {trialDaysLeft}d
            </Link>
          )}
          <ThemeToggle compact />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {menuOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-white dark:bg-gray-900 z-30 overflow-y-auto animate-fade-in">
          <div className="p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium min-h-[44px] transition-all ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}

            <hr className="my-2 border-gray-200 dark:border-gray-700" />

            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 min-h-[44px]"
            >
              <span>{"\u2699\uFE0F"}</span>
              <span>{nav?.settings ?? "Settings"}</span>
            </Link>

            {!isPremium && !isTrialing && (
              <Link
                href="/premium"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 min-h-[44px]"
              >
                <span>{"\u2B50"}</span>
                <span>{nav?.upgrade ?? "Upgrade"}</span>
              </Link>
            )}

            <div className="px-4 py-3">
              <LanguageSwitcher />
            </div>

            <hr className="my-2 border-gray-200 dark:border-gray-700" />

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full min-h-[44px]"
            >
              <span>{"\uD83D\uDEAA"}</span>
              <span>{dict?.common?.logout ?? "Logout"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-gray-200/60 dark:border-gray-700/60 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 min-w-[44px] min-h-[44px] justify-center transition-colors ${
                isActive(link.href)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-[10px] font-medium leading-tight">
                {link.label}
              </span>
              {isActive(link.href) && (
                <div className="w-4 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-0.5" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
