"use client";

import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import Link from "next/link";

export default function TrialBanner() {
  const dict = useDict();
  const { isTrialing, trialDaysLeft, loading } = useSubscription();
  const t = dict?.trial;

  if (loading || !isTrialing) return null;

  const daysText =
    trialDaysLeft === 1
      ? t?.dayLeft ?? "1 day left"
      : (t?.daysLeft ?? "{days} days left").replace(
          "{days}",
          String(trialDaysLeft)
        );

  const bannerDesc = (t?.trialBannerDesc ?? "").replace(
    "{days}",
    String(trialDaysLeft)
  );

  // Color shifts as trial nears end
  const isUrgent = trialDaysLeft <= 2;
  const isWarning = trialDaysLeft <= 4 && !isUrgent;

  const bgColor = isUrgent
    ? "bg-red-50 border-red-200"
    : isWarning
    ? "bg-amber-50 border-amber-200"
    : "bg-blue-50 border-blue-200";

  const textColor = isUrgent
    ? "text-red-800"
    : isWarning
    ? "text-amber-800"
    : "text-blue-800";

  const badgeColor = isUrgent
    ? "bg-red-100 text-red-700"
    : isWarning
    ? "bg-amber-100 text-amber-700"
    : "bg-blue-100 text-blue-700";

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">
            {isUrgent ? "\u23F3" : "\u2728"}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-semibold ${textColor}`}>
                {t?.trialBanner ?? "You have a free trial!"}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}
              >
                {daysText}
              </span>
            </div>
            <p className={`text-sm mt-1 ${textColor} opacity-80`}>
              {bannerDesc}
            </p>
          </div>
        </div>
        <Link
          href="/premium"
          className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex-shrink-0 ${
            isUrgent
              ? "bg-red-600 hover:bg-red-700"
              : isWarning
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {t?.keepPremium ?? "Keep Premium Access"}
        </Link>
      </div>
    </div>
  );
}