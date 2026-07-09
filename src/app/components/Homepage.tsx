"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import NewsFlashWidget from "./NewsFlashWidget";
import Image from "next/image";
import {
  Search,
  BookOpen,
  GraduationCap,
  ChevronRight,
  MapPin,
  Globe2,
  BarChart3,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Bell,
  Building2,
  LineChart,
  Activity,
  Mail,
  Plus,
} from "lucide-react";
import { FEATURED_ARTICLES, University, Article } from "../data";
import { BLOG_CATEGORY_TABS, getPublishedStoredBlogs, storedBlogToArticle } from "../lib/blog-storage";
import { useUniversityData } from "./data/UniversityDataProvider";
import { useSidebar } from "./navigation/SidebarContext";
import { AsiaMapNetwork, MapUniversityCards } from "./home/AsiaMapHero";
import "./home/ref-home.css";
import { API_BASE_URL } from "../lib/universities";

/* ── Reusable scroll-reveal wrapper ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}

type SuggestionPick =
  | { kind: "uni"; uni: University }
  | { kind: "article"; article: Article }
  | { kind: "view-all" };

const COUNTRY_FLAGS: Record<string, string> = {
  China: "🇨🇳",
  Singapore: "🇸🇬",
  Japan: "🇯🇵",
  "South Korea": "🇰🇷",
  India: "🇮🇳",
  Malaysia: "🇲🇾",
  Thailand: "🇹🇭",
  Vietnam: "🇻🇳",
  Indonesia: "🇮🇩",
  Uzbekistan: "🇺🇿",
  Kazakhstan: "🇰🇿",
  Taiwan: "🇹🇼",
  "Hong Kong": "🇭🇰",
  Philippines: "🇵🇭",
  Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩",
  Nepal: "🇳🇵",
  Myanmar: "🇲🇲",
  Cambodia: "🇰🇭",
  Mongolia: "🇲🇳",
};

const socialLinks = [
  {
    label: "Twitter",
    imgSrc: "/twitter-logo.png",
    href: "https://twitter.com",
  },
  {
    label: "LinkedIn",
    imgSrc: "/linkedin-logo.png",
    href: "https://www.linkedin.com/company/asia-university-rankings/",
  },
  {
    label: "Instagram",
    imgSrc: "/instagram-logo.png",
    href: "https://www.instagram.com/asiauniversityrankings/",
  },
  {
    label: "YouTube",
    imgSrc: "/youtube-logo.png",
    href: "https://www.youtube.com/",
  },
];

/** Light cards themed around each country's iconic monument */
const COUNTRY_THEME: Record<
  string,
  { code: string; monument: string; accent: string; bg: string; image: string; imagePos?: string }
> = {
  Singapore: {
    code: "SG",
    monument: "Marina Bay Sands",
    accent: "#ef4444",
    bg: "linear-gradient(135deg, #fff5f5 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1525621488860-1f28d3244604?auto=format&fit=crop&w=600&q=80",
    imagePos: "70% center",
  },
  "Hong Kong": {
    code: "HK",
    monument: "Victoria Harbour",
    accent: "#dc2626",
    bg: "linear-gradient(135deg, #fff7f7 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1536596788103-df0d9994a3e3?auto=format&fit=crop&w=600&q=80",
    imagePos: "center 40%",
  },
  "South Korea": {
    code: "KR",
    monument: "Gyeongbokgung Palace",
    accent: "#2563eb",
    bg: "linear-gradient(135deg, #eff6ff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1517154428173-52d99888fc9e?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  China: {
    code: "CN",
    monument: "Great Wall of China",
    accent: "#dc2626",
    bg: "linear-gradient(135deg, #fffbeb 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Japan: {
    code: "JP",
    monument: "Mount Fuji",
    accent: "#be123c",
    bg: "linear-gradient(135deg, #fff1f2 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    imagePos: "center 35%",
  },
  India: {
    code: "IN",
    monument: "Taj Mahal",
    accent: "#ea580c",
    bg: "linear-gradient(135deg, #fff7ed 0%, #ffffff 55%, #f0fdf4 100%)",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Taiwan: {
    code: "TW",
    monument: "Taipei 101",
    accent: "#1d4ed8",
    bg: "linear-gradient(135deg, #eff6ff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1470006985013-6c54c888a04f?auto=format&fit=crop&w=600&q=80",
    imagePos: "center bottom",
  },
  Malaysia: {
    code: "MY",
    monument: "Petronas Towers",
    accent: "#1e40af",
    bg: "linear-gradient(135deg, #eff6ff 0%, #ffffff 55%, #fefce8 100%)",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Thailand: {
    code: "TH",
    monument: "Wat Arun",
    accent: "#b45309",
    bg: "linear-gradient(135deg, #fffbeb 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1552465011-5ec7e39b7250?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Vietnam: {
    code: "VN",
    monument: "Ha Long Bay",
    accent: "#059669",
    bg: "linear-gradient(135deg, #ecfdf5 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Indonesia: {
    code: "ID",
    monument: "Borobudur Temple",
    accent: "#c2410c",
    bg: "linear-gradient(135deg, #fff7ed 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Uzbekistan: {
    code: "UZ",
    monument: "Registan, Samarkand",
    accent: "#0284c7",
    bg: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1578895101403-2fc6c0e161bb?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Kazakhstan: {
    code: "KZ",
    monument: "Bayterek Tower",
    accent: "#0891b2",
    bg: "linear-gradient(135deg, #ecfeff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Philippines: {
    code: "PH",
    monument: "Mayon Volcano",
    accent: "#2563eb",
    bg: "linear-gradient(135deg, #eff6ff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1518509562904-7a059f5c4d0c?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Pakistan: {
    code: "PK",
    monument: "Faisal Mosque",
    accent: "#16a34a",
    bg: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1571875257727-b31a4db7c926?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Bangladesh: {
    code: "BD",
    monument: "Sixty Dome Mosque",
    accent: "#15803d",
    bg: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Nepal: {
    code: "NP",
    monument: "Boudhanath Stupa",
    accent: "#dc2626",
    bg: "linear-gradient(135deg, #fff7ed 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Myanmar: {
    code: "MM",
    monument: "Shwedagon Pagoda",
    accent: "#ca8a04",
    bg: "linear-gradient(135deg, #fefce8 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1559592410-5c6a0c2fc866?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Cambodia: {
    code: "KH",
    monument: "Angkor Wat",
    accent: "#b45309",
    bg: "linear-gradient(135deg, #fff7ed 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1609137144813-b021b859d386?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
  Mongolia: {
    code: "MN",
    monument: "Genghis Khan Statue",
    accent: "#1d4ed8",
    bg: "linear-gradient(135deg, #eff6ff 0%, #ffffff 62%)",
    image: "https://images.unsplash.com/photo-1548013144-3a63e8ce00a3?auto=format&fit=crop&w=600&q=80",
    imagePos: "center",
  },
};

function getCountryTheme(country: string) {
  return (
    COUNTRY_THEME[country] ?? {
      code: country.slice(0, 2).toUpperCase(),
      monument: country,
      accent: "#f97316",
      bg: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
      image: "https://images.unsplash.com/photo-1562774053-f5a02f6da861?auto=format&fit=crop&w=600&q=80",
      imagePos: "center",
    }
  );
}

const LIVE_UPDATES = [
  { text: "New Rankings Published", time: "2 min ago", color: "#f59e0b" },
  { text: "Tsinghua University climbs to #1", time: "15 min ago", color: "#2563eb" },
  { text: "Singapore institutions gain +2.4 avg", time: "32 min ago", color: "#f59e0b" },
];

const METHODOLOGY = [
  { label: "Research Impact", pct: 40, color: "#3b82f6" },
  { label: "Teaching Excellence", pct: 25, color: "#10b981" },
  { label: "Employability", pct: 15, color: "#f59e0b" },
  { label: "International Outlook", pct: 15, color: "#8b5cf6" },
  { label: "Industry Income", pct: 5, color: "#64748b" },
];

const PULSE_ITEMS = [
  "Tsinghua leads research output index",
  "NUS tops employability in ASEAN",
  "Uzbekistan medical programs surge +18%",
  "Japan universities rise in citations",
  "Singapore avg score hits 94.2",
  "New English-medium tracks in Central Asia",
];

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-100 text-amber-800 px-0.5">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function Sparkline({ values, color = "#3b82f6" }: { values: number[]; color?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 48;
      const y = 14 - ((v - min) / range) * 12;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="52" height="16" className="inline-block" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function MiniLineChart({ color, trend }: { color: string; trend?: "up" | "down" }) {
  const pts = trend === "down" ? "0,12 12,8 24,10 36,6 48,8" : "0,10 12,8 24,6 36,4 48,2";
  return (
    <svg width="100%" height="48" viewBox="0 0 48 16" preserveAspectRatio="none" className="mt-2">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} opacity="0.9" />
      <polyline fill={`${color}22`} stroke="none" points={`${pts} 48,16 0,16`} />
    </svg>
  );
}

function RadarChart({ universities }: { universities: University[] }) {
  const axes = ["Innovation", "Research", "Teaching", "Employability", "Intl"];
  const n = axes.length;
  const cx = 120;
  const cy = 120;
  const r = 80;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, val: number) => {
    const rad = (val / 100) * r;
    return { x: cx + Math.cos(angle(i)) * rad, y: cy + Math.sin(angle(i)) * rad };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];

  const getVals = (u: University) => [
    u.research * 0.95,
    u.research,
    u.teaching,
    u.employability,
    u.intlStudents,
  ];

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] mx-auto">
      {gridLevels.map((lvl) => {
        const pts = axes
          .map((_, i) => {
            const p = point(i, lvl * 100);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon key={lvl} points={pts} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="1" />
        );
      })}
      {axes.map((label, i) => {
        const outer = point(i, 100);
        return (
          <g key={label}>
            <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(148,163,184,0.12)" />
            <text
              x={outer.x + (outer.x - cx) * 0.12}
              y={outer.y + (outer.y - cy) * 0.12}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="8"
            >
              {label}
            </text>
          </g>
        );
      })}
      {universities.map((uni, ui) => {
        const vals = getVals(uni);
        const pts = vals
          .map((v, i) => {
            const p = point(i, v);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={uni.id}
            points={pts}
            fill={`${colors[ui]}22`}
            stroke={colors[ui]}
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

function getCountryStats(universities: University[]) {
  const map = new Map<string, University[]>();
  universities.forEach((u) => {
    if (!map.has(u.location)) map.set(u.location, []);
    map.get(u.location)!.push(u);
  });
  return Array.from(map.entries())
    .map(([country, unis]) => {
      const sorted = [...unis].sort((a, b) => b.overall - a.overall);
      return {
        country,
        count: unis.length,
        avgScore: unis.reduce((s, u) => s + u.overall, 0) / unis.length,
        topUni: sorted[0],
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 8);
}

function rankTrend(uni: University) {
  const delta = (uni.history[1] ?? uni.history[0]) - uni.history[0];
  return { delta, improved: delta > 0 };
}

function scoreHistory(uni: University, metric: "research" | "employability" | "overall") {
  const base = metric === "research" ? uni.research : metric === "employability" ? uni.employability : uni.overall;
  return uni.history.map((rank, i) => Math.min(100, base - i * 0.8 + (5 - rank) * 0.5));
}

interface HomepageProps {
  onSearchSubmit: (query: string) => void;
  onUniversitySelect: (id: string) => void;
  onArticleSelect: (article: Article) => void;
  onViewChange: (view: string) => void;
}

export default function Homepage({
  onSearchSubmit,
  onUniversitySelect,
  onArticleSelect,
  onViewChange,
}: HomepageProps) {
  const { universities } = useUniversityData();
  const { searchQuery, setSearchQuery } = useSidebar();
  const [suggestions, setSuggestions] = useState<{ universities: University[]; articles: Article[] }>({
    universities: [],
    articles: [],
  });

    // Newsletter
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [articleTab, setArticleTab] = useState<"featured" | "reports" | "insights">("featured");
  const [createdArticles, setCreatedArticles] = useState<Article[]>([]);

  const suggestionRef = useRef<HTMLDivElement>(null);
  const methodologyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCreatedArticles = () => {
      setCreatedArticles(getPublishedStoredBlogs().map(storedBlogToArticle));
    };

    loadCreatedArticles();
    window.addEventListener("storage", loadCreatedArticles);

    return () => window.removeEventListener("storage", loadCreatedArticles);
  }, []);

  const articlesForSearch = useMemo(
    () => [...createdArticles, ...FEATURED_ARTICLES],
    [createdArticles]
  );

  const displayedArticles = useMemo(() => {
    const localArticlesForTab = createdArticles.filter((article) => {
      const category = article.category as keyof typeof BLOG_CATEGORY_TABS | undefined;
      return category ? BLOG_CATEGORY_TABS[category] === articleTab : false;
    });

    return articleTab === "featured" ? [...localArticlesForTab, ...FEATURED_ARTICLES] : localArticlesForTab;
  }, [articleTab, createdArticles]);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions({ universities: [], articles: [] });
      return;
    }
    const filteredUnis = universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);
    const filteredArticles = articlesForSearch.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);
    setSuggestions({ universities: filteredUnis, articles: filteredArticles });
  }, [articlesForSearch, searchQuery, universities]);

  const flatSuggestions = useMemo((): SuggestionPick[] => {
    const items: SuggestionPick[] = [];
    suggestions.universities.forEach((uni) => items.push({ kind: "uni", uni }));
    suggestions.articles.forEach((article) => items.push({ kind: "article", article }));
    if (searchQuery.trim().length > 0) items.push({ kind: "view-all" });
    return items;
  }, [suggestions, searchQuery]);

  useEffect(() => setActiveSuggestionIndex(-1), [searchQuery]);

  const activateSuggestion = useCallback(
    (item: SuggestionPick) => {
      if (item.kind === "uni") {
        onUniversitySelect(item.uni.id);
        setShowSuggestions(false);
      } else if (item.kind === "article") {
        onArticleSelect(item.article);
        setShowSuggestions(false);
      } else {
        onSearchSubmit(searchQuery);
        onViewChange("rankings");
        setShowSuggestions(false);
      }
    },
    [onArticleSelect, onSearchSubmit, onUniversitySelect, onViewChange, searchQuery]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }
    if (!showSuggestions || flatSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.min(i + 1, flatSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      e.preventDefault();
      activateSuggestion(flatSuggestions[activeSuggestionIndex]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      onViewChange("rankings");
      setShowSuggestions(false);
    }
  };

  const topTen = useMemo(
    () => [...universities].sort((a, b) => b.overall - a.overall).slice(0, 10),
    [universities]
  );

  const countryStats = useMemo(() => getCountryStats(universities), [universities]);
  const compareUnis = topTen.slice(0, 4);
  const uniqueCountries = useMemo(() => new Set(universities.map((u) => u.location)).size, [universities]);
  const mapUniversities = topTen.slice(0, 3);

  const scrollToMethodology = () => {
    // Navigated via onViewChange("methodology") — scroll ref no longer needed
  };

  const handleSubscribe = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    setStatus("Please enter a valid email address.");
    return;
  }

  setLoading(true);
  setStatus("");

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/newsletter/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Subscription failed.");
    }

    setStatus("Thank you for subscribing!");
    setEmail("");
  } catch (error) {
    setStatus(
      error instanceof Error
        ? error.message
        : "Unable to connect. Please try again later."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="ref-home flex-grow w-full relative">


      {/* ── Hero ── */}
      <section className="ref-hero overflow-hidden">
        <div className="ref-hero-grid">
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <span
              className="ref-label"
              
              
              
            >Asia University Rankings</span>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mt-3 mb-4">
              Asia&apos;s Most Trusted{" "}
              <span className="ref-hero-title-accent">University Intelligence</span> Platform
            </h1>
            <p className="text-[var(--ref-muted)] text-sm leading-relaxed max-w-2xl mx-auto mb-8">
              Filter institutional indicators, compare global rankings, and explore regional study models
              including medical careers in Central Asia — powered by live audited data.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button type="button" className="ref-btn-primary" onClick={() => onViewChange("rankings")}>
                Explore Rankings
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" className="ref-btn-outline" onClick={() => onViewChange("methodology")}>
                <BookOpen className="h-4 w-4" />
                Our Methodology
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-2xl mx-auto mb-4" ref={suggestionRef}>
              <form onSubmit={handleSearchSubmit} className="flex rounded-none overflow-hidden border border-[var(--ref-border)]">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ref-muted)]" />
                  <input
                    type="search"
                    role="combobox"
                    aria-expanded={showSuggestions && searchQuery.trim().length > 0}
                    placeholder="Search universities, locations, subjects..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full bg-white text-sm text-slate-900 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--ref-blue)]"
                  />
                </div>
                <button type="submit" className="ref-btn-primary rounded-none px-5 py-3 text-[11px]">
                  Search
                </button>
              </form>

              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 z-30 mt-1 ref-card max-h-80 overflow-y-auto">
                  {(() => {
                    let rowIndex = -1;
                    return (
                      <>
                        <div className="p-3 border-b border-[var(--ref-border)]">
                          <div className="ref-label text-[9px] mb-2 flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" /> Universities
                          </div>
                          {suggestions.universities.length > 0 ? (
                            <ul className="space-y-1">
                              {suggestions.universities.map((uni) => {
                                rowIndex += 1;
                                const active = activeSuggestionIndex === rowIndex;
                                return (
                                  <li key={uni.id}>
                                    <button
                                      type="button"
                                      onClick={() => activateSuggestion({ kind: "uni", uni })}
                                      className={`w-full text-left flex justify-between p-2 text-xs rounded-none ${active ? "bg-amber-50" : "hover:bg-slate-50"}`}
                                    >
                                      <span className="font-semibold truncate pr-2">{highlightMatch(uni.name, searchQuery)}</span>
                                      <span className="text-[var(--ref-muted)] shrink-0">{uni.location}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="text-xs text-[var(--ref-muted)] italic p-2">No universities found</p>
                          )}
                        </div>
                        <div className="p-3 border-b border-[var(--ref-border)]">
                          <div className="ref-label text-[9px] mb-2 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Articles
                          </div>
                          {suggestions.articles.map((art) => {
                            rowIndex += 1;
                            return (
                              <button
                                key={art.id}
                                type="button"
                                onClick={() => activateSuggestion({ kind: "article", article: art })}
                                className="w-full text-left p-2 text-xs hover:bg-slate-50 rounded-none block"
                              >
                                {highlightMatch(art.title, searchQuery)}
                              </button>
                            );
                          })}
                        </div>
                        <div className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => activateSuggestion({ kind: "view-all" })}
                            className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider"
                          >
                            View all matching &quot;{searchQuery}&quot;
                            <ChevronRight className="inline h-3 w-3" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center justify-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ref-muted)]">Trending:</span>
              {["Uzbekistan", "Medicine", "National Univ Singapore", "English medium"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setSearchQuery(tag);
                    onSearchSubmit(tag);
                    onViewChange("rankings");
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-blue-200 bg-white text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── Live Top 10 ── */}
      <RevealSection className="ref-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="ref-label">Rankings Engine</span>
            <h2 className="text-2xl font-bold mt-1">Live Top 10 Universities</h2>
          </div>
          <button type="button" className="ref-btn-primary text-[11px]" onClick={() => onViewChange("rankings")}>
            Analyze All Universities
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="ref-card-light ref-table-wrap shadow-lg">
          <table className="ref-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>University</th>
                <th>Country</th>
                <th>Score</th>
                <th>Trend</th>
                <th className="hidden md:table-cell">Research</th>
                <th className="hidden md:table-cell">Employability</th>
                <th className="hidden lg:table-cell">International</th>
              </tr>
            </thead>
            <tbody>
              {topTen.map((uni, idx) => {
                const trend = rankTrend(uni);
                return (
                  <tr
                    key={uni.id}
                    className="cursor-pointer"
                    onClick={() => onUniversitySelect(uni.id)}
                  >
                    <td>
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${idx < 3 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="font-semibold text-slate-900 max-w-[180px] truncate">{uni.name}</td>
                    <td>
                      <span className="mr-1">{COUNTRY_FLAGS[uni.location] ?? "🌏"}</span>
                      {uni.location}
                    </td>
                    <td className="font-mono font-bold">{uni.overall.toFixed(1)}</td>
                    <td>
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${trend.improved ? "ref-trend-up" : "ref-trend-down"}`}>
                        {trend.improved ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                        {Math.abs(trend.delta).toFixed(1)}
                      </span>
                    </td>
                    <td className="hidden md:table-cell">
                      <Sparkline values={scoreHistory(uni, "research")} color="#3b82f6" />
                    </td>
                    <td className="hidden md:table-cell">
                      <Sparkline values={scoreHistory(uni, "employability")} color="#10b981" />
                    </td>
                    <td className="hidden lg:table-cell">
                      <Sparkline values={[uni.intlStudents - 8, uni.intlStudents - 4, uni.intlStudents - 2, uni.intlStudents - 1, uni.intlStudents]} color="#8b5cf6" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--ref-muted)] mt-3">* Filterable by location, program &amp; tuition in Rankings Engine.</p>
      </RevealSection>

      {/* ── Explore by Country (light cards, per-country theme) ── */}
      <RevealSection className="ref-section pt-0 ref-country-section">
        <span className="ref-label">Regional Intelligence</span>
        <h2 className="text-2xl font-bold mt-1 mb-6">Explore by Country</h2>
        <div className="ref-country-grid"    >
          {countryStats.map((c) => {
            const theme = getCountryTheme(c.country);
            return (
              <button 
                key={c.country}
                type="button"
                className="ref-country-card ref-country-card--light text-left"
                style={
                  {
                    "--country-accent": theme.accent,
                    "--country-bg": theme.bg,
                    "--country-image": `url(${theme.image})`,
                    "--country-image-pos": theme.imagePos ?? "center",
                  } as React.CSSProperties
                }
                onClick={() => {
                  onSearchSubmit(c.country);
                  onViewChange("rankings");
                }}
              >
                <div className="ref-country-monument" aria-hidden="true" />
                <div className="ref-country-body">
                  <span className="ref-country-code">{theme.code}</span>
                  <span className="ref-country-monument-label">{theme.monument}</span>
                  <div className="ref-country-name">{c.country}</div>
                  <div className="ref-country-meta">{c.count} universities</div>
                  <div className="ref-country-avg">Avg {c.avgScore.toFixed(1)}</div>
                  <div className="ref-country-top truncate">Top: {c.topUni.name}</div>
                </div>
              </button>
            );
          })}
        </div>
      </RevealSection>

      {/* ── News Flash ── */}
      <RevealSection className="ref-section pt-0">
        <NewsFlashWidget />
      </RevealSection>


      {/* ── Discovery Hub ── */}
      <RevealSection className="ref-section pt-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
          <div>
            <span className="ref-label">Discovery Hub</span>
            <h2 className="text-2xl font-bold mt-1">Insights &amp; Analysis</h2>
          </div>
          <Link href="/blogs/create" className="ref-btn-outline text-[11px] uppercase tracking-wider justify-center">
            <Plus className="h-3.5 w-3.5" />
            Create Blog
          </Link>
        </div>
        <div className="ref-article-tabs flex gap-6 border-b border-[var(--ref-border)] mb-6">
          {(
            [
              { id: "featured" as const, label: "Featured Insights" },
              { id: "reports" as const, label: "Latest Reports" },
              { id: "insights" as const, label: "Regional Briefings" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setArticleTab(tab.id)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${articleTab === tab.id ? "active" : "text-[var(--ref-muted)]"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"    >
          {displayedArticles.map((article) => (
            <button
              key={article.id}
              type="button"
              
              onClick={() => onArticleSelect(article)}
              className="ref-card text-left overflow-hidden group hover:border-blue-300 transition-colors"
            >
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className="ref-label text-[9px]">Insight</span>
                <h3 className="font-bold text-sm mt-2 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-[var(--ref-muted)] line-clamp-2 mb-3">{article.contentSummary}</p>
                <span className="text-[10px] text-[var(--ref-muted)]">{article.date} · {article.readTime}</span>
              </div>
            </button>
          ))}
        </div>
      </RevealSection>


      {/* ── Pulse Ticker ── */}
      <div className="ref-pulse-ticker">
        <div className="ref-pulse-track">
          {[...PULSE_ITEMS, ...PULSE_ITEMS].map((item, i) => (
            <span key={`${item}-${i}`} className="text-xs text-[var(--ref-muted)] inline-flex items-center gap-2">
              <Activity className="h-3 w-3 text-amber-500" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Trusted By ── */}
      <section className="ref-section py-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ref-muted)] mb-6">
          Trusted by Leading Institutions
        </p>
        <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
          {topTen.slice(0, 6).map((u) => (
            <span key={u.id} className="text-sm font-bold tracking-wide text-slate-500">
              {u.name.split(" ")[0].toUpperCase()}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <RevealSection className="ref-section pt-0 pb-8">
        <div className="ref-cta-banner p-8 md:p-12">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Discover the Future of Higher Education Intelligence
            </h2>
            <p className="text-sm text-[var(--ref-muted)] mb-6">
              Access live rankings, institutional analytics, and regional insights trusted across Asia.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button type="button" className="ref-btn-primary" onClick={() => onViewChange("rankings")}>
                Explore Rankings
              </button>
              <button type="button" className="ref-btn-outline" onClick={() => onViewChange("settings")}>
                Request Institutional Access
              </button>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Footer block ── */}
      <footer className="ref-section pt-0 border-t border-[var(--ref-border)]">
        <div className="ref-footer-grid">
          <div>
  <div className="font-bold text-lg mb-2">
    ASIA <span className="text-amber-600">UNIVERSITY</span> RANKINGS
  </div>

  <p className="text-xs text-[var(--ref-muted)] leading-relaxed max-w-xs">
    The definitive intelligence platform for higher education across Asia and Central Asia.
  </p>

  {/* Social Media */}
  <div className="mt-5 flex flex-wrap items-center gap-3">
    {socialLinks.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.label}
        className="group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--ref-border)] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-amber-400 hover:shadow-md">
          <Image
            src={social.imgSrc}
            alt={social.label}
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      </a>
    ))}
  </div>
</div>
          {[
            { title: "Platform", links: [["Rankings Engine", "rankings"], ["Discovery Hub", "home"], ["Analytics", "analytics"]] },
            { title: "Resources", links: [["Methodology", "methodology"], ["Reports", "home"], ["Insights", "home"]] },
            { title: "Company", links: [["About Us", "home"], ["Contact", "settings"], ["Privacy", "settings"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, view]) => (
                  <li key={label}>
                    <button
                      type="button"
                      onClick={() => onViewChange(view)}
                      className="text-xs text-[var(--ref-muted)] hover:text-blue-600 transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-[var(--ref-border)] flex flex-col sm:flex-row justify-between gap-4 items-center">
          <span className="text-[10px] text-[var(--ref-muted)]">© 2026 Asia University Rankings. All rights reserved.</span>
<form
  onSubmit={handleSubscribe}
  className="flex w-full flex-col items-stretch gap-2 sm:w-auto"
>
  <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:items-center">
    <Mail className="h-4 w-4 text-[var(--ref-muted)] hidden sm:block" />

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Newsletter email"
      required
      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-amber-400"
    />

    <button
      type="submit"
      disabled={loading}
      className="ref-btn-primary text-[10px] px-3 py-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Subscribing..." : "Subscribe"}
    </button>
  </div>

  {status && (
    <p
      className={`text-[11px] ${
        status.includes("Thank") ? "text-green-600" : "text-red-500"
      }`}
    >
      {status}
    </p>
  )}
</form>
        </div>
      </footer>
    </div>
  );
}
