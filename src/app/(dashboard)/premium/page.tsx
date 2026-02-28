"use client";

import { useState } from "react";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";

export default function PremiumPage() {
  const dict = useDict();
  const { subscription, isPremium, loading } = useSubscription();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billingInterval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to open portal");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const features = [
    dict.premium.feature1,
    dict.premium.feature2,
    dict.premium.feature3,
    dict.premium.feature4,
    dict.premium.feature5,
    dict.premium.feature6,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {dict.premium.title}
        </h1>
        <p className="text-gray-600 text-lg">
          {dict.premium.subtitle}
        </p>
      </div>

      {isPremium && subscription ? (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">{"\u{1F451}"}</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">
            {dict.premium.successTitle}
          </h2>
          <p className="text-yellow-700 mb-2">
            {dict.premium.successDesc}
          </p>
          <div className="mt-4 space-y-1 text-sm text-yellow-600">
            <p>
              {dict.premium.currentPlan}: {subscription.plan === "monthly" ? dict.premium.billedMonthly : dict.premium.billedYearly}
            </p>
            {subscription.current_period_end && (
              <p>
                {subscription.status === "cancelled" ? "Expires" : "Renews"}:{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleManage}
            className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            {dict.premium.managePlan}
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                billingInterval === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {dict.premium.monthly}
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                billingInterval === "yearly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {dict.premium.yearly}
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {dict.premium.savePercent}
              </span>
            </button>
          </div>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
              <h3 className="text-xl font-bold">{dict.premium.premiumBadge}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  {"\u20AC"}{billingInterval === "monthly" ? dict.premium.monthlyPrice : dict.premium.yearlyPrice}
                </span>
                <span className="text-blue-200">
                  {billingInterval === "monthly" ? dict.premium.perMonth : dict.premium.perYear}
                </span>
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-center text-sm text-gray-500 mt-4">
                {dict.premium.cancelAnytime}
              </p>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {checkoutLoading ? dict.common.loading : dict.premium.subscribe}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}