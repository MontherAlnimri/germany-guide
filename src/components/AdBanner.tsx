"use client";

import { useEffect, useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { usePathname } from "next/navigation";

// Only show ads on these content-rich paths
const ALLOWED_AD_PATHS = [
  "/dashboard",
  "/flow",
  "/documents",
  "/deadlines",
];

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdBanner({
  slot = "auto",
  format = "auto",
  className = "",
}: AdBannerProps) {
  const { isPremium } = useSubscription();
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if current path is allowed for ads
    const isAllowed = ALLOWED_AD_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
    setShouldShow(isAllowed);
  }, [pathname]);

  // Never show ads to premium users
  if (isPremium) return null;

  // Never show ads on non-content pages
  if (!shouldShow) return null;

  return (
    <div className={`ad-container w-full flex justify-center my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-3388930204483365"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}