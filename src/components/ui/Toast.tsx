"use client";
import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

type Action =
  | { type: "ADD"; toast: Toast }
  | { type: "EXIT"; id: number }
  | { type: "REMOVE"; id: number };

let nextId = 0;

function reducer(state: Toast[], action: Action): Toast[] {
  switch (action.type) {
    case "ADD": return [...state, action.toast];
    case "EXIT": return state.map(t => t.id === action.id ? { ...t, exiting: true } : t);
    case "REMOVE": return state.filter(t => t.id !== action.id);
    default: return state;
  }
}

const ToastContext = createContext<((message: string, type?: ToastType, duration?: number) => void) | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used within ToastProvider");
  return { toast };
}

const icons: Record<ToastType, string> = {
  success: "\u2713",
  error: "\u2717",
  warning: "\u26A0",
  info: "\u2139",
};

const colors: Record<ToastType, string> = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700/50",
  error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700/50",
  warning: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/50 dark:text-amber-200 dark:border-amber-700/50",
  info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700/50",
};

const iconColors: Record<ToastType, string> = {
  success: "bg-emerald-500 dark:bg-emerald-400",
  error: "bg-red-500 dark:bg-red-400",
  warning: "bg-amber-500 dark:bg-amber-400",
  info: "bg-blue-500 dark:bg-blue-400",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-premium-lg backdrop-blur-sm ${colors[toast.type]} ${toast.exiting ? "animate-toast-out" : "animate-toast-in"}`}
      onAnimationEnd={() => { if (toast.exiting) onDismiss(toast.id); }}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-full ${iconColors[toast.type]} text-white text-xs flex items-center justify-center font-bold`}>
        {icons[toast.type]}
      </span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity text-sm ml-2">&times;</button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(reducer, []);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = ++nextId;
    dispatch({ type: "ADD", toast: { id, message, type } });
    setTimeout(() => dispatch({ type: "EXIT", id }), duration);
  }, []);

  const removeToast = useCallback((id: number) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
          {toasts.map(t => (
            <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
