"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useSidebar } from "./navigation/SidebarContext";
import { API_BASE_URL } from "../lib/universities";

// ─── Types ────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FloatingChatAssistant() {
  const {activeView } = useSidebar();
  const [isChatOpen, setIsChatOpen] = useState(false);


  const [isIdle, setIsIdle] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 1500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Hello! I'm your Asia University Rankings assistant. Ask me about rankings, programs, tuition, or how to use the comparison tools.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Side Effects ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      setTimeout(() => inputRef.current?.focus(), 140);
    }
  }, [isChatOpen, messages]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleClose = () => {
    setIsChatOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input.trim() };
    const query = userMsg.content;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json().catch(() => ({}));
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: res.ok
            ? data.reply
            : data.detail || "Sorry, the chat service is unavailable right now.",
        },
      ]);
    } catch (err) {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I couldn't reach the server. Please try again.",
        },
      ]);
    }
  };

  // ─── Theme Tokens ─────────────────────────────────────────────────────────

  const panelBg  = "bg-white";
  const headerBg = "bg-slate-50";
  const border   = "border-slate-200";
  const inputBg  = "bg-slate-50";
  const aiBubble = "bg-slate-100 border border-slate-200 text-slate-700";
  const accent   = "text-amber-700";
  const muted    = "text-slate-500";

  // Constant subtle glow to make the panel stand out beautifully
  const dragGlow = "shadow-[0_0_30px_rgba(245,158,11,0.25)] border-amber-500/40";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Physics Chat Panel ──────────────────────────────────────────── */}
      <>
        {isChatOpen && (
          <motion.div
            key="chat-panel"
            drag
            dragMomentum={false}
            className={[
              "fixed bottom-24 right-6 z-50",
              "w-80 sm:w-[360px]",
              "flex flex-col rounded-xl overflow-hidden",
              "border",
              border,
              panelBg,
              dragGlow,
              "cursor-grab select-none",
              "will-change-transform",
            ].join(" ")}
          >

            {/* ── Header ─────────────────────────────────────── */}
            <div
              className={[
                "flex items-center justify-between px-4 py-3",
                headerBg,
                "border-b",
                border,
                "shrink-0",
              ].join(" ")}
            >
              {/* Branding */}
              <div className="flex items-center gap-2.5">
                <div
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full",
                    "bg-amber-50 border border-amber-200",
                  ].join(" ")}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${accent}`} />
                </div>
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${"text-slate-900"}`}>
                    AUR Helping Hand
                  </p>
                  <p className={`text-[9px] font-mono ${muted}`}>
                    {isThinking ? "Analyzing…" : "Drag · Swirl · Ask anything"}
                  </p>
                </div>
              </div>

              {/* Close button — stops propagation so it doesn't initiate drag */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={handleClose}
                className={[
                  "p-1.5 rounded-full transition-colors",
                  "hover:bg-slate-200 text-slate-400 hover:text-slate-800",
                ].join(" ")}
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Messages ───────────────────────────────────── */}
            {/* stopPropagation prevents drag from accidentally starting on message text */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 cursor-default"
              style={{ maxHeight: 340 }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className={[
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full mr-2 mt-0.5",
                        "bg-amber-50 border border-amber-200",
                      ].join(" ")}
                    >
                      <Bot className={`h-3 w-3 ${accent}`} />
                    </div>
                  )}
                  <div
                    className={[
                      "max-w-[78%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
                      msg.role === "user"
                        ? "bg-amber-600 dark:bg-cyber-yellow text-white dark:text-cyber-black font-semibold"
                        : aiBubble,
                    ].join(" ")}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex justify-start">
                  <div
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full mr-2 mt-0.5",
                      "bg-amber-50 border border-amber-200",
                    ].join(" ")}
                  >
                    <Bot className={`h-3 w-3 ${accent}`} />
                  </div>
                  <div className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs ${aiBubble}`}>
                    <Loader2 className={`h-3 w-3 ${accent} animate-spin`} />
                    <span className={muted}>Thinking…</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ──────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit}
              onPointerDown={(e) => e.stopPropagation()}
              className={[
                "shrink-0 p-3 border-t",
                border,
                headerBg,
                "flex items-center gap-2",
              ].join(" ")}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about universities…"
                disabled={isThinking}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-xs border cursor-text",
                  inputBg,
                  border,
                  "text-slate-800 placeholder-slate-400 focus:border-amber-600",
                  "focus:outline-none transition-colors disabled:opacity-50",
                ].join(" ")}
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 dark:bg-cyber-yellow text-white dark:text-cyber-black hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </>

      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <>
        {!isChatOpen && (
          <motion.div
            drag
            dragMomentum={false}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 cursor-grab active:cursor-grabbing"
            style={{
              opacity: isIdle ? 1 : 0,
              pointerEvents: isIdle ? "auto" : "none",
            }}
          >
            {/* "Come talk to me" tooltip — only on homepage */}
            {activeView === "home" && (
              <div
                className={[
                  "relative px-3.5 py-2.5 rounded-2xl text-[11px] font-bold shadow-xl transition-transform hover:scale-105 pointer-events-none mr-2",
                  "bg-white border border-cyber-black/10 text-cyber-black shadow-cyber-black/10",
                ].join(" ")}
              >
                👋 Come talk to me!
                <div
                  className={[
                    "absolute right-4 -bottom-1.5 w-3.5 h-3.5 rotate-45 border-r border-b",
                    "bg-white border-cyber-black/10",
                  ].join(" ")}
                />
              </div>
            )}

            {/* FAB — always visible on all pages */}
            <button
              key="chat-trigger"
              onClick={() => setIsChatOpen(true)}
              className="shrink-0 h-14 w-14 rounded-full bg-cyber-black dark:bg-white text-white dark:text-cyber-black shadow-[0_0_20px_rgba(127, 86, 217, 0.6)] dark:shadow-[0_0_20px_rgba(255,255,255,0.7)] hover:shadow-[0_0_30px_rgba(127, 86, 217, 0.8)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.9)] flex items-center justify-center relative hover:scale-105 transition-all"
              title="Open AUR Helping Hand"
            >
              <Bot className="h-6 w-6 pointer-events-none" />
              {/* Pulsing ring only on home */}
              {activeView === "home" && (
                <span className="absolute inset-0 rounded-full animate-ping bg-cyber-black/20 dark:bg-white/20 pointer-events-none" />
              )}
            </button>
          </motion.div>
        )}
      </>
    </>
  );
}


