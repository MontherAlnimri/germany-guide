"use client";

import Link from "next/link";

interface UsageBarProps {
  label: string;
  current: number;
  max: number;
  isPremium: boolean;
}

export default function UsageBar({ label, current, max, isPremium }: UsageBarProps) {
  if (isPremium) return null;

  const percentage = Math.min((current / max) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= max;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span
          className={`text-sm font-semibold ${
            isAtLimit
              ? "text-red-600"
              : isNearLimit
              ? "text-amber-600"
              : "text-gray-600"
          }`}
        >
          {current} / {max}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isAtLimit
              ? "bg-red-500"
              : isNearLimit
              ? "bg-amber-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isAtLimit && (
        <Link
          href="/premium"
          className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block font-medium"
        >
          Upgrade for unlimited {'\u2192'}
        </Link>
      )}
    </div>
  );
}