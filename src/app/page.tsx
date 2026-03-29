"use client";

import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import AuthCodeHandler from "@/components/AuthCodeHandler";
import { useDict } from "@/lib/i18n/context";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import LegalFooter from "@/components/layout/LegalFooter";
import StructuredData from "@/components/StructuredData";
import { FeaturedGuides, FAQSection } from "@/components/FeaturedGuidesAndFAQ";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ClipboardList, FolderOpen, Clock, Globe } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 600;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const dict = useDict();
  const l = dict?.landing;
  const p = dict?.premium;
  const [yearly, setYearly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <StructuredData />
      <Suspense fallback={null}><AuthCodeHandler /></Suspense>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* ===== NAVBAR ===== */}
        <nav className="glass-nav border-b border-gray-200/60 dark:border-gray-700/60 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-bold text-gradient">
              {dict?.common?.appName || "Germany Guide"}
            </span>
            <div className="hidden sm:flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle compact />
              <Link href="/login" className="text-sm text-gray-600 hover:text-blue-700 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">
                {dict?.auth?.signIn || "Sign In"}
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-5 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-[0.97]">
                {l?.getStarted || "Get Started Free"}
              </Link>
            </div>
            <div className="flex sm:hidden items-center gap-2">
              <LanguageSwitcher compact />
              <ThemeToggle compact />
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {menuOpen && (
            <div className="sm:hidden border-t border-gray-100 dark:border-gray-700 px-4 py-3 space-y-2 bg-white dark:bg-gray-900 animate-fade-in">
              <Link href="/login" className="block py-2.5 px-3 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMenuOpen(false)}>
                {dict?.auth?.signIn || "Sign In"}
              </Link>
              <Link href="/register" className="block py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg text-center hover:from-blue-700 hover:to-indigo-700" onClick={() => setMenuOpen(false)}>
                {l?.getStarted || "Get Started Free"}
              </Link>
            </div>
          )}
        </nav>

        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-hero-gradient" />
          {/* Decorative blobs — contained to prevent overflow glitch */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-blob will-change-transform" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-blob delay-500 will-change-transform" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative py-16 sm:py-28 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-blue-100 text-sm font-medium mb-6 animate-fade-in">
                <span>{"\u{1F1E9}\u{1F1EA}"}</span>
                <span>{l?.featuresTitle ? "11 Languages" : "Available in 11 Languages"}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-5 sm:mb-6 leading-tight animate-fade-in-up">
                <span className="text-white">{l?.heroTitle?.split(" ").slice(0, 2).join(" ") || "Navigate German"} </span>
                <span className="text-gradient-animated">{l?.heroTitle?.split(" ").slice(2).join(" ") || "Bureaucracy with Confidence"}</span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100/90 mb-8 sm:mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
                {l?.heroSubtitle || "Step-by-step guidance for visas, registration, and settling in Germany. Available in 11 languages."}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 animate-fade-in-up delay-300">
                <Link href="/register" className="bg-white text-blue-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97] text-center">
                  {l?.getStarted || "Get Started Free"}
                </Link>
                <a href="#features" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all text-center">
                  {l?.learnMore || "Learn More"}
                </a>
              </div>
              {/* Trust badge */}
              <div className="flex justify-center mt-10 sm:mt-14 animate-fade-in-up delay-500">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span className="text-sm text-blue-100 font-medium">{l?.trustBadge ?? "Free & open to everyone"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom dual wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" className="w-full">
              <path d="M0 100V50C240 90 480 10 720 50C960 90 1200 20 1440 60V100H0Z" className="fill-gray-50/50 dark:fill-gray-800/50" />
              <path d="M0 100V60C240 90 480 20 720 50C960 80 1200 30 1440 60V100H0Z" className="fill-gray-50 dark:fill-gray-900" />
            </svg>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-16 sm:py-24 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {l?.featuresTitle || "Everything you need to settle in Germany"}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { icon: <ClipboardList className="w-6 h-6 text-white" />, title: l?.feature1Title || "Visa Flow Engine", desc: l?.feature1Desc || "Personalized step-by-step guides based on your visa type.", color: "from-blue-500 to-blue-600" },
                { icon: <FolderOpen className="w-6 h-6 text-white" />, title: l?.feature2Title || "Document Vault", desc: l?.feature2Desc || "Track all your important documents in one place.", color: "from-emerald-500 to-emerald-600" },
                { icon: <Clock className="w-6 h-6 text-white" />, title: l?.feature3Title || "Deadline Reminders", desc: l?.feature3Desc || "Never miss a visa renewal or appointment.", color: "from-amber-500 to-orange-500" },
                { icon: <Globe className="w-6 h-6 text-white" />, title: l?.feature4Title || "11 Languages", desc: l?.feature4Desc || "Available in 11 languages.", color: "from-purple-500 to-indigo-600" },
              ].map((f, i) => (
                <div key={i} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-premium card-hover border border-gray-100/80 dark:border-gray-700/80 stagger-item">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 sm:py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {l?.howItWorksTitle || "How It Works"}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                { step: "1", title: l?.step1Title || "Create Your Account", desc: l?.step1Desc || "Sign up for free and tell us about your visa type." },
                { step: "2", title: l?.step2Title || "Follow Your Flow", desc: l?.step2Desc || "Get a personalized checklist of steps." },
                { step: "3", title: l?.step3Title || "Track Progress", desc: l?.step3Desc || "Mark steps as done and never miss a deadline." },
              ].map((s, i) => (
                <div key={i} className="text-center relative stagger-item">
                  {i < 2 && (
                    <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-blue-200 dark:border-blue-800" />
                  )}
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/25 hover:animate-ring-pulse transition-all cursor-default">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {l?.pricingTitle || "Simple, Transparent Pricing"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {l?.pricingSubtitle || "Start for free. Upgrade when you need more."}
              </p>
            </div>
            {/* Pricing toggle */}
            <div className="flex justify-center mb-8 sm:mb-10">
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex">
                <div className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-white dark:bg-gray-700 rounded-full shadow-md transition-all duration-300 ${yearly ? "left-[50%]" : "left-1"}`} />
                <button onClick={() => setYearly(false)} className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${!yearly ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                  {l?.premiumMonthly || "Monthly"}
                </button>
                <button onClick={() => setYearly(true)} className={`relative z-10 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${yearly ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                  {l?.premiumYearly || "Yearly"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-premium card-hover">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{l?.freeTier || "Free"}</h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{"\u20AC"}0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{l?.freePriceLabel || "Free forever"}</p>
                <ul className="space-y-3 mb-8">
                  {[l?.freeFeature1 || "Up to 3 active flows", l?.freeFeature2 || "Up to 10 documents", l?.freeFeature3 || "Basic deadline tracking", l?.freeFeature4 || "All 11 languages"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block text-center w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  {l?.getStarted || "Get Started Free"}
                </Link>
              </div>
              {/* Premium Plan */}
              <div className="relative rounded-2xl gradient-border">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 shadow-premium-lg hover-glow text-white h-full">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                      {p?.mostPopular || "Most Popular"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{l?.premiumTier || "Premium"}</h3>
                  <p className="text-4xl font-bold mb-1">{"\u20AC"}{yearly ? (p?.yearlyPrice || "39.99") : (p?.monthlyPrice || "4.99")}</p>
                  <p className="text-sm text-blue-200 mb-6">
                    {yearly ? (p?.billedYearly || "Billed yearly") : (p?.billedMonthly || "Billed monthly")}
                    {yearly && <span className="ml-2 text-amber-300 font-semibold">{p?.savePercent || "Save 33%"}</span>}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[p?.feature1 || "Unlimited flows", p?.feature2 || "Unlimited documents", p?.feature3 || "Priority reminders", p?.feature4 || "Ad-free experience", p?.feature5 || "PDF export", p?.feature6 || "Priority support"].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-blue-50">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/premium" className="block text-center w-full bg-white text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                    {p?.subscribe || "Subscribe Now"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="relative overflow-hidden py-16 sm:py-20 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          {/* Floating decorations */}
          <div className="absolute top-6 left-[10%] w-3 h-3 bg-white/20 rounded-full animate-float" />
          <div className="absolute top-12 right-[15%] w-2 h-2 bg-white/15 rounded-full animate-float-delayed" />
          <div className="absolute bottom-8 left-[25%] w-4 h-4 bg-white/10 rounded-full animate-float" />
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">{l?.ctaTitle || "Ready to simplify your move to Germany?"}</h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8">{l?.ctaSubtitle || "Start your free account and get step-by-step guidance for your visa, registration, and more."}</p>
            <Link href="/register" className="inline-block bg-white text-blue-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.97]">
              {l?.ctaButton || "Create Free Account"}
            </Link>
          </div>
        </section>

        <FeaturedGuides />
        <FAQSection />
        <LegalFooter />
      </div>
    </>
  );
}
