"use client";

import Link from "next/link";
import { useDict } from "@/lib/i18n/context";

export default function AboutPage() {
  const dict = useDict();
  const a = dict.about;

  const features = [
    {
      icon: "\u{1F501}",
      title: a?.feature1Title || "Smart Flow Engine",
      desc: a?.feature1Desc || "Personalized step-by-step guides based on your visa type.",
    },
    {
      icon: "\u{1F4C4}",
      title: a?.feature2Title || "Document Vault",
      desc: a?.feature2Desc || "Track all your important documents in one place.",
    },
    {
      icon: "\u{23F0}",
      title: a?.feature3Title || "Deadline Reminders",
      desc: a?.feature3Desc || "Never miss a deadline for visa renewals and more.",
    },
    {
      icon: "\u{1F310}",
      title: a?.feature4Title || "11 Languages",
      desc: a?.feature4Desc || "Available in 11 languages including Arabic, Turkish, and Ukrainian.",
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {a?.title || "About Germany Guide"}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {a?.subtitle || "Making German bureaucracy manageable for everyone"}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {a?.missionTitle || "Our Mission"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {a?.missionContent || "Moving to Germany is exciting but navigating the bureaucracy can be overwhelming."}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {a?.whatWeDoTitle || "What We Do"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
          {a?.whatWeDoContent || "We provide step-by-step guides tailored to your visa type and situation."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {a?.whoWeAreTitle || "Who We Are"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
          {a?.whoWeAreContent || "Germany Guide was created by migrants who experienced the challenges of German bureaucracy firsthand."}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">
          {a?.ctaTitle || "Ready to get started?"}
        </h2>
        <p className="text-blue-100 mb-6 text-lg">
          {a?.ctaContent || "Create your free account and let us guide you through the process."}
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          {a?.ctaButton || "Get Started Free"}
        </Link>
      </div>
    </div>
  );
}
