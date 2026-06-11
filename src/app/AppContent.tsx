"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import MobileMenu from "./components/mobile/MobileMenu";
import Homepage from "./components/Homepage";
import RankingsEngine from "./components/RankingsEngine";
import UniversityProfile from "./components/UniversityProfile";
import Footer from "./components/Footer";
import FloatingChatAssistant from "./components/FloatingChatAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
>>>>>>> navdeep/main
import { useSidebar } from "./components/navigation/SidebarContext";
import { Article, MOCK_UNIVERSITIES } from "./data";
import { BarChart3, Bookmark, Award, GraduationCap, CheckCircle, ShieldAlert } from "lucide-react";
import { BarChart3, Bookmark, Award, GraduationCap, CheckCircle, ShieldAlert } from "lucide-react";

export default function AppContent() {
  const searchParams = useSearchParams();

<<<<<<< HEAD
  const {
    activeView,
    handleViewChange,
    selectedUniId,
    setSelectedUniId,
    selectedUniIds,
    handleToggleCompare,
    handleRemoveCompare,
  } = useSidebar();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [selectedUniIds, setSelectedUniIds] = useState<string[]>([]);
  const [savedUniIds, setSavedUniIds] = useState<string[]>([]);
>>>>>>> navdeep/main

  // Local settings toggles state
  const [settingsAutoRecalc, setSettingsAutoRecalc] = useState(true);
  const [settingsRealtimeSearch, setSettingsRealtimeSearch] = useState(true);
  const [settingsAnalyticsTelemetry, setSettingsAnalyticsTelemetry] = useState(false);

  // Derived state from URL (synced with context)
  const view = activeView;
  const id = selectedUniId;

  const handleToggleCompare = (uniId: string) => {
    setSelectedUniIds((prev) => {
      if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
      if (prev.length >= 4) {
        alert("You can compare a maximum of 4 universities at a time.");
        return prev;
      }
      return [...prev, uniId];
    });
  };

  const handleRemoveCompare = (uniId: string) => {
    setSelectedUniIds((prev) => prev.filter((id) => id !== uniId));
  };

  const handleClearCompare = () => {
    setSelectedUniIds([]);
  };

  const handleToggleSave = (uniId: string) => {
    setSavedUniIds((prev) => {
      if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
      return [...prev, uniId];
    });
  };

>>>>>>> navdeep/main
  const handleUniversitySelect = (uniId: string) => {
    setSelectedUniId(uniId);
  };

  const handleBackToRankings = () => {
    setSelectedUniId(null);
  };

  const handleArticleSelect = (article: Article) => {
    router.push(`/blogs/${article.id}`);
  };

  // Get selected universities for Saved view
  const savedUniversities = MOCK_UNIVERSITIES.filter((u) => savedUniIds.includes(u.id));

  return (
    <div className={`relative overflow-x-hidden flex min-h-screen flex-col transition-colors duration-300 ${
      theme === "dark" ? "bg-cyber-black text-slate-100 dark" : "bg-white text-slate-900"
    }`}>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Core Layout Layout */}
      <div className="flex-grow flex w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
        
        {/* Collapsible Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 p-4 pb-28 md:pb-6">
          
          {view === "home" && (
            <Homepage
              onSearchSubmit={(q) => setSearchQuery(q)}
              onUniversitySelect={handleUniversitySelect}
              onArticleSelect={handleArticleSelect}
              onViewChange={handleViewChange}
            />
          )}

<<<<<<< HEAD
      {view === "rankings" && (
        <RankingsEngine
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedUniIds={selectedUniIds}
          onToggleCompare={handleToggleCompare}
          onUniversitySelect={handleUniversitySelect}
        />
      )}
=======
      {/* Main Core Layout Layout */}
      <div className="flex-grow flex w-full w-full mx-auto px-0 sm:px-4 lg:px-8 mt-6">
        
        {/* Collapsible Left Sidebar */}
        <Sidebar />
>>>>>>> navdeep/main

      {view === "profile" && id && (
        <UniversityProfile
          universityId={id}
          onBack={handleBackToRankings}
          onViewChange={handleViewChange}
        />
      )}

<<<<<<< HEAD
      {/* 1. Analytics Mock Panel */}
      {view === "analytics" && (
        <div className="p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
              Academic Intelligence
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Institutional Analytics Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Real-time telemetric aggregation across audited South, East, and Central Asian university databases.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Index Institutions", val: "45", desc: "Audited & Verified", icon: GraduationCap },
              { title: "Average Score", val: "84.6%", desc: "Calculated overall metrics", icon: BarChart3 },
              { title: "Top Region", val: "China / Japan", desc: "Highest citation output", icon: Award },
              { title: "Medicine Programs", val: "62%", desc: "Offer English MD courses", icon: CheckCircle },
            ].map((stat) => (
              <div
                key={stat.title}
                className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg flex items-center justify-between shadow-xs hover:border-slate-350 dark:hover:border-cyber-yellow/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                    {stat.title}
                  </span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">
                    {stat.val}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-550 block mt-0.5">
                    {stat.desc}
                  </span>
                </div>
                <stat.icon className="h-8 w-8 text-slate-300 dark:text-cyber-yellow/20" />
              </div>
            ))}
          </div>

          {/* Mock Chart Section */}
          <div className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-4">
              Citation Density Output Index (5-Year Progression)
            </span>
            <div className="h-48 w-full flex items-end justify-between gap-2 pt-4">
              {[45, 62, 58, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
=======
          {view === "universities" && (
            <UniversitiesList
              onUniversitySelect={handleUniversitySelect}
              onViewChange={handleViewChange}
              savedUniIds={savedUniIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {view === "rankings" && (
            <RankingsEngine
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedUniIds={selectedUniIds}
              onToggleCompare={handleToggleCompare}
              savedUniIds={savedUniIds}
              onToggleSave={handleToggleSave}
              onUniversitySelect={handleUniversitySelect}
            />
          )}

          {view === "profile" && id && (
            <UniversityProfile
              universityId={id}
              onBack={handleBackToRankings}
              onViewChange={handleViewChange}
              savedUniIds={savedUniIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {/* Analytics Dashboard */}
          {view === "analytics" && <AnalyticsDashboard />}

          {/* 2. Saved Items Mock Panel */}
          {view === "saved" && (
            <div className="w-full mx-auto w-full p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
                  Personal Database
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Shortlisted Universities
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  List of institutions currently shortlisted for further analysis.
                </p>
              </div>

              {savedUniversities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedUniversities.map((uni) => (
                    <div
                      key={uni.id}
                      onClick={() => handleUniversitySelect(uni.id)}
                      className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg hover:border-slate-350 dark:hover:border-cyber-yellow transition-all duration-150 cursor-pointer flex justify-between items-center group"
                    >
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-cyber-yellow transition-colors">
                          {uni.name}
                        </h4>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500 block mt-1">
                          {uni.location} • {uni.tuition}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-lg font-bold text-slate-900 dark:text-white block">
                          {uni.overall.toFixed(1)}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                          Score
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                  <Bookmark className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No universities are currently added to comparison.
                  </p>
                  <button
                    onClick={() => handleViewChange("rankings")}
                    className="mt-4 inline-flex items-center justify-center border border-slate-900 dark:border-cyber-yellow bg-slate-900 dark:bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white dark:text-cyber-yellow hover:bg-slate-800 dark:hover:bg-cyber-yellow dark:hover:text-cyber-black transition-colors"
                  >
                    Go to Rankings Engine
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. Settings Mock Panel */}
          {view === "settings" && (
            <div className="w-full mx-auto w-full p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
                  System Diagnostics
                </span>
                <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Engine Configuration Console
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Configure real-time arithmetic models, indexing parameters, and telemetric UI modules.
                </p>
              </div>

              {/* Toggles List */}
              <div className="space-y-4 max-w-xl">
                {[
                  {
                    title: "Automatic Recalculations",
                    desc: "Instantly re-evaluate all institution rankings as weights variables are adjusted.",
                    state: settingsAutoRecalc,
                    setter: setSettingsAutoRecalc,
                  },
                  {
                    title: "Real-time Search Queries",
                    desc: "Perform dynamic matching algorithm searches as letters are keyed in.",
                    state: settingsRealtimeSearch,
                    setter: setSettingsRealtimeSearch,
                  },
                  {
                    title: "Advanced Analytics Telemetry",
                    desc: "Aggregate diagnostic logging data and rendering benchmarks for support.",
                    state: settingsAnalyticsTelemetry,
                    setter: setSettingsAnalyticsTelemetry,
                  },
                ].map((option) => (
>>>>>>> navdeep/main
                  <div
                    className="w-full bg-slate-900 dark:bg-cyber-yellow rounded-t transition-all duration-500 hover:brightness-110"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-550 mt-1">
                    {2022 + i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Saved Items Mock Panel */}
      {view === "saved" && (
        <div className="p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
              Personal Database
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Saved Comparison Nodes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              List of institutions currently pinned inside the analysis comparators dock.
            </p>
          </div>

          {savedUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedUniversities.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => handleUniversitySelect(uni.id)}
                  className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg hover:border-slate-350 dark:hover:border-cyber-yellow transition-all duration-150 cursor-pointer flex justify-between items-center group"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-cyber-yellow transition-colors">
                      {uni.name}
                    </h4>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 block mt-1">
                      {uni.location} • {uni.tuition}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg font-bold text-slate-900 dark:text-white block">
                      {uni.overall.toFixed(1)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-550 block">
                      Score
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
              <Bookmark className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No universities are currently added to comparison.
              </p>
              <button
                onClick={() => handleViewChange("rankings")}
                className="mt-4 inline-flex items-center justify-center border border-slate-900 dark:border-cyber-yellow bg-slate-900 dark:bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white dark:text-cyber-yellow hover:bg-slate-800 dark:hover:bg-cyber-yellow dark:hover:text-cyber-black transition-colors"
              >
                Go to Rankings Engine
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Settings Mock Panel */}
      {view === "settings" && (
        <div className="p-6 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
              System Diagnostics
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Engine Configuration Console
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Configure real-time arithmetic models, indexing parameters, and telemetric UI modules.
            </p>
          </div>

          {/* Toggles List */}
          <div className="space-y-4 max-w-xl">
            {[
              {
                title: "Automatic Recalculations",
                desc: "Instantly re-evaluate all institution rankings as weights variables are adjusted.",
                state: settingsAutoRecalc,
                setter: setSettingsAutoRecalc,
              },
              {
                title: "Real-time Search Queries",
                desc: "Perform dynamic matching algorithm searches as letters are keyed in.",
                state: settingsRealtimeSearch,
                setter: setSettingsRealtimeSearch,
              },
              {
                title: "Advanced Analytics Telemetry",
                desc: "Aggregate diagnostic logging data and rendering benchmarks for support.",
                state: settingsAnalyticsTelemetry,
                setter: setSettingsAnalyticsTelemetry,
              },
            ].map((option) => (
              <div
                key={option.title}
                className="p-4 border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-cyber-gray rounded-lg flex items-center justify-between"
              >
                <div className="pr-4">
                  <span className="block font-bold text-sm text-slate-900 dark:text-white">
                    {option.title}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                    {option.desc}
                  </span>
                </div>

                {/* Switch Button */}
                <button
                  onClick={() => option.setter(!option.state)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    option.state
                      ? "bg-slate-900 dark:bg-cyber-yellow"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-cyber-black shadow-xs ring-0 transition duration-200 ease-in-out ${
                      option.state ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Reset Database Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 max-w-xl">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-cyber-yellow mb-2">
              <ShieldAlert className="h-4.5 w-4.5" />
              <span className="font-bold text-xs uppercase tracking-wider">Danger Zone</span>
            </div>
<<<<<<< HEAD
            <button
              onClick={() => {
                if (confirm("Reset layout configs and clear filters?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-750 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:border-red-900 dark:text-red-400 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
            >
              Reset Local Storage Cache
            </button>
          </div>
=======
          )}

        </main>
      </div>

      {/* Mobile Responsive Navigation Drawer & Bottom Bar */}
      <MobileMenu />

      <FloatingChatAssistant />

      <ComparisonDock
        selectedIds={selectedUniIds}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onUniversitySelect={handleUniversitySelect}
      />

      <Footer />
    </div>
  );
}
