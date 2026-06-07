"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowLeft, MapPin, Globe, BookOpen, GraduationCap, Building2, ChevronRight, Award, LineChart, Trophy, ExternalLink, Bookmark, Square } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_UNIVERSITIES } from "../data";

// Lazy load the heavy charting component
const TrendChart = dynamic(() => import("./TrendChart"), {
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray/40 text-slate-400 dark:text-slate-500 font-mono text-xs uppercase tracking-widest rounded-xl">
      Loading Analytics Engine...
    </div>
  ),
  ssr: false,
});

interface UniversityProfileProps {
  universityId: string;
  onBack: () => void;
  onViewChange: (view: string) => void;
  savedUniIds: string[];
  onToggleSave: (id: string) => void;
}

export default function UniversityProfile({ universityId, onBack, onViewChange, savedUniIds, onToggleSave }: UniversityProfileProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "admissions">("overview");

  const uni = MOCK_UNIVERSITIES.find((u) => u.id === universityId);
  const isShortlisted = savedUniIds?.includes(universityId) || false;

  if (!uni) {
    return (
      <div className="mx-auto w-full px-4 py-16 text-center font-sans">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">University Record Not Found</h2>
        <button onClick={onBack} className="mt-4 text-amber-700 dark:text-cyber-yellow hover:underline font-bold">Return to Rankings</button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans flex-grow animate-fadeIn">
      {/* Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors bg-white dark:bg-cyber-gray/30 border border-slate-200 dark:border-slate-800/60 px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Directory
        </button>
        
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
          Institutional Profile
        </span>
      </div>

      {/* Hero Section QS Style */}
      <div className="relative mb-24 rounded-2xl overflow-visible">
        {/* Banner Image */}
        <div className="relative h-[320px] w-full rounded-t-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
          <Image
            src={uni.campusPhoto}
            alt={`${uni.name} Campus`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Content inside banner */}
          <div className="absolute bottom-[4.5rem] left-0 right-0 px-6 sm:px-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-white">
            <div className="h-28 w-28 bg-white rounded-xl shadow-lg border-[6px] border-white overflow-hidden shrink-0">
               {/* Use the campus photo as a placeholder for logo */}
               <Image
                 src={uni.campusPhoto}
                 alt={`${uni.name} Logo`}
                 width={112}
                 height={112}
                 className="object-cover w-full h-full"
               />
            </div>
            <div className="flex-grow flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-1">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tracking-tight mb-2 text-white">{uni.name}</h1>
                <div className="flex items-center gap-2 text-sm text-slate-300 justify-center md:justify-start">
                  <MapPin className="h-4 w-4" />
                  {uni.location}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-0">
                <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 py-2.5 rounded text-sm transition-colors shadow-sm">
                  Apply to this University with QS
                </button>
                <button 
                  onClick={() => onToggleSave(universityId)}
                  className={`${isShortlisted ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400" : "bg-white hover:bg-slate-100 text-slate-700 dark:bg-cyber-gray dark:text-slate-300 dark:hover:bg-slate-800"} font-semibold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors shadow-sm`}>
                  <Bookmark className={`h-4 w-4 ${isShortlisted ? "fill-current" : ""}`} /> {isShortlisted ? "Shortlisted" : "Shortlist"}
                </button>
                <button 
                  onClick={() => onViewChange("rankings")}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-semibold px-4 py-2.5 rounded text-sm flex items-center gap-2 transition-colors shadow-sm">
                  <Square className="h-4 w-4" /> Compare
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Overlapping Stat Cards */}
        <div className="absolute -bottom-10 left-0 right-0 px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Card 1 */}
           <div className="bg-white dark:bg-cyber-gray border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center">
             <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                #={uni.history[0] || uni.qsSubjectRankings?.[0]?.worldRank || 587}
             </span>
             <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">QS World University Rankings</span>
           </div>
           {/* Card 2 */}
           <div className="bg-white dark:bg-cyber-gray border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center">
             <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {uni.subjects.length * 15}
             </span>
             <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Undergrad & Postgrad Programmes</span>
           </div>
           {/* Card 3 */}
           <div className="bg-white dark:bg-cyber-gray border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg flex flex-col items-center justify-center text-center">
             <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {uni.internationalStudents || 12}%
             </span>
             <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">International students</span>
           </div>
        </div>
      </div>

      {/* Accessible Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 mb-10 flex overflow-x-auto hide-scrollbar">
        {[
          { id: "overview", label: "Overview & Context", icon: Building2 },
          { id: "metrics", label: "QS Academic Metrics", icon: LineChart },
          { id: "admissions", label: "Admissions & Programs", icon: GraduationCap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center whitespace-nowrap border-b-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors -mb-[1px] ${
              activeTab === tab.id
                ? "border-amber-700 dark:border-cyber-yellow text-slate-900 dark:text-white"
                : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <tab.icon className={`h-4 w-4 mr-2.5 ${activeTab === tab.id ? "text-amber-700 dark:text-cyber-yellow" : "text-slate-400 dark:text-slate-600"}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[400px]">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-4">Institutional Profile</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                {uni.description}
              </p>
              
              <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">Regional Context & Infrastructure</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8">
                Located in the heart of {uni.location}, this institution benefits from robust regional infrastructure and deep academic networks. 
                International students frequently choose this destination for its unique blend of cultural heritage and advanced research facilities. 
                {uni.hasMedicine && " Its medical faculties are internationally recognized, providing rigorous clinical instruction tailored for global medical practice."}
              </p>

              {/* TopUniversities style Subject Ranking Highlights */}
              {uni.qsSubjectRankings && uni.qsSubjectRankings.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-white">QS World University Rankings by Subject</h4>
                    <Trophy className="h-5 w-5 text-amber-700 dark:text-cyber-yellow" />
                  </div>
                  
                  <div className="space-y-3">
                    {uni.qsSubjectRankings.map((qs, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-cyber-gray/30 border border-slate-200 dark:border-slate-800/60 rounded-xl hover:border-amber-300 dark:hover:border-cyber-yellow/40 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-cyber-black border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-amber-700 dark:group-hover:text-cyber-yellow transition-colors" />
                          </div>
                          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{qs.subject}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-0.5">World Rank</span>
                            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">#{qs.worldRank}</span>
                          </div>
                          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                          <div className="text-right w-16">
                            <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold mb-0.5">Score</span>
                            <span className="font-mono text-sm font-bold text-amber-700 dark:text-cyber-yellow">{qs.score.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-cyber-gray/20 rounded-2xl p-6 self-start sticky top-24">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  Fast Facts
                  <ExternalLink className="h-3.5 w-3.5" />
                </h4>
                <ul className="space-y-5">
                  <li>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Location</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-amber-700 dark:text-cyber-yellow" />
                      {uni.location}
                    </span>
                  </li>
                  <li>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Primary Language</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{uni.languages[0]}</span>
                  </li>
                  <li>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Est. Tuition (Intl)</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-white dark:bg-cyber-black px-2 py-1 rounded border border-slate-200 dark:border-slate-800 inline-block">{uni.tuition}</span>
                  </li>
                  {uni.academicReputation && (
                    <li>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-1">Academic Reputation</span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">{uni.academicReputation.toFixed(1)} / 100</span>
                    </li>
                  )}
                </ul>

                {/* Core Metrics Visual Bar Chart */}
                <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                    Core Metrics Profile
                  </h5>
                  <div className="space-y-4">
                    {[
                      { label: "Academic Reputation", value: uni.academicReputation || uni.research, color: "from-amber-500 to-amber-700 dark:from-cyber-yellow dark:to-amber-500" },
                      { label: "Employer Reputation", value: uni.employerReputation || uni.employability, color: "from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500" },
                      { label: "Citations per Faculty", value: uni.citations, color: "from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500" },
                      { label: "Faculty/Student Ratio", value: uni.facultyStudentRatio || uni.teaching, color: "from-rose-500 to-red-600 dark:from-rose-400 dark:to-red-500" },
                      { label: "International Students", value: uni.intlStudents, color: "from-purple-500 to-violet-600 dark:from-purple-400 dark:to-violet-500" }
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-[11px] font-medium mb-1.5">
                          <span className="text-slate-500 dark:text-slate-400">{metric.label}</span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{metric.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-cyber-black rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini-line chart showing 5-Year Rank progression inside sidebar */}
                <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-5">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
                    5-Year Ranking Progression
                  </h5>
                  <div className="bg-white dark:bg-cyber-black/40 rounded-xl border border-slate-150 dark:border-slate-800/50 p-3 h-28 flex items-end justify-between gap-1.5 relative overflow-hidden">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-40">
                      <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full h-px" />
                      <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full h-px" />
                      <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full h-px" />
                    </div>
                    {/* Render visual trend bars representing ranks */}
                    {uni.history.map((rank, index) => {
                      const maxRank = Math.max(...uni.history, 10);
                      const minRank = Math.min(...uni.history, 1);
                      // Invert because rank 1 (lowest number) is the best/highest bar
                      const pct = 15 + ((maxRank - rank) / (maxRank - minRank || 1)) * 75;
                      const year = 2026 - index;

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group/bar z-10">
                          <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 opacity-0 group-hover/bar:opacity-100 transition-opacity mb-1 bg-slate-900 text-white dark:bg-cyber-yellow dark:text-cyber-black px-1 rounded absolute -top-4">
                            #{rank}
                          </span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${pct}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="w-full bg-slate-200 dark:bg-slate-800 group-hover/bar:bg-amber-600 dark:group-hover/bar:bg-cyber-yellow rounded-t-sm transition-colors cursor-pointer"
                          />
                          <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 mt-1.5 scale-90">
                            '{String(year).slice(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QS Academic Metrics Tab (Includes Lazy Chart) */}
        {activeTab === "metrics" && (
          <div className="space-y-10 animate-fadeIn">
            
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">QS Intelligence Unit Metrics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                Scores are compiled using the latest Global Employer Survey, Academic Reputation Index, and Scopus/Elsevier citation data.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Overall Score", value: uni.overall, highlight: true },
                { label: "Academic Rep", value: uni.academicReputation || uni.research },
                { label: "Employer Rep", value: uni.employerReputation || uni.employability },
                { label: "Citations/Faculty", value: uni.citations },
                { label: "Faculty/Student", value: uni.facultyStudentRatio || uni.teaching },
                { label: "Intl Students", value: uni.intlStudents },
              ].map((metric, idx) => (
                <div key={idx} className={`border rounded-xl p-5 flex flex-col justify-between ${
                  metric.highlight 
                    ? "border-amber-300 dark:border-cyber-yellow/50 bg-amber-50/50 dark:bg-cyber-yellow/10" 
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray/30"
                }`}>
                  <span className={`block text-[9px] uppercase font-bold tracking-widest mb-3 ${
                    metric.highlight ? "text-amber-800 dark:text-cyber-yellow" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    {metric.label}
                  </span>
                  <span className={`text-2xl font-black font-mono ${
                    metric.highlight ? "text-amber-700 dark:text-cyber-yellow-bright" : "text-slate-900 dark:text-white"
                  }`}>
                    {metric.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-cyber-gray/20 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">5-Year Rank Progression</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1">Historical Performance</p>
                </div>
                <LineChart className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </div>
              {/* Lazy Loaded Chart */}
              <div className="bg-slate-50/50 dark:bg-cyber-black rounded-xl border border-slate-100 dark:border-slate-800/50 p-4">
                <TrendChart history={uni.history} />
              </div>
            </div>
            
          </div>
        )}

        {/* Admissions & Programs Tab */}
        {activeTab === "admissions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-fadeIn">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-cyber-yellow/10 border border-amber-200 dark:border-cyber-yellow/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-amber-700 dark:text-cyber-yellow" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Core Faculties</h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-800/60 rounded-xl bg-white dark:bg-cyber-gray/30 overflow-hidden">
                {uni.subjects.map((sub, idx) => (
                  <li key={idx} className="px-5 py-4 flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-cyber-dark/40 transition-colors cursor-default">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-cyber-yellow mr-3"></div>
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-cyber-yellow/10 border border-amber-200 dark:border-cyber-yellow/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-amber-700 dark:text-cyber-yellow" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">Featured Degree Programs</h3>
              </div>
              <ul className="space-y-3">
                {uni.programs.map((prog, idx) => (
                  <li key={idx} className="p-4 border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-cyber-gray/30 rounded-xl flex items-center justify-between group cursor-pointer hover:border-amber-300 dark:hover:border-cyber-yellow/40 hover:shadow-md transition-all">
                    <span className="text-sm text-slate-800 dark:text-slate-200 font-semibold group-hover:text-amber-700 dark:group-hover:text-cyber-yellow transition-colors">
                      {prog}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono group-hover:text-amber-700 dark:group-hover:text-cyber-yellow flex items-center gap-1">
                      Details
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
