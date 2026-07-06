"use client";

import React, { useState } from "react";
import { X, ArrowRight, BarChart3, Shuffle, Trash } from "lucide-react";
import { useUniversityData } from "./data/UniversityDataProvider";

interface ComparisonDockProps {
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onUniversitySelect: (id: string) => void;
}

export default function ComparisonDock({
  selectedIds,
  onRemove,
  onClearAll,
  onUniversitySelect,
}: ComparisonDockProps) {
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyber-yellow dark:focus-visible:ring-offset-cyber-black";
  const { universities } = useUniversityData();
  const [isExpanded, setIsExpanded] = useState(false);

  if (selectedIds.length === 0) return null;

  // Fetch full details of selected universities
  const selectedUnis = universities.filter((uni) => selectedIds.includes(uni.id));
  const comparisonGridColsClass =
    selectedUnis.length <= 1
      ? "md:grid-cols-2"
      : selectedUnis.length === 2
        ? "md:grid-cols-3"
        : selectedUnis.length === 3
          ? "md:grid-cols-4"
          : "md:grid-cols-5";

  // Visual Horizontal Fill Meter Component
  const MetricMeter = ({ value, label }: { value: number; label: string }) => {
    return (
      <div className="space-y-1.5 font-sans">
        <div className="flex justify-between text-[11px] font-medium text-slate-500">
          <span>{label}</span>
          <span className="font-mono font-bold text-slate-900">{value.toFixed(0)}/100</span>
        </div>
        {/* Flat fill bar - NO gradients */}
        <div className="h-2 w-full bg-slate-100 border border-slate-250">
          <div
            className="h-full bg-amber-700 transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Global Sticky Floating Dock (Bottom-6 on desktop, bottom-20 on mobile) */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 z-40 w-full max-w-2xl -translate-x-1/2 px-4 font-sans select-none">
        <div className="aur-panel border-slate-900/10 dark:border-cyber-yellow/20 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 truncate">
            {/* Action Icon */}
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center border border-slate-905 bg-slate-50 text-slate-800">
              <Shuffle className="h-4 sm:h-4.5 w-4 sm:w-4.5" />
            </div>

            {/* Micro Badge & Selected Counter */}
            <div className="truncate">
              <span className="inline-block text-[9px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-xs">
                Comparison Suite
              </span>
              <div className="text-[10px] sm:text-xs font-bold text-slate-900 mt-0.5 truncate">
                Comparing {selectedUnis.length} of 4 Universities
              </div>
            </div>

            {/* University Name Badges */}
            <div className="hidden sm:flex items-center space-x-2 shrink-0">
              {selectedUnis.map((uni) => (
                <span
                  key={uni.id}
                  className="inline-flex items-center text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-800 px-2 py-1"
                >
                  <span className="truncate max-w-[80px]">{uni.name.split(" ")[0]}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(uni.id)}
                    aria-label={`Remove ${uni.name} from comparison`}
                    className={`ml-1.5 hover:text-red-600 text-slate-400 ${focusRing}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 ml-2 sm:ml-4">
            <button
              type="button"
              onClick={onClearAll}
              className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-slate-900 transition-colors ${focusRing}`}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className={`inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors ${focusRing}`}
            >
              Compare
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full Overlay Comparison Matrix View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsExpanded(false)}
          />

          <div className="fixed inset-y-10 inset-x-4 md:inset-x-12 lg:inset-x-24 bg-white border border-slate-950 flex flex-col justify-between shadow-2xl z-50">
            
            {/* Matrix Header */}
            <div className="p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                    Analytical Comparison Model
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mt-0.5">
                    Side-by-Side Matrix
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close comparison"
                  className={`p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 ${focusRing}`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Matrix Scrollable Grid */}
            <div className="flex-1 overflow-auto p-6 bg-slate-50">
              <div className={`grid gap-6 grid-cols-1 ${comparisonGridColsClass}`}>
                
                {/* Metrics label Column (Optional/Responsive layout) */}
                <div className="hidden md:flex flex-col justify-between border-r border-slate-200 pr-6 pt-16 space-y-8 select-none">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Overall Standing</h4>
                    <p className="text-xs text-slate-500">Summary academic percentile score</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Citations Score</h4>
                    <p className="text-xs text-slate-500">Research citations count index</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Research Value</h4>
                    <p className="text-xs text-slate-500">Peer research output audit</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">Employability</h4>
                    <p className="text-xs text-slate-500">Corporate placement placement</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2">International Student Ratio</h4>
                    <p className="text-xs text-slate-500">Global diversity intake scale</p>
                  </div>
                </div>

                {/* University Data Cards columns */}
                {selectedUnis.map((uni) => (
                  <div key={uni.id} className="border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      {/* Name & Region */}
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <div className="flex justify-between items-start">
                          <h4 
                            onClick={() => {
                              onUniversitySelect(uni.id);
                              setIsExpanded(false);
                            }}
                            className="font-sans text-sm font-bold text-slate-900 hover:text-amber-700 cursor-pointer transition-colors leading-tight truncate"
                          >
                            {uni.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemove(uni.id)}
                            aria-label={`Remove ${uni.name} from comparison`}
                            className={`text-slate-400 hover:text-red-600 ml-2 ${focusRing}`}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1 font-semibold uppercase">
                          {uni.location}
                        </span>
                      </div>

                      {/* Rank Indicator */}
                      <div className="mb-6 flex items-baseline space-x-2">
                        <span className="text-2xl font-serif font-bold text-slate-900">#{uni.history[0]}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Asia Standing</span>
                      </div>

                      {/* Dynamic Fill Meters (Tailwind visual progress) */}
                      <div className="space-y-6">
                        <MetricMeter value={uni.overall} label="Overall Percentile" />
                        <MetricMeter value={uni.citations} label="Citations Index" />
                        <MetricMeter value={uni.research} label="Research Output" />
                        <MetricMeter value={uni.employability} label="Employability Rate" />
                        <MetricMeter value={uni.intlStudents} label="International Diversity" />
                      </div>

                      {/* Metadata Table */}
                      <div className="mt-8 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Programs:</span>
                          <span className="text-slate-800 text-right truncate max-w-[150px]">
                            {uni.subjects.join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Languages:</span>
                          <span className="text-slate-800 text-right truncate max-w-[150px]">
                            {uni.languages.join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tuition Est:</span>
                          <span className="font-mono text-slate-900 font-semibold">{uni.tuition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          onUniversitySelect(uni.id);
                          setIsExpanded(false);
                        }}
                        className={`w-full text-center border border-slate-900 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors ${focusRing}`}
                      >
                        Deep-Dive Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Footer controls */}
            <div className="p-6 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                type="button"
                onClick={onClearAll}
                className={`text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors ${focusRing}`}
              >
                Clear All Matches
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className={`bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 hover:bg-slate-800 transition-colors border border-slate-900 ${focusRing}`}
              >
                Return to Analysis
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
