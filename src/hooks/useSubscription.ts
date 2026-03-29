"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionState {
  isPremium: boolean;
  isTrialing: boolean;
  trialDaysLeft: number;
  trialEndsAt: string | null;
  plan: string;
  status: string;
  loading: boolean;
}

export function useSubscription(): SubscriptionState {
  const [state, setState] = useState<SubscriptionState>({
    isPremium: false,
    isTrialing: false,
    trialDaysLeft: 0,
    trialEndsAt: null,
    plan: "free",
    status: "active",
    loading: true,
  });

  useEffect(() => {
    async function fetchSubscription() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      // Fetch profile for trial info
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, trial_ends_at")
        .eq("id", user.id)
        .single();

      // Fetch subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user.id)
        .single();

      // Calculate trial status
      let isTrialing = false;
      let trialDaysLeft = 0;
      const trialEndsAt = profile?.trial_ends_at || null;

      if (trialEndsAt) {
        const now = new Date();
        const trialEnd = new Date(trialEndsAt);
        const diffMs = trialEnd.getTime() - now.getTime();
        trialDaysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        isTrialing = diffMs > 0;
      }

      const hasPaidPremium =
        profile?.is_premium === true ||
        (sub?.plan && sub.plan !== "free" && sub.status === "active");

      setState({
        isPremium: hasPaidPremium || isTrialing,
        isTrialing: isTrialing && !hasPaidPremium,
        trialDaysLeft,
        trialEndsAt,
        plan: sub?.plan || "free",
        status: sub?.status || "active",
        loading: false,
      });
    }

    fetchSubscription();
  }, []);

  return state;
}