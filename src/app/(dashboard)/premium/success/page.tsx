"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDict } from "@/lib/i18n/context";

export default function PremiumSuccessPage() {
  const dict = useDict();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-6">{"\u{1F389}"}</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {dict.premium.successTitle}
      </h1>
      <p className="text-gray-600 text-lg mb-2">
        {dict.premium.successDesc}
      </p>
      <p className="text-gray-500 mb-6">
        {dict.premium.cancelAnytime}
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