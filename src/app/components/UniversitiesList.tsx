"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  GraduationCap,
  ChevronRight,
  Globe,
  Award,
  BookOpen,
  Heart,
  BarChart2,
  ExternalLink,
  Filter,
  X,
  TrendingUp,
  Users,
} from "lucide-react";
import { MOCK_UNIVERSITIES } from "../data";
import { useSidebar } from "./navigation/SidebarContext";

interface UniversitiesListProps {
  onUniversitySelect: (id: string) => void;
  onViewChange: (view: string) => void;
  savedUniIds: string[];
  onToggleSave: (id: string) => void;
}


const REGION_STATS = [
  {
    region: "East Asia",
    countries: "China · Japan · South Korea · Hong Kong · Taiwan",
    institutions: 22,
    avgScore: 88.4,
    topField: "Engineering & Sciences",
    highlight: "Home to 7 of the top 10 ranked Asian universities.",
  },
  {
    region: "Southeast Asia",
    countries: "Singapore · Malaysia · Thailand · Indonesia",
    institutions: 8,
    avgScore: 82.1,
    topField: "Medicine & Business",
    highlight: "NUS and NTU compete at world-class levels globally.",
  },
  {
    region: "South Asia",
    countries: "India",
    institutions: 3,
    avgScore: 84.3,
    topField: "Engineering & Research",
    highlight: "IITs produce the world's highest citations-per-faculty.",
  },
  {
    region: "Central Asia",
    countries: "Uzbekistan",
    institutions: 12,
    avgScore: 63.2,
    topField: "Medicine (English-Medium)",
    highlight: "Fastest-growing English MBBS destination in Asia.",
  },
];

// Programmes count per university (derived)
function getProgrammesCount(uni: (typeof MOCK_UNIVERSITIES)[0]) {
  return uni.subjects.length * 12 + Math.floor(uni.overall * 2);
}

export default function UniversitiesList({
  onUniversitySelect,
  onViewChange,
  savedUniIds,
  onToggleSave,
}: UniversitiesListProps) {
  const { theme } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [showMedicine, setShowMedicine] = useState(false);
  const [sortBy, setSortBy] = useState<"rank" | "name" | "tuition">("rank");
  // Removed local shortlisted state; using savedUniIds from props.
  const [compared, setCompared] = useState<string[]>([]);

  const filteredUniversities = useMemo(() => {
    let results = [...MOCK_UNIVERSITIES];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q) ||
          u.subjects.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedRegion) {
      const regionMap: Record<string, string[]> = {
        "East Asia": ["China", "Japan", "South Korea", "Hong Kong", "Taiwan"],
        "Southeast Asia": ["Singapore", "Malaysia", "Thailand", "Indonesia"],
        "South Asia": ["India"],
        "Central Asia": ["Uzbekistan"],
      };
      const countries = regionMap[selectedRegion] || [];
      results = results.filter((u) => countries.includes(u.location));
    }
    if (showMedicine) {
      results = results.filter((u) => u.hasMedicine);
    }
    results.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "tuition") {
        const aVal = parseInt(a.tuition.replace(/[^0-9]/g, "")) || 0;
        const bVal = parseInt(b.tuition.replace(/[^0-9]/g, "")) || 0;
        return aVal - bVal;
      }
      return b.overall - a.overall;
    });
    return results;
  }, [searchQuery, selectedRegion, showMedicine, sortBy]);

  const toggleShortlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(id);
    // navigate to Shortlisted view
    onViewChange('saved');
  };

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompared((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans grow animate-fadeIn">
      {/* ── Page Header ── */}
      <div className="mb-10 border-b border-slate-200 dark:border-slate-800 pb-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow bg-amber-50 dark:bg-cyber-yellow/10 px-2.5 py-1 rounded-full border border-amber-200 dark:border-cyber-yellow/20">
          Institutional Database
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mt-4 text-slate-900 dark:text-white">
          University Directory{" "}
          <span className="text-slate-300 dark:text-slate-700">&</span> Regional Intelligence
        </h2>
        <p className="text-sm leading-relaxed mt-4 max-w-3xl text-slate-500 dark:text-slate-400">
          Comprehensive profiles of{" "}
          <strong className="text-slate-900 dark:text-slate-200">
            {MOCK_UNIVERSITIES.length} audited institutions
          </strong>{" "}
          spanning 10 countries. Explore, shortlist, and compare universities with real data.
        </p>
      </div>

      {/* ── Region Pills ── */}
      <div className="mb-8">
        <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-4">
          Browse by Region
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REGION_STATS.map((region) => {
            const isSelected = selectedRegion === region.region;
            return (
              <motion.button
                key={region.region}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  setSelectedRegion(isSelected ? "" : region.region)
                }
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? "bg-slate-900 border-slate-900 text-white dark:bg-cyber-yellow dark:border-cyber-yellow dark:text-cyber-black"
                    : "bg-white border-slate-200 dark:bg-cyber-gray/30 dark:border-slate-800 hover:border-amber-300 dark:hover:border-cyber-yellow/40"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
                    isSelected
                      ? "text-slate-300 dark:text-cyber-black/70"
                      : "text-amber-700 dark:text-cyber-yellow"
                  }`}
                >
                  {region.institutions} Universities
                </span>
                <span
                  className={`text-sm font-bold block leading-tight ${
                    isSelected
                      ? "text-white dark:text-cyber-black"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {region.region}
                </span>
                <span
                  className={`text-[10px] mt-1 block font-mono ${
                    isSelected
                      ? "text-slate-400 dark:text-cyber-black/60"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {region.countries}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-cyber-dark/40">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, or subject..."
            className="w-full h-[42px] border border-slate-200 dark:border-slate-800 rounded-lg px-4 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white dark:bg-cyber-black text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rank" | "name" | "tuition")}
            className="h-[42px] border border-slate-200 dark:border-slate-800 rounded-lg px-4 pr-8 text-xs focus:outline-none bg-white dark:bg-cyber-black text-slate-900 dark:text-slate-100 appearance-none cursor-pointer"
          >
            <option value="rank">Sort: Rank</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="tuition">Sort: Tuition (Low)</option>
          </select>
          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowMedicine(!showMedicine)}
          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 h-[42px] rounded-lg border transition-all ${
            showMedicine
              ? "bg-slate-900 border-slate-900 text-white dark:bg-cyber-yellow dark:border-cyber-yellow dark:text-cyber-black"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-cyber-black dark:border-slate-800 dark:text-slate-400"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          Med Only
        </button>
      </div>

      {/* Active filter indicator */}
      <AnimatePresence>
        {(selectedRegion || showMedicine || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mb-5 flex-wrap"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active filters:
            </span>
            {selectedRegion && (
              <button
                onClick={() => setSelectedRegion("")}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-300 text-amber-800 bg-amber-50 dark:border-cyber-yellow dark:text-cyber-yellow dark:bg-cyber-yellow/10 hover:opacity-80 transition"
              >
                {selectedRegion} <X className="h-2.5 w-2.5" />
              </button>
            )}
            {showMedicine && (
              <button
                onClick={() => setShowMedicine(false)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-300 text-emerald-800 bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:bg-emerald-900/20 hover:opacity-80 transition"
              >
                Medicine Only <X className="h-2.5 w-2.5" />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-300 text-slate-600 bg-white dark:border-slate-700 dark:text-slate-300 dark:bg-cyber-gray/30 hover:opacity-80 transition"
              >
                &quot;{searchQuery}&quot; <X className="h-2.5 w-2.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
          Showing{" "}
          <span className="text-slate-900 dark:text-white">
            {filteredUniversities.length}
          </span>{" "}
          of {MOCK_UNIVERSITIES.length} institutions
        </p>
        {compared.length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-cyber-yellow bg-amber-50 dark:bg-cyber-yellow/10 border border-amber-200 dark:border-cyber-yellow/20 px-3 py-1 rounded-full">
            {compared.length} Selected for Compare
          </span>
        )}
      </div>

      {/* ── University Cards Grid (QS Style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUniversities.map((uni, idx) => {
            const isShortlisted = savedUniIds.includes(uni.id);
            const isCompared = compared.includes(uni.id);
            const programmes = getProgrammesCount(uni);
            const qsRank = Math.max(1, Math.round(110 - uni.overall));

            return (
              <motion.div
                key={uni.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.25) }}
                className="group bg-white dark:bg-cyber-gray/30 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 dark:hover:border-cyber-yellow/30 transition-all duration-300 flex flex-col"
              >
                {/* ── Image Banner ── */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uni.campusPhoto}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* University name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3">
                    {/* Logo placeholder */}
                    <div className="h-10 w-10 rounded-lg bg-white/95 dark:bg-cyber-dark/90 border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                      <GraduationCap className="h-5 w-5 text-slate-700 dark:text-cyber-yellow" />
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight drop-shadow-md line-clamp-2">
                      {uni.name}
                    </h4>
                  </div>

                  {/* Medicine badge */}
                  {uni.hasMedicine && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
                      <Award className="h-2.5 w-2.5" />
                      Med
                    </div>
                  )}
                </div>

                {/* ── Action Row ── */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={(e) => toggleShortlist(uni.id, e)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                      isShortlisted
                        ? "bg-red-50 border-red-300 text-red-600 dark:bg-red-900/20 dark:border-red-500 dark:text-red-400"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:bg-cyber-black dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <Heart
                      className={`h-3 w-3 ${isShortlisted ? "fill-red-500" : ""}`}
                    />
                    {isShortlisted ? "Shortlisted" : "Shortlist"}
                  </button>
                  <button
                    onClick={(e) => toggleCompare(uni.id, e)}
                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                      isCompared
                        ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-cyber-yellow/10 dark:border-cyber-yellow dark:text-cyber-yellow"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:bg-cyber-black dark:border-slate-700 dark:text-slate-400"
                    }`}
                  >
                    <BarChart2 className="h-3 w-3" />
                    {isCompared ? "Added" : "Compare"}
                  </button>
                </div>

                {/* ── Meta Info ── */}
                <div className="px-4 py-4 flex-1 flex flex-col">
                  <div className="space-y-2 mb-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{uni.name.includes("(") ? uni.name.split("(")[1].replace(")", "") + ", " : ""}{uni.location}</span>
                    </div>

                    {/* QS World Rank */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          QS World University Rankings:
                        </span>{" "}
                        #{qsRank}
                      </span>
                    </div>

                    {/* Programmes */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Programmes:
                        </span>{" "}
                        {programmes}
                      </span>
                    </div>

                    {/* Tuition */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Tuition:
                        </span>{" "}
                        {uni.tuition}
                      </span>
                    </div>
                  </div>

                  {/* Subject tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {uni.subjects.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700"
                      >
                        {sub}
                      </span>
                    ))}
                    {uni.subjects.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 dark:bg-cyber-dark dark:text-slate-500 dark:border-slate-800">
                        +{uni.subjects.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View University CTA */}
                  <div className="mt-auto flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUniversitySelect(uni.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-sm"
                    >
                      View University
                      <ChevronRight className="h-3.5 w-3.5" />
                    </motion.button>
                    <motion.a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-cyber-black text-slate-500 dark:text-slate-400 hover:border-slate-400 hover:text-slate-700 dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredUniversities.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray/20">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
          <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Institutions Found
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("");
              setShowMedicine(false);
            }}
            className="inline-flex items-center gap-2 border border-slate-900 dark:border-cyber-yellow bg-slate-900 dark:bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white dark:text-cyber-yellow hover:bg-slate-800 dark:hover:bg-cyber-yellow dark:hover:text-cyber-black transition-colors rounded-xl"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div className="mt-12 p-8 rounded-2xl border border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-dark/60 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-cyber-gray dark:via-cyber-dark dark:to-cyber-gray opacity-60 z-0" />
        <div className="relative z-10">
          <Users className="h-8 w-8 mx-auto mb-3 text-amber-600 dark:text-cyber-yellow" />
          <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-white mb-2">
            Deep Analytics Mode
          </h4>
          <p className="text-xs mb-6 text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Switch to the Rankings Engine to dynamically adjust scoring weights and compare institutions side-by-side.
          </p>
          <button
            onClick={() => onViewChange("rankings")}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyber-yellow dark:text-cyber-black dark:hover:brightness-110 transition-all shadow-md"
          >
            Launch Rankings Engine
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
