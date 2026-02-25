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
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className={cn("w-full bg-white rounded-xl shadow-xl", sizeStyles[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">X</button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
