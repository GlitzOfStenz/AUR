"use client";

import "./Login.css";
import React, { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Network,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useSidebar } from "./navigation/SidebarContext";
import { CanvasRevealEffect } from "./ui/canvas-reveal-effect";
import LoginGlobe from "./LoginGlobe";

// ─── Variants ─────────────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const panelLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease } },
};
const panelRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.15, ease } },
};
const formIn = (dir: number) => ({ opacity: 0, x: dir * 28 });
const formAnim = { opacity: 1, x: 0, transition: { duration: 0.4, ease } };
const formOut = (dir: number) => ({ opacity: 0, x: dir * -28, transition: { duration: 0.26, ease: [0.4,0,1,1] as [number,number,number,number] } });

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// ─── Password strength ────────────────────────────────────────────────────────
function pwStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: "Weak",      color: "#ef4444" };
  if (s <= 2) return { score: 2, label: "Fair",      color: "#f97316" };
  if (s <= 3) return { score: 3, label: "Good",      color: "#eab308" };
  if (s <= 4) return { score: 4, label: "Strong",    color: "#22c55e" };
  return       { score: 5, label: "Excellent", color: "#10b981" };
}


// ─── Floating Data Chip ───────────────────────────────────────────────────────
function Chip({ icon: Icon, value, label, delay, className = "" }:
  { icon: any; value: string; label: string; delay: number; className?: string }) {
  return (
    <div 
      
      
      
      className={`lp-chip ${className}`}
    >
      <div className="lp-chip-icon"><Icon size={16}/></div>
      <div>
        <div className="lp-chip-value">{value}</div>
        <div className="lp-chip-label">{label}</div>
      </div>
    </div>
  );
}

// ─── Social SVGs ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.165 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Login() {
  const { handleViewChange, theme } = useSidebar();
  const isDark = theme === "dark";

  const [isLogin, setIsLogin]             = useState(true);
  const [dir, setDir]                     = useState(1);
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [name, setName]                   = useState("");
  const [confirmPw, setConfirmPw]         = useState("");
  const [showPw, setShowPw]               = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [keepIn, setKeepIn]               = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");

  const strength   = pwStrength(password);
  const pwsMatch   = confirmPw === "" || password === confirmPw;

  const switchMode = (toLogin: boolean) => {
    setDir(toLogin ? -1 : 1);
    setIsLogin(toLogin);
    setError("");
    setPassword("");
    setConfirmPw("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Basic Frontend Validation & Sanitization
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (!isLogin) {
      if (!pwsMatch) {
        setError("Passwords do not match.");
        return;
      }
      if (strength.score < 3) {
        setError("Please choose a stronger password for better security.");
        return;
      }
      if (!name.trim()) {
        setError("Full Name is required for registration.");
        return;
      }
    }

    setLoading(true);

    try {
      // 2. Prepare API payload and secure headers
      // BACKEND TEAM: Update this endpoint to your actual authentication service.
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const payload = isLogin 
        ? { email: email.trim(), password }
        : { email: email.trim(), password, name: name.trim() };

      // Set a strict timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      // ----------------------------------------------------------------------
      // MOCK DEMO LOGIC - Remove in Production
      // ----------------------------------------------------------------------
      const isMockDemo = true; 
      
      if (isMockDemo) {
        await new Promise(r => setTimeout(r, 1000));
        clearTimeout(timeoutId);

        if (isLogin) {
          if (email === "admin" && password === "admin") {
            localStorage.setItem("aur_logged_in", "true");
            handleViewChange("admin");
            return;
          } else if (email === "user@aur.edu" && password === "user123") {
            localStorage.setItem("aur_logged_in", "true");
            handleViewChange("home");
            return;
          } else if (password.length >= 6 && email.includes("@")) {
            localStorage.setItem("aur_logged_in", "true");
            handleViewChange("home");
            return;
          } else {
            throw new Error("Invalid credentials. Use a valid account.");
          }
        } else {
          localStorage.setItem("aur_logged_in", "true");
          handleViewChange("home");
          return;
        }
      }
      // ----------------------------------------------------------------------

      // --- REAL API INTEGRATION START ---
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // "X-CSRF-Token": getCsrfToken(), // BACKEND TEAM: Uncomment if using CSRF tokens
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle standard authentication HTTP status codes securely
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error("Invalid credentials. Please try again.");
        if (response.status === 403) throw new Error("Account locked or access denied.");
        if (response.status === 429) throw new Error("Too many attempts. Please try again later.");
        throw new Error(errorData.message || "An error occurred during authentication.");
      }

      const data = await response.json();
      
      // 3. Handle Secure Token Storage
      // BACKEND TEAM: HttpOnly cookies are strongly recommended over localStorage for JWTs to prevent XSS.
      // If you must use local storage, it goes here:
      if (data.token) {
        // sessionStorage.setItem("aur_session", data.token);
      }

      // 4. Redirect on success
      if (data.role === "admin") {
        handleViewChange("admin");
      } else {
        handleViewChange("home");
      }
      // --- REAL API INTEGRATION END ---

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError("Connection timeout. Please check your network and try again.");
      } else {
        setError(err.message || "Authentication failed. Please contact support.");
      }
    } finally {
      setLoading(false);
    }
  };

  const chips = [
    { icon: Network,    value: "1.2M", label: "Data Points Processed", delay: 0.2, cls: "lp-chip-1" },
    { icon: Activity,   value: "58+",  label: "Institutions Live",     delay: 0.4, cls: "lp-chip-2" },
    { icon: TrendingUp, value: "QS",   label: "World Rankings API",    delay: 0.6, cls: "lp-chip-3" },
  ];

  return (
    <div className="lp-root relative">
      {/* Dark mode: animated dot matrix canvas background */}
      {isDark && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="bg-black"
            colors={[
              [255, 255, 255],
              [255, 255, 255],
            ]}
            dotSize={6}
            reverse={false}
            showGradient={false}
          />
          {/* Radial vignette so center stays dark and readable */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.85)_0%,_transparent_70%)]" />
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-black to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}

      <div className="lp-bg-grid relative z-10"/>

      {/* ── Left Showcase ── */}
      <div className="lp-left relative z-10"   >
        {/* Logo */}
        <div className="lp-logo">
          <img src="/aur-logo-transparent.png" alt="Asia University Rankings" />
        </div>

        {/* Intelligence Graphic */}
        <div className="lp-intel-stage">
          <div className="lp-map-wrapper" style={{ width: "100%", height: "100%", display: "flex" }}>
            <LoginGlobe />
          </div>
          {chips.map((c) => (
            <Chip key={c.label} icon={c.icon} value={c.value} label={c.label} delay={c.delay} className={c.cls}/>
          ))}
        </div>

        {/* Hero copy */}
        <div className="lp-hero"   >
          <div className="lp-hero-eyebrow" >
            Intelligence Platform
          </div>
          <h2 className="lp-hero-title">
            Asia's Premier<br/>
            <span>University Analytics</span>
          </h2>
          <div className="lp-trust-row" >
            {["Certified Data", "Institutional Access", "Real-time Processing"].map(t => (
              <div key={t} className="lp-trust-badge">
                <div className="lp-trust-dot"/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form ── */}
      <div className="lp-right relative z-10"   >
        <div className="lp-glass-card">
          {/* Mobile brand */}
          <div className="lp-mobile-brand">
            <div className="lp-logo">
              <img src="/aur-logo-transparent.png" alt="Asia University Rankings" />
            </div>
          </div>

          {/* Tab bar removed as per request */}

          {/* Animated form swap */}
          <>
            <div
              key={isLogin ? "login" : "signup"}
              className="lp-form-anim-wrapper"
            >
              {/* Header */}
              <div className="lp-form-header">
                <h1 className="lp-form-title">
                  {isLogin ? "Welcome Back" : "Get Started"}
                </h1>
                <p className="lp-form-sub">
                  {isLogin
                    ? "Access the Asia University Intelligence Hub"
                    : "Create your institutional research account"}
                </p>
              </div>

              {/* Form */}
              <form className="lp-form" onSubmit={handleSubmit}>
                {/* Name field (signup only) */}
                {!isLogin && (
                  <div className="lp-field">
                    <label htmlFor="lp-name" className="lp-label">Full Name</label>
                    <div className="lp-input-wrap">
                      <User size={16} className="lp-input-icon"/>
                      <input
                        id="lp-name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Dr. Jane Smith"
                        required={!isLogin}
                        autoComplete="name"
                        className="lp-input"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="lp-field">
                  <label htmlFor="lp-email" className="lp-label">
                    {isLogin ? "Institutional Email or Username" : "Institutional Email"}
                  </label>
                  <div className="lp-input-wrap">
                    <Mail size={16} className="lp-input-icon"/>
                    <input
                      id="lp-email"
                      type="text"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={isLogin ? "email or username" : "you@institution.edu"}
                      required
                      autoComplete="email"
                      className="lp-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lp-field">
                  <label htmlFor="lp-password" className="lp-label">Password</label>
                  <div className="lp-input-wrap">
                    <Lock size={16} className="lp-input-icon"/>
                    <input
                      id="lp-password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="lp-input"
                    />
                    <button type="button" className="lp-eye-btn" onClick={() => setShowPw(v => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}>
                      {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>

                  {/* Strength bar (sign-up only) */}
                  {!isLogin && password && (
                    <div className="lp-strength-row">
                      <div className="lp-strength-bars">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="lp-strength-bar"
                            style={{ background: i <= strength.score ? strength.color : undefined }}/>
                        ))}
                      </div>
                      <span className="lp-strength-text" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password (signup only) */}
                {!isLogin && (
                  <div className="lp-field">
                    <label htmlFor="lp-confirm" className="lp-label">Confirm Password</label>
                    <div className="lp-input-wrap">
                      <Lock size={16} className="lp-input-icon"/>
                      <input
                        id="lp-confirm"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPw}
                        onChange={e => setConfirmPw(e.target.value)}
                        placeholder="••••••••"
                        required={!isLogin}
                        autoComplete="new-password"
                        className="lp-input"
                        style={!pwsMatch ? { borderColor: "#fca5a5", backgroundColor: "#fef2f2" } : undefined}
                      />
                      <button type="button" className="lp-eye-btn" onClick={() => setShowConfirm(v => !v)}>
                        {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {!pwsMatch && (
                      <div className="lp-field-error">
                        <AlertCircle size={14}/> Passwords do not match
                      </div>
                    )}
                  </div>
                )}

                {/* Remember / Forgot (login only) */}
                {isLogin && (
                  <div className="lp-remember-row">
                    <label className="lp-checkbox-label">
                      <input type="checkbox" checked={keepIn} onChange={e => setKeepIn(e.target.checked)} className="lp-checkbox"/>
                      Keep me signed in
                    </label>
                    <button type="button" className="lp-forgot">Forgot password?</button>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="lp-error-banner" role="alert">
                    <AlertCircle size={16} style={{ flexShrink: 0 }}/>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || (!isLogin && !pwsMatch && confirmPw !== "")}
                  className="lp-submit"
                >
                  <span className="lp-submit-inner">
                    {loading ? (
                      <><div className="lp-spinner"/> Authenticating…</>
                    ) : (
                      <>{isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16}/></>
                    )}
                  </span>
                </button>

                {/* Divider */}
                <div className="lp-divider">
                  <div className="lp-divider-line"/>
                  <span className="lp-divider-text">or continue with</span>
                  <div className="lp-divider-line"/>
                </div>

                {/* Social buttons */}
                <div className="lp-social-row">
                  <button type="button" className="lp-social-btn">
                    <GoogleIcon/> Google
                  </button>
                  <button type="button" className="lp-social-btn">
                    <GithubIcon/> GitHub
                  </button>
                </div>

              </form>

              {/* Footer toggle */}
              <div className="lp-footer">
                {isLogin ? (
                  <>Don&apos;t have an account?{" "}
                    <button className="lp-footer-btn" onClick={() => switchMode(false)}>Sign up free</button>
                  </>
                ) : (
                  <>Already have an account?{" "}
                    <button className="lp-footer-btn" onClick={() => switchMode(true)}>Sign in</button>
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
