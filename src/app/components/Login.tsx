import React, { useState } from "react";
import { useSidebar } from "./navigation/SidebarContext";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const { handleViewChange } = useSidebar();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "abc" && password === "abc") {
      handleViewChange("admin");
    } else {
      handleViewChange("home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md aur-card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-[var(--aur-text)] text-[var(--background)] font-serif text-2xl font-bold rounded-xl mb-4 shadow-sm">
            A
          </div>
          <h2 className="font-serif text-2xl font-bold text-[var(--aur-text)]">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-[var(--aur-text-muted)] mt-2">
            Access the premier Asia University Rankings analytical data engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="aur-caption block mb-1.5">Full Name</label>
              <input type="text" required className="aur-input" placeholder="Dr. John Doe" />
            </div>
          )}
          <div>
            <label className="aur-caption block mb-1.5">Work Email or Username</label>
            <input 
              type="text" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="aur-input" 
              placeholder="name@university.edu or 'abc'" 
            />
          </div>
          <div>
            <label className="aur-caption block mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="aur-input" 
              placeholder="•••••••• (use 'abc' for admin)" 
            />
          </div>
          
          <button type="submit" className="w-full aur-btn-primary py-3 flex justify-center items-center mt-6 text-xs">
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            type="button"
            className="text-xs font-bold text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
