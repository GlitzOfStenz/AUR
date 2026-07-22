"use client";

import React, { useState, useMemo } from "react";
import { X, LayoutGrid, Search } from "lucide-react";
import { University } from "../data";
import { useUniversityData } from "./data/UniversityDataProvider";

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
  const { universities } = useUniversityData();

  const [selectedUnis, setSelectedUnis] = useState<University[]>([]);
  const [maxTuition, setMaxTuition] = useState("");
  const [country, setCountry] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchResults = useMemo(() => {
    if (!hasSearched) return [];
    return universities.filter((u) => {
      const matchesCountry =
        !country || u.location.toLowerCase() === country.toLowerCase();

      let matchesTuition = true;
      if (maxTuition) {
        const numeric = parseInt(u.tuition.replace(/[^0-9]/g, ""), 10);
        const max = parseInt(maxTuition, 10);
        matchesTuition = !isNaN(numeric) && !isNaN(max) && numeric <= max;
      }

      return matchesCountry && matchesTuition;
    });
  }, [universities, country, maxTuition, hasSearched]);

  const applyFilters = () => setHasSearched(true);

  const toggleSelect = (uni: University) => {
    if (selectedUnis.some(u => u.id === uni.id)) {
      setSelectedUnis(prev => prev.filter(u => u.id !== uni.id));
    } else {
      if (selectedUnis.length >= 5) {
        alert("You can only compare up to 5 universities at once.");
        return;
      }
      setSelectedUnis(prev => [...prev, uni]);
    }
  };

  const clearParameters = () => {
    setMaxTuition("");
    setCountry("");
    setHasSearched(false);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <LayoutGrid className="w-6 h-6 text-slate-900" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Comparison Matrix
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-500">
            Select up to 5 institutions to evaluate side-by-side against real ranking metrics, tuition, and admission data.
          </p>
        </header>

        {/* Configuration Panel */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm mb-10 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h2 className="text-sm font-semibold text-slate-800">
              Filtering Criteria
            </h2>
            <button
              onClick={clearParameters}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Clear parameters
            </button>
          </div>

          <div className="p-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProfessionalInput
                label="Maximum Tuition Fee (USD/year)"
                value={maxTuition}
                onChange={setMaxTuition}
                placeholder="e.g. 5000"
                prefix="$"
              />
              <ProfessionalInput
                label="Country"
                value={country}
                onChange={setCountry}
                placeholder="e.g. China"
              />
            </div>

            <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-6">
              <button
                onClick={applyFilters}
                className="inline-flex items-center justify-center px-5 py-2 bg-slate-900 hover:bg-cyber-black text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                <Search className="w-4 h-4 mr-2" />
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
                        const isSelected = selectedUnis.some(u => u.id === res.id);
                        return (
                          <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {res.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {res.location}
                            </td>
                            <td className="px-6 py-4 text-slate-500 w-32">
                              Score: {res.overall.toFixed(1)}
                            </td>
                            <td className="px-6 py-4 text-right w-40">
                              <button
                                onClick={() => toggleSelect(res)}
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
          {selectedUnis.length > 0 && (
            <span className="text-sm font-medium text-slate-500">
              {selectedUnis.length} / 5 selected
            </span>
          )}
        </div>

        {selectedUnis.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-lg p-16 text-center shadow-sm">
            <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-900">No institutions selected</h3>
            <p className="mt-2 text-sm text-slate-500">
              Search and add institutions from the panel above to begin your comparison. You can compare up to 5 at once.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(127, 86, 217, 0.1)]">University Name</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Overall Score</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Founded</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Tuition Fee</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Academic Reputation</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Employability</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Citations</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Teaching</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Research</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Intl Students</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Website</th>
                  <th className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-800 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedUnis.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 border-r border-slate-200 bg-white group-hover:bg-slate-50 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(127, 86, 217, 0.1)]">
                      <h3 className="font-bold text-slate-900 text-base min-w-[14rem]">{u.name}</h3>
                      <p className="text-slate-500 text-xs mt-1">{u.location}</p>
                    </td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.overall.toFixed(1)}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.founded ?? "N/A"}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.tuition}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.academicReputation ?? "N/A"}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.employability}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.citations}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.teaching}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.research}</td>
                    <td className="px-6 py-4 border-r border-slate-200">{u.intlStudents}</td>
                    <td className="px-6 py-4 border-r border-slate-200">
                      {u.website ? (
                        <a href={u.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline whitespace-nowrap">
                          Visit Site
                        </a>
                      ) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleSelect(u)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-md border border-slate-200 shadow-sm hover:border-red-200 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

