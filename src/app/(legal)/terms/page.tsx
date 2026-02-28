"use client";

import { useDict } from "@/lib/i18n/context";

export default function TermsPage() {
  const dict = useDict();
  const t = dict.terms;

  const sections = [
    { title: t?.section1Title, content: t?.section1Content },
    { title: t?.section2Title, content: t?.section2Content },
    { title: t?.section3Title, content: t?.section3Content },
    { title: t?.section4Title, content: t?.section4Content },
    { title: t?.section5Title, content: t?.section5Content },
    { title: t?.section6Title, content: t?.section6Content },
    { title: t?.section7Title, content: t?.section7Content },
    { title: t?.section8Title, content: t?.section8Content },
    { title: t?.section9Title, content: t?.section9Content },
    { title: t?.section10Title, content: t?.section10Content },
    { title: t?.section11Title, content: t?.section11Content },
    { title: t?.section12Title, content: t?.section12Content },
  ];

  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {t?.title || "Terms of Service"}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t?.lastUpdated || "Last updated: July 2025"}
      </p>
      <p className="text-gray-700 mb-8 text-lg leading-relaxed">
        {t?.intro || "By using Germany Guide, you agree to these Terms of Service."}
      </p>

      {sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {index + 1}. {section.title}
          </h2>
          <p className="text-gray-700 leading-relaxed">{section.content}</p>
        </div>
      ))}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          {"support@my-germany-guide.vercel.app"}
        </p>
      </div>
    </div>
  );
}