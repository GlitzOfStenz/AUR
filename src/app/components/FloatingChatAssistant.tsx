"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Bot, Send, Sparkles, Loader2 } from "lucide-react";

import { useSidebar } from "./navigation/SidebarContext";

// ─── Types & Mock Intelligence ────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "I can help you explore university rankings, compare institutions, and understand academic metrics across Asia. What would you like to know?",
  ranking:
    "Asia's top-ranked universities include Tsinghua University (China), University of Tokyo (Japan), and National University of Singapore — ranked on citations, research output, employability, and international diversity.",
  medical:
    "For MBBS programs in Asia, Uzbekistan, China, and Russia are popular destinations. Many offer English-medium programs at significantly lower tuition than Western countries.",
  compare:
    "Use the Comparison Suite (dock at the bottom) to select up to 4 universities side-by-side and view detailed metric breakdowns for citations, research, and employability.",
  cost:
    "Tuition ranges from ~$2,000/year in Uzbekistan to $40,000+/year in Singapore and Japan. The Rankings Engine includes a tuition filter to help you search by budget.",
};

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("rank") || q.includes("top") || q.includes("best"))
    return MOCK_RESPONSES.ranking;
  if (q.includes("medical") || q.includes("mbbs") || q.includes("medicine"))
    return MOCK_RESPONSES.medical;
  if (q.includes("compare") || q.includes("comparison") || q.includes("vs"))
    return MOCK_RESPONSES.compare;
  if (q.includes("cost") || q.includes("tuition") || q.includes("fee") || q.includes("price"))
    return MOCK_RESPONSES.cost;
  return MOCK_RESPONSES.default;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FloatingChatAssistant() {
  const { theme, activeView } = useSidebar();
  const isDark = theme === "dark";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: input.trim() };
    const query = userMsg.content;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: getMockResponse(query) },
      ]);
    }, 900 + Math.random() * 500);
  };

  // ─── Theme Tokens ─────────────────────────────────────────────────────────

  const panelBg  = isDark ? "bg-[#0d0d11]"  : "bg-white";
  const headerBg = isDark ? "bg-[#18181f]"  : "bg-slate-50";
  const border   = isDark ? "border-cyber-border" : "border-slate-200";
  const inputBg  = isDark ? "bg-[#070710]"  : "bg-slate-50";
  const aiBubble = isDark
    ? "bg-[#18181f] border border-slate-800 text-slate-300"
    : "bg-slate-100 border border-slate-200 text-slate-700";
  const accent   = isDark ? "text-cyber-yellow" : "text-amber-700";
  const muted    = isDark ? "text-slate-400"    : "text-slate-500";

  // Shadow that glows while dragging (matches cyber-yellow in dark, slate in light)
  const dragGlow = isDark
    ? "shadow-[0_12px_48px_rgba(234,179,8,0.18)]"
    : "shadow-[0_12px_48px_rgba(15,23,42,0.18)]";

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Physics Chat Panel ──────────────────────────────────────────── */}
      <>
        {isChatOpen && (
          <div
            key="chat-panel"
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
                    isDark
                      ? "bg-cyber-yellow/10 border border-cyber-yellow/20"
                      : "bg-amber-50 border border-amber-200",
                  ].join(" ")}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${accent}`} />
                </div>
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>
                    AI Rankings Assistant
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
                  isDark
                    ? "hover:bg-slate-800 text-slate-400 hover:text-white"
                    : "hover:bg-slate-200 text-slate-400 hover:text-slate-800",
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
                        isDark ? "bg-cyber-yellow/10" : "bg-amber-50 border border-amber-200",
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
                      isDark ? "bg-cyber-yellow/10" : "bg-amber-50 border border-amber-200",
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
                  isDark
                    ? "text-slate-200 placeholder-slate-600 focus:border-cyber-yellow"
                    : "text-slate-800 placeholder-slate-400 focus:border-amber-600",
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
          </div>
        )}
      </>

      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <>
        {!isChatOpen && (
          <div
            className="fixed bottom-6 right-6 z-50 flex items-end gap-4 pointer-events-none"
            style={{
              opacity: isIdle ? 1 : 0,
              transform: isIdle ? "translate3d(0, 0, 0)" : "translate3d(0, 8px, 0)",
              transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "opacity, transform",
              pointerEvents: isIdle ? "auto" : "none",
            }}
          >
            {/* "Come talk to me" tooltip — only on homepage */}
            {activeView === "home" && (
              <div
                className={[
                  "relative mb-2 px-3.5 py-2.5 rounded-2xl text-[11px] font-bold shadow-xl cursor-pointer pointer-events-auto transition-transform hover:scale-105",
                  isDark
                    ? "bg-cyber-gray border border-cyber-yellow/30 text-cyber-yellow"
                    : "bg-white border border-slate-200 text-amber-700 shadow-slate-900/10",
                ].join(" ")}
                onClick={() => setIsChatOpen(true)}
              >
                👋 Come talk to me!
                <div
                  className={[
                    "absolute -right-1.5 bottom-3.5 w-3.5 h-3.5 rotate-45 border-r border-b",
                    isDark ? "bg-cyber-gray border-cyber-yellow/30" : "bg-white border-slate-200",
                  ].join(" ")}
                />
              </div>
            )}

            {/* FAB — always visible on all pages */}
            <button
              key="chat-trigger"
              onClick={() => setIsChatOpen(true)}
              className="pointer-events-auto shrink-0 h-14 w-14 rounded-full bg-amber-600 dark:bg-cyber-yellow text-white dark:text-cyber-black shadow-lg shadow-amber-600/30 dark:shadow-cyber-yellow/25 flex items-center justify-center relative"
              title="Open AI Rankings Assistant"
            >
              <Bot className="h-6 w-6" />
              {/* Pulsing ring only on home */}
              {activeView === "home" && (
                <span className="absolute inset-0 rounded-full animate-ping bg-amber-500/30 dark:bg-cyber-yellow/20 pointer-events-none" />
              )}
            </button>
          </div>
        )}
      </>
    </>
  );
}
