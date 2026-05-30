"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  X
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
  // We use window.history.replaceState to prevent Next.js from triggering heavy layout flushes or re-renders
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
    
    // Only serialize custom weights if they differ from default
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

    // Apply custom formula weights to recalculate scores dynamically
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
  const filteredData = useMemo(() => {
    return processedData.filter((uni) => {
      // 1. Search Query (combine props.searchQuery and filters.searchQuery)
      const query = (filters.searchQuery || searchQuery || "").toLowerCase();
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
        const isPublic = !["akfa-univ", "tashkent-webster", "yonsei", "korea-univ"].includes(uni.id);
        matchesType = isPublic === filters.isPublic;
      }

      // 8. Scholarship Only
      let matchesScholarship = true;
      if (filters.scholarshipOnly) {
        const hasScholarship = ["tsinghua", "nus", "peking", "tokyo", "samarkand-med", "tashkent-med", "akfa-univ", "malaya"].includes(uni.id);
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
  }, [processedData, searchQuery, locations, selectedSubjects, selectedLanguages, filters]);

  // 6. Extract unique values for filter dropdown options
  const uniqueLocations = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.map((u) => u.location))).sort(), []);
  const uniqueSubjects = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.flatMap((u) => u.subjects))).sort(), []);
  const uniqueLanguages = useMemo(() => Array.from(new Set(MOCK_UNIVERSITIES.flatMap((u) => u.languages))).sort(), []);

  // 7. Column Definitions for @tanstack/react-table
  const columns = useMemo<ColumnDef<typeof filteredData[0]>[]>(
    () => [
      {
        id: "calculatedRank",
        header: "Rank",
        accessorKey: "calculatedRank",
        cell: ({ row }) => (
          <motion.span
            key={`rank-${row.original.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-6 w-6 items-center justify-center border border-slate-900 bg-slate-900 text-white font-mono text-xs font-bold"
          >
            {row.original.calculatedRank}
          </motion.span>
        ),
      },
      {
        id: "name",
        header: "University Name",
        accessorKey: "name",
        cell: ({ row }) => (
          <div className="text-left font-sans font-bold text-slate-900 hover:text-amber-700 transition-colors cursor-pointer" onClick={() => onUniversitySelect(row.original.id)}>
            <div className="truncate max-w-50">{row.original.name}</div>
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
          <span className="font-mono font-bold text-slate-900">{(getValue() as number).toFixed(1)}</span>
        ),
      },
      {
        id: "citations",
        header: "Citations",
        accessorKey: "citations",
        cell: ({ getValue }) => <span className="font-mono text-slate-600">{(getValue() as number).toFixed(0)}</span>,
      },
      {
        id: "research",
        header: "Research",
        accessorKey: "research",
        cell: ({ getValue }) => <span className="font-mono text-slate-600">{(getValue() as number).toFixed(0)}</span>,
      },
      {
        id: "employability",
        header: "Employability",
        accessorKey: "employability",
        cell: ({ getValue }) => <span className="font-mono text-slate-600">{(getValue() as number).toFixed(0)}</span>,
      },
      {
        id: "tuition",
        header: "Tuition / Yr",
        accessorKey: "tuition",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5">
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
            <motion.button
              onClick={() => onToggleCompare(row.original.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-900 px-2.5 py-1 hover:bg-slate-50 transition-colors"
            >
              {isSelected ? (
                <>
                  <CheckSquare className="h-3.5 w-3.5 text-amber-700" />
                  <span className="text-[10px]">Added</span>
                </>
              ) : (
                <>
                  <Square className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Compare</span>
                </>
              )}
            </motion.button>
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
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 font-sans grow">
      
      {/* Editorial Title */}
      <div className="mb-8 border-b border-slate-900 dark:border-cyber-border pb-4 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
            Engine & Analytics Database
          </span>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight mt-1">
            Asia Institutional Ranking Table
          </h2>
        </div>
        
        {/* Recalculator Drawer Trigger button */}
        <button
          onClick={() => setIsWeightsDrawerOpen(true)}
          className="mt-4 md:mt-0 inline-flex items-center justify-center border border-amber-700 bg-amber-50 dark:bg-cyber-gray dark:text-cyber-yellow dark:border-cyber-yellow/40 hover:bg-amber-100 dark:hover:bg-cyber-yellow dark:hover:text-cyber-black text-amber-900 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2 text-amber-700" />
          Weights Recalculator
        </button>
      </div>

      {/* 9. Elite Filtering Bar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-50 dark:bg-cyber-gray border border-slate-200 dark:border-slate-800 p-4">
        
        {/* Search Field */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full border border-slate-200 bg-white px-3 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Location Dropdown */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Location
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleLocationToggle(e.target.value);
                e.target.value = "";
              }}
              className="w-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
            >
              <option value="">Filter Location...</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc} {locations.includes(loc) ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Locations tags */}
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              <AnimatePresence>
                {locations.map((loc) => (
                  <motion.span
                    key={loc}
                    onClick={() => handleLocationToggle(loc)}
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="inline-flex items-center text-[9px] font-mono border border-slate-350 bg-white text-slate-700 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                  >
                    {loc} <X className="h-2 w-2 ml-1" />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Program / Subject Dropdown */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Subject Focus
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleSubjectToggle(e.target.value);
                e.target.value = "";
              }}
              className="w-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
            >
              <option value="">Filter Subject...</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub} {selectedSubjects.includes(sub) ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Subjects tags */}
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              <AnimatePresence>
                {selectedSubjects.map((sub) => (
                  <motion.span
                    key={sub}
                    onClick={() => handleSubjectToggle(sub)}
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="inline-flex items-center text-[9px] font-mono border border-slate-350 bg-white text-slate-700 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                  >
                    {sub} <X className="h-2 w-2 ml-1" />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Medium of Instruction */}
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">
            Language
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleLanguageToggle(e.target.value);
                e.target.value = "";
              }}
              className="w-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
            >
              <option value="">Filter Language...</option>
              {uniqueLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang} {selectedLanguages.includes(lang) ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Active Language tags */}
          {selectedLanguages.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              <AnimatePresence>
                {selectedLanguages.map((lang) => (
                  <motion.span
                    key={lang}
                    onClick={() => handleLanguageToggle(lang)}
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="inline-flex items-center text-[9px] font-mono border border-slate-350 bg-white text-slate-700 px-1.5 py-0.5 cursor-pointer hover:border-red-500 hover:text-red-500"
                  >
                    {lang} <X className="h-2 w-2 ml-1" />
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Total: <span className="text-slate-750 font-mono">{filteredData.length}</span> matching institutions
        </span>
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:text-amber-800 transition-colors"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset All Filters
        </button>
      </div>

      {/* 10. Table System Container with Sticky Header & Pinned Column rules */}
      <div className="relative border border-slate-200 dark:border-cyber-border overflow-x-auto select-none bg-white dark:bg-cyber-dark">
        <table className="w-full table-auto border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-900 dark:bg-cyber-gray text-white dark:text-cyber-yellow font-sans uppercase tracking-wider font-semibold">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200 dark:border-slate-800">
                {headerGroup.headers.map((header, idx) => {
                  const isPinnedCol = idx < 2; // rank and name columns pinned
                  return (
                    <th
                      key={header.id}
                      className={`px-4 py-3 text-left font-bold select-none ${
                        isPinnedCol
                          ? "sticky left-0 bg-slate-900 dark:bg-cyber-gray z-20 border-r border-slate-800 dark:border-slate-700"
                          : ""
                      } ${header.column.getCanSort() ? "cursor-pointer hover:text-amber-300 dark:hover:text-cyber-yellow-bright" : ""}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {header.column.getCanSort() && (
                          <motion.span
                            className="shrink-0"
                            animate={{
                              rotate: header.column.getIsSorted() === "desc" ? 180 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <div className="w-3" />
                            )}
                          </motion.span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-250 dark:divide-slate-850 font-sans text-slate-700 dark:text-slate-300">
            <AnimatePresence>
              {table.getRowModel().rows.map((row, idx) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: idx * 0.05 }}
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(15,23,42,0.08)" }}
                  className="hover:bg-slate-50 dark:hover:bg-cyber-gray/25 transition-colors"
                >
                {row.getVisibleCells().map((cell, idx) => {
                  const isPinnedCol = idx < 2;
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 align-middle ${
                        isPinnedCol
                          ? "sticky left-0 bg-white dark:bg-cyber-black hover:bg-slate-50 dark:hover:bg-cyber-gray/30 z-10 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                          : ""
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </motion.tr>
              ))}
              {filteredData.length === 0 && (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td colSpan={columns.length} className="text-center py-12 text-slate-400 italic">
                    No universities match the current search filters.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-white py-3 mt-4">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="relative ml-3 inline-flex items-center border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Showing page <span className="font-mono text-slate-700">{table.getState().pagination.pageIndex + 1}</span> of{" "}
              <span className="font-mono text-slate-700">{table.getPageCount()}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px" aria-label="Pagination">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 11. Custom Recalculation Weights Slide-Out Drawer */}
      <AnimatePresence>
        {isWeightsDrawerOpen && (
          <motion.div
            key="weights-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-hidden font-sans"
          >
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsWeightsDrawerOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 right-0 pl-10 max-w-full flex"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="w-screen max-w-md bg-white border-l border-slate-900 flex flex-col justify-between shadow-2xl">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                      Calculations Lab
                    </span>
                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-0.5">
                      Recalculate Rank Weights
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsWeightsDrawerOpen(false)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
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
                          <label className="text-xs font-bold text-slate-900 block">{slider.label}</label>
                          <span className="text-[10px] text-slate-400 block">{slider.desc}</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded">
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
                        className="w-full accent-amber-700 cursor-pointer bg-slate-100"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Drawer Footer controls */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => {
                    setWeights(DEFAULT_WEIGHTS);
                    serializeStateToUrl(searchQuery, locations, selectedSubjects, selectedLanguages, DEFAULT_WEIGHTS);
                  }}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  Default Weights
                </button>
                <button
                  onClick={() => setIsWeightsDrawerOpen(false)}
                  className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-slate-800 transition-colors border border-slate-900"
                >
                  Apply Recalculation
                </button>
              </div>

            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
