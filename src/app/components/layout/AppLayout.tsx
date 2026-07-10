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
        theme === "bg-white text-slate-900"
      }`}
    >
      {/* Top Navigation Bar */}
      <Navbar />

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
      <MobileMenu />

      <FloatingChatAssistant />

      <ComparisonDock
        selectedIds={selectedUniIds}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearCompare}
        onUniversitySelect={handleUniversitySelect}
      />


    </div>
  );
}
