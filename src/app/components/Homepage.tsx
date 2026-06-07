"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, BookOpen, GraduationCap, ChevronRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { MOCK_UNIVERSITIES, FEATURED_ARTICLES, University, Article } from "../data";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{
    universities: University[];
    articles: Article[];
  }>({ universities: [], articles: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<"overall" | "research" | "employability">("overall");
  
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Debounced search auto-suggestions
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions({ universities: [], articles: [] });
      return;
    }

    const filteredUnis = MOCK_UNIVERSITIES.filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5);

    const filteredArticles = FEATURED_ARTICLES.filter(
      (art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.contentSummary.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3);

    setSuggestions({ universities: filteredUnis, articles: filteredArticles });
  }, [searchQuery]);

  // Click outside listener to close suggestions
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

  // Get Top 5 Universities based on active metric tab
  const getTopFive = () => {
    const sorted = [...MOCK_UNIVERSITIES].sort((a, b) => {
      if (activeTab === "research") return b.research - a.research;
      if (activeTab === "employability") return b.employability - a.employability;
      return b.overall - a.overall;
    });
    return sorted.slice(0, 5);
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-8 font-sans grow -mt-2">
      
      {/* Split Layout Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-16 border-b border-slate-200 pb-16">
        
        {/* Left Pane (40% - Cols 1-4): Discovery & Typographic Search */}
        <div className="lg:col-span-4 flex flex-col justify-start pt-2 lg:pt-4 pr-0 lg:pr-6">
          <div className="mb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
              Academic Intelligence Hub
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight mb-4">
            Find World-Class Education in Asia.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Filter institutional indicators, compare global rankings, and explore regional study models including medical careers in Central Asia.
          </p>

          {/* Search Box Container */}
          <div className="relative w-full" ref={suggestionRef}>
            <form onSubmit={handleSearchSubmit} className="flex">
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Search universities, locations..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full border border-slate-900 bg-white px-4 py-3 pl-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                />
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider px-6 hover:bg-slate-800 transition-colors border-y border-r border-slate-900"
              >
                Search
              </motion.button>
            </form>

            {/* Debounced Suggestion Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.99 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 right-0 z-20 mt-1.5 border border-slate-950 bg-white shadow-xl max-h-96 overflow-y-auto"
                >
                
                {/* Universities Section */}
                <div className="p-3 border-b border-slate-100">
                  <div className="flex items-center space-x-1.5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                    <span>Universities</span>
                  </div>
                  {suggestions.universities.length > 0 ? (
                    <ul className="space-y-1">
                      {suggestions.universities.map((uni) => (
                        <li key={uni.id}>
                          <button
                            onClick={() => {
                              onUniversitySelect(uni.id);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left flex items-center justify-between p-2 hover:bg-slate-50 transition-colors text-xs"
                          >
                            <span className="font-semibold text-slate-800 truncate pr-4">{uni.name}</span>
                            <span className="flex items-center text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono shrink-0">
                              <MapPin className="h-2.5 w-2.5 mr-0.5" />
                              {uni.location}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400 p-2 italic">No universities found</div>
                  )}
                </div>

                {/* Spotlight Reports & Country Nodes */}
                <div className="p-3">
                  <div className="flex items-center space-x-1.5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    <span>Spotlights & Articles</span>
                  </div>
                  {suggestions.articles.length > 0 ? (
                    <ul className="space-y-1">
                      {suggestions.articles.map((art) => (
                        <li key={art.id}>
                          <button
                            onClick={() => {
                              onArticleSelect(art);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-2 hover:bg-slate-50 transition-colors text-xs block"
                          >
                            <span className="font-semibold text-slate-800 line-clamp-1">{art.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{art.source}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400 p-2 italic">No relevant articles found</div>
                  )}
                </div>

                {/* View All Search Link */}
                <div className="bg-slate-50 p-2 text-center border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSearchSubmit(searchQuery);
                      onViewChange("rankings");
                      setShowSuggestions(false);
                    }}
                    className="inline-flex items-center text-[10px] font-bold text-amber-700 uppercase tracking-widest hover:text-amber-800"
                  >
                    View all rankings matching &quot;{searchQuery}&quot;
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Quick-links / Popular Searches */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Trending:</span>
            {["Uzbekistan", "Medicine", "National Univ Singapore", "English medium", "Scholarships"].map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ y: -1, scale: 1.02 }}
                onClick={() => {
                  setSearchQuery(tag);
                  onSearchSubmit(tag);
                  onViewChange("rankings");
                }}
                className="text-[11px] border border-slate-200 px-2 py-0.5 text-slate-600 hover:border-slate-900 hover:text-slate-900 bg-slate-50 transition-all font-mono"
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Pane (60% - Cols 5-10): Global Interactive Rank Card */}
        <div className="lg:col-span-6 border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Live Top 5 Universities
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                  Real-time Audited Academic Index
                </p>
              </div>
              <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 border border-amber-200 font-mono">
                <Star className="h-3.5 w-3.5 fill-amber-700 mr-1 shrink-0" />
                Rankings 2026
              </span>
            </div>

            {/* Quick Metrics Selector Tabs */}
            <div className="flex border-b border-slate-100 mb-6">
              {[
                { id: "overall", label: "Overall Score" },
                { id: "research", label: "Research Metric" },
                { id: "employability", label: "Employability Ratio" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative border-b-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors -mb-px ${
                    activeTab === tab.id
                      ? "border-amber-700 text-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="active-tab-indicator"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-amber-700"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Micro Tabular View */}
            <div className="space-y-3">
              {getTopFive().map((uni, idx) => {
                const activeScore =
                  activeTab === "research"
                    ? uni.research
                    : activeTab === "employability"
                    ? uni.employability
                    : uni.overall;

                return (
                  <motion.div
                    key={uni.id}
                    onClick={() => onUniversitySelect(uni.id)}
                    whileHover={{ y: -2, boxShadow: "0 14px 35px rgba(15,23,42,0.08)" }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-300 bg-slate-50 hover:bg-white cursor-pointer transition-all duration-150 group"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-slate-900 bg-slate-900 text-white font-mono text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors truncate">
                          {uni.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {uni.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 shrink-0 font-mono">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {activeScore.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-slate-400 block uppercase tracking-wider">
                          Score
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">
              * Filterable by Location, Program & Tuition.
            </span>
            <button
              onClick={() => onViewChange("rankings")}
              className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-amber-700 transition-colors inline-flex items-center"
            >
              Analyze All Universities
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Content Grid Header */}
      <div className="mb-8 border-b border-slate-900 pb-2 flex justify-between items-baseline">
        <h3 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">
          Editorial Focus & Regional Briefings
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
          Featured Articles
        </span>
      </div>

      {/* 3-Column Editorial Grid Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200">
        {FEATURED_ARTICLES.map((article, idx) => (
          <motion.div
            key={article.id}
            onClick={() => onArticleSelect(article)}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.05 }}
            className={`py-8 cursor-pointer group flex flex-col justify-between h-full ${
              idx === 0 ? "md:pr-8" : idx === 1 ? "md:px-8" : "md:pl-8"
            }`}
          >
            <div>
              {/* Image Frame with Strict Aspect Ratio */}
              <div className="relative aspect-video w-full mb-6 border border-slate-200 overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={article.image}
                  alt={article.title}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full w-full object-cover object-center transition-transform"
                />
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              {/* Headings in Lora */}
              <h4 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2">
                {article.title}
              </h4>
              <p className="font-serif text-xs italic text-slate-500 mb-4 leading-normal">
                {article.subtitle}
              </p>

              {/* Body Summary */}
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-6">
                {article.contentSummary}
              </p>
            </div>

            <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors">
              <span>Read Full Report</span>
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Partner Universities Grid (QS Style) */}
      <div className="mt-16 pt-16 border-t border-slate-200 text-center">
        <h2 className="text-3xl font-bold font-sans tracking-tight text-slate-900 mb-10">
          Over 650 global partner universities
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {MOCK_UNIVERSITIES.slice(0, 8).map((uni, idx) => (
            <motion.div
              key={`partner-${uni.id}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => onUniversitySelect(uni.id)}
              className="bg-white border border-slate-100 p-6 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all h-32 group"
            >
              <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100 flex items-center justify-center flex-col">
                <div className="h-10 w-10 relative mb-2">
                  <img
                    src={uni.campusPhoto}
                    alt={`${uni.name} Logo`}
                    className="object-cover rounded-md w-full h-full"
                  />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-800 text-center line-clamp-2">
                  {uni.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
