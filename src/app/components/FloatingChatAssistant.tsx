"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Bot, Send, Sparkles, Loader2 } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useVelocity,
  useTransform,
  useSpring,
} from "framer-motion";
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

  // ─── Framer Motion Physics Drag ───────────────────────────────────────────

  // Core position motion values — Framer Motion writes to these during drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Real-time velocity sampling on the X axis
  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Map horizontal velocity → rotation angle
  // Drag fast right → +18° tilt; drag fast left → -18°; stop → 0°
  const rawRotation = useTransform(xVelocity, [-2400, 0, 2400], [-18, 0, 18]);

  // Add subtle Y influence: circular swirls produce diagonal tilts
  const yTiltContrib = useTransform(yVelocity, [-1200, 0, 1200], [-4, 0, 4]);

  // Combine X and Y tilt contributions
  const combinedRotation = useTransform(
    [rawRotation, yTiltContrib],
    ([rx, ry]: number[]) => rx + ry
  );

  // Spring-smooth the tilt — gives the elastic "swing then settle" physics
  const rotation = useSpring(combinedRotation, {
    stiffness: 55,   // low stiffness = wide, slow oscillation
    damping: 10,     // low damping  = more oscillations before rest
    mass: 0.6,       // heavier mass = more inertia in the swing
  });

  // Subtle scale pulse on high-velocity drag — feels "alive"
  const absVelocity = useTransform(xVelocity, (v) => Math.abs(v));
  const rawScale = useTransform(absVelocity, [0, 1800], [1, 1.035]);
  const liveScale = useSpring(rawScale, { stiffness: 180, damping: 28 });

  // ─── Viewport-aware Drag Constraints ─────────────────────────────────────

  const [constraints, setConstraints] = useState({
    left: -2400,
    right: 0,
    top: -1000,
    bottom: 0,
  });

  useEffect(() => {
    // Panel is fixed at: bottom-24 (96px), right-6 (24px)
    // Width ≈ 368px (sm:w-[360px] + borders), Height ≈ 520px
    const PANEL_W = 368;
    const PANEL_H = 520;
    const RIGHT_OFFSET = 24;
    const BOTTOM_OFFSET = 96;

    const update = () => {
      setConstraints({
        left: -(window.innerWidth - PANEL_W - RIGHT_OFFSET),
        right: 0,
        top: -(window.innerHeight - PANEL_H - BOTTOM_OFFSET),
        bottom: 0,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
    // Animate back to origin after exit completes
    setTimeout(() => {
      x.set(0);
      y.set(0);
    }, 340);
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
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="chat-panel"

            // ── Enter / Exit spring ──
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.78 }}
            transition={{ type: "spring", stiffness: 310, damping: 24 }}

            // ── Physics-based omnidirectional drag ──
            drag
            dragConstraints={constraints}
            dragElastic={{              // elastic resistance at every boundary edge
              top: 0.14,
              bottom: 0.14,
              left: 0.14,
              right: 0.14,
            }}
            dragMomentum                // keep velocity on release for glide
            dragTransition={{
              power: 0.42,             // how much velocity carries after release
              timeConstant: 380,       // ms; longer = longer glide
              bounceDamping: 22,       // damping of edge bounce-back
              bounceStiffness: 260,    // spring stiffness of edge bounce
              modifyTarget: (t) => Math.round(t), // snap to nearest pixel
            }}
            whileDrag={{ cursor: "grabbing" }}

            // ── Live physics style bindings ──
            style={{
              x,
              y,
              rotate: rotation,
              scale: liveScale,
            }}

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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isChatOpen && activeView === "home" && isIdle && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
            className="fixed bottom-6 right-6 z-50 flex items-end gap-4 pointer-events-none"
          >
            {/* The "Come talk to me" tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className={[
                "relative mb-2 px-3.5 py-2.5 rounded-2xl text-[11px] font-bold shadow-xl cursor-pointer pointer-events-auto transition-transform hover:scale-105",
                isDark 
                  ? "bg-cyber-gray border border-cyber-yellow/30 text-cyber-yellow" 
                  : "bg-white border border-slate-200 text-amber-700 shadow-slate-900/10"
              ].join(" ")}
              onClick={() => setIsChatOpen(true)}
            >
              👋 Come talk to me!
              {/* Tooltip triangle pointing right/down */}
              <div 
                className={[
                  "absolute -right-1.5 bottom-3.5 w-3.5 h-3.5 rotate-45 border-r border-b",
                  isDark ? "bg-cyber-gray border-cyber-yellow/30" : "bg-white border-slate-200"
                ].join(" ")} 
              />
            </motion.div>

            {/* The FAB */}
            <motion.button
              key="chat-trigger"
              onClick={() => setIsChatOpen(true)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              className="pointer-events-auto shrink-0 h-14 w-14 rounded-full bg-amber-600 dark:bg-cyber-yellow text-white dark:text-cyber-black shadow-lg shadow-amber-600/30 dark:shadow-cyber-yellow/25 flex items-center justify-center relative"
              title="Open AI Rankings Assistant"
            >
              <Bot className="h-6 w-6" />
              {/* Pulsing attention ring */}
              <span className="absolute inset-0 rounded-full animate-ping bg-amber-500/30 dark:bg-cyber-yellow/20 pointer-events-none" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
