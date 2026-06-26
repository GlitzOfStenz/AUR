"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import MobileMenu from "../mobile/MobileMenu";
import FloatingChatAssistant from "../FloatingChatAssistant";
import ComparisonDock from "../ComparisonDock";
import { useSidebar } from "../navigation/SidebarContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/";

  const {
    theme,
    selectedUniIds,
    handleRemoveCompare,
    handleClearCompare,
    setSelectedUniId,
  } = useSidebar();

  const handleUniversitySelect = (uniId: string) => {
    setSelectedUniId(uniId);
  };

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-cyber-black text-slate-100 dark" : "bg-white text-slate-900"
      }`}
    >
      {/* Top Navigation Bar */}
      <Navbar showSidebar={showSidebar} />

      {/* Main Core Layout */}
      <div className={`flex-grow flex w-full mx-auto ${showSidebar ? "max-w-7xl px-0 sm:px-4 lg:px-8" : "max-w-none px-0"}`}>
        {/* Collapsible Left Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 p-4 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Responsive Navigation Drawer & Bottom Bar */}
      <MobileMenu showSidebar={showSidebar} />

      <FloatingChatAssistant />

      <ComparisonDock
        selectedIds={selectedUniIds}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onUniversitySelect={handleUniversitySelect}
      />

      {/* Universal Footer */}
      <footer className="border-t border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-dark/80 py-8 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
          © 2026 Asia University Rankings | Official Analytical Data Engine
        </div>
      </footer>
    </div>
  );
}
