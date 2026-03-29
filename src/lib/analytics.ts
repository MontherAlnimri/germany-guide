import posthog from "posthog-js";

type AnalyticsEvents = {
  trial_started: { visa_type?: string };
  user_signed_up: { method: string };
  user_logged_in: { method: string };
  onboarding_completed: {
    visa_type: string;
    city: string;
    first_vs_renewal: string;
  };
  flow_started: { flow_title: string; visa_type?: string };
  flow_completed: {
    flow_title: string;
    visa_type?: string;
    duration_days?: number;
  };
  step_completed: {
    flow_title: string;
    step_title: string;
    step_order: number;
  };
  document_added: { doc_type: string };
  deadline_added: Record<string, never>;
  premium_checkout_started: { plan: "monthly" | "yearly" };
  premium_subscribed: { plan: string; amount?: number };
  tip_sent: { amount: number };
  pdf_exported: { type: "flow" | "documents" };
  language_changed: { from: string; to: string };
  upgrade_modal_shown: { source: string };
  cta_clicked: { location: string; text: string };
};

export function trackEvent<K extends keyof AnalyticsEvents>(
  event: K,
  properties?: AnalyticsEvents[K]
) {
  if (typeof window === "undefined") return;
  if (!posthog || !posthog.__loaded) return;
  posthog.capture(event, properties);
}

export function identifyUser(
  userId: string,
  traits?: {
    email?: string;
    name?: string;
    visa_type?: string;
    city?: string;
    is_premium?: boolean;
    locale?: string;
  }
) {
  if (typeof window === "undefined") return;
  if (!posthog || !posthog.__loaded) return;
  posthog.identify(userId, traits);
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  if (!posthog || !posthog.__loaded) return;
  posthog.reset();
}