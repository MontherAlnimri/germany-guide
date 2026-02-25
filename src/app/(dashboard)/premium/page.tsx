'use client';

import { useState } from 'react';
import { useDict } from '@/lib/i18n';
import { useSubscription } from '@/hooks/useSubscription';
import { getStripe } from '@/lib/stripe/client';

export default function PremiumPage() {
  const dict = useDict();
  const { subscription, isPremium, loading } = useSubscription();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: billingInterval }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Failed to start checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Failed to open portal');
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {dict.premium.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {dict.premium.subtitle}
        </p>
      </div>

      {isPremium && subscription ? (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">👑</div>
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            {dict.premium.thankYou}
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-2">
            {dict.premium.welcomePremium}
          </p>
          <div className="mt-4 space-y-1 text-sm text-yellow-600 dark:text-yellow-400">
            <p>
              {dict.premium.active} — {subscription.plan === 'monthly' ? dict.premium.monthlyPrice : dict.premium.yearlyPrice}
            </p>
            {subscription.current_period_end && (
              <p>
                {subscription.status === 'cancelled' ? dict.premium.expiresOn : dict.premium.renewsOn}:{' '}
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleManage}
            className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            {dict.premium.manage}
          </button>
        </div>
      ) : (
        <>
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                billingInterval === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {dict.premium.monthly}
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                billingInterval === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {dict.premium.yearly}
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {dict.premium.savePercent}
              </span>
            </button>
          </div>

          {/* Pricing card */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
              <h3 className="text-xl font-bold">{dict.landing.premium}</h3>
              <div className="mt-2">
                <span className="text-4xl font-bold">
                  {billingInterval === 'monthly' ? '€4.99' : '€39.99'}
                </span>
                <span className="text-blue-200">
                  /{billingInterval === 'monthly' ? dict.premium.monthly.toLowerCase() : dict.premium.yearly.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {checkoutLoading ? dict.premium.processing : dict.premium.subscribe}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}