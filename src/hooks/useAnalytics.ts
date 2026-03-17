"use client";

import { useCallback } from "react";
import { trackEvent, identifyUser, resetAnalytics } from "@/lib/analytics";

export function useAnalytics() {
  const track = useCallback(trackEvent, []);
  const identify = useCallback(identifyUser, []);
  const reset = useCallback(resetAnalytics, []);

  return { track, identify, reset };
}