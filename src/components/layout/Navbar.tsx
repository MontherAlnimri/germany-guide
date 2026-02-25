'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n';
import { useSubscription } from '@/hooks/useSubscription';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function Navbar() {
  const dict = useDict();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const { isPremium } = useSubscription();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: dict.nav.dashboard, icon: '📊' },
    { href: '/flow', label: dict.nav.flows, icon: '🔄' },
    { href: '/documents', label: dict.nav.documents, icon: '📄' },
    { href: '/deadlines', label: dict.nav.deadlines, icon: '📅' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: App name */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg">🇩🇪</span>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:inline">
              {dict.common.appName}
            </span>
          </Link>

          {/* Center: Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith(item.href)
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Premium badge or upgrade button */}
            {isPremium ? (
              <Link
                href="/premium"
                className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full"
              >
                👑 Premium
              </Link>
            ) : (
              <Link
                href="/premium"
                className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition"
              >
                ⚡ {dict.nav.upgrade}
              </Link>
            )}

            {/* Support link */}
            <Link
              href="/support"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-sm hidden sm:inline"
              title="Support"
            >
              ☕
            </Link>

            <LanguageSwitcher />

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
              title={dict.nav.logout}
            >
              🚪
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-gray-100 dark:border-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs ${
                pathname.startsWith(item.href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
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