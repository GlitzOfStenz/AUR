"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import { SIDEBAR_ITEMS, NavItem } from "../navigation/config";


export default function Sidebar() {
  const {
    isCollapsed,
    setIsCollapsed,
    activeView,
    handleViewChange,
    theme,
  } = useSidebar();

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Helper to check if a navigation item matches the active view
  const isItemActive = (item: NavItem) => {
    return activeView === item.view;
  };

  const handleItemClick = (item: NavItem) => {
    handleViewChange(item.view);
  };

  // Expand sidebar and expand filters if clicked collapsed filter icon
  const handleFilterAccordionClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setIsFilterExpanded(true);
    } else {
      setIsFilterExpanded(!isFilterExpanded);
    }
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 border-r border-[var(--aur-border)] transition-all duration-300 z-30 select-none bg-[var(--aur-surface)] ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* 1. Sidebar Links Section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col justify-center space-y-1.5 scrollbar-thin">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item);

          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full flex items-center p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 relative z-10 cursor-pointer ${
                  isActive
                    ? "text-[var(--background)]"
                    : "text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] hover:bg-[var(--aur-hover)]"
                }`}
              >
                {/* Background highlight using Framer Motion for active state */}
                {isActive && (
                  <div
                    
                    className="absolute inset-0 bg-[var(--aur-text)] shadow-sm rounded-lg z-[-1]"
                    
                  />
                )}

                {/* Left Icon */}
                <div className={`shrink-0 ${isCollapsed ? "mx-auto" : "mr-3.5"}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>

                {/* Label text (hidden when collapsed) */}
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {/* Badge (e.g. "Live") */}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-[var(--aur-hover)] text-[var(--aur-text)] border border-[var(--aur-border)]">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Collapsed Hover Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5 rounded border border-[var(--aur-border)] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 text-[10px] font-bold uppercase tracking-widest shadow-lg bg-[var(--aur-surface)] text-[var(--aur-text)]">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 font-mono bg-[var(--aur-hover)] px-1 py-0.2 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}


      </div>

      {/* 3. Bottom Expand / Collapse Toggle Button */}
      <div className="p-4 pb-12 border-t border-[var(--aur-border)] flex justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg border transition-all duration-150 cursor-pointer border-[var(--aur-border)] text-[var(--aur-text-secondary)] hover:bg-[var(--aur-text)] hover:text-[var(--background)] hover:border-[var(--aur-text)]"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold tracking-widest px-1">
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>

      {/* Style tag helper for tooltip styling inside CSS */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: var(--aur-border-strong);
          border-radius: 2px;
        }
      `}</style>
    </aside>
  );
}
