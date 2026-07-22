"use client";

import React from "react";

import { Search, Globe, Award, DollarSign, BookOpen, Trophy, RotateCcw, ShieldCheck, Check, ChevronDown } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import { useUniversityData } from "../data/UniversityDataProvider";

// List of all unique subjects in the mock data
const ALL_SUBJECTS = ["Medicine", "Engineering", "Sciences", "Business", "Humanities", "Law", "Social Sciences"];

export default function FilterPanel() {
  const { filters, setFilters, clearFilters } = useSidebar();
  const { universities } = useUniversityData();

  const [openSections, setOpenSections] = React.useState({
    search: true,
    country: true,
    rank: true,
    tuition: true,
    type: true,
    subjects: true,
    scholarship: true,
  });

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count += 1;
    if (filters.country) count += 1;
    if (filters.subjects.length > 0) count += filters.subjects.length;
    if (filters.qsRange[0] !== 1 || filters.qsRange[1] !== 50) count += 1;
    if (filters.tuitionRange[0] !== 0 || filters.tuitionRange[1] !== 25000) count += 1;
    if (filters.isPublic !== null) count += 1;
    if (filters.scholarshipOnly) count += 1;
    return count;
  }, [filters]);

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Extract unique locations dynamically
  const countries = React.useMemo(() => {
    return Array.from(new Set(universities.map((u) => u.location))).sort();
  }, [universities]);

  // Update query field
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  // Toggle subject filter
  const toggleSubject = (sub: string) => {
    setFilters((prev) => {
      const active = prev.subjects.includes(sub)
        ? prev.subjects.filter((s) => s !== sub)
        : [...prev.subjects, sub];
      return { ...prev, subjects: active };
    });
  };

  // Dual Range change handler for QS Rank
  const handleRankMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minVal = Math.min(Number(e.target.value), filters.qsRange[1] - 1);
    setFilters((prev) => ({ ...prev, qsRange: [minVal, prev.qsRange[1]] }));
  };

  const handleRankMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Math.max(Number(e.target.value), filters.qsRange[0] + 1);
    setFilters((prev) => ({ ...prev, qsRange: [prev.qsRange[0], maxVal] }));
  };

  // Dual Range change handler for Tuition
  const handleTuitionMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minVal = Math.min(Number(e.target.value), filters.tuitionRange[1] - 500);
    setFilters((prev) => ({ ...prev, tuitionRange: [minVal, prev.tuitionRange[1]] }));
  };

  const handleTuitionMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Math.max(Number(e.target.value), filters.tuitionRange[0] + 500);
    setFilters((prev) => ({ ...prev, tuitionRange: [prev.tuitionRange[0], maxVal] }));
  };

  return (
    <div className="w-full flex flex-col space-y-6 font-sans text-xs">
      
      {/* Sticky Header inside Panel */}
      <div className="sticky top-0 z-10 flex items-center justify-between pb-3 border-b border-slate-200 dark:border-cyber-border bg-white/95 dark:bg-cyber-dark/95 backdrop-blur-md transition-colors duration-200">
        <div className="flex items-center space-x-2">
          <Trophy className="h-4 w-4 text-slate-700 dark:text-cyber-yellow" />
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Target Filters
            </span>
            <span
              key={activeFilterCount}
              
              
              
              className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-cyber-yellow/15 dark:text-cyber-yellow text-[10px] font-semibold uppercase px-2 py-0.5"
            >
              {activeFilterCount}
            </span>
          </div>
        </div>
        <button
          
          
          onClick={clearFilters}
          className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Clear
        </button>
      </div>

      {/* 1. Search Bar */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("search")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          Institution Search
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.search ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.search && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="relative">
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search name or location..."
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray px-3 py-2 pl-9 rounded text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-800 dark:focus:border-cyber-yellow transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          )}
        </>
      </div>

      {/* 2. Country Select Dropdown */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("country")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          Country / Territory
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.country ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.country && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="relative">
                <select
                  value={filters.country}
                  onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray px-3 py-2 pl-9 rounded text-slate-800 dark:text-slate-100 focus:outline-none focus:border-slate-800 dark:focus:border-cyber-yellow transition-all duration-200 appearance-none"
                >
                  <option value="">All Locations</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Globe className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 dark:border-t-slate-500 w-0 h-0" />
              </div>
            </div>
          )}
        </>
      </div>

      {/* 3. QS Ranking range slider (Dual Range) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("rank")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          Calculated Rank
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.rank ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.rank && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="flex justify-between items-baseline">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  Calculated Rank
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-cyber-yellow-bright">
                  #{filters.qsRange[0]} - #{filters.qsRange[1]}
                </span>
              </div>
              <div className="relative h-6 mt-1 flex items-center">
                <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-800 rounded">
                  {/* Active Highlighted Track */}
                  <div
                    className="absolute h-full bg-slate-800 dark:bg-cyber-yellow rounded"
                    style={{
                      left: `${((filters.qsRange[0] - 1) / 49) * 100}%`,
                      right: `${100 - ((filters.qsRange[1] - 1) / 49) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.qsRange[0]}
                    onChange={handleRankMinChange}
                    className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent top-0 left-0 accent-slate-900 dark:accent-cyber-yellow"
                    style={{
                      zIndex: filters.qsRange[0] > 40 ? 5 : 3,
                    }}
                  />
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.qsRange[1]}
                    onChange={handleRankMaxChange}
                    className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent top-0 left-0 accent-slate-900 dark:accent-cyber-yellow"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      </div>

      {/* 4. Tuition fee range slider */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("tuition")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          Tuition / Year (USD)
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.tuition ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.tuition && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="flex justify-between items-baseline">
                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  Tuition / Year (USD)
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-cyber-yellow-bright">
                  ${filters.tuitionRange[0].toLocaleString()} - ${filters.tuitionRange[1].toLocaleString()}
                </span>
              </div>
              <div className="relative h-6 mt-1 flex items-center">
                <div className="relative w-full h-1 bg-slate-200 dark:bg-slate-800 rounded">
                  {/* Active track */}
                  <div
                    className="absolute h-full bg-slate-800 dark:bg-cyber-yellow rounded"
                    style={{
                      left: `${(filters.tuitionRange[0] / 25000) * 100}%`,
                      right: `${100 - (filters.tuitionRange[1] / 25000) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={filters.tuitionRange[0]}
                    onChange={handleTuitionMinChange}
                    className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent top-0 left-0 accent-slate-900 dark:accent-cyber-yellow"
                    style={{
                      zIndex: filters.tuitionRange[0] > 20000 ? 5 : 3,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={filters.tuitionRange[1]}
                    onChange={handleTuitionMaxChange}
                    className="absolute pointer-events-none appearance-none w-full h-1 bg-transparent top-0 left-0 accent-slate-900 dark:accent-cyber-yellow"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      </div>

      {/* 5. Public / Private Toggle */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("type")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
        >
          Institution Type
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.type ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.type && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-cyber-gray p-0.5 rounded border border-slate-200 dark:border-slate-800">
                {[
                  { label: "All", value: null },
                  { label: "Public", value: true },
                  { label: "Private", value: false },
                ].map((typeItem) => {
                  const isSelected = filters.isPublic === typeItem.value;
                  return (
                    <button
                      key={typeItem.label}
                      type="button"
                      
                      
                      
                      onClick={() => setFilters((prev) => ({ ...prev, isPublic: typeItem.value }))}
                      className={`py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all duration-150 ${
                        isSelected
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200 dark:border-transparent dark:bg-cyber-yellow dark:text-cyber-black"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      {typeItem.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      </div>

      {/* 6. Course Category Multi-select (chips) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => toggleSection("subjects")}
          className="flex w-full items-center justify-between text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans"
        >
          Course Subjects
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${openSections.subjects ? "rotate-180" : ""}`} />
        </button>
        <>
          {openSections.subjects && (
            <div
              
              
              
              
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-1 pt-1">
                {ALL_SUBJECTS.map((subject) => {
                  const isSelected = filters.subjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      
                      
                      
                      onClick={() => toggleSubject(subject)}
                      className={`px-2 py-1 border rounded-full text-[10px] font-medium transition-all duration-150 ${
                        isSelected
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-cyber-yellow dark:border-cyber-yellow dark:text-cyber-black font-bold"
                          : "bg-transparent border-slate-200 text-slate-600 hover:border-slate-400 dark:border-slate-800 dark:text-slate-400 dark:hover:border-cyber-yellow"
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      </div>

      {/* 7. Scholarship Availability */}
      <div className="pt-2">
        <label
          onClick={() =>
            setFilters((prev) => ({ ...prev, scholarshipOnly: !prev.scholarshipOnly }))
          }
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-150 rounded ${
              filters.scholarshipOnly
                ? "bg-slate-900 border-slate-900 dark:bg-cyber-yellow dark:border-cyber-yellow text-white dark:text-cyber-black"
                : "border-slate-300 group-hover:border-slate-400 dark:border-slate-800 dark:group-hover:border-cyber-yellow"
            }`}
          >
            {filters.scholarshipOnly && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </div>
          <div>
            <span className="block font-bold text-slate-800 dark:text-slate-200">
              Scholarship Programs
            </span>
            <span className="block text-[10px] text-slate-400 dark:text-slate-500">
              Show institutions offering grants/waivers
            </span>
          </div>
        </label>
      </div>

      {/* Custom range slider thumb styling hacks in React */}
      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          pointer-events: auto;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          background: #0f172a;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -5px;
          box-shadow: 0 1px 3px rgba(127, 86, 217, 0.3);
          transition: transform 0.1s ease;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        input[type="range"] {
          height: 4px;
        }
      `}</style>
    </div>
  );
}


