'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';

export default function DashboardPage() {
  const dict = useDict();
  const [profile, setProfile] = useState<any>(null);
  const [flows, setFlows] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase.from('profiles').select('full_name, visa_type, visa_expiry_date, onboarding_complete').eq('id', user.id).single();
      if (p) setProfile(p);

      const { data: f } = await supabase.from('flow_instances').select('id, status, progress, flow_variant:flow_variant_id(base_flow:base_flow_id(title, icon))').eq('user_id', user.id).order('created_at', { ascending: false });
      if (f) setFlows(f as any);

      const { count } = await supabase.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
      setDocCount(count || 0);

      const { data: d } = await supabase.from('deadlines').select('id, title, due_date, is_done').eq('user_id', user.id).eq('is_done', false).order('due_date', { ascending: true }).limit(5);
      if (d) setDeadlines(d);

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const activeFlows = flows.filter((f) => f.status === 'in_progress');
  const completedFlows = flows.filter((f) => f.status === 'completed');

  let visaText = dict.dashboard.notSet;
  let visaUrgent = false;
  let visaWarning = '';
  if (profile?.visa_expiry_date) {
    const days = Math.ceil((new Date(profile.visa_expiry_date).getTime() - Date.now()) / 86400000);
    visaText = days + dict.dashboard.daysShort;
    if (days < 0) { visaUrgent = true; visaWarning = dict.dashboard.visaExpired; }
    else if (days <= 90) { visaUrgent = true; visaWarning = dict.dashboard.visaExpiresSoon.replace('{days}', String(days)); }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {dict.dashboard.welcomeBack} {profile?.full_name || ''}
      </h1>

      {visaUrgent && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-medium">{visaWarning}</p>
          <p className="text-red-600 text-sm mt-1">
            {visaText.startsWith('-') ? dict.dashboard.contactABH : dict.dashboard.startRenewal}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">{dict.dashboard.activeFlows}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{activeFlows.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">{dict.dashboard.completed}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{completedFlows.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">{dict.dashboard.documents}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{docCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">{dict.dashboard.visaExpires}</p>
          <p className={'text-2xl font-bold mt-1 ' + (visaUrgent ? 'text-red-600' : 'text-gray-900')}>{visaText}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{dict.dashboard.yourActiveFlows}</h2>
          <Link href="/flow" className="text-sm text-blue-600 hover:text-blue-700">{dict.dashboard.viewAll}</Link>
        </div>
        {activeFlows.length === 0 ? (
          <p className="text-gray-500 text-sm">{dict.dashboard.noActiveFlows}</p>
        ) : (
          <div className="space-y-3">
            {activeFlows.slice(0, 3).map((flow) => (
              <Link key={flow.id} href={'/flow/' + flow.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{flow.flow_variant?.base_flow?.icon || '\uD83D\uDCCB'}</span>
                  <span className="text-sm font-medium text-gray-900">{flow.flow_variant?.base_flow?.title || 'Flow'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: (flow.progress || 0) + '%' }} />
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(flow.progress || 0)}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{dict.dashboard.upcomingDeadlines}</h2>
          <Link href="/deadlines" className="text-sm text-blue-600 hover:text-blue-700">{dict.dashboard.viewAll}</Link>
        </div>
        {deadlines.length === 0 ? (
          <p className="text-gray-500 text-sm">{dict.dashboard.noDeadlines}</p>
        ) : (
          <div className="space-y-3">
            {deadlines.map((dl) => {
              const days = Math.ceil((new Date(dl.due_date).getTime() - Date.now()) / 86400000);
              let bc = 'bg-green-100 text-green-700';
              let bt = days + dict.dashboard.daysLeft;
              if (days < 0) { bc = 'bg-red-100 text-red-700'; bt = dict.dashboard.overdue; }
              else if (days <= 7) { bc = 'bg-amber-100 text-amber-700'; }
              return (
                <div key={dl.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <span className="text-sm text-gray-900">{dl.title}</span>
                  <span className={'text-xs font-medium px-2 py-1 rounded-full ' + bc}>{bt}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}