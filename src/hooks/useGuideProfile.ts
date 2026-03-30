"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GUIDE_FLOW_MAP } from "@/lib/blog/flow-mapping";

interface GuideProfile {
  visa_type: string | null;
  first_vs_renewal: string | null;
  city: string | null;
  full_name: string | null;
}

interface MatchingFlow {
  variantId: string;
  baseFlowTitle: string;
  baseFlowIcon: string;
}

interface ActiveInstance {
  id: string;
  progress: number;
  status: string;
}

interface UseGuideProfileResult {
  loading: boolean;
  isAuthenticated: boolean;
  profile: GuideProfile | null;
  matchingFlow: MatchingFlow | null;
  activeInstance: ActiveInstance | null;
}

export function useGuideProfile(slug: string): UseGuideProfileResult {
  const [state, setState] = useState<UseGuideProfileResult>({
    loading: true,
    isAuthenticated: false,
    profile: null,
    matchingFlow: null,
    activeInstance: null,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setState({ loading: false, isAuthenticated: false, profile: null, matchingFlow: null, activeInstance: null });
        return;
      }

      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("visa_type, first_vs_renewal, city, full_name")
        .eq("id", user.id)
        .single();

      if (!profile) {
        setState({ loading: false, isAuthenticated: true, profile: null, matchingFlow: null, activeInstance: null });
        return;
      }

      // Check if this guide has a flow mapping
      const mapping = GUIDE_FLOW_MAP[slug];
      let matchingFlow: MatchingFlow | null = null;
      let activeInstance: ActiveInstance | null = null;

      if (mapping && profile.visa_type) {
        // Find base flow by keyword search
        const { data: baseFlows } = await supabase
          .from("base_flows")
          .select("id, title, icon")
          .ilike("title", `%${mapping.flowKeyword}%`);

        if (baseFlows && baseFlows.length > 0) {
          const baseFlow = baseFlows[0];

          // Find matching variant for user's profile
          const variantQuery = supabase
            .from("flow_variants")
            .select("id")
            .eq("base_flow_id", baseFlow.id)
            .eq("first_vs_renewal", profile.first_vs_renewal || "first");

          // If the guide is visa-specific, use that visa type; otherwise use user's
          const visaType = mapping.visaTypeFilter || profile.visa_type;
          variantQuery.eq("visa_type", visaType);

          const { data: variants } = await variantQuery;

          if (variants && variants.length > 0) {
            matchingFlow = {
              variantId: variants[0].id,
              baseFlowTitle: baseFlow.title,
              baseFlowIcon: baseFlow.icon || "",
            };

            // Check for existing active instance
            const { data: instances } = await supabase
              .from("flow_instances")
              .select("id, progress, status")
              .eq("user_id", user.id)
              .eq("flow_variant_id", variants[0].id)
              .order("created_at", { ascending: false })
              .limit(1);

            if (instances && instances.length > 0) {
              activeInstance = instances[0];
            }
          }
        }
      }

      setState({
        loading: false,
        isAuthenticated: true,
        profile,
        matchingFlow,
        activeInstance,
      });
    }

    load();
  }, [slug]);

  return state;
}
