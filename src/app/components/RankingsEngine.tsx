"use client";

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { MOCK_UNIVERSITIES, University } from "../data";
import { useSidebar } from "./navigation/SidebarContext";

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
    const recalculated = MOCK_UNIVERSITIES.map((uni) => {
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
  }, [weights]);

  // 5. Apply filters
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const filteredData = useMemo(() => {
    return processedData.filter((uni) => {
      // 1. Search Query (combine props.searchQuery and filters.searchQuery)
      const query = (filters.searchQuery || deferredSearchQuery || "").toLowerCase();
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
  const uniqueLocations = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.map((u) => u.location))).sort(), []);
  const uniqueSubjects = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.flatMap((u) => u.subjects))).sort(), []);
  const uniqueLanguages = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.flatMap((u) => u.languages))).sort(), []);

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
          <div className="text-left font-sans font-bold text-slate-900 hover:text-amber-700 dark:text-slate-100 dark:hover:text-cyber-yellow transition-colors cursor-pointer" onClick={() => onUniversitySelect(row.original.id)}>
            <div className="truncate max-w-[11rem] sm:max-w-[17rem] lg:max-w-[21rem]">{row.original.name}</div>
            <div className="flex items-center text-[10px] text-slate-400 font-mono font-medium uppercase mt-0.5">
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
          <span className="font-mono text-slate-600 dark:text-slate-300 aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "research",
        header: "Research",
        accessorKey: "research",
        cell: ({ getValue }) => (
          <span className="font-mono text-slate-600 dark:text-slate-300 aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "employability",
        header: "Employability",
        accessorKey: "employability",
        cell: ({ getValue }) => (
          <span className="font-mono text-slate-600 dark:text-slate-300 aur-tabular">{(getValue() as number).toFixed(0)}</span>
        ),
      },
      {
        id: "tuition",
        header: "Tuition / Yr",
        accessorKey: "tuition",
        cell: ({ row }) => (
          <span className="inline-flex min-w-[5.5rem] justify-end font-mono text-xs text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-cyber-gray border border-slate-200 dark:border-cyber-border px-1.5 py-0.5">
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
  });

  return (
    <div className="aur-rankings-shell mx-auto w-full max-w-[1600px] px-3 sm:px-5 lg:px-8 py-6 sm:py-8 font-sans flex-grow">
      
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

      <div className="aur-rankings-insights grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {rankingInsights.map((insight) => (
          <div key={insight.label} className="aur-rankings-insight-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="aur-caption block text-slate-400 dark:text-slate-500">
                  {insight.label}
                </span>
                <div className="mt-1 truncate text-xl font-bold text-slate-900 dark:text-white">
                  {insight.value}
                </div>
              </div>
              <div className="aur-rankings-insight-icon">
                <insight.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {insight.detail}
            </p>
          </div>
        ))}
      </div>

      {/* 9. Elite Filtering Bar Layout */}
      <div className="aur-filter-deck aur-rankings-filter grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 mb-6 sm:mb-8 items-start">
        <p className="sm:col-span-2 xl:col-span-4 aur-caption text-slate-400 dark:text-slate-500 -mb-1">
          Refine index
        </p>
        
        {/* Search Field */}
        <div className="relative flex min-h-[5.75rem] flex-col">
          <label className="aur-caption block text-slate-400 dark:text-slate-500 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="aur-input pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--aur-text-muted)]" />
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="aur-caption block text-slate-400 dark:text-slate-500 mb-2">
            Location
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleLocationToggle(e.target.value);
                e.target.value = "";
              }}
              className="aur-input"
            >
              <option value="">Filter Location...</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} {locations.includes(loc) ? "âœ“" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Locations tags */}
          {locations.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {locations.map((loc) => (
                <span
                  key={loc}
                  onClick={() => handleLocationToggle(loc)}
                  className="inline-flex max-w-full items-center rounded-sm text-[9px] font-mono border border-slate-350 bg-white dark:bg-cyber-gray dark:border-cyber-border text-slate-700 dark:text-slate-300 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                >
                  {loc} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Program / Subject Dropdown */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="aur-caption block text-slate-400 dark:text-slate-500 mb-2">
            Subject Focus
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleSubjectToggle(e.target.value);
                e.target.value = "";
              }}
              className="aur-input"
            >
              <option value="">Filter Subject...</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub} {selectedSubjects.includes(sub) ? "âœ“" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Subjects tags */}
          {selectedSubjects.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {selectedSubjects.map((sub) => (
                <span
                  key={sub}
                  onClick={() => handleSubjectToggle(sub)}
                  className="inline-flex max-w-full items-center rounded-sm text-[9px] font-mono border border-slate-350 bg-white dark:bg-cyber-gray dark:border-cyber-border text-slate-700 dark:text-slate-300 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                >
                  {sub} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Medium of Instruction */}
        <div className="flex min-h-[5.75rem] flex-col">
          <label className="aur-caption block text-slate-400 dark:text-slate-500 mb-2">
            Language
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleLanguageToggle(e.target.value);
                e.target.value = "";
              }}
              className="aur-input"
            >
              <option value="">Filter Language...</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang} {selectedLanguages.includes(lang) ? "âœ“" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Language tags */}
          {selectedLanguages.length > 0 && (
            <div className="min-h-6 flex flex-wrap gap-1 mt-1.5">
              {selectedLanguages.map((lang) => (
                <span
                  key={lang}
                  onClick={() => handleLanguageToggle(lang)}
                  className="inline-flex max-w-full items-center rounded-sm text-[9px] font-mono border border-slate-350 bg-white dark:bg-cyber-gray dark:border-cyber-border text-slate-700 dark:text-slate-300 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                >
                  {lang} <X className="h-2.5 w-2.5 ml-1" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Total: <span className="text-slate-750 dark:text-slate-100 font-mono">{filteredData.length}</span> matching institutions
        </span>
        <button
          onClick={handleResetFilters}
          className="aur-rankings-reset inline-flex w-fit items-center text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset All Filters
        </button>
      </div>

      {/* 10. Table System Container with Sticky Header & Pinned Column rules */}
      <div className="aur-table-wrap aur-rankings-table relative overflow-x-auto select-none rounded-sm">
        <table className="aur-table table-fixed min-w-[760px] w-full">
          <thead className="sticky top-0 z-10 aur-thead-shadow">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[var(--aur-border)]">
                {headerGroup.headers.map((header, idx) => {
                  const isPinnedCol = idx < 2; // rank and name columns pinned
                  const columnId = header.column.id;
                  const isMobileHiddenCol =
                    columnId === "citations" ||
                    columnId === "research" ||
                    columnId === "employability" ||
                    columnId === "tuition";
                  const widthClass =
                    columnId === "calculatedRank"
                      ? "w-14 min-w-[56px] max-w-[56px]"
                      : columnId === "name"
                        ? "w-[14rem] min-w-[14rem] sm:w-[18rem] sm:min-w-[18rem] lg:w-[22rem] lg:min-w-[22rem]"
                        : columnId === "compare"
                          ? "w-28 min-w-[112px]"
                          : "w-24 min-w-[96px]";
                  const alignClass =
                    columnId === "calculatedScore" ||
                    columnId === "citations" ||
                    columnId === "research" ||
                    columnId === "employability"
                      ? "text-right"
                      : "";
                  return (
                    <th
                      key={header.id}
                      className={`px-3 sm:px-4 py-3 text-left font-bold select-none ${
                        isPinnedCol
                          ? idx === 0
                            ? `aur-rankings-th sticky left-0 z-20 border-r border-white/10 ${widthClass}`
                            : `aur-rankings-th sticky left-[56px] z-20 border-r border-white/10 ${widthClass}`
                          : ""
                      } ${widthClass} ${alignClass} ${
                        isMobileHiddenCol ? "hidden sm:table-cell" : ""
                      } ${header.column.getCanSort() ? "cursor-pointer hover:text-[var(--aur-text)]" : ""}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={`flex items-center space-x-1.5 ${alignClass ? "justify-end" : ""}`}>
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <span className="shrink-0">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <div className="w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="font-sans text-[var(--aur-text-secondary)]">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group">
                {row.getVisibleCells().map((cell, idx) => {
                  const isPinnedCol = idx < 2;
                  const columnId = cell.column.id;
                  const isMobileHiddenCol =
                    columnId === "citations" ||
                    columnId === "research" ||
                    columnId === "employability" ||
                    columnId === "tuition";
                  const widthClass =
                    columnId === "calculatedRank"
                      ? "w-14 min-w-[56px] max-w-[56px]"
                      : columnId === "name"
                        ? "w-[14rem] min-w-[14rem] sm:w-[18rem] sm:min-w-[18rem] lg:w-[22rem] lg:min-w-[22rem]"
                        : columnId === "compare"
                          ? "w-28 min-w-[112px]"
                          : "w-24 min-w-[96px]";
                  const alignClass =
                    columnId === "calculatedScore" ||
                    columnId === "citations" ||
                    columnId === "research" ||
                    columnId === "employability"
                      ? "text-right"
                      : "";
                  return (
                    <td
                      key={cell.id}
                      className={`px-3 sm:px-4 py-3 align-middle ${
                        isPinnedCol
                          ? idx === 0
                            ? `sticky-pin sticky left-0 z-10 border-r border-[var(--aur-border)] font-bold text-[var(--aur-text)] ${widthClass}`
                            : `sticky-pin sticky left-[56px] z-10 border-r border-[var(--aur-border)] font-bold text-[var(--aur-text)] ${widthClass}`
                          : ""
                      } ${widthClass} ${alignClass} ${isMobileHiddenCol ? "hidden sm:table-cell" : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-16 px-6">
                  <div className="flex flex-col items-center text-center max-w-md mx-auto">
                    <div className="flex h-12 w-12 items-center justify-center border border-[var(--aur-border)] bg-[var(--aur-surface-2)] rounded-xl mb-4">
                      <FilterX className="h-5 w-5 text-[var(--aur-text-muted)]" />
                    </div>
                    <p className="aur-caption mb-2">No matches</p>
                    <h3 className="font-serif text-lg font-semibold text-[var(--aur-text)] mb-2">
                      No institutions match your filters
                    </h3>
                    <p className="text-xs text-[var(--aur-text-muted)] leading-relaxed mb-6">
                      Try widening location, subject, or rank rangesâ€”or reset all filters to browse the full index.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className={`aur-btn-primary px-5 py-2.5 aur-focus-ring ${focusRing}`}
                    >
                      Reset all filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsWeightsDrawerOpen(false)} />
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
