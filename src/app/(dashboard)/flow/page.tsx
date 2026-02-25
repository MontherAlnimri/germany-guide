'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';

export default function FlowsPage() {
  const dict = useDict();
  const [instances, setInstances] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: pd } = await supabase.from('profiles').select('visa_type, first_vs_renewal').eq('id', user.id).single();
      setProfile(pd);
      const { data: id } = await supabase.from('flow_instances').select('id, status, progress, created_at, flow_variant:flow_variant_id(id, base_flow_id, visa_type, first_vs_renewal, base_flow:base_flow_id(id, title, description, icon, category))').eq('user_id', user.id).order('created_at', { ascending: false });
      if (id) setInstances(id as any);
      const { data: vd } = await supabase.from('flow_variants').select('id, base_flow_id, visa_type, first_vs_renewal, base_flow:base_flow_id(id, title, description, icon, category)').order('created_at', { ascending: true });
      if (vd) setVariants(vd as any);
      setLoading(false);
    }
    load();
  }, []);

  const startFlow = async (variantId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: steps } = await supabase.from('flow_steps').select('id, step_order').eq('flow_variant_id', variantId).order('step_order');
    const snap = (steps || []).map((s) => ({ step_id: s.id, is_done: false, notes: '' }));
    const { data: inst } = await supabase.from('flow_instances').insert({ user_id: user.id, flow_variant_id: variantId, status: 'in_progress', progress: 0, step_snapshot: snap }).select().single();
    if (inst) window.location.href = '/flow/' + inst.id;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  const active = instances.filter((i) => i.status === 'in_progress');
  const done = instances.filter((i) => i.status === 'completed');
  const startedIds = instances.map((i) => i.flow_variant?.id);
  const recommended = variants.filter((v) => !startedIds.includes(v.id) && (v.visa_type === profile?.visa_type || v.visa_type === null) && (v.first_vs_renewal === profile?.first_vs_renewal || v.first_vs_renewal === null));
  const other = variants.filter((v) => !startedIds.includes(v.id) && !recommended.includes(v));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{dict.flows.myFlows}</h1>
        <p className="text-gray-600 mt-1">{dict.flows.myFlowsDesc}</p>
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{dict.flows.inProgress}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {active.map((inst) => (
              <Link key={inst.id} href={'/flow/' + inst.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{inst.flow_variant?.base_flow?.icon || '\uD83D\uDCCB'}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{inst.flow_variant?.base_flow?.title}</h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: (inst.progress || 0) + '%' }} />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(inst.progress || 0)}%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {done.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{dict.flows.completedSection}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {done.map((inst) => (
              <Link key={inst.id} href={'/flow/' + inst.id} className="bg-green-50 rounded-xl border border-green-100 p-5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{inst.flow_variant?.base_flow?.icon || '\u2705'}</span>
                  <h3 className="font-medium text-green-900">{inst.flow_variant?.base_flow?.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recommended.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{dict.flows.recommendedForYou}</h2>
          <p className="text-sm text-gray-500 mb-3">{dict.flows.basedOnVisa} {(dict.visa as any)[profile?.visa_type] || profile?.visa_type}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {recommended.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-blue-100 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{v.base_flow?.icon || '\uD83D\uDCCB'}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{v.base_flow?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{v.base_flow?.description}</p>
                    <button onClick={() => startFlow(v.id)} className="mt-3 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">{dict.flows.startFlow}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{dict.flows.otherFlows}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {other.map((v) => (
              <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{v.base_flow?.icon || '\uD83D\uDCCB'}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{v.base_flow?.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{v.base_flow?.description}</p>
                    <button onClick={() => startFlow(v.id)} className="mt-3 px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">{dict.flows.startFlow}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}