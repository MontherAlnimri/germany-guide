"use client";

import { useRouter } from "next/navigation";
import { useDict } from "@/lib/i18n/context";

export default function ThankYouPage() {
  const dict = useDict();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6">{"\u{1F496}"}</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {dict.support.thankYouTitle}
      </h1>
      <p className="text-gray-600 mb-6">
        {dict.support.thankYouDesc}
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {dict.premium.goToDashboard}
      </button>
    </div>
  );
}