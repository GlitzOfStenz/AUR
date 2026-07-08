"use client";

import React, { useState, useMemo } from "react";
import { MOCK_UNIVERSITIES, University } from "../data";
import { X, LayoutGrid } from "lucide-react";

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

const ProfessionalInput = ({ 
  label, value, onChange, placeholder, prefix, suffix 
}: { 
  label: string; value: string; onChange: (v: string) => void; placeholder: string; prefix?: string; suffix?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-slate-700">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-slate-400 text-sm font-medium">{prefix}</span>}
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors ${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'}`}
      />
      {suffix && <span className="absolute right-3 text-slate-400 text-sm font-medium">{suffix}</span>}
    </div>
  </div>
);

export default function ComparisonMatrix() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<Criteria>(DEFAULT_CRITERIA);
  const [hasSearched, setHasSearched] = useState(false);

  const maxTuition = parseNum(criteria.tuitionStr);
  const maxLiving = parseNum(criteria.livingStr);
  const minSalary = parseNum(criteria.salaryStr);
  const maxRank = parseNum(criteria.rankStr);
  const maxAcceptance = parseNum(criteria.acceptanceStr);
  const minScholarship = parseNum(criteria.scholarshipStr);
  const reqAccred = criteria.accreditationSearch.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!hasSearched) return [];
    
    const results = MOCK_UNIVERSITIES.map(u => {
      const e = ENRICHMENT[u.id] ?? DEFAULT_ENRICH;
      let score = 100;

      if (maxTuition !== null) { if (e.tuition > maxTuition) score -= 20; }
      if (maxLiving !== null) { if (e.livingCost > maxLiving) score -= 15; }
      if (minSalary !== null) { if (e.salary < minSalary) score -= 25; }
      if (maxRank !== null) { if (e.rank > maxRank) score -= 15; }
      if (maxAcceptance !== null) { if (e.acceptance > maxAcceptance) score -= 10; }
      if (minScholarship !== null) { if (e.scholarship < minScholarship) score -= 10; }
      if (reqAccred) {
        if (!e.accreditation.some(a => a.toLowerCase().includes(reqAccred))) score -= 15;
      }

      return { u, score: Math.max(0, score) };
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
    <div className="min-h-screen w-full pb-20 font-sans bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">
            <LayoutGrid className="w-4 h-4" />
            Comparison Matrix
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-slate-900">
            Evaluate Institutions
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl">
            Configure filtering parameters below to shortlist institutions. Then, use the data table to perform a side-by-side analysis of relevant metrics and accreditations.
          </p>
        </header>

        {/* Configuration Panel */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-10 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-800">
              Filtering Criteria
            </h2>
            <button 
              onClick={() => { setCriteria(DEFAULT_CRITERIA); setHasSearched(false); }}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Clear parameters
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProfessionalInput label="Maximum Tuition" value={criteria.tuitionStr} onChange={v => setCriteria(p => ({...p, tuitionStr: v}))} placeholder="e.g. 20000" prefix="$" />
              <ProfessionalInput label="Maximum Living Cost" value={criteria.livingStr} onChange={v => setCriteria(p => ({...p, livingStr: v}))} placeholder="e.g. 15000" prefix="$" />
              <ProfessionalInput label="Minimum Graduate Salary" value={criteria.salaryStr} onChange={v => setCriteria(p => ({...p, salaryStr: v}))} placeholder="e.g. 60000" prefix="$" />
              <ProfessionalInput label="Maximum World Rank" value={criteria.rankStr} onChange={v => setCriteria(p => ({...p, rankStr: v}))} placeholder="e.g. 50" prefix="#" />
              
              <ProfessionalInput label="Maximum Acceptance Rate" value={criteria.acceptanceStr} onChange={v => setCriteria(p => ({...p, acceptanceStr: v}))} placeholder="e.g. 15" suffix="%" />
              <ProfessionalInput label="Minimum Scholarship" value={criteria.scholarshipStr} onChange={v => setCriteria(p => ({...p, scholarshipStr: v}))} placeholder="e.g. 5000" prefix="$" />
              <div className="sm:col-span-2 lg:col-span-2">
                <ProfessionalInput label="Required Accreditations" value={criteria.accreditationSearch} onChange={v => setCriteria(p => ({...p, accreditationSearch: v}))} placeholder="e.g. AACSB, EQUIS" />
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-6">
              <button 
                onClick={() => setHasSearched(true)}
                className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results List */}
          {hasSearched && (
            <div className="border-t border-slate-200 bg-white">
              <div className="px-6 py-3 border-b border-slate-200 bg-white">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Matches ({searchResults.length})
                </h3>
              </div>
              
              <div className="max-h-72 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-slate-200">
                      {searchResults.map((res) => {
                        const isSelected = selectedIds.includes(res.u.id);
                        return (
                          <tr key={res.u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {res.u.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {res.u.location}
                            </td>
                            <td className="px-6 py-4 text-slate-500 w-32">
                              {res.score}% Match
                            </td>
                            <td className="px-6 py-4 text-right w-40">
                              <button
                                onClick={() => toggleSelect(res.u.id)}
                                className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  isSelected 
                                    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100" 
                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {isSelected ? "Remove" : "Add to Matrix"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-slate-500 text-sm">No institutions matched the provided parameters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Data Matrix
          </h2>
          {displayedUnis.length > 0 && (
            <span className="text-sm font-medium text-slate-500">
              {displayedUnis.length} {displayedUnis.length === 1 ? 'institution' : 'institutions'} selected
            </span>
          )}
        </div>

        {displayedUnis.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center shadow-sm">
            <p className="text-slate-500 text-sm">Select institutions from the filter results to populate the comparison matrix.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white text-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold border-b border-r border-slate-200 w-48 sticky left-0 bg-white z-10">
                      Metric
                    </th>
                    {displayedUnis.map(u => (
                      <th scope="col" key={u.id} className="px-6 py-4 font-semibold border-b border-r border-slate-200 min-w-[240px] last:border-r-0 relative group">
                        <div className="pr-6">
                          <div className="text-slate-900 truncate" title={u.name}>{u.name}</div>
                          <div className="text-xs font-normal text-slate-500 mt-0.5">{u.location}</div>
                        </div>
                        <button 
                          onClick={() => toggleSelect(u.id)} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          aria-label="Remove institution"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { label: "Annual Tuition", render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).tuition) },
                    { label: "Living Expenses", render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).livingCost) },
                    { label: "Avg. Graduate Salary", render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).salary) },
                    { label: "World Ranking", render: (u: University) => {
                        const r = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).rank;
                        return r < 999 ? `#${r}` : "Unranked";
                    }},
                    { label: "Acceptance Rate", render: (u: University) => {
                        const v = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).acceptance;
                        return v > 0 ? `${v.toFixed(1)}%` : "—";
                    }},
                    { label: "Scholarship Max", render: (u: University) => fmtCurrency((ENRICHMENT[u.id] ?? DEFAULT_ENRICH).scholarship) },
                    { label: "Accreditation", render: (u: University) => {
                        const a = (ENRICHMENT[u.id] ?? DEFAULT_ENRICH).accreditation;
                        return a.length > 0 ? a.join(", ") : "—";
                    }}
                  ].map(({ label, render }, idx) => (
                    <tr key={label} className="hover:bg-slate-50 transition-colors">
                      <th scope="row" className="px-6 py-4 font-medium text-slate-700 border-r border-slate-200 sticky left-0 bg-white">
                        {label}
                      </th>
                      {displayedUnis.map(u => (
                        <td key={u.id} className="px-6 py-4 text-slate-600 border-r border-slate-200 last:border-r-0">
                          {render(u)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
