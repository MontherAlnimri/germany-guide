"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSubscription } from "./useSubscription";

const FREE_LIMITS = {
  maxFlows: 3,
  maxDocuments: 10,
};

interface UsageLimits {
  flowCount: number;
  documentCount: number;
  maxFlows: number;
  maxDocuments: number;
  canCreateFlow: boolean;
  canCreateDocument: boolean;
  isPremium: boolean;
  loading: boolean;
}

export function useUsageLimits(): UsageLimits {
  const { isPremium, loading: subLoading } = useSubscription();
  const [flowCount, setFlowCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const [flowRes, docRes] = await Promise.all([
        supabase
          .from("flow_instances")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("documents")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      setFlowCount(flowRes.count || 0);
      setDocumentCount(docRes.count || 0);
      setLoading(false);
    }

    fetchCounts();
  }, []);

  const isLoading = loading || subLoading;

  return {
    flowCount,
    documentCount,
    maxFlows: isPremium ? Infinity : FREE_LIMITS.maxFlows,
    maxDocuments: isPremium ? Infinity : FREE_LIMITS.maxDocuments,
    canCreateFlow: isPremium || flowCount < FREE_LIMITS.maxFlows,
    canCreateDocument: isPremium || documentCount < FREE_LIMITS.maxDocuments,
    isPremium,
    loading: isLoading,
  };
}