import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";
interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string; }

const styles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50",
  warning: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50",
  danger: "bg-red-50 text-red-700 border border-red-200/60 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700/50",
  info: "bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50",
  neutral: "bg-gray-100 text-gray-700 border border-gray-200/60 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600/50",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200", styles[variant], className)}>{children}</span>;
}
