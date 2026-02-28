"use client";

import Link from "next/link";
import { useDict } from "@/lib/i18n/context";

interface LimitModalProps {
  type: "flow" | "document";
  current: number;
  max: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LimitModal({
  type,
  current,
  max,
  isOpen,
  onClose,
}: LimitModalProps) {
  const dict = useDict();

  if (!isOpen) return null;

  const title =
    type === "flow"
      ? dict.flows?.title || "Flows"
      : dict.docs?.title || "Documents";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title} Limit Reached
          </h3>
          <p className="text-gray-600 mb-2">
            You have reached the free plan limit of{" "}
            <span className="font-semibold">{max}</span> {title.toLowerCase()}.
          </p>
          <p className="text-gray-600 mb-6">
            Currently using: <span className="font-semibold">{current}</span> /{" "}
            {max}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/premium"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              {dict.premium?.upgradeNow || "Upgrade to Premium"}
            </Link>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {dict.common?.close || "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}