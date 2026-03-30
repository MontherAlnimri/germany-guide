"use client";

import { Sparkles, MapPin, FileCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CalloutProps {
  children: React.ReactNode;
}

export function VisaCallout({ visaType, children }: CalloutProps & { visaType: string }) {
  const label = visaType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="my-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
            Tip for {label} holders
          </p>
          <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CityCallout({ city, children }: CalloutProps & { city: string }) {
  return (
    <div className="my-6 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">
            In {city}
          </p>
          <div className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlowCTA({
  hasActiveInstance,
  instanceId,
  progress,
  flowTitle,
  flowIcon,
  onStartFlow,
  starting,
}: {
  hasActiveInstance: boolean;
  instanceId?: string;
  progress?: number;
  flowTitle: string;
  flowIcon: string;
  onStartFlow: () => void;
  starting: boolean;
}) {
  if (hasActiveInstance && instanceId) {
    return (
      <div className="my-8 rounded-2xl border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{flowIcon}</span>
          <div className="flex-1">
            <p className="font-bold text-gray-900 dark:text-white">
              Continue: {flowTitle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You&apos;re {progress}% through this process
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <Link
          href={`/flow/${instanceId}`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 min-h-[44px]"
        >
          Continue Your Guide <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-5 sm:p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <p className="font-bold text-gray-900 dark:text-white text-lg">
          Ready to start this process?
        </p>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
        Get a personalized step-by-step guide with document tracking, deadline reminders, and progress tracking.
      </p>
      <button
        onClick={onStartFlow}
        disabled={starting}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 min-h-[44px] disabled:opacity-50"
      >
        {starting ? "Starting..." : "Start Your Personalized Guide"} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
