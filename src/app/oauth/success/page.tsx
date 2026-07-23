"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * /oauth/success
 *
 * The backend redirects here after a successful Google OAuth login:
 *   https://aur-38ce.onrender.com/auth/google/callback
 *     → 302 → https://aur-tau.vercel.app/oauth/success?access_token=...&refresh_token=...
 *
 * This page:
 *  1. Reads the tokens from the URL
 *  2. Persists them exactly the same way the email/password Login does
 *  3. Redirects to the home view
 */

function OAuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setErrorMsg(
        "Authentication failed — missing tokens in the redirect URL. " +
          "Please try signing in again."
      );
      setStatus("error");
      return;
    }

    // Store tokens exactly the same way Login.tsx does
    sessionStorage.setItem("aur_access_token", accessToken);
    sessionStorage.setItem("aur_refresh_token", refreshToken);
    localStorage.setItem("aur_logged_in", "true");

    // Navigate to the main app (home view)
    router.replace("/?view=home");
  }, [searchParams, router]);

  /* ── Loading state ──────────────────────────────────────────────── */
  if (status === "processing") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          gap: "1.5rem",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Google colour spinner */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "4px solid #1f1f1f",
            borderTopColor: "#4285F4",
            borderRightColor: "#34A853",
            borderBottomColor: "#FBBC05",
            borderLeftColor: "#EA4335",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#e5e7eb",
              fontSize: "1.1rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Signing you in with Google…
          </p>
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.85rem",
              marginTop: "0.4rem",
            }}
          >
            Hang tight, setting up your session.
          </p>
        </div>
      </div>
    );
  }

  /* ── Error state ────────────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        gap: "1.25rem",
        fontFamily: "'Inter', sans-serif",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#1f1f1f",
          border: "1px solid #ef444433",
          borderRadius: 12,
          padding: "2rem 2.5rem",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#ef44441a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            fontSize: "1.5rem",
          }}
        >
          &times;
        </div>
        <h2 style={{ color: "#f9fafb", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
          Authentication Failed
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          {errorMsg}
        </p>
        <button
          onClick={() => router.replace("/?view=login")}
          style={{
            background: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "0.6rem 1.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
          }}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default function OAuthSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSuccessContent />
    </Suspense>
  );
}
