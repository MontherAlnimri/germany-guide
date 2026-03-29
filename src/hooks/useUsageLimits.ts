"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FREE_LIMITS } from "@/lib/stripe/server";

interface UsageLimits {
  flowCount: number;
  docCount: number;
  maxFlows: number;
  maxDocs: number;
  canStartFlow: boolean;
  canAddDoc: boolean;
  isPremium: boolean;
  isTrialing: boolean;
  trialDaysLeft: number;
  loading: boolean;
}

export function useUsageLimits(): UsageLimits {
  const [state, setState] = useState<UsageLimits>({
    flowCount: 0,
    docCount: 0,
    maxFlows: FREE_LIMITS.maxFlows,
    maxDocs: FREE_LIMITS.maxDocuments,
    canStartFlow: true,
    canAddDoc: true,
    isPremium: false,
    isTrialing: false,
    trialDaysLeft: 0,
    loading: true,
  });

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      // Get profile for premium + trial
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, trial_ends_at")
        .eq("id", user.id)
        .single();

      // Get subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .single();

      // Calculate trial
      let isTrialing = false;
      let trialDaysLeft = 0;
      if (profile?.trial_ends_at) {
        const diffMs =
          new Date(profile.trial_ends_at).getTime() - Date.now();
        trialDaysLeft = Math.max(
          0,
          Math.ceil(diffMs / (1000 * 60 * 60 * 24))
        );
        isTrialing = diffMs > 0;
      }

      const hasPaidPremium =
        profile?.is_premium === true ||
        (sub?.plan && sub.plan !== "free" && sub.status === "active");
      const hasAccess = hasPaidPremium || isTrialing;

      // Count usage
      const { count: flowCount } = await supabase
        .from("flow_instances")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: docCount } = await supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const fc = flowCount ?? 0;
      const dc = docCount ?? 0;

      setState({
        flowCount: fc,
        docCount: dc,
        maxFlows: hasAccess ? Infinity : FREE_LIMITS.maxFlows,
        maxDocs: hasAccess ? Infinity : FREE_LIMITS.maxDocuments,
        canStartFlow: hasAccess || fc < FREE_LIMITS.maxFlows,
        canAddDoc: hasAccess || dc < FREE_LIMITS.maxDocuments,
        isPremium: hasAccess,
        isTrialing: isTrialing && !hasPaidPremium,
        trialDaysLeft,
        loading: false,
      });
    }

    check();
  }, []);

  return state;
}