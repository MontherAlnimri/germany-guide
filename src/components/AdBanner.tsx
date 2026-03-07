"use client";

import { useSubscription } from "@/hooks/useSubscription";
import { useDict } from "@/lib/i18n/context";

interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({ slot, format = "horizontal", className = "" }: AdBannerProps) {
  const { isPremium, loading } = useSubscription();
  const dict = useDict();

  if (loading || isPremium) return null;

  const sizeClasses = {
    horizontal: "h-[60px] sm:h-[90px] w-full",
    vertical: "w-full sm:w-[160px] h-[200px] sm:h-[600px]",
    rectangle: "w-full sm:w-[300px] h-[200px] sm:h-[250px]",
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`${sizeClasses[format]} bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-lg flex items-center justify-center`}
      >
        <div className="text-center p-4">
          <p className="text-xs text-gray-400 mb-1">{dict.ads.placeholder}</p>
          <p className="text-xs sm:text-sm text-gray-500">
            {dict.ads.hiddenForPremium}
          </p>
        </div>
      </div>
    </div>
  );
}