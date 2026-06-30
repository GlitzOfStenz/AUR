"use client";

import React from "react";


const METRICS = [
  { label: "Academic Reputation", value: 30 },
  { label: "Citations", value: 25 },
  { label: "Employability", value: 20 },
  { label: "International Faculty", value: 15 },
  { label: "Teaching Quality", value: 10 },
];

const TREND = [18, 14, 11, 7, 4];

export default function UniversityRankingVisuals() {
  return (
    <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-cyber-gray">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-cyber-yellow">
          Ranking Intelligence
        </span>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
          Methodology Snapshot
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {METRICS.map((metric) => (
            <div key={metric.label}>
              <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>{metric.label}</span>
                <span>{metric.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-amber-700 dark:bg-cyber-yellow"
                  
                  
                  
                  
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-end gap-3 rounded-lg bg-slate-50 p-4 dark:bg-cyber-dark">
          {TREND.map((rank, index) => (
            <div key={rank} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t bg-slate-900 dark:bg-cyber-yellow"
                
                
                
                
              />
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                #{rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
