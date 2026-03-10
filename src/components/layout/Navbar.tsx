'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useSubscription } from '@/hooks/useSubscription';
import { useEmailVerified } from '@/hooks/useEmailVerified';
import { useDict } from '@/lib/i18n/context';
import { Badge } from '@/components/ui/Badge';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/dashboard', icon: '\uD83C\uDFE0' },
  { key: 'flows', href: '/flow', icon: '\uD83D\uDCCB' },
  { key: 'documents', href: '/documents', icon: '\uD83D\uDCC4' },
  { key: 'deadlines', href: '/deadlines', icon: '\u23F0' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { subscription } = useSubscription();
  const { verified } = useEmailVerified();
  const dict = useDict();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPremium = subscription?.plan === 'monthly' || subscription?.plan === 'yearly';

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLabels: Record<string, string> = {
    dashboard: dict.nav?.dashboard ?? 'Dashboard',
    flows: dict.nav?.flows ?? 'Flows',
    documents: dict.nav?.documents ?? 'Documents',
    deadlines: dict.nav?.deadlines ?? 'Deadlines',
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 min-h-[44px]"
            >
              <span className="text-xl sm:text-2xl">{"\uD83C\uDDE9\uD83C\uDDEA"}</span>
              <span className="font-bold text-gray-900 text-sm sm:text-base hidden sm:inline">
                {dict.common?.appName ?? 'Germany Guide'}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <button
                    key={item.key}
                    onClick={() => router.push(item.href)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon} {navLabels[item.key]}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {verified === false && (
                <span
                  className="text-amber-500 cursor-pointer text-lg"
                  title={dict.verification?.bannerTitle ?? 'Email not verified'}
                  onClick={() => router.push('/dashboard')}
                >
                  {"\u26A0\uFE0F"}
                </span>
              )}

              {isPremium ? (
                <Badge variant="warning" className="hidden sm:inline-flex">{"\u2B50"} Premium</Badge>
              ) : (
                <button
                  onClick={() => router.push('/premium')}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 min-h-[44px] flex items-center"
                >
                  {dict.premium?.upgrade ?? 'Upgrade'}
                </button>
              )}

              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>

              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center text-sm text-gray-600 hover:text-gray-900 min-h-[44px] px-2"
              >
                {dict.common?.logout ?? 'Sign Out'}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600"
              >
                {mobileMenuOpen ? '\u2715' : '\u2630'}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{user?.email}</span>
                {isPremium && <Badge variant="warning">{"\u2B50"}</Badge>}
              </div>
              {verified === false && (
                <div className="px-3 py-2 text-sm text-amber-700 bg-amber-50 rounded-lg">
                  {"\u26A0\uFE0F"} {dict.verification?.bannerTitle ?? 'Email not verified'}
                </div>
              )}
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              {!isPremium && (
                <button
                  onClick={() => { router.push('/premium'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-blue-600 font-medium rounded-lg hover:bg-blue-50 min-h-[44px]"
                >
                  {"\u2B50"} {dict.premium?.upgrade ?? 'Upgrade to Premium'}
                </button>
              )}
              <button
                onClick={() => { router.push('/support'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 min-h-[44px]"
              >
                {"\uD83D\uDC9D"} {dict.nav?.support ?? 'Support Us'}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 min-h-[44px]"
              >
                {dict.common?.logout ?? 'Sign Out'}
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[10px] mt-0.5 leading-tight">{navLabels[item.key]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}