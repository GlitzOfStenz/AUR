import React, { useState } from "react";
import { Crown, ShieldCheck, BarChart3, Edit3, Award, Info, Check, X, ChevronDown, Building2, User, Mail, Globe2, CreditCard, CalendarDays, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Application Modal Component ---
function ApplicationModal({ isOpen, onClose, selectedTier }: { isOpen: boolean, onClose: () => void, selectedTier: string }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    institution: "",
    website: "",
    contactName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation logic
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.institution.trim()) newErrors.institution = "Institution name is required";
    if (!formData.website.trim() || !formData.website.includes(".")) newErrors.website = "Valid website domain is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Valid institutional email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    // Only validate if they are selecting Premium or Standard (assuming payment is needed)
    // For simplicity, we just check if fields are mostly filled.
    const newErrors: Record<string, string> = {};
    if (formData.cardNumber.replace(/\s/g, '').length < 15) newErrors.cardNumber = "Valid card number required";
    if (formData.expiry.length < 5) newErrors.expiry = "MM/YY required";
    if (formData.cvv.length < 3) newErrors.cvv = "CVV required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({ institution: "", website: "", contactName: "", email: "", cardNumber: "", expiry: "", cvv: "" });
      setErrors({});
      setIsSuccess(false);
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
                <h3 className="font-serif text-xl font-bold text-[var(--aur-text)]">Apply for Membership</h3>
                <p className="text-xs text-[var(--aur-text-muted)] uppercase tracking-wider font-bold mt-1">
                  Tier: <span className="text-[var(--aur-text)]">{selectedTier}</span>
                </p>
              </div>
              <button onClick={handleClose} className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors rounded-full hover:bg-[var(--aur-surface-2)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[var(--aur-text)] mb-2">Application Received</h4>
                  <p className="text-[var(--aur-text-secondary)] mb-6">
                    Our team will verify your institutional details and contact you within 48 hours to finalize your {selectedTier} membership.
                  </p>
                  <button onClick={handleClose} className="w-full py-3 px-4 bg-[var(--aur-text)] text-[var(--background)] rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                    Done
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
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Institution Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            value={formData.institution}
                            onChange={(e) => { setFormData({ ...formData, institution: e.target.value }); setErrors({ ...errors, institution: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.institution ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="e.g. National University of Singapore"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.institution && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.institution}</motion.p>}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Official Website Domain</label>
                        <div className="relative">
                          <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            value={formData.website}
                            onChange={(e) => { setFormData({ ...formData, website: e.target.value }); setErrors({ ...errors, website: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.website ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="e.g. nus.edu.sg"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.website && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.website}</motion.p>}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Primary Contact Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            value={formData.contactName}
                            onChange={(e) => { setFormData({ ...formData, contactName: e.target.value }); setErrors({ ...errors, contactName: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.contactName ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="Full Name"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.contactName && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.contactName}</motion.p>}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Institutional Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                            className={`w-full bg-[var(--aur-surface-2)] border ${errors.email ? "border-red-500 focus:border-red-500" : "border-[var(--aur-border)] focus:border-[var(--aur-text)]"} rounded-xl py-3 pl-10 pr-4 text-sm text-[var(--aur-text)] focus:outline-none transition-colors`}
                            placeholder="name@institution.edu"
                          />
                        </div>
                        <AnimatePresence>
                          {errors.email && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</motion.p>}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--aur-text-secondary)] mb-2">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--aur-text-muted)]" />
                          <input
                            type="text"
                            maxLength={19}
                            value={formData.cardNumber}
                            onChange={(e) => { 
                              let val = e.target.value.replace(/\D/g, "");
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
                                let val = e.target.value.replace(/\D/g, "");
                                if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                setFormData({ ...formData, expiry: val }); 
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
                            <span className="text-[var(--aur-text-muted)]">Institution</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">{formData.institution}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--aur-text-muted)]">Contact</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">{formData.contactName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--aur-text-muted)]">Payment</span>
                            <span className="font-medium text-[var(--aur-text)] text-right">•••• {formData.cardNumber.slice(-4)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--aur-text-muted)] text-center">
                        By submitting, you authorize the charge for the {selectedTier} membership.
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && (
              <div className="p-6 border-t border-[var(--aur-border)] bg-[var(--aur-surface-2)] flex justify-between">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : handleClose()}
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
                  ) : step === 4 ? "Submit" : "Next"}
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
    { name: "Public Profile Listing", free: true, std: true, prem: true },
    { name: "Basic Ranking Inclusion", free: true, std: true, prem: true },
    { name: "Profile Verification Badge", free: false, std: true, prem: true },
    { name: "Institutional Data Submissions", free: false, std: true, prem: true },
    { name: "Advanced Analytics Dashboard", free: false, std: false, prem: true },
    { name: "Events & Awards Participation", free: false, std: false, prem: true },
    { name: "Dedicated Account Manager", free: false, std: false, prem: true },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-24 px-4 md:px-0">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl font-bold text-[var(--aur-text)] mb-3">Compare Tiers</h3>
        <p className="text-[var(--aur-text-secondary)]">Find the right level of engagement for your institution.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-[var(--aur-border)] text-[var(--aur-text-secondary)] font-bold uppercase tracking-widest text-xs w-2/5">Feature</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg">Free</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg">Standard</th>
              <th className="p-4 border-b border-[var(--aur-border)] text-center text-[var(--aur-text)] font-bold text-lg bg-[var(--aur-surface-2)] rounded-t-xl">Premium</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f, i) => (
              <tr key={i} className="hover:bg-[var(--aur-surface-hover)] transition-colors">
                <td className="p-4 border-b border-[var(--aur-border)] text-sm font-medium text-[var(--aur-text)]">{f.name}</td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center">
                  {f.free ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
                </td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center">
                  {f.std ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
                </td>
                <td className="p-4 border-b border-[var(--aur-border)] text-center bg-[var(--aur-surface-2)]">
                  {f.prem ? <Check className="w-5 h-5 mx-auto text-[#10b981]" /> : <X className="w-5 h-5 mx-auto text-[var(--aur-border-strong)]" />}
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
      q: "Does membership improve our ranking?",
      a: "No. Official AUR rankings are 100% methodology-based and completely unbiased. Membership provides enhanced visibility, analytics, and verification services, but does not influence any ranking scores."
    },
    {
      q: "How does the verification process work?",
      a: "Once you apply, our team verifies that your representative is officially authorized by the institution. We check your institutional email domain and may require a brief confirmation call."
    },
    {
      q: "Can we upgrade our tier later in the year?",
      a: "Yes, you can upgrade from Standard to Premium at any time. The cost will be prorated based on the remaining months of your annual cycle."
    },
    {
      q: "What is included in the Advanced Analytics Dashboard?",
      a: "Premium members get access to real-time telemetry showing profile views, geographic breakdown of prospective students, and comparative benchmarking against regional peers."
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
  const [selectedTier, setSelectedTier] = useState("Standard");

  const openApplication = (tier: string) => {
    setSelectedTier(tier);
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
            Institutional Membership
          </h1>
          <p className="text-lg text-[var(--aur-text-secondary)] max-w-2xl mx-auto px-4">
            Unlock enhanced services, deeper insights, and greater visibility for your institution with our annual membership tiers.
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
            <h3 className="font-bold text-[var(--aur-text)] mb-1 uppercase tracking-wider text-xs">Integrity & Unbiased Rankings</h3>
            <p className="text-sm text-[var(--aur-text-secondary)] leading-relaxed">
              Official AUR rankings will remain completely methodology-based and unbiased. Membership is tied only to enhanced ranking-related services and will <strong>not influence</strong> a university's official ranking.
            </p>
          </div>
        </motion.div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 md:px-0">
          {/* Tier 1: Standard */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-3xl p-8 shadow-[var(--aur-shadow-sm)] flex flex-col relative"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--aur-text)]">Standard</h2>
              <p className="text-[var(--aur-text-muted)] text-sm mt-2">Essential tools for institutional visibility.</p>
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--aur-text)] mb-8">
              $2,500<span className="text-sm text-[var(--aur-text-muted)] font-sans"> / year</span>
            </div>
            
            <ul className="space-y-5 mb-8 flex-1">
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[var(--aur-text-muted)] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--aur-text-secondary)]">Profile Verification Badge</span>
              </li>
              <li className="flex items-start gap-4">
                <Edit3 className="w-5 h-5 text-[var(--aur-text-muted)] shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--aur-text-secondary)]">Institutional Data Update Submissions</span>
              </li>
            </ul>

            <button 
              onClick={() => openApplication("Standard")}
              className="w-full py-4 px-6 rounded-xl border border-[var(--aur-border-strong)] bg-transparent hover:bg-[var(--aur-surface-hover)] text-[var(--aur-text)] font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            >
              Apply Now
            </button>
          </motion.div>

          {/* Tier 2: Premium */}
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
                Premium <Crown className="w-5 h-5" />
              </h2>
              <p className="text-[var(--background)]/70 text-sm mt-2">Advanced analytics and premium participation.</p>
            </div>
            <div className="text-3xl font-bold font-mono text-[var(--background)] mb-8">
              $5,000<span className="text-sm text-[var(--background)]/70 font-sans"> / year</span>
            </div>
            
            <ul className="space-y-5 mb-8 flex-1">
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Profile Verification Badge</span>
              </li>
              <li className="flex items-start gap-4">
                <Edit3 className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Institutional Data Update Submissions</span>
              </li>
              <li className="flex items-start gap-4">
                <BarChart3 className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Advanced Analytics Dashboard</span>
              </li>
              <li className="flex items-start gap-4">
                <Award className="w-5 h-5 text-[var(--background)]/70 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-[var(--background)]/90">Participation in Events and Awards</span>
              </li>
            </ul>

            <button 
              onClick={() => openApplication("Premium")}
              className="w-full py-4 px-6 rounded-xl bg-[var(--background)] hover:opacity-90 text-[var(--aur-text)] font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              Upgrade to Premium
            </button>
          </motion.div>
        </div>

        <FeatureComparisonMatrix />
        <FAQSection />

      </motion.div>

      {/* Render the application modal using a portal or simply floating above */}
      <ApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedTier={selectedTier} />
    </div>
  );
}
