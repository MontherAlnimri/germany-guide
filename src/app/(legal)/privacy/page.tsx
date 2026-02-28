"use client";

import { useDict } from "@/lib/i18n/context";

export default function PrivacyPage() {
  const dict = useDict();
  const p = dict.privacy;

  const sections = [
    { title: p?.section1Title, content: p?.section1Content },
    { title: p?.section2Title, content: p?.section2Content },
    { title: p?.section3Title, content: p?.section3Content },
    { title: p?.section4Title, content: p?.section4Content },
    { title: p?.section5Title, content: p?.section5Content },
    { title: p?.section6Title, content: p?.section6Content },
    { title: p?.section7Title, content: p?.section7Content },
    { title: p?.section8Title, content: p?.section8Content },
    { title: p?.section9Title, content: p?.section9Content },
    { title: p?.section10Title, content: p?.section10Content },
  ];

  return (
    <div className="prose prose-blue max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {p?.title || "Privacy Policy"}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {p?.lastUpdated || "Last updated: July 2025"}
      </p>
      <p className="text-gray-700 mb-8 text-lg leading-relaxed">
        {p?.intro || "Your privacy is important to us."}
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
          {p?.contactEmail || "support@my-germany-guide.vercel.app"}
        </p>
      </div>
    </div>
  );
}