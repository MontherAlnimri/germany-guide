import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";
interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string; }

const styles: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700", warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700", info: "bg-blue-100 text-blue-700", neutral: "bg-gray-100 text-gray-700",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles[variant], className)}>{children}</span>;
}
