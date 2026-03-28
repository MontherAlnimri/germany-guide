import React from "react";
import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; padding?: boolean; hover?: boolean; onClick?: () => void; }

export function Card({ children, className, padding = true, hover = false, onClick }: CardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-premium transition-all duration-300 dark:bg-gray-800 dark:border-gray-700", padding && "p-6", hover && "card-hover cursor-pointer", className)} onClick={onClick}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-semibold text-gray-900 dark:text-gray-100", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-gray-500 mt-1 dark:text-gray-400", className)}>{children}</p>;
}
