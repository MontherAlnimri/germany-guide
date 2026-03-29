"use client";

import { useState } from "react";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import { useUser } from "@/hooks/useUser";
import { trackEvent } from "@/lib/analytics";
import { Star, Sparkles } from "lucide-react";

export default function PremiumPage() {
  const dict = useDict();
  const p = dict?.premium;
  const t = dict?.trial;
  const user = useUser();
  const { isPremium, isTrialing, trialDaysLeft, plan, loading } = useSubscription();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) return;
    setCheckoutLoading(true);
    trackEvent("premium_checkout_started", { plan: billingPeriod });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billingPeriod }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // handle error silently
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      // handle error silently
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Already a paid premium subscriber
  if (isPremium && !isTrialing) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/20 border border-amber-200/60 dark:border-amber-700/40 rounded-2xl p-8 text-center shadow-premium">
          <span className="mb-4 block flex justify-center"><Star className="w-12 h-12 text-amber-400" /></span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {p?.premiumPlan ?? "Premium Plan"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {p?.currentPlanBadge ?? "Current plan"}: <span className="font-semibold capitalize">{plan}</span>
          </p>
          <button
            onClick={handlePortal}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
          >
            {p?.managePlan ?? "Manage Plan"}
          </button>
        </div>
      </div>
    );
  }

  const features = [
    p?.feature1 ?? "Unlimited flow guides",
    p?.feature2 ?? "Unlimited document tracking",
    p?.feature3 ?? "PDF export for all guides",
    p?.feature4 ?? "Priority email support",
    p?.feature5 ?? "Ad-free experience",
    p?.feature6 ?? "Early access to new features",
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {p?.title ?? "Go Premium"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {p?.subtitle ?? "Unlock all features and get the most out of your Germany journey"}
        </p>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-blue-500 dark:text-blue-400" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                  {t?.trialActive ?? "Trial Active"} — {trialDaysLeft === 1
                    ? t?.dayLeft ?? "1 day left"
                    : (t?.daysLeft ?? "{days} days left").replace("{days}", String(trialDaysLeft))
                  }
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t?.enjoyingTrial ?? "Enjoying your trial?"}{" "}
                  {(t?.trialBannerDesc ?? "").replace("{days}", String(trialDaysLeft))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              billingPeriod === "monthly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {p?.monthly ?? "Monthly"}
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
              billingPeriod === "yearly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {p?.yearly ?? "Yearly"}
            <span className="absolute -top-2.5 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
              -33%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free plan */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-premium hover-lift">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {p?.freePlan ?? "Free"}
          </h3>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{p?.free ?? "\u20AC0"}</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">{"\u2713"}</span>
              <span>3 {dict?.flows?.title?.toLowerCase() ?? "flows"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">{"\u2713"}</span>
              <span>10 {dict?.docs?.title?.toLowerCase() ?? "documents"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">{"\u2713"}</span>
              <span>{dict?.deadlines?.title ?? "Deadlines"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">{"\u2713"}</span>
              <span>{t?.freeTrialIncluded ?? "7-day free trial included"}</span>
            </li>
          </ul>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {p?.currentPlanBadge ?? "Current plan"}
          </div>
        </div>

        {/* Premium plan */}
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-premium-lg hover-glow text-white">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
              {p?.mostPopular ?? "Most Popular"}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">
            {p?.premiumPlan ?? "Premium"}
          </h3>
          <div className="mb-4">
            <span className="text-3xl font-bold">
              {billingPeriod === "monthly" ? (p?.monthlyPrice ?? "\u20AC4.99") : (p?.yearlyPrice ?? "\u20AC39.99")}
            </span>
            <span className="text-blue-200 text-sm ml-1">
              /{billingPeriod === "monthly" ? (p?.perMonth ?? "mo") : (p?.perYear ?? "yr")}
            </span>
          </div>
          <ul className="space-y-3 text-sm text-blue-50 mb-6">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50 shadow-xl border-2 border-white/30"
          >
            {checkoutLoading
              ? (dict?.common?.loading ?? "Loading...")
              : (p?.subscribe ?? "Subscribe")}
          </button>
          <p className="text-center text-xs text-blue-200 mt-3">
            {p?.cancelAnytime ?? "Cancel anytime"}
          </p>
        </div>
      </div>
    </div>
  );
}
