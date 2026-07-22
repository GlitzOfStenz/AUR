"use client";

import React, { useState } from "react";
import { useSidebar } from "../navigation/SidebarContext";
import { SIDEBAR_ITEMS, NavItem } from "../navigation/config";
import FilterPanel from "../filters/FilterPanel";

import { X, SlidersHorizontal, Home, Trophy, Settings, LogIn, UserPlus } from "lucide-react";

interface MobileMenuProps {
  isAuthenticated?: boolean;
  onLogIn?: () => void;
  onSignUp?: () => void;
}

export default function MobileMenu({
  isAuthenticated = true,
  onLogIn,
  onSignUp,
}: MobileMenuProps) {
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyber-yellow dark:focus-visible:ring-offset-cyber-black";
  const {
    activeView,
    handleViewChange,
    isMobileOpen,
    setIsMobileOpen,
  } = useSidebar();

  const [activeTab, setActiveTab] = useState<"menu" | "filters">("menu");

  const handleLinkClick = (item: NavItem) => {
    handleViewChange(item.view);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* 1. Mobile Left Drawer (Sidebar & Filter Panel) */}
      <>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex font-sans">
            
            {/* Backdrop Blur Overlay */}
            <div
              
              
              
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Slide-in Drawer Content */}
            <div
              
              
              
              
              className="relative w-80 max-w-[85vw] h-full flex flex-col shadow-2xl z-10 bg-[var(--aur-surface)] text-[var(--aur-text)] border-r border-[var(--aur-border)]"
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
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                  className={`p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray ${focusRing}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Tab Headers (Menu vs Filters) */}
              <div className="flex border-b border-slate-200 dark:border-cyber-border/30">
                <button
                  type="button"
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
                  type="button"
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
                    {SIDEBAR_ITEMS.filter((item) => isAuthenticated || item.view === "home").map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.view;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleLinkClick(item)}
                          className={`w-full flex items-center p-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                            isActive
                              ? "bg-slate-150 border border-slate-200 text-slate-900 dark:bg-cyber-yellow dark:text-cyber-black dark:border-transparent dark:shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-cyber-gray/30"
                          } ${focusRing}`}
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
            </div>
          </div>
        )}
      </>

      {/* 2. Bottom Mobile Quick Navigation Pinned Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t z-40 transition-colors duration-200 bg-[var(--aur-surface)]/95 border-[var(--aur-border)] text-[var(--aur-text-muted)] pb-safe-bottom backdrop-blur-md"
      >
        <div className={`h-full grid ${isAuthenticated ? "grid-cols-4" : "grid-cols-3"} items-center max-w-lg mx-auto`}>
          {/* Item 1: Discovery Hub */}
          <button
            type="button"
            onClick={() => handleViewChange("home")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "home"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            } ${focusRing}`}
          >
            <Home className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Overview</span>
          </button>

          {isAuthenticated ? <>
          {/* Item 2: Prestige Rankings */}
          <button
            type="button"
            onClick={() => handleViewChange("rankings")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "rankings"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            } ${focusRing}`}
          >
            <Trophy className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Rankings</span>
          </button>

          {/* Item 3: Toggle Drawer Filters */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("filters");
              setIsMobileOpen(true);
            }}
            className={`flex flex-col items-center justify-center h-full hover:text-slate-800 dark:hover:text-white ${focusRing}`}
          >
            <SlidersHorizontal className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Filters</span>
          </button>

          {/* Item 4: Settings */}
          <button
            type="button"
            onClick={() => handleViewChange("settings")}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              activeView === "settings"
                ? "text-amber-700 dark:text-cyber-yellow"
                : "hover:text-slate-800 dark:hover:text-white"
            } ${focusRing}`}
          >
            <Settings className="h-4.5 w-4.5 mb-1" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Settings</span>
          </button>

          </> : <>
            <button type="button" onClick={onLogIn} className={`flex h-full flex-col items-center justify-center ${focusRing}`}>
              <LogIn className="mb-1 h-4.5 w-4.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Log In</span>
            </button>
            <button type="button" onClick={onSignUp} className={`flex h-full flex-col items-center justify-center ${focusRing}`}>
              <UserPlus className="mb-1 h-4.5 w-4.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Sign Up</span>
            </button>
          </>}

        </div>
      </nav>
    </>
  );
}
