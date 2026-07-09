"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, GraduationCap, CheckCircle2, ChevronRight, X } from "lucide-react";
import { MOCK_UNIVERSITIES, University } from "../data";
import { useSidebar } from "./navigation/SidebarContext";

const COUNTRY_FLAGS: Record<string, string> = {
  China: "🇨🇳", Japan: "🇯🇵", "South Korea": "🇰🇷", Singapore: "🇸🇬",
  "Hong Kong": "🇭🇰", India: "🇮🇳", Taiwan: "🇹🇼", Malaysia: "🇲🇾",
  Thailand: "🇹🇭", Indonesia: "🇮🇩", Uzbekistan: "🇺🇿",
};

const ALL_COUNTRIES = ["All", ...Array.from(new Set(MOCK_UNIVERSITIES.map((u) => u.location))).sort()];

interface Props { onUniversitySelect: (id: string) => void; }

function UniversityCard({ uni, rank, onClick }: { uni: University; rank: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white border border-slate-100 hover:border-amber-300 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_8px_30px_rgba(251,191,36,0.12)] hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Top Image Section */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={uni.campusPhoto}
          alt={`${uni.name} Campus`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent" />
        
        {/* Rank Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500 text-white font-mono text-[11px] font-bold shadow-sm">
          #{rank}
        </div>

        {/* Med Badge */}
        {uni.hasMedicine && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider shadow-sm">
            Med
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-[16px] font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug line-clamp-2">
            {uni.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-[13px] text-slate-500">
            <span>{COUNTRY_FLAGS[uni.location] ?? "🌏"}</span>
            <span className="font-medium">{uni.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tuition</div>
            <div className="text-[12px] font-bold text-slate-700 font-mono mt-0.5">{uni.tuition}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</div>
            <div className="text-[16px] font-extrabold text-amber-500 font-mono mt-0.5">{uni.overall.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InstitutionDirectory({ onUniversitySelect }: Props) {
  const { searchQuery: search, setSearchQuery: setSearch } = useSidebar();
  const [country, setCountry] = useState("All");
  const [medOnly, setMedOnly] = useState(false);
  
  // Eligibility check state
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<null | { status: string, message: string }>(null);

  const filtered = useMemo(() =>
    MOCK_UNIVERSITIES.filter((u) => {
      const q = search.toLowerCase();
      return (
        (!search || u.name.toLowerCase().includes(q) || u.location.toLowerCase().includes(q)) &&
        (country === "All" || u.location === country) &&
        (!medOnly || u.hasMedicine)
      );
    }),
    [search, country, medOnly]
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/60 pb-12">
      {/* ── TOP BAR ── */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="font-serif text-2xl font-bold text-slate-900">Institution Directory</h1>
              <p className="text-[12px] text-slate-400 mt-0.5">{MOCK_UNIVERSITIES.length} universities across Asia</p>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg self-start md:self-auto">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-2.5 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or country…"
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* Country */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="text-[12px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {ALL_COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Countries" : `${COUNTRY_FLAGS[c] ?? "🌏"} ${c}`}
                </option>
              ))}
            </select>

            {/* Med toggle */}
            <button
              onClick={() => setMedOnly((v) => !v)}
              className={`text-[11px] font-bold px-3.5 py-2 rounded-lg border transition-all ${
                medOnly
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-rose-300 hover:text-rose-500"
              }`}
            >
              🏥 Medicine Only
            </button>

            {/* Eligibility toggle */}
            <button
              onClick={() => {
                setShowEligibility(!showEligibility);
                setEligibilityResult(null);
              }}
              className={`text-[11px] font-bold px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                showEligibility
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-400 hover:text-amber-600"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Eligibility Check
            </button>
          </div>
        </div>
      </div>

      {/* ── ELIGIBILITY CHECK SECTION ── */}
      {showEligibility && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6">
          <div className="bg-white border border-amber-200 shadow-[0_8px_30px_rgba(251,191,36,0.12)] rounded-2xl p-6 relative">
            <button 
              onClick={() => setShowEligibility(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Check Your Eligibility</h2>
            </div>
            
            {eligibilityResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-emerald-800 text-sm mb-1">{eligibilityResult.status}</h3>
                  <p className="text-emerald-700 text-xs leading-relaxed">{eligibilityResult.message}</p>
                  <button 
                    onClick={() => setEligibilityResult(null)}
                    className="mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-100/50 hover:bg-emerald-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Check another profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">Current Degree</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:border-amber-400">
                    <option>High School</option>
                    <option>Bachelor's</option>
                    <option>Master's</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">GPA / Score</label>
                  <input type="text" placeholder="e.g. 85% or 3.5" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">English Proficiency</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] text-slate-700 focus:outline-none focus:border-amber-400">
                    <option>IELTS (6.5+)</option>
                    <option>TOEFL (90+)</option>
                    <option>None / Pending</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => setEligibilityResult({
                      status: "Highly Eligible!",
                      message: "Based on your profile, you meet the initial criteria for over 60% of our top-tier institutions, including several medical programs. We recommend filtering by 'Medicine Only' to explore specific options."
                    })}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[12px] uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Assess Now <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CARD GRID ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-100 max-w-lg mx-auto mt-6">
            <MapPin className="h-8 w-8 text-amber-250 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No universities found matching your filters.</p>
            <button
              onClick={() => { setSearch(""); setCountry("All"); setMedOnly(false); }}
              className="mt-3 text-amber-500 text-[12px] font-bold hover:text-amber-600 underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((uni, i) => (
              <UniversityCard
                key={uni.id}
                uni={uni}
                rank={i + 1}
                onClick={() => onUniversitySelect(uni.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
