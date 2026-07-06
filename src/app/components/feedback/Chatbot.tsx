"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

import { Send, X, Bot, Sparkles } from "lucide-react";
import { useUniversityData } from "../data/UniversityDataProvider";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const BUBBLE_SIZE = 64;
const STORAGE_KEY = "aur_chat_fab_position";
const DRAG_THRESHOLD = 8;

function getViewportBounds() {
  if (typeof window === "undefined") {
    return { minX: 8, maxX: 300, minY: 72, maxY: 500 };
  }
  const isMobile = window.innerWidth < 768;
  const bottomInset = isMobile ? 88 : 28;
  const topInset = 72;
  return {
    minX: 8,
    maxX: Math.max(8, window.innerWidth - BUBBLE_SIZE - 8),
    minY: topInset,
    maxY: Math.max(topInset, window.innerHeight - BUBBLE_SIZE - bottomInset),
  };
}

function getDefaultPosition() {
  const b = getViewportBounds();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) {
    return { x: b.minX + 8, y: b.maxY };
  }
  return { x: b.maxX, y: b.maxY };
}

function clampPosition(x: number, y: number) {
  const b = getViewportBounds();
  return {
    x: Math.min(Math.max(x, b.minX), b.maxX),
    y: Math.min(Math.max(y, b.minY), b.maxY),
  };
}

export default function Chatbot() {
  const { universities } = useUniversityData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! I am your Asia University Rankings AI Assistant. Ask me about rankings, specific universities, countries, tuition fees, or medical programs!",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [fabPos, setFabPos] = useState({ x: 16, y: 400 });
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { x: number; y: number };
        setFabPos(clampPosition(parsed.x, parsed.y));
        return;
      } catch {
        /* use default */
      }
    }
    setFabPos(getDefaultPosition());
  }, []);

  useEffect(() => {
    const onResize = () => setFabPos((p) => clampPosition(p.x, p.y));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const persistPosition = useCallback((pos: { x: number; y: number }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: fabPos.x,
      originY: fabPos.y,
      moved: false,
    };
    setIsDragging(true);
    setShowTooltip(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || dragState.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) {
      dragState.current.moved = true;
    }
    const next = clampPosition(dragState.current.originX + dx, dragState.current.originY + dy);
    setFabPos(next);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || dragState.current.pointerId !== e.pointerId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    const wasDrag = dragState.current.moved;
    const finalPos = clampPosition(
      dragState.current.originX + dx,
      dragState.current.originY + dy
    );
    setFabPos(finalPos);
    if (wasDrag) {
      persistPosition(finalPos);
    } else {
      setIsOpen((open) => !open);
    }
    dragState.current.active = false;
    dragState.current.moved = false;
    setIsDragging(false);
  };

  const getBotResponse = (input: string): string => {
    const query = input.toLowerCase().trim();

    if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
      return "Hello! How can I help you today? You can ask me about regional admissions, tuition rankings, or specific subjects like engineering/medicine.";
    }

    const matchedUnis = universities.filter(
      (uni) =>
        query.includes(uni.name.toLowerCase()) ||
        query.includes(uni.id.toLowerCase()) ||
        (uni.id === "nus" && query.includes("nus")) ||
        (uni.id === "hku" && query.includes("hku")) ||
        (uni.id === "snu" && query.includes("snu")) ||
        (uni.id === "ntu" && query.includes("ntu")) ||
        (uni.id === "kaist" && query.includes("kaist")) ||
        (uni.id === "cuhk" && query.includes("cuhk")) ||
        (uni.id === "iisc" && query.includes("iisc")) ||
        (uni.id === "iit" && query.includes("iit")) ||
        (uni.id === "tma" && query.includes("tma")) ||
        (query.includes("tashkent medical") && uni.id === "tashkent-med")
    );

    if (matchedUnis.length > 0) {
      const uni = matchedUnis[0];
      return `**${uni.name}** (${uni.location})
• **Asia Standing Rank**: #${uni.history[0]}
• **Percentile Score**: ${uni.overall}/100
• **Research Citations Index**: ${uni.citations}/100
• **Annual Tuition**: ${uni.tuition}
• **Popular Subjects**: ${uni.subjects.slice(0, 3).join(", ")}
• **Medicine Program Taught**: ${uni.hasMedicine ? "Yes (English-medium)" : "No"}

*${uni.description}*`;
    }

    if (
      query.includes("medicine") ||
      query.includes("medical") ||
      query.includes("mbbs") ||
      query.includes("md") ||
      query.includes("doctor")
    ) {
      const medUnis = universities.filter((u) => u.hasMedicine);
      return `Here are the top indexed universities offering **Medical / MD / MBBS Programs**:
${medUnis
  .slice(0, 5)
  .map((u) => `• **${u.name}** (Rank #${u.history[0]}, ${u.location}) - Tuition: ${u.tuition}`)
  .join("\n")}
All Central Asian options feature WHO-recognized, English-medium MBBS courses for international students.`;
    }

    if (
      query.includes("uzbekistan") ||
      query.includes("tashkent") ||
      query.includes("samarkand") ||
      query.includes("fergana") ||
      query.includes("bukhara")
    ) {
      const uzUnis = universities.filter((u) => u.location.toLowerCase() === "uzbekistan");
      return `**Uzbekistan Admissions & Universities**:
${uzUnis
  .map((u) => `• **${u.name}** (Rank #${u.history[0]}) - Estimated Tuition: ${u.tuition}`)
  .join("\n")}
These medical schools hosts over 2,000 international scholars and provide intensive clinical anatomy practice.`;
    }

    if (
      query.includes("japan") ||
      query.includes("tokyo") ||
      query.includes("kyoto") ||
      query.includes("osaka") ||
      query.includes("tsukuba")
    ) {
      const jpUnis = universities.filter((u) => u.location.toLowerCase() === "japan");
      return `**Top Research Japanese Universities**:
${jpUnis
  .map((u) => `• **${u.name}** (Rank #${u.history[0]}) - Citations: ${u.citations}/100`)
  .join("\n")}
These public institutions are highly competitive and offer excellent research facilities.`;
    }

    if (query.includes("singapore") || query.includes("nus") || query.includes("ntu")) {
      const sgUnis = universities.filter((u) => u.location.toLowerCase() === "singapore");
      return `**Singapore Global Academic Nodes**:
${sgUnis
  .map((u) => `• **${u.name}** (Rank #${u.history[0]}) - Citation Index: ${u.citations}/100. Tuition is higher (approx. ${u.tuition}), but global merit-based scholarships are available.`)
  .join("\n")}`;
    }

    if (
      query.includes("india") ||
      query.includes("iit") ||
      query.includes("iisc") ||
      query.includes("bombay") ||
      query.includes("delhi")
    ) {
      const inUnis = universities.filter((u) => u.location.toLowerCase() === "india");
      return `**Top Indian Institutions**:
${inUnis
  .map((u) => `• **${u.name}** (Rank #${u.history[0]}) - Citations: ${u.citations}/100 (IISc holds the world's highest citations-per-faculty score!)`)
  .join("\n")}`;
    }

    if (
      query.includes("tuition") ||
      query.includes("fee") ||
      query.includes("cheap") ||
      query.includes("cost") ||
      query.includes("expensive") ||
      query.includes("price")
    ) {
      const getTuitionVal = (t: string) => {
        const num = parseInt(t.replace(/[^0-9]/g, ""));
        return isNaN(num) ? 99999 : num;
      };
      const sorted = [...universities].sort(
        (a, b) => getTuitionVal(a.tuition) - getTuitionVal(b.tuition)
      );
      return `**Tuition Estimates Q&A**:
*Budget-friendly Medical/Academic Nodes:*
${sorted
  .slice(0, 5)
  .map((u) => `• **${u.name}** (${u.location}) - **${u.tuition}**`)
  .join("\n")}

*High-tier Premium Universities:*
${sorted
  .slice(-3)
  .reverse()
  .map((u) => `• **${u.name}** (${u.location}) - **${u.tuition}**`)
  .join("\n")}`;
    }

    if (query.includes("rank") || query.includes("best") || query.includes("top")) {
      const top5 = universities.slice(0, 5);
      return `Here are the current **Top 5 Asia Universities** based on our audited indexes:
${top5
  .map((u, i) => `${i + 1}. **${u.name}** (Rank #${u.history[0]}, ${u.location}) - Index Score: ${u.overall}`)
  .join("\n")}`;
    }

    if (
      query.includes("score") ||
      query.includes("calculate") ||
      query.includes("weight") ||
      query.includes("formula") ||
      query.includes("metrics")
    ) {
      return `Our **Asia University Rankings Index** evaluates institutions across 5 key weight metrics:
• **Citations Index** (30% weight) - Citation density output
• **Research Output** (30% weight) - Peer-audited publications
• **Employability Rate** (20% weight) - Placements
• **Teaching Environment** (10% weight) - Faculty ratio
• **International Diversity** (10% weight) - Student diversity

You can dynamically adjust these weights in the **Rankings Engine** page!`;
    }

    return "I couldn't find a direct matches in our database. Try asking about: 'medical programs', 'Uzbekistan tuition', 'top 5 universities', or specific names like 'Tsinghua' or 'NUS'!";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getBotResponse(text);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const content = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const italicRegex = /\*(.*?)\*/g;
      const tempText = content.replace(boldRegex, "<b>$1</b>").replace(italicRegex, "<i>$1</i>");

      return (
        <div
          key={i}
          className="mb-1 leading-relaxed text-xs"
          dangerouslySetInnerHTML={{
            __html: tempText
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/g, "<strong>$1</strong>")
              .replace(/&lt;i&gt;(.*?)&lt;\/i&gt;/g, "<em>$1</em>"),
          }}
        />
      );
    });
  };

  return (
    <>
      {/* One-touch draggable FAB — default above mobile nav, left side to avoid Settings */}
      <div
        className="aur-chat-fab group"
        style={{ left: fabPos.x, top: fabPos.y }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant. Drag to move."}
        aria-expanded={isOpen}
      >
        <div
          
          
          className="w-full h-full relative"
          style={{ scale: isDragging ? 1.06 : 1 }}
        >
          <div className="absolute inset-[-4px] rounded-full border border-dashed border-amber-600/30 dark:border-cyber-yellow/40 animate-[spin_30s_linear_infinite] pointer-events-none" />
          <span className="absolute inset-0 rounded-full bg-amber-500/10 dark:bg-cyber-yellow/5 animate-pulse pointer-events-none" />

          <div
            className={`w-full h-full rounded-full flex items-center justify-center bg-slate-950/90 dark:bg-cyber-gray/95 border-2 border-amber-500/50 dark:border-cyber-yellow/60 shadow-[0_4px_25px_rgba(180,83,9,0.3)] dark:shadow-[0_0_20px_rgba(234,179,8,0.2)] backdrop-blur-md relative overflow-hidden transition-shadow ${
              isDragging
                ? "shadow-[0_8px_32px_rgba(180,83,9,0.45)] border-amber-400"
                : "group-hover:shadow-[0_0_30px_rgba(234,179,8,0.55)]"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            <div
              
              className="flex items-center justify-center w-full h-full relative z-10 pointer-events-none"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-amber-500 dark:text-cyber-yellow" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Bot className="h-7 w-7 text-amber-500 dark:text-cyber-yellow" />
                  <Sparkles className="h-3.5 w-3.5 absolute -top-1.5 -right-1.5 text-amber-400 dark:text-cyber-yellow-bright animate-bounce" />
                </div>
              )}
            </div>
          </div>
        </div>

        <>
          {showTooltip && !isOpen && !isDragging && (
            <div
              
              
              
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-44 bg-slate-900 border border-slate-800 dark:bg-cyber-gray dark:border-cyber-yellow/20 text-white rounded-lg p-2.5 text-[10px] font-bold uppercase tracking-wider shadow-lg text-center leading-normal pointer-events-none hidden sm:block"
            >
              Drag anywhere · Tap to chat
              <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-cyber-gray border-l border-b border-slate-800 dark:border-cyber-yellow/20 rotate-45" />
            </div>
          )}
        </>
      </div>

      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center sm:items-end sm:justify-end p-4 sm:p-6 md:p-8">
            <div
              
              
              
              
              className="pointer-events-auto w-full max-w-sm sm:max-w-md h-[min(480px,calc(100vh-120px))] bg-white/95 dark:bg-cyber-dark/95 border border-slate-200 dark:border-cyber-border rounded-2xl shadow-2xl flex flex-col overflow-hidden cyber-glass-light dark:cyber-glass mb-20 sm:mb-20 md:mb-6"
            >
              <div className="p-4 border-b border-slate-200/60 dark:border-cyber-border/40 bg-slate-50/50 dark:bg-cyber-gray/40 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-700/10 dark:bg-cyber-yellow/10 flex items-center justify-center text-amber-700 dark:text-cyber-yellow">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      AUR Academic Assistant
                      <Sparkles className="h-3 w-3 text-amber-700 dark:text-cyber-yellow animate-pulse" />
                    </h3>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block font-semibold leading-none">
                      Local Index Intelligence Mode
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-cyber-yellow transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isBot ? "justify-start" : "justify-end"} items-start gap-2.5`}
                    >
                      {isBot && (
                        <div className="w-6.5 h-6.5 rounded-full border border-slate-200 dark:border-cyber-border/30 bg-slate-100 dark:bg-cyber-gray flex items-center justify-center shrink-0 text-slate-500 dark:text-cyber-yellow text-[10px]">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs font-sans ${
                          isBot
                            ? "bg-slate-100 dark:bg-cyber-gray text-slate-800 dark:text-slate-100 rounded-tl-xs"
                            : "bg-amber-700 text-white rounded-tr-xs dark:bg-cyber-yellow dark:text-cyber-black font-semibold"
                        }`}
                      >
                        {isBot ? formatText(msg.text) : <div>{msg.text}</div>}
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex justify-start items-center gap-2.5">
                    <div className="w-6.5 h-6.5 rounded-full border border-slate-200 dark:border-cyber-border/30 bg-slate-100 dark:bg-cyber-gray flex items-center justify-center shrink-0">
                      <Bot className="h-3.5 w-3.5 text-slate-500 dark:text-cyber-yellow" />
                    </div>
                    <div className="bg-slate-100 dark:bg-cyber-gray rounded-2xl px-4 py-3 flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyber-yellow animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyber-yellow animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-cyber-yellow animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-cyber-border/20 bg-slate-50/20 dark:bg-cyber-gray/10 shrink-0">
                {["Top 5 Universities", "MBBS in Uzbekistan", "NUS vs NTU tuition", "Weight formula"].map(
                  (chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 border border-slate-200 hover:border-slate-800 dark:border-cyber-border/50 dark:hover:border-cyber-yellow bg-white dark:bg-cyber-gray hover:bg-slate-50 dark:hover:bg-cyber-dark/40 text-slate-650 dark:text-slate-400 dark:hover:text-cyber-yellow rounded-full transition-all duration-150"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
                className="p-3 border-t border-slate-200/60 dark:border-cyber-border/40 bg-slate-50/50 dark:bg-cyber-gray/40 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask rankings assistant..."
                  className="flex-grow bg-white dark:bg-cyber-gray border border-slate-200 dark:border-cyber-border/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow text-slate-850 dark:text-slate-100 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2 bg-slate-900 hover:bg-slate-850 dark:bg-transparent dark:border dark:border-cyber-yellow text-white dark:text-cyber-yellow disabled:opacity-40 disabled:cursor-not-allowed dark:disabled:border-cyber-border dark:disabled:text-slate-600 rounded-xl transition-all duration-150"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    </>
  );
}
