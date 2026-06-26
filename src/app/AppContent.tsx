"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import MobileMenu from "./components/mobile/MobileMenu";
import Homepage from "./components/Homepage";
import RankingsEngine from "./components/RankingsEngine";
import ComparisonDock from "./components/ComparisonDock";
import UniversityProfile from "./components/UniversityProfile";
import Footer from "./components/Footer";
import FloatingChatAssistant from "./components/FloatingChatAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { useSidebar } from "./components/navigation/SidebarContext";
import { Article, MOCK_UNIVERSITIES } from "./data";
import { Bookmark, ShieldAlert } from "lucide-react";

export default function AppContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    activeView,
    handleViewChange,
    selectedUniId,
    setSelectedUniId,
    selectedUniIds,
    handleToggleCompare,
    handleRemoveCompare,
    handleClearCompare,
    theme,
  } = useSidebar();

  const showSidebar = pathname !== "/" || activeView !== "home";

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") ?? "");
  const [savedUniIds, setSavedUniIds] = useState<string[]>([]);

  // Local settings toggles state
  const [settingsAutoRecalc, setSettingsAutoRecalc] = useState(true);
  const [settingsRealtimeSearch, setSettingsRealtimeSearch] = useState(true);
  const [settingsAnalyticsTelemetry, setSettingsAnalyticsTelemetry] = useState(false);

  // Derived state from URL (synced with context)
  const view = activeView;
  const id = selectedUniId;

  // A key to force AnimatePresence re-mount on view change
  const viewKey = view + (id ?? "");

  const handleToggleSave = (uniId: string) => {
    setSavedUniIds((prev) =>
      prev.includes(uniId) ? prev.filter((id) => id !== uniId) : [...prev, uniId]
    );
  };

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
    <div className={`${view === "home" ? "bg-gradient-to-b from-amber-50/50 via-white to-blue-50" : "aur-page"} flex min-h-screen flex-col transition-colors duration-300 ${
      theme === "dark" && view !== "home" ? "text-slate-100 dark" : "text-slate-900"
    }`}>
      {/* Top Navigation Bar */}
      <Navbar showSidebar={showSidebar} />

      {/* Main Core Layout Layout */}
      <div className={`flex-grow flex w-full mx-auto ${showSidebar ? "max-w-7xl px-0 sm:px-4 lg:px-8" : "max-w-none px-0"}`}>
        
        {/* Collapsible Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col min-w-0 pb-20 md:pb-6 w-full mx-auto ${showSidebar ? "p-4 max-w-[1600px]" : "p-0 max-w-none"}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col flex-grow"
            >
          {view === "home" && (
            <Homepage
              onSearchSubmit={(q) => setSearchQuery(q)}
              onUniversitySelect={handleUniversitySelect}
              onArticleSelect={handleArticleSelect}
              onViewChange={handleViewChange}
            />
          )}

          {view === "rankings" && (
            <RankingsEngine
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              selectedUniIds={selectedUniIds}
              onToggleCompare={handleToggleCompare}
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
            </div>
          )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Responsive Navigation Drawer & Bottom Bar */}
      <MobileMenu showSidebar={showSidebar} />

      <ComparisonDock
        selectedIds={selectedUniIds}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onUniversitySelect={handleUniversitySelect}
      />

      <FloatingChatAssistant />

      <footer className="border-t border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-dark/80 py-8 transition-colors duration-200">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
          © 2026 Asia University Rankings | Official Analytical Data Engine
        </div>
      </footer>
    </div>
  );
}
