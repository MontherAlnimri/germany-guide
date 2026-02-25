'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n';
import { useSubscription } from '@/hooks/useSubscription';
import AdBanner from '@/components/AdBanner';
import AffiliateSection from '@/components/AffiliateSection';

interface FlowInstanceRow {
  id: string;
  status: string;
  progress: number;
  flow_variant_id: string;
}

interface DocumentRow {
  id: string;
  doc_type: string;
  doc_name: string;
  status: string;
  expiry_date: string | null;
}

interface DeadlineRow {
  id: string;
  title: string;
  due_date: string;
  is_done: boolean;
}

export default function DashboardPage() {
  const dict = useDict();
  const supabase = createClient();
  const { isPremium } = useSubscription();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [flows, setFlows] = useState<FlowInstanceRow[]>([]);
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [deadlines, setDeadlines] = useState<DeadlineRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, flowsRes, docsRes, deadlinesRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('flow_instances').select('id, status, progress, flow_variant_id').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5),
        supabase.from('documents').select('id, doc_type, doc_name, status, expiry_date').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('deadlines').select('id, title, due_date, is_done').eq('user_id', user.id).eq('is_done', false).order('due_date', { ascending: true }).limit(5),
      ]);

      setProfile(profileRes.data);
      setFlows(flowsRes.data || []);
      setDocs(docsRes.data || []);
      setDeadlines(deadlinesRes.data || []);
      setLoading(false);
    }

    fetchData();
  }, [supabase]);

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return dict.dashboard.overdue;
    if (diff === 0) return dict.dashboard.today;
    return `${diff} ${dict.dashboard.days}`;
  };

  const statusBadge = (status: string) => {
    if (status === 'valid') return 'bg-green-100 text-green-700';
    if (status === 'expired') return 'bg-red-100 text-red-700';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {dict.dashboard.welcomeBack}{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
      </div>

      {!isPremium && (
        <Link href="/premium" className="block mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white flex items-center justify-between hover:from-blue-700 hover:to-indigo-700 transition">
            <div>
              <p className="font-bold">{dict.dashboard.premiumBanner}</p>
              <p className="text-blue-100 text-sm">{dict.dashboard.premiumBannerDesc}</p>
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
              {dict.dashboard.premiumBannerCta}
            </span>
          </div>
        </Link>
      )}

      <div className="mb-6 flex justify-center">
        <AdBanner format="horizontal" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link href="/flow" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition">
          <span className="text-2xl block">{'\u{1F504}'}</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{dict.dashboard.startNewFlow}</p>
        </Link>
        <Link href="/documents/new" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition">
          <span className="text-2xl block">{'\u{1F4C4}'}</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{dict.dashboard.addDocument}</p>
        </Link>
        <Link href="/deadlines" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition">
          <span className="text-2xl block">{'\u{1F4C5}'}</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{dict.dashboard.viewAllDeadlines}</p>
        </Link>
        <Link href="/premium" className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition">
          <span className="text-2xl block">{'\u26A1'}</span>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{dict.nav.premium}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">{dict.dashboard.yourFlows}</h2>
              <Link href="/flow" className="text-sm text-blue-600 hover:underline">{dict.dashboard.viewAllFlows}</Link>
            </div>
            {flows.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{dict.dashboard.noFlows}</p>
            ) : (
              <div className="space-y-3">
                {flows.map((flow) => (
                  <Link key={flow.id} href={`/flow/${flow.id}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{'\u{1F504}'}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Flow</p>
                          <p className="text-xs text-gray-500">{flow.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${flow.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{flow.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">{dict.dashboard.yourDocuments}</h2>
              <Link href="/documents" className="text-sm text-blue-600 hover:underline">{dict.dashboard.viewAllDocs}</Link>
            </div>
            {docs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{dict.dashboard.noDocs}</p>
            ) : (
              <div className="space-y-2">
                {docs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{'\u{1F4C4}'}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.doc_name}</p>
                        <p className="text-xs text-gray-500">{doc.doc_type}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(doc.status)}`}>
                      {dict.docs[doc.status as keyof typeof dict.docs] || doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white">{dict.dashboard.upcomingDeadlines}</h2>
              <Link href="/deadlines" className="text-sm text-blue-600 hover:underline">{dict.dashboard.viewAllDeadlines}</Link>
            </div>
            {deadlines.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{dict.dashboard.noDeadlines}</p>
            ) : (
              <div className="space-y-2">
                {deadlines.map((dl) => (
                  <div key={dl.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{'\u{1F4C5}'}</span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{dl.title}</p>
                    </div>
                    <span className={`text-xs font-medium ${
                      new Date(dl.due_date) < new Date() ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {getDaysUntil(dl.due_date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AffiliateSection />

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
            <span className="text-3xl">{'\u2615'}</span>
            <h3 className="font-bold text-gray-900 dark:text-white mt-2">{dict.support.tipTitle}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{dict.support.tipSubtitle}</p>
            <Link href="/support" className="inline-block px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
              {dict.support.tipSend}
            </Link>
          </div>

          <AdBanner format="rectangle" />
        </div>
      </div>
    </div>
  );
}