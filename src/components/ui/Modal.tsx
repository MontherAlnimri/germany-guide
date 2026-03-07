"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm" | "md" | "lg"; }
const sizeStyles = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) { document.addEventListener("keydown", handleEscape); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = "unset"; };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className={cn("w-full bg-white shadow-xl sm:rounded-xl rounded-t-xl max-h-[90vh] flex flex-col", sizeStyles[size])}>
        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center">X</button>
          </div>
        )}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}