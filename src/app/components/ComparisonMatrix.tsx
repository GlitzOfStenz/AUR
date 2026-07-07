"use client";

import React, { useState, useMemo } from "react";
import { MOCK_UNIVERSITIES, University } from "../data";
import { X, Search } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ENRICHMENT DATA
// ─────────────────────────────────────────────────────────────────────────────

const ENRICHMENT: Record<string, {
  tuition: number;
  livingCost: number;
  salary: number;
  rank: number;
  acceptance: number;
  scholarship: number;
  accreditation: string[];
}> = {
  tsinghua:            { tuition: 4800,  livingCost: 6200,  salary: 72000, rank: 14,  acceptance: 3.4,  scholarship: 8000,  accreditation: ["AACSB","ABET","QS Top 20"] },
  nus:                 { tuition: 22000, livingCost: 14000, salary: 89000, rank: 8,   acceptance: 5.0,  scholarship: 20000, accreditation: ["AACSB","EQUIS","QS Top 10"] },
  peking:              { tuition: 5500,  livingCost: 6000,  salary: 68000, rank: 17,  acceptance: 3.6,  scholarship: 7500,  accreditation: ["AACSB","QS Top 20"] },
  tokyo:               { tuition: 4000,  livingCost: 12000, salary: 76000, rank: 28,  acceptance: 9.8,  scholarship: 11000, accreditation: ["JABEE","ABET","QS Top 30"] },
  hku:                 { tuition: 21000, livingCost: 18000, salary: 85000, rank: 26,  acceptance: 7.4,  scholarship: 25000, accreditation: ["AACSB","AMBA","QS Top 30"] },
  ntu:                 { tuition: 18000, livingCost: 14000, salary: 82000, rank: 15,  acceptance: 7.1,  scholarship: 18000, accreditation: ["AACSB","ABET","QS Top 15"] },
  snu:                 { tuition: 6000,  livingCost: 9000,  salary: 64000, rank: 41,  acceptance: 10.2, scholarship: 9000,  accreditation: ["AACSB","ABET","QS Top 40"] },
  kyoto:               { tuition: 4200,  livingCost: 11500, salary: 71000, rank: 46,  acceptance: 11.5, scholarship: 10000, accreditation: ["JABEE","QS Top 50"] },
  kaist:               { tuition: 7000,  livingCost: 9500,  salary: 69000, rank: 56,  acceptance: 12.0, scholarship: 12000, accreditation: ["ABET","AACSB"] },
  cuhk:                { tuition: 18500, livingCost: 17500, salary: 79000, rank: 36,  acceptance: 14.5, scholarship: 22000, accreditation: ["AACSB","EQUIS","QS Top 40"] },
  fudan:               { tuition: 5000,  livingCost: 7500,  salary: 67000, rank: 39,  acceptance: 4.2,  scholarship: 7000,  accreditation: ["AACSB","EQUIS","QS Top 40"] },
  zhejiang:            { tuition: 5200,  livingCost: 6800,  salary: 63000, rank: 42,  acceptance: 3.8,  scholarship: 6500,  accreditation: ["AACSB","ABET"] },
  ustc:                { tuition: 4500,  livingCost: 5500,  salary: 61000, rank: 85,  acceptance: 6.5,  scholarship: 6000,  accreditation: ["ABET","QS Top 100"] },
  titech:              { tuition: 4500,  livingCost: 12500, salary: 73000, rank: 91,  acceptance: 13.0, scholarship: 9500,  accreditation: ["JABEE","ABET"] },
};

const DEFAULT_ENRICH = { tuition: 0, livingCost: 0, salary: 0, rank: 999, acceptance: 0, scholarship: 0, accreditation: [] };

// ─────────────────────────────────────────────────────────────────────────────
// CRITERIA STATE
// ─────────────────────────────────────────────────────────────────────────────

interface Criteria {
  tuitionStr: string;
  livingStr: string;
  salaryStr: string;
  rankStr: string;
  acceptanceStr: string;
  scholarshipStr: string;
  accreditationSearch: string;
}

const DEFAULT_CRITERIA: Criteria = {
  tuitionStr: "",
  livingStr: "",
  salaryStr: "",
  rankStr: "",
  acceptanceStr: "",
  scholarshipStr: "",
  accreditationSearch: "",
};

function parseNum(val: string): number | null {
  const num = parseInt(val.replace(/[^0-9]/g, ""));
  return isNaN(num) ? null : num;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ComparisonMatrix() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<Criteria>(DEFAULT_CRITERIA);
  const [hasSearched, setHasSearched] = useState(false);

  // Parse strings to numbers for filtering
  const maxTuition = parseNum(criteria.tuitionStr);
  const maxLiving = parseNum(criteria.livingStr);
  const minSalary = parseNum(criteria.salaryStr);
  const maxRank = parseNum(criteria.rankStr);
  const maxAcceptance = parseNum(criteria.acceptanceStr);
  const minScholarship = parseNum(criteria.scholarshipStr);
  const reqAccred = criteria.accreditationSearch.trim().toLowerCase();

  const handleClear = () => {
    setCriteria(DEFAULT_CRITERIA);
    setHasSearched(false);
  };

  const searchResults = useMemo(() => {
    if (!hasSearched) return [];
    
    const results = MOCK_UNIVERSITIES.map(u => {
      const e = ENRICHMENT[u.id] ?? DEFAULT_ENRICH;
      let score = 100;
      let matches = 0;
      let totalFilters = 0;

      if (maxTuition !== null) {
        totalFilters++;
        if (e.tuition <= maxTuition) matches++; else score -= 20;
      }
      if (maxLiving !== null) {
        totalFilters++;
        if (e.livingCost <= maxLiving) matches++; else score -= 15;
      }
      if (minSalary !== null) {
        totalFilters++;
        if (e.salary >= minSalary) matches++; else score -= 25;
      }
      if (maxRank !== null) {
        totalFilters++;
        if (e.rank <= maxRank) matches++; else score -= 15;
      }
      if (maxAcceptance !== null) {
        totalFilters++;
        if (e.acceptance <= maxAcceptance) matches++; else score -= 10;
      }
      if (minScholarship !== null) {
        totalFilters++;
        if (e.scholarship >= minScholarship) matches++; else score -= 10;
      }
      if (reqAccred) {
        totalFilters++;
        if (e.accreditation.some(a => a.toLowerCase().includes(reqAccred))) matches++; else score -= 15;
      }

      return { u, score: Math.max(0, score), matches, totalFilters };
    });

    return results
      .filter(r => (maxTuition === null && minSalary === null && maxRank === null && maxLiving === null && maxAcceptance === null && minScholarship === null && !reqAccred) || r.score > 0)
      .sort((a, b) => b.score - a.score);

  }, [hasSearched, criteria, maxTuition, maxLiving, minSalary, maxRank, maxAcceptance, minScholarship, reqAccred]);

  const displayedUnis = useMemo(() => {
    return selectedIds.map(id => MOCK_UNIVERSITIES.find(u => u.id === id)).filter(Boolean) as University[];
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const fmtCurrency = (n: number) => n === 0 ? "—" : `$${n.toLocaleString()}`;

  return (
    <div className="w-full min-h-screen bg-white text-black">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10">
        
        {/* ── HEADER ── */}
        <header className="mb-12 border-b border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-1.5">Prestige Institutional Portal</div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-black tracking-tight leading-none">
              Analysis Matrix
            </h1>
          </div>
          <p className="text-xs text-neutral-500 max-w-md leading-relaxed md:text-right">
            Evaluate prospective institutions side-by-side across critical ROI metrics and accreditation standings inside a structured comparison grid.
          </p>
        </header>

        {/* ── AUTHORITATIVE FILTER CONSOLE ── */}
        <section className="border border-black bg-white mb-14 transition-all duration-300">
          <div className="border-b border-black px-6 py-4 flex items-center justify-between bg-white">
            <h2 className="font-serif text-xs font-bold uppercase tracking-widest text-black flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              Institutional Filter Console
            </h2>
            <button 
              onClick={handleClear} 
              className="text-[9px] uppercase tracking-widest font-bold text-neutral-450 hover:text-black transition-colors rounded-md px-2 py-1"
            >
              Clear Parameters
            </button>
          </div>

          {/* 1px grid border layout */}
          <div className="bg-neutral-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
            
            {/* Tuition */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Max Annual Tuition
              </label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black mr-1.5 font-serif">$</span>
                <input 
                  type="text" 
                  value={criteria.tuitionStr} 
                  onChange={e => setCriteria(prev => ({...prev, tuitionStr: e.target.value}))}
                  placeholder="Any Budget"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
              </div>
            </div>

            {/* Living Cost */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Max Living Cost
              </label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black mr-1.5 font-serif">$</span>
                <input 
                  type="text" 
                  value={criteria.livingStr} 
                  onChange={e => setCriteria(prev => ({...prev, livingStr: e.target.value}))}
                  placeholder="Any Cost"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
              </div>
            </div>

            {/* Salary */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Min Graduate Salary
              </label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black mr-1.5 font-serif">$</span>
                <input 
                  type="text" 
                  value={criteria.salaryStr} 
                  onChange={e => setCriteria(prev => ({...prev, salaryStr: e.target.value}))}
                  placeholder="No Minimum"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
              </div>
            </div>

            {/* Rank */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Max World Rank
              </label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black mr-1.5 font-serif">#</span>
                <input 
                  type="text" 
                  value={criteria.rankStr} 
                  onChange={e => setCriteria(prev => ({...prev, rankStr: e.target.value}))}
                  placeholder="Unrestricted"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
              </div>
            </div>

            {/* Acceptance Rate */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Max Acceptance Rate
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={criteria.acceptanceStr} 
                  onChange={e => setCriteria(prev => ({...prev, acceptanceStr: e.target.value}))}
                  placeholder="No Limit"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black ml-1.5 font-serif">%</span>
              </div>
            </div>

            {/* Scholarships */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Min Scholarship Fund
              </label>
              <div className="flex items-center">
                <span className="text-sm font-bold text-neutral-400 group-focus-within:text-black mr-1.5 font-serif">$</span>
                <input 
                  type="text" 
                  value={criteria.scholarshipStr} 
                  onChange={e => setCriteria(prev => ({...prev, scholarshipStr: e.target.value}))}
                  placeholder="No Minimum"
                  className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
                />
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-white p-5 flex flex-col gap-1.5 relative group lg:col-span-2">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-400 scale-y-0 group-focus-within:scale-y-100 transition-transform origin-center duration-150" />
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-focus-within:text-black transition-colors">
                Accreditation Bodies
              </label>
              <input 
                type="text" 
                value={criteria.accreditationSearch} 
                onChange={e => setCriteria(prev => ({...prev, accreditationSearch: e.target.value}))}
                placeholder="e.g. AACSB, ABET, EQUIS"
                className="w-full bg-transparent outline-none border-none text-sm font-serif font-medium text-black placeholder-neutral-300"
              />
            </div>

          </div>

          {/* Actions Bar */}
          <div className="bg-white px-6 py-4 border-t border-black flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
              {hasSearched ? `Matches Identified: ${searchResults.length}` : "Configure filters to shortlist institutions"}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleClear}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-black border border-neutral-200 hover:border-black transition-colors duration-150 rounded-md"
              >
                Reset Parameters
              </button>
              <button 
                onClick={() => setHasSearched(true)}
                className="bg-black text-white px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#facc15] hover:text-black border border-black transition-colors duration-150 rounded-md"
              >
                Apply Parameters
              </button>
            </div>
          </div>

          {/* SEARCH RESULTS */}
          {hasSearched && (
            <div className="border-t border-black bg-white">
              <div className="px-6 py-3 bg-neutral-50 border-b border-black/10">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Query Results ({searchResults.length} Matches)</span>
              </div>
              {searchResults.length > 0 ? (
                <ul className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto">
                  {searchResults.map((res, i) => {
                    const isSelected = selectedIds.includes(res.u.id);
                    return (
                      <li key={res.u.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <span className="font-serif text-xs text-neutral-400 font-medium w-4">{i + 1}.</span>
                          <div>
                            <div className="font-serif font-bold text-sm text-black group-hover:text-yellow-600 transition-colors">
                              {res.u.name}
                            </div>
                            <div className="text-[10px] text-neutral-450 font-semibold uppercase tracking-wider mt-0.5">
                              {res.u.location} &middot; {res.score}% Compatibility
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSelect(res.u.id)}
                          className={`px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors border rounded-md ${
                            isSelected 
                              ? "bg-neutral-100 border-neutral-300 text-neutral-500 hover:bg-red-100 hover:text-red-700 hover:border-red-400" 
                              : "bg-black border-black text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400"
                          }`}
                        >
                          {isSelected ? "Remove" : "Add to Matrix"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="py-16 text-center text-neutral-400 font-serif text-sm bg-neutral-50/20">
                  No institutions matched the specified filter criteria.
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── COMPARISON MATRIX (FINANCIAL REPORT STYLE) ── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-bold text-black tracking-tight">Comparative Analysis Ledger</h2>
            <span className="text-[9px] font-bold uppercase tracking-widest text-black px-3 py-1 border border-black bg-neutral-50">
              {displayedUnis.length} / 6 Shortlisted
            </span>
          </div>

          {displayedUnis.length === 0 ? (
            <div className="border border-black border-dashed p-16 text-center bg-white">
              <p className="font-serif text-neutral-400 text-base">The comparison ledger is currently empty. Use the Filter Console above to shortlist institutions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-black bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  {/* ── University headers: listed HORIZONTALLY as columns ── */}
                  <tr className="border-b-2 border-black">
                    <th scope="col" className="px-5 py-4 w-52 border-r-2 border-black bg-neutral-50 align-bottom">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">Institution / Metric</span>
                    </th>
                    {displayedUnis.map(u => (
                      <th scope="col" key={u.id} className="px-5 py-4 min-w-[210px] border-r border-black/30 last:border-r-0 align-bottom bg-white">
                        <div className="flex justify-between items-end gap-2 pb-2 border-b-2 border-black">
                          <div>
                            <div className="font-serif font-bold text-sm text-black leading-tight">{u.name}</div>
                            <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold mt-0.5">{u.location}</div>
                          </div>
                          <button 
                            onClick={() => toggleSelect(u.id)} 
                            className="shrink-0 text-neutral-400 hover:text-black transition-colors hover:bg-neutral-100 p-1.5 rounded-md border border-transparent hover:border-neutral-200"
                            title="Remove from matrix"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* ── Metrics listed VERTICALLY as rows ── */}
                <tbody className="text-sm bg-white">

                  {([
                    {
                      label: "Annual Tuition",
                      render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).tuition),
                    },
                    {
                      label: "Living Expenses",
                      render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).livingCost),
                    },
                    {
                      label: "Avg. Graduate Salary",
                      render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).salary),
                    },
                    {
                      label: "World Ranking",
                      render: (u: University) => {
                        const r = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).rank;
                        return r < 999 ? `#${r}` : "Unranked";
                      },
                    },
                    {
                      label: "Acceptance Rate",
                      render: (u: University) => {
                        const v = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).acceptance;
                        return v > 0 ? `${v.toFixed(1)}%` : "—";
                      },
                    },
                    {
                      label: "Scholarship Support",
                      render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).scholarship),
                    },
                    {
                      label: "Accreditation",
                      render: (u: University) => {
                        const a = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).accreditation;
                        return a.length > 0 ? a.join(", ") : "—";
                      },
                      isText: true,
                    },
                  ] as { label: string; render: (u: University) => string; isText?: boolean }[]).map(({ label, render, isText }) => (
                    <tr key={label} className="border-t border-black/10 hover:bg-amber-50/30 transition-colors">
                      {/* Metric label — left-pinned vertical axis */}
                      <th
                        scope="row"
                        className="px-5 py-3.5 border-r-2 border-black bg-neutral-50 text-[9px] font-black uppercase tracking-widest text-neutral-500 whitespace-nowrap text-left"
                      >
                        {label}
                      </th>
                      {/* University data cells — horizontal columns */}
                      {displayedUnis.map(u => (
                        <td
                          key={u.id}
                          className={`px-5 py-3.5 border-r border-black/20 last:border-r-0 ${
                            isText
                              ? "text-[11px] font-bold text-neutral-700 leading-relaxed"
                              : "font-serif text-black font-semibold text-sm"
                          }`}
                        >
                          {render(u)}
                        </td>
                      ))}
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          )}
        </section>
        
      </div>
    </div>
  );
}
