"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, X } from "lucide-react";

const PROMPT_DELAY_MS = 5_000;

interface DiscoveryJoinModalProps {
  onLogIn: () => void;
  onSignUp: () => void;
  onClose?: () => void;
}

export default function DiscoveryJoinModal({
  onLogIn,
  onSignUp,
  onClose,
}: DiscoveryJoinModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer: number | undefined;

    const startPromptTimer = () => {
      if (timer !== undefined) return;
      timer = window.setTimeout(() => setIsOpen(true), PROMPT_DELAY_MS);
      window.removeEventListener("scroll", startPromptTimer);
    };

    window.addEventListener("scroll", startPromptTimer, { passive: true });

    return () => {
      window.removeEventListener("scroll", startPromptTimer);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#071a2f]/55 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
      role="presentation"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="discovery-join-title"
        aria-describedby="discovery-join-description"
        className="relative w-full max-w-lg overflow-hidden border border-amber-200/80 bg-white shadow-[0_28px_80px_rgba(7,26,47,0.32)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (✕) Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="h-1.5 bg-gradient-to-r from-[#d8a12e] via-amber-400 to-[#1a365d]" />
        <div className="px-6 pb-6 pt-8 sm:px-9 sm:pb-9 sm:pt-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            Your discovery journey
          </span>
          <h2
            id="discovery-join-title"
            className="mt-3 max-w-md text-2xl font-bold leading-tight text-[#122b49] sm:text-3xl"
          >
            Make university discovery personal
          </h2>
          <p
            id="discovery-join-description"
            className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base"
          >
            Join AUR to keep your research organized and return to the institutions
            that matter most to you.
          </p>

          <div className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {["Save universities", "Build comparisons"].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {benefit}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSignUp}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-[#1a365d] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#254a78]"
            >
              Sign Up
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onLogIn}
              className="inline-flex min-h-12 flex-1 items-center justify-center border border-[#1a365d]/20 bg-white px-5 py-3 text-sm font-bold text-[#1a365d] transition-colors hover:bg-slate-50"
            >
              Log In
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}
