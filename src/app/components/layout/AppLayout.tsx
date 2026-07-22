"use client";

import React from "react";
import Navbar from "../navbar/Navbar";
import MobileMenu from "../mobile/MobileMenu";
import FloatingChatAssistant from "../FloatingChatAssistant";
import ComparisonDock from "../ComparisonDock";
import { useSidebar } from "../navigation/SidebarContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const {
    selectedUniIds,
    handleRemoveCompare,
    handleClearCompare,
    setSelectedUniId,
    handleViewChange,
  } = useSidebar();

  const handleUniversitySelect = (uniId: string) => {
    setSelectedUniId(uniId);
    handleViewChange("university-profile");
  };

  return (
    <div
      className="flex min-h-screen flex-col transition-colors duration-300"
    >
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Core Layout */}
      <div className="flex w-full grow mx-auto max-w-none px-0">
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
