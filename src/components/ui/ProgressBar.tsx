import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps { value: number; className?: string; showLabel?: boolean; size?: "sm" | "md" | "lg"; }
const sizeStyles = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

export function ProgressBar({ value, className, showLabel = true, size = "md" }: ProgressBarProps) {
  const v = Math.min(100, Math.max(0, value));
  const color = v >= 100 ? "bg-green-500" : v >= 50 ? "bg-blue-500" : v >= 25 ? "bg-yellow-500" : "bg-gray-400";
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(v)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeStyles[size])}>
        <div className={cn("h-full rounded-full transition-all duration-500 ease-out", color)} style={{ width: v + "%" }} />
      </div>
    </div>
  );
}
