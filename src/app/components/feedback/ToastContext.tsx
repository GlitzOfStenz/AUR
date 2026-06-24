"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <AnimatePresence>
          {toasts.map((toast) => {
            const style = variantStyles[toast.variant];
            const Icon = style.icon;
            return (
              <motion.div
                key={toast.id}
                role="status"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex items-start gap-3 border bg-white px-4 py-3 text-xs font-medium text-slate-800 shadow-xl dark:bg-cyber-gray dark:text-slate-100 ${style.border}`}
              >
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${style.iconClass}`} />
                <span className="leading-relaxed">{toast.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
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
