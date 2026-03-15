"use client";

import { useDict } from "@/lib/i18n/context";

export function FeaturedGuides() {
  const dict = useDict();

  const guides = [
    {
      icon: "\uD83C\uDFE2",
      category: dict?.guides?.guide1Category ?? "City Registration",
      title: dict?.guides?.guide1Title ?? "",
      desc: dict?.guides?.guide1Desc ?? "",
      time: dict?.guides?.guide1Time ?? "12",
    },
    {
      icon: "\uD83D\uDEE1\uFE0F",
      category: dict?.guides?.guide2Category ?? "Insurance",
      title: dict?.guides?.guide2Title ?? "",
      desc: dict?.guides?.guide2Desc ?? "",
      time: dict?.guides?.guide2Time ?? "14",
    },
    {
      icon: "\uD83C\uDFE6",
      category: dict?.guides?.guide3Category ?? "Banking & Finance",
      title: dict?.guides?.guide3Title ?? "",
      desc: dict?.guides?.guide3Desc ?? "",
      time: dict?.guides?.guide3Time ?? "11",
    },
    {
      icon: "\uD83C\uDFE0",
      category: dict?.guides?.guide4Category ?? "Housing",
      title: dict?.guides?.guide4Title ?? "",
      desc: dict?.guides?.guide4Desc ?? "",
      time: dict?.guides?.guide4Time ?? "15",
    },
    {
      icon: "\uD83D\uDCCB",
      category: dict?.guides?.guide5Category ?? "Visa & Residence Permits",
      title: dict?.guides?.guide5Title ?? "",
      desc: dict?.guides?.guide5Desc ?? "",
      time: dict?.guides?.guide5Time ?? "13",
    },
    {
      icon: "\uD83C\uDF93",
      category: dict?.guides?.guide6Category ?? "Education",
      title: dict?.guides?.guide6Title ?? "",
      desc: dict?.guides?.guide6Desc ?? "",
      time: dict?.guides?.guide6Time ?? "13",
    },
  ];

  return (
    <section className="py-16 bg-white" id="guides">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          {dict?.guides?.sectionTitle ?? "Free Germany Guides"}
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          {dict?.guides?.sectionSubtitle ?? ""}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow border group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{g.icon}</span>
                <span className="text-xs font-medium text-blue-600">
                  {g.category}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                {g.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">{g.desc}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                {g.time} {dict?.guides?.minRead ?? "min read"}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
            {dict?.guides?.viewAll ?? "View All Guides"} &rarr;
          </span>
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
    <section className="py-16 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          {dict?.faq?.sectionTitle ?? "Frequently Asked Questions"}
        </h2>
        <p className="text-center text-gray-600 mb-10">
          {dict?.faq?.sectionSubtitle ?? ""}
        </p>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details
              key={i}
              className="bg-white rounded-xl border p-5 group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="pr-4">{item.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl flex-shrink-0">
                  &#9662;
                </span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">{item.a}</p>
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