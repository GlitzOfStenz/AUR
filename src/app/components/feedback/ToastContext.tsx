"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

import { CheckCircle2, Info, AlertTriangle } from "lucide-react";

export type ToastVariant = "info" | "success" | "warning";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const variantStyles: Record<
  ToastVariant,
  { border: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    border: "border-slate-900 dark:border-cyber-yellow/30",
    icon: Info,
    iconClass: "text-slate-600 dark:text-cyber-yellow",
  },
  success: {
    border: "border-emerald-700/40 dark:border-emerald-500/40",
    icon: CheckCircle2,
    iconClass: "text-emerald-700 dark:text-emerald-400",
  },
  warning: {
    border: "border-amber-700/50 dark:border-cyber-yellow/40",
    icon: AlertTriangle,
    iconClass: "text-amber-700 dark:text-cyber-yellow",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-24 right-4 z-[60] flex w-full max-w-sm flex-col gap-2 md:bottom-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        <>
          {toasts.map((toast) => {
            const style = variantStyles[toast.variant];
            const Icon = style.icon;
            return (
              <div
                key={toast.id}
                role="status"
                
                
                
                
                className={`pointer-events-auto flex items-start gap-3 border bg-white px-4 py-3 text-xs font-medium text-slate-800 shadow-xl dark:bg-cyber-gray dark:text-slate-100 ${style.border}`}
              >
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.iconClass}`} />
                <span className="leading-relaxed">{toast.message}</span>
              </div>
            );
          })}
        </>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
