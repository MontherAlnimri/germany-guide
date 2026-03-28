"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps { value: number; className?: string; showLabel?: boolean; size?: "sm" | "md" | "lg"; }
const sizeStyles = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function ProgressBar({ value, className, showLabel = true, size = "md" }: ProgressBarProps) {
  const v = Math.min(100, Math.max(0, value));
  const [width, setWidth] = useState(0);
  const color = v >= 100 ? "from-green-400 to-emerald-500" : v >= 50 ? "from-blue-400 to-indigo-500" : v >= 25 ? "from-amber-400 to-orange-500" : "from-gray-300 to-gray-400";

  useEffect(() => {
    const t = requestAnimationFrame(() => setWidth(v));
    return () => cancelAnimationFrame(t);
  }, [v]);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{Math.round(v)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700", sizeStyles[size])} role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out", color)} style={{ width: width + "%" }} />
      </div>
    </div>
  );
}
