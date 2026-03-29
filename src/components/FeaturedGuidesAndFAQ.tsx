"use client";

import Link from "next/link";
import { useDict } from "@/lib/i18n/context";
import { Building2, Shield, Landmark, Home, FileCheck, GraduationCap } from "lucide-react";

export function FeaturedGuides() {
  const dict = useDict();

  const guides = [
    {
      icon: <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "anmeldung-city-registration-guide",
      category: dict?.guides?.guide1Category ?? "City Registration",
      title: dict?.guides?.guide1Title ?? "",
      desc: dict?.guides?.guide1Desc ?? "",
      time: dict?.guides?.guide1Time ?? "12",
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "german-health-insurance-guide",
      category: dict?.guides?.guide2Category ?? "Insurance",
      title: dict?.guides?.guide2Title ?? "",
      desc: dict?.guides?.guide2Desc ?? "",
      time: dict?.guides?.guide2Time ?? "14",
    },
    {
      icon: <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "opening-bank-account-germany",
      category: dict?.guides?.guide3Category ?? "Banking & Finance",
      title: dict?.guides?.guide3Title ?? "",
      desc: dict?.guides?.guide3Desc ?? "",
      time: dict?.guides?.guide3Time ?? "11",
    },
    {
      icon: <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "finding-apartment-germany",
      category: dict?.guides?.guide4Category ?? "Housing",
      title: dict?.guides?.guide4Title ?? "",
      desc: dict?.guides?.guide4Desc ?? "",
      time: dict?.guides?.guide4Time ?? "15",
    },
    {
      icon: <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "german-blue-card-guide",
      category: dict?.guides?.guide5Category ?? "Visa & Residence Permits",
      title: dict?.guides?.guide5Title ?? "",
      desc: dict?.guides?.guide5Desc ?? "",
      time: dict?.guides?.guide5Time ?? "13",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      slug: "student-visa-germany-guide",
      category: dict?.guides?.guide6Category ?? "Education",
      title: dict?.guides?.guide6Title ?? "",
      desc: dict?.guides?.guide6Desc ?? "",
      time: dict?.guides?.guide6Time ?? "13",
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900" id="guides">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          {dict?.guides?.sectionTitle ?? "Free Germany Guides"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          {dict?.guides?.sectionSubtitle ?? ""}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <Link
              key={i}
              href={`/guides/${g.slug}`}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 hover:shadow-md transition-shadow border dark:border-gray-700 group block"
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{g.icon}</span>
                <span className="text-xs font-medium text-blue-600">
                  {g.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                {g.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{g.desc}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                {g.time} {dict?.guides?.minRead ?? "min read"}
              </span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/guides" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {dict?.guides?.viewAll ?? "View All Guides"} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const dict = useDict();

  const faqItems = [
    { q: dict?.faq?.q1 ?? "", a: dict?.faq?.a1 ?? "" },
    { q: dict?.faq?.q2 ?? "", a: dict?.faq?.a2 ?? "" },
    { q: dict?.faq?.q3 ?? "", a: dict?.faq?.a3 ?? "" },
    { q: dict?.faq?.q4 ?? "", a: dict?.faq?.a4 ?? "" },
    { q: dict?.faq?.q5 ?? "", a: dict?.faq?.a5 ?? "" },
    { q: dict?.faq?.q6 ?? "", a: dict?.faq?.a6 ?? "" },
    { q: dict?.faq?.q7 ?? "", a: dict?.faq?.a7 ?? "" },
    { q: dict?.faq?.q8 ?? "", a: dict?.faq?.a8 ?? "" },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
          {dict?.faq?.sectionTitle ?? "Frequently Asked Questions"}
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
          {dict?.faq?.sectionSubtitle ?? ""}
        </p>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5 group"
            >
              <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                <span className="pr-4">{item.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl flex-shrink-0">
                  &#9662;
                </span>
              </summary>
              <p className="text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}