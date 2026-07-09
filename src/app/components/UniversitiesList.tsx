"use client";

import React, { useState, useMemo } from "react";

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
import type { University } from "../data";
import { useUniversityData } from "./data/UniversityDataProvider";
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

function getProgrammesCount(uni: University) {
  return uni.subjects.length * 12 + Math.floor(uni.overall * 2);
}

export default function UniversitiesList({
  onUniversitySelect,
  onViewChange,
  savedUniIds,
  onToggleSave,
}: UniversitiesListProps) {
  const { universities } = useUniversityData();
  const { theme, searchQuery, setSearchQuery } = useSidebar();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  // Eligibility check state
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<null | { status: string, message: string }>(null);
  const [showMedicine, setShowMedicine] = useState(false);
  const [sortBy, setSortBy] = useState<"rank" | "name" | "tuition">("rank");
  const [compared, setCompared] = useState<string[]>([]);

  const filteredUniversities = useMemo(() => {
    let results = [...universities];
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
  }, [searchQuery, selectedRegion, showMedicine, sortBy, universities]);

  const toggleShortlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(id);
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
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans grow animate-fadeIn bg-[var(--background)]">
      {/* ── Page Header ── */}
      <div className="mb-10 aur-hero-accent">
        <span className="aur-caption">Institutional Database</span>
        <h2 className="aur-section-title text-3xl md:text-4xl leading-tight mt-2">
          University Directory &amp; Regional Intelligence
        </h2>
        <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-3 tracking-wide">
          Index refreshed · Jun 2026 · {universities.length} institutions indexed
        </p>
      </div>

      {/* ── Region Pills ── */}
      <div className="mb-8">
        <h3 className="font-serif text-xl font-bold text-[var(--aur-text)] mb-4">
          Browse by Region
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REGION_STATS.map((region) => {
            const isSelected = selectedRegion === region.region;
            return (
              <button
                key={region.region}
                
                
                onClick={() =>
                  setSelectedRegion(isSelected ? "" : region.region)
                }
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? "bg-[var(--aur-text)] border-[var(--aur-text)] text-[var(--background)] shadow-md"
                    : "bg-[var(--aur-surface)] border-[var(--aur-border)] text-[var(--aur-text)] hover:border-[var(--aur-border-strong)] hover:shadow-sm"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
                    isSelected
                      ? "text-[var(--background)] opacity-80"
                      : "text-[var(--aur-text-secondary)]"
                  }`}
                >
                  {region.institutions} Universities
                </span>
                <span
                  className={`text-sm font-bold block leading-tight ${
                    isSelected
                      ? "text-[var(--background)]"
                      : "text-[var(--aur-text)]"
                  }`}
                >
                  {region.region}
                </span>
                <span
                  className={`text-[10px] mt-1 block font-mono ${
                    isSelected
                      ? "text-[var(--background)] opacity-60"
                      : "text-[var(--aur-text-muted)]"
                  }`}
                >
                  {region.countries}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-3 rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)]">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--aur-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, country, or subject..."
            className="w-full h-[42px] border border-[var(--aur-border)] rounded-lg px-4 pl-10 text-xs focus:outline-none focus:border-[var(--aur-border-strong)] bg-[var(--aur-surface)] text-[var(--aur-text)] placeholder-[var(--aur-text-muted)] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "rank" | "name" | "tuition")}
            className="h-[42px] border border-[var(--aur-border)] rounded-lg px-4 pr-8 text-xs focus:outline-none focus:border-[var(--aur-border-strong)] bg-[var(--aur-surface)] text-[var(--aur-text)] appearance-none cursor-pointer transition-colors"
          >
            <option value="rank">Sort: Rank</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="tuition">Sort: Tuition (Low)</option>
          </select>
          <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[var(--aur-text-muted)] pointer-events-none" />
        </div>
        <button
          onClick={() => setShowMedicine(!showMedicine)}
          className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-5 h-[42px] rounded-lg border transition-all ${
            showMedicine
              ? "bg-[var(--aur-text)] border-[var(--aur-text)] text-[var(--background)]"
              : "bg-[var(--aur-surface)] border-[var(--aur-border)] text-[var(--aur-text-secondary)] hover:bg-[var(--aur-surface-hover)] hover:text-[var(--aur-text)]"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          Med Only
        </button>
        <button
          onClick={() => {
            setShowEligibility(!showEligibility);
            setEligibilityResult(null);
          }}
          className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-5 h-[42px] rounded-lg border transition-all ${
            showEligibility
              ? "bg-[var(--aur-text)] border-[var(--aur-text)] text-[var(--background)] shadow-sm"
              : "bg-[var(--aur-surface)] border-[var(--aur-border)] text-[var(--aur-text-secondary)] hover:bg-[var(--aur-surface-hover)] hover:text-[var(--aur-text)]"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Eligibility Check
        </button>
      </div>

      {/* ── ELIGIBILITY CHECK SECTION ── */}
      {showEligibility && (
        <div className="mb-8">
          <div className="bg-[var(--aur-surface)] border border-[#ff4433]/30 shadow-[0_8px_30px_rgba(255,68,51,0.1)] rounded-2xl p-6 relative overflow-hidden">
            {/* Decorative background blur */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff4433]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <button 
              onClick={() => setShowEligibility(false)}
              className="absolute top-4 right-4 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] bg-[var(--aur-surface-2)] hover:bg-[var(--aur-surface-hover)] rounded-full p-1.5 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="bg-[#ff4433]/10 p-2.5 rounded-lg text-[#ff4433]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--aur-text)] leading-tight">Check Your Eligibility</h2>
                <p className="text-[11px] text-[var(--aur-text-muted)] mt-0.5">Find out if you meet the baseline requirements for our top-tier programs.</p>
              </div>
            </div>
            
            {eligibilityResult ? (
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-5 flex items-start gap-4 relative z-10">
                <div className="bg-[#10b981] p-1.5 rounded-full shrink-0 mt-0.5">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--aur-text)] text-sm mb-1">{eligibilityResult.status}</h3>
                  <p className="text-[var(--aur-text-secondary)] text-[13px] leading-relaxed mb-3">{eligibilityResult.message}</p>
                  <button 
                    onClick={() => setEligibilityResult(null)}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#10b981] hover:text-white bg-[#10b981]/10 hover:bg-[#10b981] px-4 py-2 rounded-md transition-all border border-[#10b981]/20"
                  >
                    Check another profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">Current Degree</label>
                  <select className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-lg px-4 py-3 text-xs text-[var(--aur-text)] focus:outline-none focus:border-[#ff4433] transition-colors cursor-pointer appearance-none">
                    <option>High School</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">GPA / Score</label>
                  <input type="text" placeholder="e.g. 85% or 3.5" className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-lg px-4 py-3 text-xs text-[var(--aur-text)] placeholder-[var(--aur-text-muted)] focus:outline-none focus:border-[#ff4433] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">English Proficiency</label>
                  <select className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-lg px-4 py-3 text-xs text-[var(--aur-text)] focus:outline-none focus:border-[#ff4433] transition-colors cursor-pointer appearance-none">
                    <option>IELTS (6.5+)</option>
                    <option>TOEFL (90+)</option>
                    <option>None / Pending</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => setEligibilityResult({
                      status: "Highly Eligible!",
                      message: "Based on your profile, you meet the initial criteria for over 60% of our top-tier institutions, including several prestigious medical programs. We recommend filtering by 'Medicine Only' to explore specific options."
                    })}
                    className="w-full bg-[var(--aur-text)] text-[var(--background)] hover:opacity-80 font-bold text-[11px] uppercase tracking-wider py-3.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm group"
                  >
                    Assess Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active filter indicator */}
      <>
        {(selectedRegion || showMedicine || searchQuery) && (
          <div
            
            
            
            className="flex items-center gap-2 mb-5 flex-wrap overflow-hidden"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
              Active filters:
            </span>
            {selectedRegion && (
              <button
                onClick={() => setSelectedRegion("")}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--aur-border)] text-[var(--aur-text)] bg-[var(--aur-surface)] hover:bg-[var(--aur-surface-hover)] transition"
              >
                {selectedRegion} <X className="h-2.5 w-2.5" />
              </button>
            )}
            {showMedicine && (
              <button
                onClick={() => setShowMedicine(false)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--aur-border)] text-[var(--aur-text)] bg-[var(--aur-surface)] hover:bg-[var(--aur-surface-hover)] transition"
              >
                Medicine Only <X className="h-2.5 w-2.5" />
              </button>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[var(--aur-border)] text-[var(--aur-text)] bg-[var(--aur-surface)] hover:bg-[var(--aur-surface-hover)] transition"
              >
                &quot;{searchQuery}&quot; <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        )}
      </>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] font-mono">
          Showing{" "}
          <span className="text-[var(--aur-text)]">
            {filteredUniversities.length}
          </span>{" "}
          of {universities.length} institutions
        </p>
        {compared.length > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--aur-text)] bg-[var(--aur-surface-hover)] border border-[var(--aur-border)] px-3 py-1 rounded-full">
            {compared.length} Selected for Compare
          </span>
        )}
      </div>

      {/* ── University Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <>
          {filteredUniversities.map((uni, idx) => {
            const isShortlisted = savedUniIds.includes(uni.id);
            const isCompared = compared.includes(uni.id);
            const programmes = getProgrammesCount(uni);
            const qsRank = Math.max(1, Math.round(110 - uni.overall));

            return (
              <div
                key={uni.id}
                
                
                
                
                
                className="group bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-[var(--aur-shadow-sm)] transition-all duration-300 flex flex-col"
              >
                {/* ── Image Banner ── */}
                <div className="relative h-44 overflow-hidden bg-[var(--aur-surface-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uni.campusPhoto}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* University name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-3 pointer-events-none">
                    <div className="h-10 w-10 rounded-lg bg-[var(--aur-surface)] border border-[var(--aur-border)] flex items-center justify-center shrink-0 shadow-lg">
                      <GraduationCap className="h-5 w-5 text-[var(--aur-text)]" />
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight drop-shadow-md line-clamp-2">
                      {uni.name}
                    </h4>
                  </div>

                  {/* Medicine badge */}
                  {uni.hasMedicine && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[var(--aur-text)] text-[var(--background)] text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
                      <Award className="h-2.5 w-2.5" />
                      Med
                    </div>
                  )}
                </div>

                {/* ── Action Row ── */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--aur-border)] bg-[var(--aur-surface)]">
                  <button
                    onClick={(e) => toggleShortlist(uni.id, e)}
                    className={`flex flex-1 justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                      isShortlisted
                        ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                        : "bg-[var(--aur-surface)] text-[var(--aur-text-secondary)] border-[var(--aur-border)] hover:bg-[var(--aur-surface-hover)]"
                    }`}
                  >
                    <Heart
                      className={`h-3 w-3 ${isShortlisted ? "fill-current" : ""}`}
                    />
                    {isShortlisted ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={(e) => toggleCompare(uni.id, e)}
                    className={`flex flex-1 justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border transition-all ${
                      isCompared
                        ? "bg-[var(--aur-text)] text-[var(--background)] border-[var(--aur-text)]"
                        : "bg-[var(--aur-surface)] text-[var(--aur-text-secondary)] border-[var(--aur-border)] hover:bg-[var(--aur-surface-hover)]"
                    }`}
                  >
                    <BarChart2 className="h-3 w-3" />
                    {isCompared ? "Added" : "Compare"}
                  </button>
                </div>

                {/* ── Meta Info ── */}
                <div className="px-4 py-4 flex-1 flex flex-col bg-[var(--aur-surface)]">
                  <div className="space-y-2 mb-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-xs text-[var(--aur-text-secondary)]">
                      <MapPin className="h-3.5 w-3.5 text-[var(--aur-text-muted)] shrink-0" />
                      <span>{uni.name.includes("(") ? uni.name.split("(")[1].replace(")", "") + ", " : ""}{uni.location}</span>
                    </div>

                    {/* QS World Rank */}
                    <div className="flex items-center gap-2 text-xs text-[var(--aur-text-secondary)]">
                      <TrendingUp className="h-3.5 w-3.5 text-[var(--aur-text-muted)] shrink-0" />
                      <span>
                        <span className="font-bold text-[var(--aur-text)]">
                          QS Ranking:
                        </span>{" "}
                        #{qsRank}
                      </span>
                    </div>

                    {/* Programmes */}
                    <div className="flex items-center gap-2 text-xs text-[var(--aur-text-secondary)]">
                      <BookOpen className="h-3.5 w-3.5 text-[var(--aur-text-muted)] shrink-0" />
                      <span>
                        <span className="font-bold text-[var(--aur-text)]">
                          Programmes:
                        </span>{" "}
                        {programmes}
                      </span>
                    </div>

                    {/* Tuition */}
                    <div className="flex items-center gap-2 text-xs text-[var(--aur-text-secondary)]">
                      <Globe className="h-3.5 w-3.5 text-[var(--aur-text-muted)] shrink-0" />
                      <span>
                        <span className="font-bold text-[var(--aur-text)]">
                          Tuition:
                        </span>{" "}
                        {uni.tuition}
                      </span>
                    </div>
                  </div>

                  {/* Subject tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4 mt-auto pt-2">
                    {uni.subjects.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--aur-border)] bg-[var(--aur-surface-hover)] text-[var(--aur-text-secondary)]"
                      >
                        {sub}
                      </span>
                    ))}
                    {uni.subjects.length > 3 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text-muted)]">
                        +{uni.subjects.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View University CTA */}
                  <div className="mt-2 flex gap-2 border-t border-[var(--aur-border)] pt-4">
                    <button
                      
                      
                      onClick={() => onUniversitySelect(uni.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg bg-[var(--aur-text)] text-[var(--background)] hover:opacity-90 transition-opacity"
                    >
                      View Profile
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      
                      
                      className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--aur-border)] bg-[var(--aur-surface)] text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      </div>

      {/* Empty state */}
      {filteredUniversities.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)] mt-6">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-[var(--aur-text-muted)]" />
          <h4 className="font-serif text-xl font-bold text-[var(--aur-text)] mb-2">
            No Institutions Found
          </h4>
          <p className="text-sm text-[var(--aur-text-secondary)] mb-6 max-w-md mx-auto">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("");
              setShowMedicine(false);
            }}
            className="inline-flex items-center justify-center gap-2 border border-[var(--aur-text)] bg-[var(--aur-text)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--background)] hover:opacity-80 transition-opacity rounded-xl"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div className="mt-12 p-8 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-center relative overflow-hidden">
        <div className="relative z-10">
          <Users className="h-8 w-8 mx-auto mb-3 text-[var(--aur-text)]" />
          <h4 className="font-serif text-xl font-bold text-[var(--aur-text)] mb-2">
            Deep Analytics Mode
          </h4>
          <p className="text-xs mb-6 text-[var(--aur-text-secondary)] max-w-xl mx-auto leading-relaxed">
            Switch to the Rankings Engine to dynamically adjust scoring weights and compare institutions side-by-side.
          </p>
          <button
            onClick={() => onViewChange("rankings")}
            className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-xl bg-[var(--aur-text)] text-[var(--background)] hover:opacity-90 transition-opacity"
          >
            Launch Rankings Engine
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
