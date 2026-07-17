"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Navbar from "./components/navbar/Navbar";
import MobileMenu from "./components/mobile/MobileMenu";
import Homepage from "./components/Homepage";
import RankingsEngine from "./components/RankingsEngine";
import InstitutionDirectory from "./components/InstitutionDirectory";
import ComparisonDock from "./components/ComparisonDock";
import ComparisonMatrix from "./components/ComparisonMatrix";
import UniversityProfile from "./components/UniversityProfile";
import Footer from "./components/Footer";
import FloatingChatAssistant from "./components/FloatingChatAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import AdminConsole from "./components/AdminConsole";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import UniversitiesList from "./components/UniversitiesList";
import Methodology from "./components/Methodology";
import EventsAndAwards from "./components/EventsAndAwards";
import FacultyStudentAwards from "./components/FacultyStudentAwards";
import Membership from "./components/Membership";
import { useSidebar } from "./components/navigation/SidebarContext";
import { useUniversityData } from "./components/data/UniversityDataProvider";
import { Article, MOCK_UNIVERSITIES } from "./data";
import { Bookmark, ShieldAlert } from "lucide-react";
import Sidebar from "./components/sidebar/Sidebar";
import { API_BASE_URL } from "./lib/universities";

export default function AppContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { universities } = useUniversityData();

  const {
    activeView,
    handleViewChange,
    selectedUniId,
    setSelectedUniId,
    selectedUniIds,
    handleToggleCompare,
    handleRemoveCompare,
    handleClearCompare,
    isCollapsed,
    searchQuery,
    setSearchQuery,
  } = useSidebar();


const [savedUniIds, setSavedUniIds] = useState<string[]>([]);
const [uniDirectory, setUniDirectory] = useState<{ id: string; name: string }[]>([]);
const [bookmarkMap, setBookmarkMap] = useState<Record<string, string>>({}); // realUuid -> slugId (reverse lookup for display)

// Local settings toggles state
const [settingsAutoRecalc, setSettingsAutoRecalc] = useState(true);
const [settingsRealtimeSearch, setSettingsRealtimeSearch] = useState(true);
const [settingsAnalyticsTelemetry, setSettingsAnalyticsTelemetry] = useState(false);

// Load real preferences on mount (only if logged in)
useEffect(() => {
  const token = sessionStorage.getItem("aur_access_token");
  if (!token) return;
  fetch(`${API_BASE_URL}/users/preferences`, { headers: getAuthHeaders() })
    .then((res) => res.json())
    .then((prefs) => {
      if (typeof prefs.autoRecalc === "boolean") setSettingsAutoRecalc(prefs.autoRecalc);
      if (typeof prefs.realtimeSearch === "boolean") setSettingsRealtimeSearch(prefs.realtimeSearch);
      if (typeof prefs.analyticsTelemetry === "boolean") setSettingsAnalyticsTelemetry(prefs.analyticsTelemetry);
    })
    .catch((err) => console.error("Failed to load preferences", err));
}, []);

const updatePreference = async (key: string, value: boolean) => {
  const token = sessionStorage.getItem("aur_access_token");
  if (!token) return;
  try {
    await fetch(`${API_BASE_URL}/users/preferences`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [key]: value }),
    });
  } catch (err) {
    console.error("Failed to update preference", err);
  }
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("aur_access_token")}`,
});

// Load university directory (slug name -> real UUID) once
useEffect(() => {
  fetch(`${API_BASE_URL}/api/universities/directory`)
    .then((res) => res.json())
    .then((data) => setUniDirectory(data))
    .catch((err) => console.error("Failed to load university directory", err));
}, []);

// Load real bookmarks on mount (only if logged in)
useEffect(() => {
  const token = sessionStorage.getItem("aur_access_token");
  if (!token) return;
  fetch(`${API_BASE_URL}/users/bookmarks`, { headers: getAuthHeaders() })
    .then((res) => res.json())
    .then((data) => {
  // data.bookmarks: [{ university_id: uuid, ... }]
  const uuidToSlug: Record<string, string> = {};
  const slugIds: string[] = [];
  (data.bookmarks || []).forEach((b: any) => {
        const match = uniDirectory.find((d) => d.id === b.university_id);
        if (match) {
          const slugMatch = universities.find((u) => u.name === match.name);
          if (slugMatch) {
            slugIds.push(slugMatch.id);
            uuidToSlug[b.university_id] = slugMatch.id;
          }
        }
      });
      setSavedUniIds(slugIds);
      setBookmarkMap(uuidToSlug);
    })
    .catch((err) => console.error("Failed to load bookmarks", err));
}, [uniDirectory, universities]);
  // Derived state from URL (synced with context)
  const view = activeView;
  const id = selectedUniId;

  // A key to force AnimatePresence re-mount on view change
  const viewKey = view + (id ?? "");

  const handleToggleSave = async (uniId: string) => {
  const token = sessionStorage.getItem("aur_access_token");
  if (!token) {
    handleViewChange("login");
    return;
  }

  const isCurrentlySaved = savedUniIds.includes(uniId);
  const slugUni = universities.find((u) => u.id === uniId);
  const directoryMatch = slugUni
    ? uniDirectory.find((d) => d.name === slugUni.name)
    : null;

  if (!directoryMatch) {
    console.error("No matching directory entry found for", uniId);
    return;
  }

  try {
    if (isCurrentlySaved) {
      await fetch(`${API_BASE_URL}/users/bookmarks/${directoryMatch.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      setSavedUniIds((prev) => prev.filter((id) => id !== uniId));
    } else {
      await fetch(`${API_BASE_URL}/users/bookmarks`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ university_id: directoryMatch.id }),
      });
      setSavedUniIds((prev) => [...prev, uniId]);
    }
  } catch (err) {
    console.error("Failed to toggle bookmark", err);
  }
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
  const savedUniversities = universities.filter((u) => savedUniIds.includes(u.id));

  // Show sidebar for non-home views
  const showSidebar = view !== "home" && view !== "login" && view !== "admin";

  return (
    <div className={`${view === "home" ? "bg-gradient-to-b from-amber-50/50 via-white to-blue-50 dark:bg-none dark:bg-cyber-black" : "aur-page"} flex min-h-screen flex-col transition-colors duration-300`}>
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

          {view === "universities" && (
            <InstitutionDirectory
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

          {/* Membership */}
          {view === "membership" && <Membership />}

          {/* Events & Awards */}
          {view === "events" && <EventsAndAwards />}

          {/* Faculty & Student Awards */}
          {view === "faculty-awards" && <FacultyStudentAwards />}

          {/* Admin Console */}
          {view === "admin" && <AdminConsole />}

          {/* Login View */}
          {view === "login" && <Login />}

          {/* User Dashboard (Combines Saved & Settings) */}
          {view === "settings" && (
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
  if (key === "autoRecalc") { setSettingsAutoRecalc(val); updatePreference("autoRecalc", val); }
  if (key === "realtimeSearch") { setSettingsRealtimeSearch(val); updatePreference("realtimeSearch", val); }
  if (key === "analyticsTelemetry") { setSettingsAnalyticsTelemetry(val); updatePreference("analyticsTelemetry", val); }
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

          {/* 2. Comparison Matrix */}
          {view === "saved" && <ComparisonMatrix />}

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
