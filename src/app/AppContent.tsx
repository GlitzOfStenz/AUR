"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
import AdminConsole from "./components/AdminConsole";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import UniversitiesList from "./components/UniversitiesList";
import Methodology from "./components/Methodology";
import { useSidebar } from "./components/navigation/SidebarContext";
import { Article, MOCK_UNIVERSITIES } from "./data";
import { Bookmark, ShieldAlert } from "lucide-react";

export default function AppContent() {
  const router = useRouter();
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
    isCollapsed,
  } = useSidebar();

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

  // Show sidebar for non-home views
  const showSidebar = view !== "home" && view !== "login" && view !== "admin";

  return (
    <div className={`${view === "home" ? "bg-gradient-to-b from-amber-50/50 via-white to-blue-50 dark:bg-none dark:bg-cyber-black" : "aur-page"} flex min-h-screen flex-col transition-colors duration-300 ${
      theme === "dark" ? "text-slate-100 dark" : "text-slate-900"
    }`}>
      {/* Top Navigation Bar */}
      {view !== "login" && view !== "admin" && <Navbar />}

      {/* Main Core Layout */}
      <div className="flex-grow flex w-full">
        
        {/* Collapsible Left Sidebar — shown on non-home views */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area — Full Width */}
        <main
          className={`flex-1 flex flex-col min-w-0 pb-20 md:pb-0 ${
            view === "home" || view === "login" || view === "admin" ? "p-0" : "px-4 pt-4 lg:px-8 lg:pt-8"
          }`}
          style={{ isolation: "isolate" }}
        >
          <>
            <div
              key={viewKey}
              
              
              
              
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

          {view === "universities" && (
            <UniversitiesList
              onUniversitySelect={handleUniversitySelect}
              onViewChange={handleViewChange}
              savedUniIds={savedUniIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {(view === "rankings" || view === "countries") && (
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

          {/* Methodology */}
          {view === "methodology" && <Methodology />}

          {/* Admin Console */}
          {view === "admin" && <AdminConsole />}

          {/* Login View */}
          {view === "login" && <Login />}

          {/* User Dashboard (Combines Saved & Settings) */}
          {(view === "saved" || view === "settings") && (
            <UserDashboard
              savedUniversities={savedUniversities}
              onUniversitySelect={handleUniversitySelect}
              onNavigateToRankings={() => handleViewChange("rankings")}
              settings={{
                autoRecalc: settingsAutoRecalc,
                realtimeSearch: settingsRealtimeSearch,
                analyticsTelemetry: settingsAnalyticsTelemetry,
              }}
              onSettingsChange={(key, val) => {
                if (key === "autoRecalc") setSettingsAutoRecalc(val);
                if (key === "realtimeSearch") setSettingsRealtimeSearch(val);
                if (key === "analyticsTelemetry") setSettingsAnalyticsTelemetry(val);
              }}
              onResetCache={() => {
                if (confirm("Reset  configs and clear filters?")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              onSignOut={() => handleViewChange("login")}
            />
          )}

            </div>
          </>
        </main>
      </div>

      {/* Mobile Responsive Navigation Drawer & Bottom Bar */}
      {view !== "login" && view !== "admin" && <MobileMenu />}

      {view !== "login" && view !== "admin" && (
        <ComparisonDock
          selectedIds={selectedUniIds}
          onRemove={handleRemoveCompare}
          onClearAll={handleClearCompare}
          onUniversitySelect={handleUniversitySelect}
        />
      )}

      {view !== "login" && view !== "admin" && <FloatingChatAssistant />}


    </div>
  );
}
