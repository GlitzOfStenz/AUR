"use client";

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Globe,
  Award,
  X,
  FilterX,
} from "lucide-react";
import { University } from "../data";
import { useUniversityData } from "./data/UniversityDataProvider";
import { useSidebar } from "./navigation/SidebarContext";
import MultiSelectDropdown from "./ui/MultiSelectDropdown";

interface RankingsEngineProps {
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  selectedUniIds: string[];
  onToggleCompare: (id: string) => void;
  onUniversitySelect: (id: string) => void;
}

// Preset weights
const DEFAULT_WEIGHTS = {
  citations: 20,
  research: 20,
  employability: 20,
  intlStudents: 20,
  teaching: 20,
};

export default function RankingsEngine({
  searchQuery,
  onSearchQueryChange,
  selectedUniIds,
  onToggleCompare,
  onUniversitySelect,
}: RankingsEngineProps) {
  const { universities } = useUniversityData();
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aur-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters } = useSidebar();

  // 1. Core State
  const [sorting, setSorting] = useState<SortingState>([{ id: "calculatedRank", desc: false }]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isWeightsDrawerOpen, setIsWeightsDrawerOpen] = useState(false);

  // Custom metric weights state
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  // 2. Deserialize state from URL Search Params on mount
  useEffect(() => {
    const locParam = searchParams.get("locations");
    const subParam = searchParams.get("subjects");
    const langParam = searchParams.get("languages");
    const searchParam = searchParams.get("search");

    const wCit = searchParams.get("w_cit");
    const wRes = searchParams.get("w_res");
    const wEmp = searchParams.get("w_emp");
    const wIntl = searchParams.get("w_intl");
    const wTeach = searchParams.get("w_teach");

    if (locParam) setLocations(locParam.split(","));
    if (subParam) setSelectedSubjects(subParam.split(","));
    if (langParam) setSelectedLanguages(langParam.split(","));
    if (searchParam) onSearchQueryChange(searchParam);

    if (wCit || wRes || wEmp || wIntl || wTeach) {
      setWeights({
        citations: wCit ? parseInt(wCit) : DEFAULT_WEIGHTS.citations,
        research: wRes ? parseInt(wRes) : DEFAULT_WEIGHTS.research,
        employability: wEmp ? parseInt(wEmp) : DEFAULT_WEIGHTS.employability,
        intlStudents: wIntl ? parseInt(wIntl) : DEFAULT_WEIGHTS.intlStudents,
        teaching: wTeach ? parseInt(wTeach) : DEFAULT_WEIGHTS.teaching,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Serialize state back to URL query strings smoothly
  // We use window.history.replaceState to prevent Next.js from triggering heavy  flushes or re-renders
  const serializeStateToUrl = (
    newSearch: string,
    newLocs: string[],
    newSubs: string[],
    newLangs: string[],
    newWeights: typeof weights
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set("search", newSearch);
    if (newLocs.length > 0) params.set("locations", newLocs.join(","));
    if (newSubs.length > 0) params.set("subjects", newSubs.join(","));
    if (newLangs.length > 0) params.set("languages", newLangs.join(","));
    
    // Only serialize  weights if they differ from default
    if (JSON.stringify(newWeights) !== JSON.stringify(DEFAULT_WEIGHTS)) {
      params.set("w_cit", newWeights.citations.toString());
      params.set("w_res", newWeights.research.toString());
      params.set("w_emp", newWeights.employability.toString());
      params.set("w_intl", newWeights.intlStudents.toString());
      params.set("w_teach", newWeights.teaching.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `?view=rankings&${queryString}` : "?view=rankings";
    window.history.replaceState({ ...window.history.state, as: url, url }, "", url);
  };

  const handleSearchChange = (val: string) => {
    onSearchQueryChange(val);
    serializeStateToUrl(val, locations, selectedSubjects, selectedLanguages, weights);
  };

  const handleLocationToggle = (loc: string) => {
    const next = locations.includes(loc)
      ? locations.filter((l) => l !== loc)
      : [...locations, loc];
    setLocations(next);
    serializeStateToUrl(searchQuery, next, selectedSubjects, selectedLanguages, weights);
  };

  const handleSubjectToggle = (sub: string) => {
    const next = selectedSubjects.includes(sub)
      ? selectedSubjects.filter((s) => s !== sub)
      : [...selectedSubjects, sub];
    setSelectedSubjects(next);
    serializeStateToUrl(searchQuery, locations, next, selectedLanguages, weights);
  };

  const handleLanguageToggle = (lang: string) => {
    const next = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(next);
    serializeStateToUrl(searchQuery, locations, selectedSubjects, next, weights);
  };

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    const next = { ...weights, [key]: val };
    setWeights(next);
    serializeStateToUrl(searchQuery, locations, selectedSubjects, selectedLanguages, next);
  };

  const handleResetFilters = () => {
    setLocations([]);
    setSelectedSubjects([]);
    setSelectedLanguages([]);
    onSearchQueryChange("");
    setWeights(DEFAULT_WEIGHTS);
    router.replace("?view=rankings");
  };

  // 4. Data Processing: Client-Side Custom Weights Recalculation Engine
  const processedData = useMemo(() => {
    const totalWeight =
      weights.citations +
      weights.research +
      weights.employability +
      weights.intlStudents +
      weights.teaching;

    // Apply  formula weights to recalculate scores dynamically
    const recalculated = universities.map((uni) => {
      let calculatedScore = uni.overall;
      if (totalWeight > 0) {
        calculatedScore =
          (uni.citations * weights.citations +
            uni.research * weights.research +
            uni.employability * weights.employability +
            uni.intlStudents * weights.intlStudents +
            uni.teaching * weights.teaching) /
          totalWeight;
      }

      return {
        ...uni,
        calculatedScore: Math.round(calculatedScore * 10) / 10,
      };
    });

    // Re-rank based on recalculated scores
    const sorted = [...recalculated].sort((a, b) => b.calculatedScore - a.calculatedScore);
    return sorted.map((uni, index) => ({
      ...uni,
      calculatedRank: index + 1,
    }));
  }, [weights, universities]);

  // 5. Apply filters
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredData = useMemo(() => {
    return processedData.filter((uni) => {
      // 1. Search Query
      const query = (deferredSearchQuery || "").toLowerCase();
      const matchesSearch =
        query === "" ||
        uni.name.toLowerCase().includes(query) ||
        uni.location.toLowerCase().includes(query);

      // 2. Location (combine locations state and filters.country)
      const matchesLoc =
        (locations.length === 0 || locations.includes(uni.location)) &&
        (filters.country === "" || uni.location === filters.country);

      // 3. Subject (combine selectedSubjects state and filters.subjects)
      const matchesSub =
        (selectedSubjects.length === 0 || uni.subjects.some((sub) => selectedSubjects.includes(sub))) &&
        (filters.subjects.length === 0 || uni.subjects.some((sub) => filters.subjects.includes(sub)));

      // 4. Language filter (keep existing local language filter)
      const matchesLang =
        selectedLanguages.length === 0 ||
        uni.languages.some((lang) => selectedLanguages.includes(lang));

      // 5. QS Rank Range (calculatedRank is from processedData)
      const rank = uni.calculatedRank;
      const matchesRank = rank >= filters.qsRange[0] && rank <= filters.qsRange[1];

      // 6. Tuition Range
      const tuitionVal = parseInt(uni.tuition.replace(/[^0-9]/g, "")) || 0;
      const matchesTuition = tuitionVal >= filters.tuitionRange[0] && tuitionVal <= filters.tuitionRange[1];

      // 7. Public / Private
      let matchesType = true;
      if (filters.isPublic !== null) {
        // Prefer data-driven flag if present; fall back to legacy ID-based rule for compatibility.
        const legacyIsPublic = !["akfa-univ", "tashkent-webster", "yonsei", "korea-univ"].includes(uni.id);
        const isPublic = typeof uni.isPublic === "boolean" ? uni.isPublic : legacyIsPublic;
        matchesType = isPublic === filters.isPublic;
      }

      // 8. Scholarship Only
      let matchesScholarship = true;
      if (filters.scholarshipOnly) {
        // Prefer data-driven flag if present; fall back to legacy ID-based rule for compatibility.
        const legacyHasScholarship = ["tsinghua", "nus", "peking", "tokyo", "samarkand-med", "tashkent-med", "akfa-univ", "malaya"].includes(uni.id);
        const hasScholarship =
          typeof uni.hasScholarship === "boolean" ? uni.hasScholarship : legacyHasScholarship;
        matchesScholarship = hasScholarship;
      }

      return (
        matchesSearch &&
        matchesLoc &&
        matchesSub &&
        matchesLang &&
        matchesRank &&
        matchesTuition &&
        matchesType &&
        matchesScholarship
      );
    });
  }, [processedData, deferredSearchQuery, locations, selectedSubjects, selectedLanguages, filters]);

  // 6. Extract unique values for filter dropdown options
  const uniqueLocations = useMemo(() => Array.from(new Set(universities.map((u) => u.location))).sort(), [universities]);
  const uniqueSubjects = useMemo(() => Array.from(new Set(universities.flatMap((u) => u.subjects))).sort(), [universities]);
  const uniqueLanguages = useMemo(() => Array.from(new Set(universities.flatMap((u) => u.languages))).sort(), [universities]);

  const rankingInsights = useMemo(() => {
    const data = filteredData;
    const total = data.length || 1;
    const countryCounts = data.reduce((acc, uni) => {
      acc.set(uni.location, (acc.get(uni.location) ?? 0) + 1);
      return acc;
    }, new Map<string, number>());

    const topCountry =
      Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
    const averageScore =
      data.reduce((sum, uni) => sum + uni.calculatedScore, 0) / total;
    const medicineCount = data.filter((uni) => uni.hasMedicine).length;
    const mostImproved = data
      .map((uni) => ({
        uni,
        improvement:
          uni.history.length > 1 ? uni.history[uni.history.length - 1] - uni.history[0] : 0,
      }))
      .sort((a, b) => b.improvement - a.improvement)[0];

    return [
      {
        label: "Top Country",
        value: topCountry,
        detail: `${countryCounts.get(topCountry) ?? 0} matching institutions`,
        icon: Globe,
      },
      {
        label: "Average Score",
        value: averageScore.toFixed(1),
        detail: "Across visible results",
        icon: Award,
      },
      {
        label: "Medicine Programs",
        value: medicineCount.toString(),
        detail: `${Math.round((medicineCount / total) * 100)}% of current index`,
        icon: Filter,
      },
      {
        label: "Most Improved",
        value: mostImproved?.uni.name.split(" ")[0] ?? "N/A",
        detail:
          mostImproved && mostImproved.improvement > 0
            ? `+${mostImproved.improvement} rank movement`
            : "Stable ranking set",
        icon: TrendingUp,
      },
    ];
  }, [filteredData]);

  // 7. Column Definitions for @tanstack/react-table
  const columns = useMemo<ColumnDef<typeof filteredData[0]>[]>(
    () => [
      {
        id: "calculatedRank",
        header: "Rank",
        accessorKey: "calculatedRank",
        cell: ({ row }) => (
          <span
            className={`aur-rank-badge aur-tabular ${
              row.original.calculatedRank <= 3 ? "aur-rank-badge--elite" : ""
            }`}
          >
            {row.original.calculatedRank}
          </span>
        ),
      },
      {
        id: "name",
        header: "University Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="text-left font-sans font-bold text-[var(--aur-text)] hover:underline transition-all active:scale-95 cursor-pointer inline-block w-full truncate" onClick={() => onUniversitySelect(row.original.id)}>
            <div className="truncate w-full">{row.original.name}</div>
            <div className="flex items-center text-[10px] text-[var(--aur-text-muted)] font-mono font-medium uppercase mt-0.5">
              <Globe className="h-3 w-3 mr-1" />
              {row.original.location}
            </div>
          </div>
        ),
      },
      {
        id: "calculatedScore",
        header: "Score",
        accessorKey: "calculatedScore",
        cell: ({ getValue }) => (
          <span className="aur-score-pill aur-tabular text-[var(--aur-text)]">
            {(getValue() as number).toFixed(1)}
          </span>
        ),
      },
      {
        id: "citations",
        header: "Citations",
        accessorKey: "citations",
        cell: ({ getValue }) => (
          <span className="font-mono text-[var(--aur-text-secondary)] aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "research",
        header: "Research",
        accessorKey: "research",
        cell: ({ getValue }) => (
          <span className="font-mono text-[var(--aur-text-secondary)] aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "employability",
        header: "Employability",
        accessorKey: "employability",
        cell: ({ getValue }) => (
          <span className="font-mono text-[var(--aur-text-secondary)] aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "tuition",
        header: "Tuition / Yr",
        accessorKey: "tuition",
        cell: ({ row }) => (
          <span className="inline-flex min-w-[5.5rem] justify-end font-mono text-xs text-[var(--aur-text-muted)] bg-[var(--aur-surface-2)] border border-[var(--aur-border)] px-1.5 py-0.5">
            {row.original.tuition}
          </span>
        ),
      },
      {
        id: "compare",
        header: "Compare",
        cell: ({ row }) => {
          const isSelected = selectedUniIds.includes(row.original.id);
          return (
            <button
              type="button"
              onClick={() => onToggleCompare(row.original.id)}
              className={`aur-btn-ghost aur-focus-ring ${focusRing} ${
                isSelected ? "aur-btn-ghost--active" : ""
              }`}
            >
              {isSelected ? (
                <>
                  <CheckSquare className="h-3.5 w-3.5 text-[var(--aur-text)]" />
                  <span className="text-[10px]">Added</span>
                </>
              ) : (
                <>
                  <Square className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Compare</span>
                </>
              )}
            </button>
          );
        },
      },
    ],
    [selectedUniIds, onToggleCompare, onUniversitySelect]
  );

  // 8. TanStack Table Instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="relative aur-rankings-shell mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 py-6 sm:py-8 font-sans flex-grow">
      
      {/* Ambient Liquid Glass Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full max-h-[600px] bg-gradient-to-b from-blue-400/10 via-cyan-300/5 to-transparent rounded-[100%] blur-[120px] pointer-events-none -z-10" />

      {/* Editorial Title */}
      <div className="aur-rankings-hero mb-6 sm:mb-8 aur-hero-accent flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        <div className="min-w-0">
          <span className="aur-caption">Engine & Analytics Database</span>
          <h2 className="aur-section-title text-3xl md:text-4xl leading-tight mt-2">
            Asia Institutional Ranking Table
          </h2>
          <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-3 tracking-wide">
            Index refreshed Â· Jun 2026 Â· {filteredData.length} institutions indexed
          </p>
        </div>
        
        {/* Recalculator Drawer Trigger button */}
        <button
          type="button"
          onClick={() => setIsWeightsDrawerOpen(true)}
          className={`aur-rankings-action mt-2 md:mt-0 inline-flex w-full sm:w-auto items-center justify-center px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all aur-focus-ring ${focusRing}`}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Weights Recalculator
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
        {rankingInsights.map((insight, idx) => (
          <motion.div 
            key={insight.label} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            className="group relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-[#1A365D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  {insight.label}
                </span>
                <div className="mt-1 truncate text-2xl font-black text-slate-800">
                  {insight.value}
                </div>
              </div>
              <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/60 border border-white text-[#1A365D] shadow-sm group-hover:scale-110 transition-transform duration-500">
                <insight.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="relative z-10 mt-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              {insight.detail}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 9. Elite Filtering Bar Layout */}
      <div className="aur-filter-deck grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 mb-6 sm:mb-8 items-start relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-2xl shadow-sm">
        <p className="sm:col-span-2 xl:col-span-4 text-[10px] uppercase font-bold tracking-widest text-slate-500 -mb-2">
          Refine index
        </p>
        
        {/* Search Field */}
        <div className="relative flex min-h-[5.75rem] flex-col">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
            Search
          </label>
          <div className="relative">
<Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/60 border border-white/80 px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 transition-all placeholder:text-slate-400"
              style={{ paddingLeft: "2.75rem" }}
            />
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
            Location
          </label>
          <div className="relative z-30">
            <MultiSelectDropdown
              options={uniqueLocations}
              selected={locations}
              onChange={(next) => {
                setLocations(next);
                serializeStateToUrl(searchQuery, next, selectedSubjects, selectedLanguages, weights);
              }}
              placeholder="Filter Location..."
            />
          </div>
          {/* Active Locations tags */}
          {locations.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {locations.map((loc) => (
                <span
                  key={loc}
                  onClick={() => handleLocationToggle(loc)}
                  className="inline-flex max-w-full items-center rounded-full text-[10px] font-mono border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text)] px-2 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  {loc} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Program / Subject Dropdown */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
            Subject Focus
          </label>
          <div className="relative z-20">
            <MultiSelectDropdown
              options={uniqueSubjects}
              selected={selectedSubjects}
              onChange={(next) => {
                setSelectedSubjects(next);
                serializeStateToUrl(searchQuery, locations, next, selectedLanguages, weights);
              }}
              placeholder="Filter Subject..."
            />
          </div>
          {/* Active Subjects tags */}
          {selectedSubjects.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {selectedSubjects.map((sub) => (
                <span
                  key={sub}
                  onClick={() => handleSubjectToggle(sub)}
                  className="inline-flex max-w-full items-center rounded-full text-[10px] font-mono border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text)] px-2 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  {sub} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Medium of Instruction */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
            Language
          </label>
          <div className="relative z-10">
            <MultiSelectDropdown
              options={uniqueLanguages}
              selected={selectedLanguages}
              onChange={(next) => {
                setSelectedLanguages(next);
                serializeStateToUrl(searchQuery, locations, selectedSubjects, next, weights);
              }}
              placeholder="Filter Language..."
            />
          </div>
          {/* Active Language tags */}
          {selectedLanguages.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  onClick={() => handleLanguageToggle(lang)}
                  className="inline-flex max-w-full items-center rounded-full text-[10px] font-mono border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text)] px-2 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  {lang} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <span className="text-[10px] text-[var(--aur-text-muted)] font-bold uppercase tracking-wider">
          Total: <span className="text-[var(--aur-text)] font-mono">{filteredData.length}</span> matching institutions
        </span>
        <button
          onClick={handleResetFilters}
          className="aur-rankings-reset inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset All Filters
        </button>
      </div>

      {/* 10. Advanced Motion Grid List */}
      <div className="relative z-10 w-full mb-4">
        {/* Header Grid */}
        <div className="hidden sm:grid grid-cols-[3rem_minmax(180px,2fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(80px,1fr)_7rem] gap-3 px-6 pb-3 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase items-center">
          {table.getHeaderGroups().map((headerGroup) => 
            headerGroup.headers.map((header, idx) => {
              const columnId = header.column.id;
              const isMobileHiddenCol = ["citations", "research", "employability", "tuition"].includes(columnId);
              const alignRight = ["calculatedScore", "citations", "research", "employability", "tuition"].includes(columnId);
              
              return (
                <div 
                  key={header.id} 
                  className={`${isMobileHiddenCol ? "hidden sm:block" : ""} ${alignRight ? "text-right" : ""} ${header.column.getCanSort() ? "cursor-pointer hover:text-slate-600 transition-colors" : ""}`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className={`flex items-center space-x-1 ${alignRight ? "justify-end" : ""}`}>
                    <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    {header.column.getCanSort() && (
                      <span className="shrink-0 text-slate-300">
                        {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* List Items */}
        <div className="flex flex-col gap-3">
          {table.getRowModel().rows.map((row, rowIdx) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (rowIdx % 10) * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-[#1A365D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 grid grid-cols-[3rem_minmax(140px,1fr)_minmax(60px,1fr)_8rem] sm:grid-cols-[3rem_minmax(180px,2fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(60px,1fr)_minmax(80px,1fr)_7rem] gap-3 items-center px-4 sm:px-6 py-4">
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;
                  const isMobileHiddenCol = ["citations", "research", "employability", "tuition"].includes(columnId);
                  const alignRight = ["calculatedScore", "citations", "research", "employability", "tuition"].includes(columnId);
                  
                  return (
                    <div 
                      key={cell.id} 
                      className={`min-w-0 ${isMobileHiddenCol ? "hidden sm:block" : ""} ${alignRight ? "text-right" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {filteredData.length === 0 && (
            <div className="py-16 px-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center border border-white bg-white/50 rounded-xl mb-4 shadow-sm">
                <FilterX className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800 mb-2">
                No institutions match your filters
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-sm">
                Try widening location, subject, or rank ranges—or reset all filters to browse the full index.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-[#1A365D] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="aur-panel aur-rankings-pagination flex items-center justify-between px-3 sm:px-4 py-3 mt-4 rounded-sm">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`relative inline-flex items-center border border-[var(--aur-border)] bg-[var(--aur-surface-2)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] disabled:opacity-50 rounded-lg ${focusRing}`}
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`relative ml-3 inline-flex items-center border border-[var(--aur-border)] bg-[var(--aur-surface-2)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] disabled:opacity-50 rounded-lg ${focusRing}`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] text-[var(--aur-text-muted)] font-bold uppercase tracking-widest">
              Showing page <span className="font-mono text-[var(--aur-text)]">{table.getState().pagination.pageIndex + 1}</span> of{" "}
              <span className="font-mono text-[var(--aur-text)]">{table.getPageCount()}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`relative inline-flex items-center border border-[var(--aur-border)] bg-[var(--aur-surface)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--aur-text-secondary)] hover:bg-[var(--aur-surface-hover)] disabled:opacity-50 rounded-l-md transition-colors ${focusRing}`}
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={`relative inline-flex items-center border border-l-0 border-[var(--aur-border)] bg-[var(--aur-surface)] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--aur-text-secondary)] hover:bg-[var(--aur-surface-hover)] disabled:opacity-50 rounded-r-md transition-colors ${focusRing}`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 11. Custom Recalculation Weights Slide-Out Drawer */}
      {isWeightsDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 bg-cyber-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsWeightsDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-[var(--aur-surface)] border-l border-[var(--aur-border)] flex flex-col justify-between shadow-2xl">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--aur-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">
                      Calculations Lab
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[var(--aur-text)] mt-0.5">
                      Recalculate Rank Weights
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsWeightsDrawerOpen(false)}
                    className="p-1 hover:bg-[var(--aur-hover)] rounded-lg text-[var(--aur-text-muted)] hover:text-[var(--aur-text)]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-[var(--aur-text-secondary)] text-xs mt-3 leading-relaxed">
                  Modify the relative priority weights below. The system automatically recalculates total scores using instant frontend arithmetic.
                </p>
              </div>

              {/* Drawer Sliders list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {[
                  { key: "citations", label: "Citations Impact", desc: "Scientific citation frequency per paper" },
                  { key: "research", label: "Research Metric", desc: "Academic staff peer assessment" },
                  { key: "employability", label: "Employability Ratio", desc: "Alumni professional career placement" },
                  { key: "intlStudents", label: "International Ratio", desc: "Percentage of international students enrolled" },
                  { key: "teaching", label: "Teaching Staff", desc: "Faculty-to-student metrics ratio" },
                ].map((slider) => {
                  const currentValue = weights[slider.key as keyof typeof weights];
                  return (
                    <div key={slider.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-[var(--aur-text)] block">{slider.label}</label>
                          <span className="text-[10px] text-[var(--aur-text-muted)] block">{slider.desc}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-[var(--aur-text)] bg-[var(--aur-surface-2)] px-2 py-0.5 border border-[var(--aur-border-strong)] rounded-md">
                          {currentValue}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={currentValue}
                        onChange={(e) => handleWeightChange(slider.key as any, parseInt(e.target.value))}
                        className="w-full cursor-pointer"
                        style={{ accentColor: "var(--aur-text)" }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer controls */}
              <div className="p-6 border-t border-[var(--aur-border)] bg-[var(--aur-surface-2)] flex items-center justify-between">
                <button
                  onClick={() => {
                    setWeights(DEFAULT_WEIGHTS);
                    serializeStateToUrl(searchQuery, locations, selectedSubjects, selectedLanguages, DEFAULT_WEIGHTS);
                  }}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Default Weights
                </button>
                <button
                  onClick={() => setIsWeightsDrawerOpen(false)}
                  className="aur-btn-primary px-6 py-2.5"
                >
                  Apply Recalculation
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

