"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import LimitModal from "@/components/ui/LimitModal";
import UsageBar from "@/components/ui/UsageBar";

interface BaseFlow {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface FlowVariant {
  id: string;
  base_flow_id: string;
  visa_type: string;
  first_vs_renewal: string;
}

interface FlowInstance {
  id: string;
  user_id: string;
  flow_variant_id: string;
  status: string;
  progress: number;
  created_at: string;
}

export default function FlowPage() {
  const dict = useDict();
  const router = useRouter();
  const { canCreateFlow, flowCount, maxFlows, isPremium, loading: limitsLoading } = useUsageLimits();

  const [baseFlows, setBaseFlows] = useState<BaseFlow[]>([]);
  const [variants, setVariants] = useState<FlowVariant[]>([]);
  const [instances, setInstances] = useState<FlowInstance[]>([]);
  const [profile, setProfile] = useState<{ visa_type: string; first_vs_renewal: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, baseRes, variantRes, instanceRes] = await Promise.all([
        supabase.from("profiles").select("visa_type, first_vs_renewal").eq("id", user.id).single(),
        supabase.from("base_flows").select("*"),
        supabase.from("flow_variants").select("*"),
        supabase.from("flow_instances").select("*").eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (baseRes.data) setBaseFlows(baseRes.data);
      if (variantRes.data) setVariants(variantRes.data);
      if (instanceRes.data) setInstances(instanceRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const startFlow = async (variantId: string) => {
    if (!canCreateFlow) {
      setShowLimitModal(true);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: steps } = await supabase
      .from("flow_steps")
      .select("*")
      .eq("flow_variant_id", variantId)
      .order("step_order");

    const snapshot = (steps || []).map((s) => ({
      ...s,
      is_done: false,
      user_notes: "",
    }));

    const { data: instance } = await supabase
      .from("flow_instances")
      .insert({
        user_id: user.id,
        flow_variant_id: variantId,
        status: "in_progress",
        progress: 0,
        step_snapshot: snapshot,
      })
      .select()
      .single();

    if (instance) {
      router.push(`/flow/${instance.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">{dict.common?.loading || "Loading..."}</div>
      </div>
    );
  }

  const myInstances = instances;
  const recommendedVariants = variants.filter(
    (v) =>
      profile &&
      v.visa_type === profile.visa_type &&
      v.first_vs_renewal === profile.first_vs_renewal &&
      !instances.some((i) => i.flow_variant_id === v.id)
  );
  const otherVariants = variants.filter(
    (v) => !recommendedVariants.includes(v) && !instances.some((i) => i.flow_variant_id === v.id)
  );

  const getBaseFlow = (variantId: string) => {
    const variant = variants.find((vr) => vr.id === variantId);
    return baseFlows.find((b) => b.id === variant?.base_flow_id);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {dict.flows?.title || "Your Flows"}
        </h1>
      </div>

      {!isPremium && !limitsLoading && (
        <UsageBar
          label={dict.flows?.title || "Flows"}
          current={flowCount}
          max={maxFlows as number}
          isPremium={isPremium}
        />
      )}

      {myInstances.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {dict.flows?.myFlows || "My Flows"}
          </h2>
          <div className="grid gap-4">
            {myInstances.map((instance) => {
              const base = getBaseFlow(instance.flow_variant_id);
              return (
                <div
                  key={instance.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/flow/${instance.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{base?.icon || ""}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {base?.title || "Flow"}
                        </h3>
                        <p className="text-sm text-gray-500">{base?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        {instance.progress}%
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${instance.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {recommendedVariants.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {dict.flows?.recommendedForYou || "Recommended for You"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {dict.flows?.basedOnVisa || "Based on your visa type and situation"}
          </p>
          <div className="grid gap-4">
            {recommendedVariants.map((variant) => {
              const base = getBaseFlow(variant.id);
              return (
                <div
                  key={variant.id}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{base?.icon || ""}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {base?.title || "Flow"}
                        </h3>
                        <p className="text-sm text-gray-500">{base?.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startFlow(variant.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {dict.flows?.startNew || "Start"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {otherVariants.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {dict.flows?.otherFlows || "Other Flows"}
          </h2>
          <div className="grid gap-4">
            {otherVariants.map((variant) => {
              const base = getBaseFlow(variant.id);
              return (
                <div
                  key={variant.id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{base?.icon || ""}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {base?.title || "Flow"}
                        </h3>
                        <p className="text-sm text-gray-500">{base?.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => startFlow(variant.id)}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      {dict.flows?.startNew || "Start"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {myInstances.length === 0 && recommendedVariants.length === 0 && otherVariants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{dict.dashboard?.noFlows || "No flows available"}</p>
        </div>
      )}

      <LimitModal
        type="flow"
        current={flowCount}
        max={maxFlows as number}
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}