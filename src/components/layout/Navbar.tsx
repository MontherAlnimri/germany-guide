'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

export default function Navbar() {
  const dict = useDict();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const links = [
    { href: '/dashboard', label: dict.nav.dashboard, icon: '\uD83D\uDCCA' },
    { href: '/flow', label: dict.nav.flows, icon: '\uD83D\uDD04' },
    { href: '/documents', label: dict.nav.docs, icon: '\uD83D\uDCC1' },
    { href: '/deadlines', label: dict.nav.deadlines, icon: '\u23F0' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">{'\uD83C\uDDE9\uD83C\uDDEA'}</span>
            <span className="font-bold text-gray-900 hidden sm:inline">{dict.common.appName}</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              let cls = 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';
              if (isActive) cls = 'bg-blue-50 text-blue-700 font-medium';
              return (
                <Link key={link.href} href={link.href} className={'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ' + cls}>
                  <span className="text-base">{link.icon}</span>
                  <span className="hidden md:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <Link href="/onboarding" className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-50 transition-colors" title={dict.nav.settings}>
              {'\u2699\uFE0F'}
            </Link>
            <button onClick={handleSignOut} className="text-sm text-gray-600 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              {dict.nav.signOut}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}