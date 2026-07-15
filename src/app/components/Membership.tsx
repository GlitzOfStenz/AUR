"use client";

import React, { useState } from "react";
import { Crown, GraduationCap, BarChart3, Search, MessageCircle, Info, Check, X, ChevronDown, User, Mail, CreditCard, CalendarDays, Lock, BookOpen, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../lib/universities";

interface MembershipTierData {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  benefits: string[];
}

// --- Application Modal Component ---
function ApplicationModal({
  isOpen,
  onClose,
  selectedTier,
  selectedTierData,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
  selectedTierData: MembershipTierData | null;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studentName: "",
    educationLevel: "",
    targetDegree: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isLoggedIn = typeof window !== "undefined" && !!sessionStorage.getItem("aur_access_token");

  // Validation logic
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentName.trim()) newErrors.studentName = "Full name is required";
    if (!formData.educationLevel) newErrors.educationLevel = "Please select your current education level";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.targetDegree) newErrors.targetDegree = "Please select a target degree";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    // Only validate if they are selecting Pro (payment needed)
    if (selectedTier !== "Pro Student") return true;

    const newErrors: Record<string, string> = {};
    if (formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = "Valid card number required";
    if (formData.expiry.length < 5) newErrors.expiry = "MM/YY required";
    if (formData.cvv.length < 3) newErrors.cvv = "CVV required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) {
      if (selectedTier === "Pro Student") {
        setStep(3);
      } else {
        setStep(4); // Skip payment if Basic
      }
    }
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleBack = () => {
    if (step === 4 && selectedTier !== "Pro Student") {
      setStep(2);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTierData) {
      setSubmitError("No tier selected. Please close and try again.");
      return;
    }

    const token = sessionStorage.getItem("aur_access_token");
    if (!token) {
      setSubmitError("You need to be logged in to subscribe. Please log in and try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/membership/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier_id: selectedTierData.id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Failed to complete subscription. Please try again.");
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({ studentName: "", educationLevel: "", targetDegree: "", email: "", cardNumber: "", expiry: "", cvv: "" });
      setErrors({});
      setIsSuccess(false);
      setSubmitError(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--aur-border)] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--aur-text)]">Student Sign Up</h3>
                <p className="text-xs text-[var(--aur-text-muted)] uppercase tracking-wider font-bold mt-1">
                  Plan: <span className="text-[var(--aur-text)]">{selectedTier}</span>
                  {selectedTierData && (
                    <span className="text-[var(--aur-text-muted)] normal-case font-normal"> — ${selectedTierData.price.toLocaleString()}/year</span>
                  )}
                </p>
              </div>
              <button onClick={handleClose} className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors rounded-full hover:bg-[var(--aur-surface-2)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {!isLoggedIn ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[var(--aur-text)] mb-2">Please Log In</h4>
                  <p className="text-[var(--aur-text-secondary)] mb-6 text-sm">
                    You need an account to subscribe to a membership plan. Please log in or create an account first.
                  </p>
                  <button onClick={handleClose} className="w-full py-3 px-4 bg-[var(--aur-text)] text-[var(--background)] rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                    Close
                  </button>
                </div>
              ) : isSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[var(--aur-text)] mb-2">Welcome Aboard!</h4>
                  <p className="text-[var(--aur-text-secondary)] mb-6">
                    Your {selectedTier} account has been successfully created. Check your email for next steps.
                  </p>
                  <button onClick={handleClose} className="w-full py-3 px-4 bg-[var(--aur-text)] text-[var(--background)] rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                    Go to Dashboard
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Progress Indicator */}
                  <div className="flex gap-2 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-[var(--aur-text)]" : "bg-[var(--aur-border)]"}`} />
                    ))}
                  </div>

                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => { setFormData({ ...formData, studentName: e.target.value }); setErrors({ ...errors, studentName: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.studentName ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="e.g. Jane Doe"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.studentName && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.studentName}</motion.p>}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Current Education Level</label>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)] z-10" />
                          <select
                            value={formData.educationLevel}
                            onChange={(e) => { setFormData({ ...formData, educationLevel: e.target.value }); setErrors({ ...errors, educationLevel: "" }); }}
                            className={`w-full appearance-none bg-[var(--aur-surface-2)] border ${errors.educationLevel ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                          >
                            <option value="" disabled>Select Level</option>
                            <option value="High School">High School</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Professional">Professional</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)] pointer-events-none" />
                        </div>
                        <AnimatePresence>
                          {errors.educationLevel && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.educationLevel}</motion.p>}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Target Degree</label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)] z-10" />
                          <select
                            value={formData.targetDegree}
                            onChange={(e) => { setFormData({ ...formData, targetDegree: e.target.value }); setErrors({ ...errors, targetDegree: "" }); }}
                            className={`w-full appearance-none bg-[var(--aur-surface-2)] border ${errors.targetDegree ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                          >
                            <option value="" disabled>Select Target Degree</option>
                            <option value="Bachelors">Bachelors Degree</option>
                            <option value="Masters">Masters Degree</option>
                            <option value="PhD">PhD / Doctorate</option>
                            <option value="Diploma">Diploma / Certificate</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)] pointer-events-none" />
                        </div>
                        <AnimatePresence>
                          {errors.targetDegree && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.targetDegree}</motion.p>}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Personal Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.email ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="name@example.com"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.email && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</motion.p>}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment (Pro Only) — cosmetic only, not processed by backend */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3 mb-2">
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                          Demo mode: payment details are not processed or stored. Your subscription will be activated without an actual charge.
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            maxLength={19}
                            value={formData.cardNumber}
                            onChange={(e) => {
                               let val = e.target.value.replace(/\D/g, "").slice(0, 16);
                               val = val.replace(/(.{4})/g, "$1 ").trim();
                               setFormData({ ...formData, cardNumber: val });
                               setErrors({ ...errors, cardNumber: "" });
                               }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.cardNumber ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.cardNumber && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.cardNumber}</motion.p>}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Expiry</label>
                          <div className="relative">
                            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                            <input
                              type="text"
                              maxLength={5}
                              value={formData.expiry}
                              onChange={(e) => {
  let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 1) {
    let month = digits.slice(0, 2);
    if (digits.length >= 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1) month = "01";
      if (monthNum > 12) month = "12";
    }
    const year = digits.slice(2, 4);
    setFormData({ ...formData, expiry: digits.length > 2 ? `${month}/${year}` : month });
  } else {
    setFormData({ ...formData, expiry: "" });
  }
  setErrors({ ...errors, expiry: "" });
}}
                              className={`w-full bg-[var(--aur-surface-2)] border ${errors.expiry ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                              placeholder="MM/YY"
                            />
                          </div>
                          <AnimatePresence>
                            {errors.expiry && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.expiry}</motion.p>}
                          </AnimatePresence>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">CVV</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                            <input
                              type="text"
                              maxLength={4}
                              value={formData.cvv}
                              onChange={(e) => { setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") }); setErrors({ ...errors, cvv: "" }); }}
                              className={`w-full bg-[var(--aur-surface-2)] border ${errors.cvv ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                              placeholder="123"
                            />
                          </div>
                          <AnimatePresence>
                            {errors.cvv && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.cvv}</motion.p>}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {step === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="bg-[var(--aur-surface-2)] rounded-xl p-4 border border-[var(--aur-border)]">
                        <h4 className="text-sm font-bold text-[var(--aur-text)] mb-3 uppercase tracking-widest">Review Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[var(--aur-text-muted)]">Name</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">{formData.studentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--aur-text-muted)]">Goal</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">{formData.targetDegree}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--aur-text-muted)]">Plan</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">
                              {selectedTier}{selectedTierData && ` — $${selectedTierData.price.toLocaleString()}/year`}
                            </span>
                          </div>
                          {selectedTier === "Pro Student" && (
                            <div className="flex justify-between">
                              <span className="text-[var(--aur-text-muted)]">Payment</span>
                              <span className="font-medium text-[var(--aur-text)] text-right">•••• {formData.cardNumber.slice(-4)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {submitError && (
                        <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-3">
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-red-700 dark:text-red-400">{submitError}</p>
                        </div>
                      )}

                      <p className="text-xs text-[var(--aur-text-muted)] text-center">
                        By submitting, you agree to our Terms of Service.
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {isLoggedIn && !isSuccess && (
              <div className="p-6 border-t border-[var(--aur-border)] bg-[var(--aur-surface-2)] flex justify-between">
                <button
                  onClick={() => step > 1 ? handleBack() : handleClose()}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] transition-colors"
                >
                  {step > 1 ? "Back" : "Cancel"}
                </button>
                <button
                  onClick={step === 4 ? handleSubmit : handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[var(--aur-text)] text-[var(--background)] rounded-lg text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full" />
                  ) : step === 4 ? "Complete Sign Up" : "Continue"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Comparison Matrix Component ---
function FeatureComparisonMatrix() {
  const features = [
    { name: "Access Official Rankings", guest: true, basic: true, pro: true },
    { name: "Standard Search & Filters", guest: true, basic: true, pro: true },
    { name: "Save Universities to List", guest: false, basic: true, pro: true },
    { name: "Personalized University Matching", guest: false, basic: false, pro: true },
    { name: "Admission Probability Predictor", guest: false, basic: false, pro: true },
    { name: "Scholarships Database Access", guest: false, basic: false, pro: true },
    { name: "Direct Alumni Chat", guest: false, basic: false, pro: true },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 md:px-0">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl font-bold text-[var(--aur-text)] mb-3">Compare Plans</h3>
        <p className="text-[var(--aur-text-secondary)]">Discover the right toolkit for your academic journey.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-[var(--aur-border)] text-[var(--aur-text-secondary)] font-bold uppercase tracking-widest text-xs w-2/5">Feature</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg">Guest</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg">Basic</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg bg-[var(--aur-surface-2)] rounded-t-xl">Pro</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="hover:bg-[var(--aur-surface-hover)] transition-colors">
                <td className="p-4 border-b border-[var(--aur-border)] text-sm font-medium text-[var(--aur-text)]">{f.name}</td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center">
                  {f.guest ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
                </td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center">
                  {f.basic ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
                </td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center bg-[var(--aur-surface-2)]">
                  {f.pro ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- FAQ Component ---
function FAQSection() {
  const faqs = [
    {
      q: "Does Pro Student guarantee university admission?",
      a: "No. The Admission Probability Predictor is an AI-driven tool based on historical data and current trends, but it does not guarantee admission to any institution."
    },
    {
      q: "How does the Personalized Matching work?",
      a: "We analyze your academic background, test scores, target degree, and preferences to recommend institutions where you have the strongest fit and highest probability of success."
    },
    {
      q: "Can I cancel my Pro Student subscription anytime?",
      a: "Yes! You can cancel your subscription at any time. You will continue to have access to Pro features until the end of your billing cycle."
    },
    {
      q: "What is included in the Direct Alumni Chat?",
      a: "Pro students can securely message verified alumni from participating institutions to ask about campus life, academic rigor, and post-graduation outcomes."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto mt-32 mb-20 px-4 md:px-0">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl font-bold text-[var(--aur-text)] mb-3">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-[var(--aur-border)] rounded-xl overflow-hidden bg-[var(--aur-surface)]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[var(--aur-surface-hover)] transition-colors"
            >
              <span className="font-bold text-[var(--aur-text)]">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-[var(--aur-text-muted)] transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-sm text-[var(--aur-text-secondary)] leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Membership Component ---
export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState("Basic Student");
  const [selectedTierData, setSelectedTierData] = useState<MembershipTierData | null>(null);

  const [tiers, setTiers] = useState<MembershipTierData[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [tiersError, setTiersError] = useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/membership/tiers`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load membership tiers");
        return res.json();
      })
      .then((data: MembershipTierData[]) => setTiers(data))
      .catch((err) => {
        if (err.name !== "AbortError") setTiersError(err.message);
      })
      .finally(() => setTiersLoading(false));
    return () => controller.abort();
  }, []);

  const basicTier = tiers.find((t) => t.name === "Basic");
  const premiumTier = tiers.find((t) => t.name === "Premium");

  const openApplication = (tier: string, tierData: MembershipTierData | undefined) => {
    setSelectedTier(tier);
    setSelectedTierData(tierData ?? null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto pb-12 pt-8"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--aur-text)] mb-4">
            Student Portal Access
          </h1>
          <p className="text-lg text-[var(--aur-text-secondary)] max-w-2xl mx-auto px-4">
            Unlock advanced university matching, admission predictions, and tools to navigate your academic journey.
          </p>
        </div>

        {/* Disclaimer Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16 bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-2xl p-6 flex gap-4 max-w-4xl mx-auto mx-4 md:mx-auto"
        >
          <div className="shrink-0 mt-0.5 text-[var(--aur-text)]">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--aur-text)] mb-1 uppercase tracking-wider text-xs">For Students & Applicants</h3>
            <p className="text-sm text-[var(--aur-text-secondary)] leading-relaxed">
              These plans are designed for students. University partner accounts are coming soon.
            </p>
          </div>
        </motion.div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 md:px-0">
          {/* Tier 1: Basic Student */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-3xl p-8 shadow-[var(--aur-shadow-sm)] flex flex-col relative"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--aur-text)]">Basic Student</h2>
              <p className="text-[var(--aur-text-muted)] text-sm mt-2">Essential access to explore global rankings.</p>
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--aur-text)] mb-8">
              {tiersLoading ? "..." : `$${basicTier?.price.toLocaleString() ?? "999"}`}<span className="text-sm text-[var(--aur-text-muted)] font-sans"> / year</span>
            </div>

            <ul className="space-y-5 mb-8 flex-1">
              {(basicTier?.benefits ?? ["Profile Verification Badge", "Institutional Data Update Submissions"]).map((benefit) => (
                <li key={benefit} className="flex items-start gap-4">
                 <ShieldCheck className="w-5 h-5 text-[var(--aur-text-muted)] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[var(--aur-text-secondary)]">{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openApplication("Basic Student", basicTier)}
              disabled={tiersLoading || !basicTier}
              className="w-full py-4 px-6 rounded-xl border border-[var(--aur-border-strong)] bg-transparent hover:bg-[var(--aur-surface-hover)] text-[var(--aur-text)] font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tiersLoading ? "Loading..." : `Subscribe — $${basicTier?.price.toLocaleString() ?? "999"}/year`}
            </button>
          </motion.div>

          {/* Tier 2: Premium / Pro Student */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            className="bg-[var(--aur-text)] border border-[var(--aur-text)] rounded-3xl p-8 shadow-xl flex flex-col relative text-[var(--background)] transition-transform"
          >
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-[var(--background)] text-[var(--aur-text)] border border-[var(--aur-border)] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                Recommended
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--background)] flex items-center gap-2">
                Pro Student <Crown className="w-5 h-5" />
              </h2>
              <p className="text-[var(--background)]/70 text-sm mt-2">AI predictions and premium tools to secure your future.</p>
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--background)] mb-8">
              {tiersLoading ? "..." : `$${premiumTier?.price.toLocaleString() ?? "2,999"}`}<span className="text-sm text-[var(--background)]/70 font-sans"> / year</span>
            </div>

            <ul className="space-y-5 mb-8 flex-1">
              <li className="flex items-start gap-4">
                <Search className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Personalized University Matching</span>
              </li>
              <li className="flex items-start gap-4">
                <BarChart3 className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Admission Probability Predictor</span>
              </li>
              <li className="flex items-start gap-4">
                <GraduationCap className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Scholarship Opportunities Database</span>
              </li>
              <li className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Direct Alumni Chat Access</span>
              </li>
            </ul>

            <button
              onClick={() => openApplication("Pro Student", premiumTier)}
              disabled={tiersLoading || !premiumTier}
              className="w-full py-4 px-6 rounded-xl bg-[var(--background)] hover:opacity-90 text-[var(--aur-text)] font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tiersLoading ? "Loading..." : "Upgrade to Pro"}
            </button>
          </motion.div>
        </div>

        <FeatureComparisonMatrix />
        <FAQSection />

      </motion.div>

      {/* Render the application modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTier={selectedTier}
        selectedTierData={selectedTierData}
      />
    </div>
  );
}