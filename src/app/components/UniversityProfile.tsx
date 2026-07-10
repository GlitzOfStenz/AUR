"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowLeft, MapPin, Globe, BookOpen, GraduationCap, Building2,
  ChevronRight, Award, LineChart, Trophy, ExternalLink, Bookmark,
  Square, Users, CalendarDays, Percent, BadgeCheck, BookMarked, X
} from "lucide-react";

import { useUniversityData } from "./data/UniversityDataProvider";

// Lazy load the heavy charting component
const TrendChart = dynamic(() => import("./TrendChart"), {
  loading: () => (
    <div className="w-full h-[300px] flex items-center justify-center border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text-muted)] font-mono text-xs uppercase tracking-widest rounded-xl">
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
  const { universities } = useUniversityData();
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "admissions">("overview");
  
  // Eligibility State
  const [showEligibility, setShowEligibility] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<null | { chance: number, message: string }>(null);

  const uni = universities.find((u) => u.id === universityId);
  const isShortlisted = savedUniIds?.includes(universityId) || false;

  if (!uni) {
    return (
      <div className="mx-auto w-full px-4 py-16 text-center font-sans">
        <h2 className="text-2xl font-bold text-[var(--aur-text)]">University Record Not Found</h2>
        <button onClick={onBack} className="mt-4 text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] font-bold">Return to Rankings</button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full pb-16 font-sans flex-grow animate-fadeIn bg-[var(--background)]">
      
      {/* Top Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between border-b border-[var(--aur-border)] bg-[var(--aur-surface)]/80 backdrop-blur-md sticky top-0 z-40">
        <button
          onClick={onBack}
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] transition-colors bg-[var(--aur-surface-hover)] border border-[var(--aur-border)] px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Directory
        </button>
        
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">
          Institutional Profile
        </span>
      </div>

      {/* Hero Section */}
      <div className="relative mb-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative h-[380px] w-full rounded-3xl overflow-hidden bg-[var(--aur-surface-2)] shadow-[var(--aur-shadow)]">
          <Image
            src={uni.campusPhoto}
            alt={`${uni.name} Campus`}
            fill
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/40 to-transparent" />
          
          {/* Content inside banner */}
          <div className="absolute bottom-16 left-0 right-0 px-8 sm:px-12 flex flex-col md:flex-row items-center md:items-end gap-8 text-white">
            <div className="h-32 w-32 bg-[var(--aur-surface)] rounded-2xl shadow-2xl border-4 border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
               <Image
                 src={uni.campusPhoto}
                 alt={`${uni.name} Logo`}
                 width={128}
                 height={128}
                 className="object-cover w-full h-full opacity-80 mix-blend-luminosity"
               />
            </div>
            <div className="flex-grow flex flex-col md:flex-row justify-between items-center md:items-end w-full pb-2">
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight mb-3 text-white drop-shadow-md">
                  {uni.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-white/80 justify-center md:justify-start font-medium">
                  <MapPin className="h-4 w-4 opacity-80" />
                  {uni.location}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6 md:mt-0">
                <button 
                  onClick={() => onToggleSave(universityId)}
                  className={`${isShortlisted ? "bg-red-500 text-white" : "bg-black/50 hover:bg-black/70 text-white border border-white/20"} font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm`}>
                  <Bookmark className={`h-4 w-4 ${isShortlisted ? "fill-current" : ""}`} /> {isShortlisted ? "Saved" : "Save"}
                </button>
                <button 
                  onClick={() => onViewChange("rankings")}
                  className="bg-black/50 hover:bg-black/70 text-white border border-white/20 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg backdrop-blur-sm">
                  <Square className="h-4 w-4" /> Compare
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Overlapping Stat Cards */}
        <div className="absolute -bottom-12 left-0 right-0 px-10 sm:px-16 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl p-6 shadow-[var(--aur-shadow)] flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
             <span className="text-3xl lg:text-4xl font-serif font-bold text-[var(--aur-text)] mb-2">
                #={uni.history[0] || uni.qsSubjectRankings?.[0]?.worldRank || 587}
             </span>
             <span className="text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold">QS World Rank</span>
           </div>
           <div className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl p-6 shadow-[var(--aur-shadow)] flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
             <span className="text-3xl lg:text-4xl font-serif font-bold text-[var(--aur-text)] mb-2">
                {uni.subjects.length * 15}
             </span>
             <span className="text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold">Total Programmes</span>
           </div>
           <div className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl p-6 shadow-[var(--aur-shadow)] flex flex-col items-center justify-center text-center transform transition-transform hover:-translate-y-1">
             <span className="text-3xl lg:text-4xl font-serif font-bold text-[var(--aur-text)] mb-2">
                {uni.intlStudents || 12}%
             </span>
             <span className="text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold">Intl Students</span>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Accessible Tab Navigation */}
        <div className="border-b border-[var(--aur-border)] mb-12 flex overflow-x-auto hide-scrollbar gap-8">
          {[
            { id: "overview", label: "Overview & Context", icon: Building2 },
            { id: "metrics", label: "Academic Metrics", icon: LineChart },
            { id: "admissions", label: "Admissions", icon: GraduationCap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center whitespace-nowrap border-b-2 pb-4 text-xs font-bold uppercase tracking-widest transition-all -mb-[1px] ${
                activeTab === tab.id
                  ? "border-[var(--aur-text)] text-[var(--aur-text)]"
                  : "border-transparent text-[var(--aur-text-muted)] hover:text-[var(--aur-text-secondary)] hover:border-[var(--aur-border-strong)]"
              }`}
            >
              <tab.icon className={`h-4 w-4 mr-2.5 ${activeTab === tab.id ? "text-[var(--aur-text)]" : "text-[var(--aur-text-muted)]"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h3 className="font-serif text-3xl font-bold text-[var(--aur-text)] mb-6">Institutional Profile</h3>
                <p className="text-[var(--aur-text-secondary)] text-base leading-relaxed mb-10">
                  {uni.description}
                </p>
                
                <h4 className="font-serif text-2xl font-bold text-[var(--aur-text)] mb-6">Regional Context & Infrastructure</h4>
                <p className="text-[var(--aur-text-secondary)] text-base leading-relaxed mb-12">
                  Located in the heart of {uni.location}, this institution benefits from robust regional infrastructure and deep academic networks. 
                  International students frequently choose this destination for its unique blend of cultural heritage and advanced research facilities. 
                  {uni.hasMedicine && " Its medical faculties are internationally recognized, providing rigorous clinical instruction tailored for global medical practice."}
                </p>

                {/* Subject Ranking Highlights */}
                {uni.qsSubjectRankings && uni.qsSubjectRankings.length > 0 && (
                  <div className="mt-12 bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-3xl p-8 shadow-[var(--aur-shadow-sm)]">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--aur-border)]">
                      <h4 className="font-serif text-2xl font-bold text-[var(--aur-text)]">Rankings by Subject</h4>
                      <Trophy className="h-6 w-6 text-[var(--aur-text-muted)]" />
                    </div>
                    
                    <div className="space-y-4">
                      {uni.qsSubjectRankings.map((qs, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-2xl hover:border-[var(--aur-border-strong)] transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-[var(--aur-surface)] border border-[var(--aur-border)] flex items-center justify-center shadow-sm">
                              <BookOpen className="h-5 w-5 text-[var(--aur-text-secondary)] group-hover:text-[var(--aur-text)] transition-colors" />
                            </div>
                            <span className="font-bold text-sm text-[var(--aur-text)]">{qs.subject}</span>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="block text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold mb-1">World Rank</span>
                              <span className="font-mono text-lg font-bold text-[var(--aur-text)]">#{qs.worldRank}</span>
                            </div>
                            <div className="w-px h-10 bg-[var(--aur-border)]"></div>
                            <div className="text-right min-w-[4rem]">
                              <span className="block text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold mb-1">Score</span>
                              <span className="font-mono text-lg font-bold text-[var(--aur-text)]">{qs.score.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="border border-[var(--aur-border)] bg-[var(--aur-surface)] rounded-3xl p-8 sticky top-28 shadow-[var(--aur-shadow)]">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mb-6 border-b border-[var(--aur-border)] pb-4 flex items-center justify-between">
                    Fast Facts
                    <ExternalLink className="h-4 w-4" />
                  </h4>
                  <ul className="space-y-6">
                    <li>
                      <span className="block text-[10px] text-[var(--aur-text-muted)] uppercase tracking-wider mb-2">Location</span>
                      <span className="text-sm font-bold text-[var(--aur-text)] flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                        {uni.location}
                      </span>
                    </li>
                    <li>
                      <span className="block text-[10px] text-[var(--aur-text-muted)] uppercase tracking-wider mb-2">Primary Language</span>
                      <span className="text-sm font-bold text-[var(--aur-text)]">{uni.languages[0]}</span>
                    </li>
                    <li>
                      <span className="block text-[10px] text-[var(--aur-text-muted)] uppercase tracking-wider mb-2">Est. Tuition (Intl)</span>
                      <span className="text-sm font-bold text-[var(--aur-text)] font-mono bg-[var(--aur-surface-2)] px-3 py-1.5 rounded-lg border border-[var(--aur-border)] inline-block">{uni.tuition}</span>
                    </li>
                  </ul>

                  {/* Core Metrics Visual Bar Chart */}
                  <div className="mt-8 border-t border-[var(--aur-border)] pt-6">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mb-5">
                      Core Metrics
                    </h5>
                    <div className="space-y-5">
                      {[
                        { label: "Academic Reputation", value: uni.academicReputation || uni.research },
                        { label: "Employer Reputation", value: uni.employerReputation || uni.employability },
                        { label: "Citations per Faculty", value: uni.citations },
                        { label: "Faculty/Student Ratio", value: uni.facultyStudentRatio || uni.teaching },
                        { label: "International Students", value: uni.intlStudents }
                      ].map((metric) => (
                        <div key={metric.label}>
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-[var(--aur-text-secondary)]">{metric.label}</span>
                            <span className="font-mono text-[var(--aur-text)]">{metric.value.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-[var(--aur-surface-hover)] rounded-full overflow-hidden border border-[var(--aur-border)]">
                            <div
                              
                              
                              
                              className="h-full bg-[var(--aur-text)] rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === "metrics" && (
            <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
              
              <div className="text-center mb-10">
                <h3 className="font-serif text-3xl font-bold text-[var(--aur-text)] mb-4">Academic Intelligence Metrics</h3>
                <p className="text-sm text-[var(--aur-text-secondary)] max-w-2xl mx-auto leading-relaxed">
                  Scores are aggregated from the Global Employer Survey, Academic Reputation Index, and peer-reviewed citation registries to ensure maximum fidelity.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Overall Score", value: uni.overall, highlight: true },
                  { label: "Academic Rep", value: uni.academicReputation || uni.research },
                  { label: "Employer Rep", value: uni.employerReputation || uni.employability },
                  { label: "Citations/Faculty", value: uni.citations },
                  { label: "Faculty/Student", value: uni.facultyStudentRatio || uni.teaching },
                  { label: "Intl Students", value: uni.intlStudents },
                ].map((metric, idx) => (
                  <div key={idx} className={`rounded-3xl p-8 flex flex-col justify-between shadow-sm transition-transform hover:-translate-y-1 ${
                    metric.highlight 
                      ? "bg-[var(--aur-text)] text-[var(--background)]" 
                      : "border border-[var(--aur-border)] bg-[var(--aur-surface)]"
                  }`}>
                    <span className={`block text-[10px] uppercase font-bold tracking-widest mb-4 ${
                      metric.highlight ? "text-[var(--background)] opacity-70" : "text-[var(--aur-text-muted)]"
                    }`}>
                      {metric.label}
                    </span>
                    <span className={`text-4xl font-black font-serif ${
                      metric.highlight ? "text-[var(--background)]" : "text-[var(--aur-text)]"
                    }`}>
                      {metric.value.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border border-[var(--aur-border)] rounded-3xl bg-[var(--aur-surface)] p-8 sm:p-10 shadow-[var(--aur-shadow-sm)] mt-12">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h4 className="font-serif text-2xl font-bold text-[var(--aur-text)]">5-Year Rank Progression</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)] mt-2">Historical Performance Chart</p>
                  </div>
                  <LineChart className="h-6 w-6 text-[var(--aur-text-muted)]" />
                </div>
                {/* Lazy Loaded Chart */}
                <div className="bg-[var(--aur-surface-2)] rounded-2xl border border-[var(--aur-border)] p-6">
                  <TrendChart history={uni.history} />
                </div>
              </div>
            </div>
          )}

          {/* Admissions & Programs Tab */}
          {activeTab === "admissions" && (
            <div className="space-y-10 animate-fadeIn max-w-5xl mx-auto">

              {/* ── Key Admission Facts ── only shown when data exists ── */}
              {(uni.acceptanceRate || uni.applicationDeadline || uni.founded || uni.studentCount || uni.scholarshipDetails) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {uni.acceptanceRate !== undefined && (
                    <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] flex flex-col gap-2">
                      <div className="h-9 w-9 rounded-xl bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center mb-1">
                        <Percent className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)]">Acceptance Rate</span>
                      <span className="text-2xl font-black font-mono text-[var(--aur-text)]">{uni.acceptanceRate}%</span>
                    </div>
                  )}
                  {uni.founded !== undefined && (
                    <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] flex flex-col gap-2">
                      <div className="h-9 w-9 rounded-xl bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center mb-1">
                        <Award className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)]">Established</span>
                      <span className="text-2xl font-black font-mono text-[var(--aur-text)]">{uni.founded}</span>
                    </div>
                  )}
                  {uni.studentCount !== undefined && (
                    <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] flex flex-col gap-2">
                      <div className="h-9 w-9 rounded-xl bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)]">Students</span>
                      <span className="text-2xl font-black font-mono text-[var(--aur-text)]">{uni.studentCount.toLocaleString()}</span>
                    </div>
                  )}
                  {uni.applicationDeadline && (
                    <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] flex flex-col gap-2">
                      <div className="h-9 w-9 rounded-xl bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center mb-1">
                        <CalendarDays className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)]">Application Deadline</span>
                      <span className="text-sm font-bold text-[var(--aur-text)] leading-tight">{uni.applicationDeadline}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── Scholarship Banner ── */}
              {uni.scholarshipDetails && (
                <div className="flex gap-4 p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)]">
                  <div className="h-10 w-10 rounded-xl bg-[var(--aur-surface)] border border-[var(--aur-border)] flex items-center justify-center shrink-0">
                    <BadgeCheck className="h-5 w-5 text-[var(--aur-text)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mb-1">Financial Aid & Scholarships</p>
                    <p className="text-sm text-[var(--aur-text-secondary)] leading-relaxed">{uni.scholarshipDetails}</p>
                  </div>
                </div>
              )}

              {/* ── Faculties + Programs ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--aur-surface-hover)] border border-[var(--aur-border)] flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-[var(--aur-text)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--aur-text)]">Core Faculties</h3>
                  </div>
                  <ul className="divide-y divide-[var(--aur-border)] border border-[var(--aur-border)] rounded-3xl bg-[var(--aur-surface)] overflow-hidden shadow-sm">
                    {uni.subjects.map((sub, idx) => (
                      <li key={idx} className="px-6 py-5 flex items-center text-sm font-bold text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] transition-colors">
                        <div className="h-2 w-2 rounded-full bg-[var(--aur-text)] opacity-40 mr-4" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[var(--aur-surface-hover)] border border-[var(--aur-border)] flex items-center justify-center">
                      <BookMarked className="h-5 w-5 text-[var(--aur-text)]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[var(--aur-text)]">Featured Programs</h3>
                  </div>
                  <ul className="space-y-3">
                    {uni.programs.map((prog, idx) => (
                      <li
                        key={idx}
                        className="p-5 border border-[var(--aur-border)] bg-[var(--aur-surface)] rounded-2xl flex items-center justify-between group cursor-pointer hover:border-[var(--aur-border-strong)] hover:shadow-[var(--aur-shadow-sm)] transition-all"
                      >
                        <span className="text-sm text-[var(--aur-text)] font-bold">{prog}</span>
                        <span className="text-[10px] text-[var(--aur-text-muted)] uppercase tracking-widest font-bold flex items-center gap-1.5 group-hover:text-[var(--aur-text)] transition-colors shrink-0 ml-4">
                          Details <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Eligibility Check Feature ── */}
              <div className="bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[var(--aur-shadow-sm)]">
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-[var(--aur-surface-2)] border border-[var(--aur-border)] p-3 rounded-xl text-[var(--aur-text)]">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-serif text-[var(--aur-text)] leading-tight">Eligibility Predictor</h3>
                      <p className="text-xs text-[var(--aur-text-muted)] mt-1 font-medium tracking-wide">Enter your marks and exam scores to check your chances at {uni.name}.</p>
                    </div>
                  </div>
                  
                  {!showEligibility && !eligibilityResult && (
                    <button 
                      onClick={() => setShowEligibility(true)}
                      className="bg-[var(--aur-text)] text-[var(--background)] hover:opacity-80 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-md shrink-0 w-full md:w-auto text-center"
                    >
                      Calculate Chances
                    </button>
                  )}
                </div>

                {showEligibility && !eligibilityResult && (
                  <div className="animate-fadeIn mt-8 pt-6 border-t border-[var(--aur-border)] relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">Current Academic Marks</label>
                        <input type="text" placeholder="e.g. 92% or 3.8 GPA" className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--aur-text)] placeholder-[var(--aur-text-muted)] focus:outline-none focus:border-[var(--aur-text)] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">Standardized Exam (Optional)</label>
                        <input type="text" placeholder="e.g. SAT 1450" className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--aur-text)] placeholder-[var(--aur-text-muted)] focus:outline-none focus:border-[var(--aur-text)] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-[var(--aur-text-muted)] mb-2 ml-1">English Proficiency</label>
                        <select className="w-full bg-[var(--aur-surface-2)] border border-[var(--aur-border)] rounded-xl px-4 py-3 text-sm font-bold text-[var(--aur-text)] focus:outline-none focus:border-[var(--aur-text)] transition-colors cursor-pointer appearance-none">
                          <option>IELTS (7.0+)</option>
                          <option>TOEFL (100+)</option>
                          <option>None / Pending</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowEligibility(false)}
                        className="font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl border border-[var(--aur-border)] text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setShowEligibility(false);
                          setEligibilityResult({
                            chance: Math.floor(Math.random() * 40) + 50, // Mock percentage between 50-90%
                            message: "Your academic profile is competitive. To maximize your chances, focus on highlighting your extracurricular achievements and securing strong letters of recommendation."
                          });
                        }}
                        className="bg-[var(--aur-text)] text-[var(--background)] hover:opacity-80 font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-xl transition-all shadow-md"
                      >
                        Analyze Profile
                      </button>
                    </div>
                  </div>
                )}

                {eligibilityResult && (
                  <div className="animate-fadeIn mt-6 pt-6 border-t border-[var(--aur-border)] relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[var(--aur-surface-2)]" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${eligibilityResult.chance * 2.83} 283`} className="text-[#10b981]" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-[var(--aur-text)]">{eligibilityResult.chance}%</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-bold text-lg text-[var(--aur-text)] mb-2">Estimated Admission Chance</h4>
                      <p className="text-[var(--aur-text-secondary)] text-sm leading-relaxed mb-4">{eligibilityResult.message}</p>
                      <button 
                        onClick={() => {
                          setEligibilityResult(null);
                          setShowEligibility(true);
                        }}
                        className="text-[11px] font-bold uppercase tracking-wider text-[#10b981] hover:text-white bg-[#10b981]/10 hover:bg-[#10b981] px-5 py-2.5 rounded-lg transition-all border border-[#10b981]/20 inline-flex items-center gap-2"
                      >
                        Recalculate <ArrowLeft className="w-3 h-3 rotate-180" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Languages of Instruction ── */}
              <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] flex flex-wrap gap-3 items-center">
                <Globe className="h-4 w-4 text-[var(--aur-text-muted)] shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mr-2">Languages of Instruction</span>
                {uni.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--aur-border-strong)] bg-[var(--aur-surface-2)] text-[var(--aur-text)]"
                  >
                    {lang}
                  </span>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
