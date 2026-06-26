"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import { SIDEBAR_ITEMS, NavItem } from "../navigation/config";
import { motion } from "framer-motion";

export default function Sidebar() {
  const {
    isCollapsed,
    setIsCollapsed,
    activeView,
    handleViewChange,
    theme,
  } = useSidebar();

  // Helper to check if a navigation item matches the active view
  const isItemActive = (item: NavItem) => {
    return activeView === item.view;
  };

  const handleItemClick = (item: NavItem) => {
    handleViewChange(item.view);
  };

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r transition-all duration-300 z-30 select-none ${
        isCollapsed ? "w-20" : "w-64"
      } ${
        theme === "dark"
          ? "bg-cyber-dark/40 border-cyber-border/40 cyber-glass"
          : "bg-white border-slate-200"
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
                    ? "text-slate-900 dark:text-cyber-black"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-cyber-gray/30"
                }`}
              >
                {/* Background highlight using Framer Motion for active state */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActiveBackground"
                    className="absolute inset-0 bg-white shadow-sm border border-slate-200 dark:border-transparent dark:bg-cyber-yellow dark:shadow-[0_0_12px_rgba(234,179,8,0.2)] rounded-lg z-[-1]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
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
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-amber-100 text-amber-900 dark:bg-cyber-black dark:text-cyber-yellow-bright border dark:border-cyber-yellow/20">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Collapsed Hover Tooltip */}
              {isCollapsed && (
                <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2.5 py-1.5 rounded border pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                  theme === 'dark'
                    ? 'bg-cyber-gray border-cyber-yellow/20 text-cyber-yellow-bright'
                    : 'bg-slate-900 border-slate-900 text-white'
                }`}>
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 font-mono bg-amber-500/10 px-1 py-0.2 rounded">
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
      <div className="p-4 pb-12 border-t border-slate-200 dark:border-cyber-border/40 flex justify-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
            theme === "dark"
              ? "bg-cyber-gray border-cyber-border/30 text-cyber-yellow hover:bg-cyber-yellow hover:text-cyber-black"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
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
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }
        html.dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(234, 179, 8, 0.1);
        }
      `}</style>
    </aside>
  );
}
