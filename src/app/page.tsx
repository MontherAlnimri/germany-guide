"use client";

import Link from "next/link";
import { useState } from "react";
import { useDict } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import LegalFooter from "@/components/layout/LegalFooter";
import StructuredData from "@/components/StructuredData";

export default function LandingPage() {
  const dict = useDict();
  const l = dict.landing;
  const p = dict.premium;
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="text-xl font-bold text-blue-700">
              {dict.common?.appName || "Germany Guide"}
            </span>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-blue-700 font-medium"
              >
                {dict.auth?.signIn || "Sign In"}
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {l?.getStarted || "Get Started Free"}
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {l?.heroTitle || "Navigate German Bureaucracy with Confidence"}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {l?.heroSubtitle ||
                "Step-by-step guidance for visas, registration, and settling in Germany. Available in 11 languages."}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {l?.getStarted || "Get Started Free"}
              </Link>
              <a
                href="#features"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {l?.learnMore || "Learn More"}
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {l?.featuresTitle || "Everything you need to settle in Germany"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "\u{1F4CB}",
                  title: l?.feature1Title || "Visa Flow Engine",
                  desc: l?.feature1Desc || "Personalized step-by-step guides based on your visa type.",
                },
                {
                  icon: "\u{1F4C2}",
                  title: l?.feature2Title || "Document Vault",
                  desc: l?.feature2Desc || "Track all your important documents in one place.",
                },
                {
                  icon: "\u{23F0}",
                  title: l?.feature3Title || "Deadline Reminders",
                  desc: l?.feature3Desc || "Never miss a visa renewal or appointment.",
                },
                {
                  icon: "\u{1F310}",
                  title: l?.feature4Title || "11 Languages",
                  desc: l?.feature4Desc || "Available in 11 languages.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {l?.howItWorksTitle || "How It Works"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: l?.step1Title || "Create Your Account",
                  desc: l?.step1Desc || "Sign up for free and tell us about your visa type.",
                },
                {
                  step: "2",
                  title: l?.step2Title || "Follow Your Flow",
                  desc: l?.step2Desc || "Get a personalized checklist of steps.",
                },
                {
                  step: "3",
                  title: l?.step3Title || "Track Progress",
                  desc: l?.step3Desc || "Mark steps as done and never miss a deadline.",
                },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              {l?.pricingTitle || "Simple, Transparent Pricing"}
            </h2>
            <p className="text-center text-gray-600 mb-8">
              {l?.pricingSubtitle || "Start for free. Upgrade when you need more."}
            </p>

            <div className="flex justify-center mb-8">
              <div className="bg-gray-200 rounded-full p-1 flex">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                  }`}
                >
                  {l?.premiumMonthly || "Monthly"}
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
                  }`}
                >
                  {l?.premiumYearly || "Yearly"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {l?.freeTier || "Free"}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {"\u20AC"}0
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {l?.freePriceLabel || "Free forever"}
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    l?.freeFeature1 || "Up to 3 active flows",
                    l?.freeFeature2 || "Up to 10 documents",
                    l?.freeFeature3 || "Basic deadline tracking",
                    l?.freeFeature4 || "All 11 languages",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block text-center w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {l?.getStarted || "Get Started Free"}
                </Link>
              </div>

              {/* Premium */}
              <div className="bg-white rounded-2xl border-2 border-blue-600 p-8 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {p?.mostPopular || "Most Popular"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {l?.premiumTier || "Premium"}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {"\u20AC"}{yearly ? (p?.yearlyPrice || "39.99") : (p?.monthlyPrice || "4.99")}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {yearly
                    ? (p?.billedYearly || "Billed yearly")
                    : (p?.billedMonthly || "Billed monthly")}
                  {yearly && (
                    <span className="ml-2 text-green-600 font-medium">
                      {p?.savePercent || "Save 33%"}
                    </span>
                  )}
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    p?.feature1 || "Unlimited flows",
                    p?.feature2 || "Unlimited documents",
                    p?.feature3 || "Priority reminders",
                    p?.feature4 || "Ad-free experience",
                    p?.feature5 || "PDF export",
                    p?.feature6 || "Priority support",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/premium"
                  className="block text-center w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {p?.subscribe || "Subscribe Now"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {l?.ctaTitle || "Ready to simplify your move to Germany?"}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {l?.ctaSubtitle || "Join thousands of migrants and students who use Germany Guide."}
            </p>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {l?.ctaButton || "Create Free Account"}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <LegalFooter />
      </div>
    </>
  );
}