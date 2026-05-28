"use client";

import React, { useState } from "react";
import { useSidebar } from "../navigation/SidebarContext";
import { SIDEBAR_ITEMS, NavItem } from "../navigation/config";
import FilterPanel from "../filters/FilterPanel";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Home, Trophy, Settings, Bookmark } from "lucide-react";

export default function MobileMenu() {
  const {
    isMobileOpen,
    setIsMobileOpen,
    activeView,
    handleViewChange,
    theme,
  } = useSidebar();

  const [activeTab, setActiveTab] = useState<"menu" | "filters">("menu");

  const handleLinkClick = (item: NavItem) => {
    handleViewChange(item.view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Left Drawer (Sidebar & Filter Panel) */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex font-sans">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Slide-in Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`relative w-80 max-w-[85vw] h-full flex flex-col shadow-2xl z-10 ${
                theme === "dark"
                  ? "bg-cyber-dark border-r border-cyber-border/40 text-slate-100"
                  : "bg-white text-slate-900 border-r border-slate-200"
              }`}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 dark:border-cyber-border/40 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    ASIA UNIVERSITY <span className="text-amber-700 dark:text-cyber-yellow text-[10px] font-sans font-bold">PORTAL</span>
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Mobile Academic Lab
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Tab Headers (Menu vs Filters) */}
              <div className="flex border-b border-slate-200 dark:border-cyber-border/30">
                <button
                  onClick={() => setActiveTab("menu")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 text-center transition-colors ${
                    activeTab === "menu"
                      ? "border-amber-700 text-slate-900 dark:border-cyber-yellow dark:text-cyber-yellow"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  Menu
                </button>
                <button
                  onClick={() => setActiveTab("filters")}
                  className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 text-center transition-colors ${
                    activeTab === "filters"
                      ? "border-amber-700 text-slate-900 dark:border-cyber-yellow dark:text-cyber-yellow"
                      : "border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  }`}
                >
                  Filters
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === "menu" ? (
                  <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.view;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleLinkClick(item)}
                          className={`w-full flex items-center p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            isActive
                              ? "bg-slate-150 border border-slate-200 text-slate-900 dark:bg-cyber-yellow dark:text-cyber-black dark:border-transparent dark:shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-cyber-gray/30"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5 mr-3.5 shrink-0" />
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-amber-100 text-amber-900 dark:bg-cyber-black dark:text-cyber-yellow border dark:border-cyber-yellow/20">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                ) : (
                  <div className="pb-8">
                    <FilterPanel />
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-cyber-border/40 bg-slate-50 dark:bg-cyber-dark/50 text-[10px] text-center text-slate-400 uppercase tracking-widest font-mono">
                System Version: 2026.01
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Bottom Mobile Quick Navigation Pinned Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t z-40 transition-colors duration-200 ${
          theme === "dark"
            ? "bg-cyber-dark/85 border-cyber-border/40 text-slate-400 cyber-glass"
            : "bg-white/95 border-slate-200 text-slate-500"
        } pb-safe-bottom`}
      >
        <div className="h-full grid grid-cols-4 items-center max-w-lg mx-auto">
          {/* Item 1: Discovery Hub */}
          <button
            onClick={() => handleViewChange("home")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "home"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Home className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Discovery</span>
          </button>

          {/* Item 2: Rankings Engine */}
          <button
            onClick={() => handleViewChange("rankings")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "rankings"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Trophy className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Rankings</span>
          </button>

          {/* Item 3: Toggle Drawer Filters */}
          <button
            onClick={() => {
              setActiveTab("filters");
              setIsMobileOpen(true);
            }}
            className="flex flex-col items-center justify-center h-full hover:text-slate-800 dark:hover:text-white"
          >
            <SlidersHorizontal className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Filters</span>
          </button>

          {/* Item 4: Settings */}
          <button
            onClick={() => handleViewChange("settings")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "settings"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Settings className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}
