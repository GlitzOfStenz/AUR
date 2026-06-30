"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Bell, Sun, Moon, Menu, X, ChevronDown, User, Shield, LogOut, Maximize2, Minimize2, SlidersHorizontal } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import { useToast } from "../feedback/ToastContext";
import { TOP_NAV_LINKS } from "../navigation/config";


export default function Navbar() {
  const { showToast } = useToast();
  const {
    theme,
    toggleTheme,
    isMobileOpen,
    setIsMobileOpen,
    activeView,
    handleViewChange,
    filters,
    setFilters,
  } = useSidebar();

  const [searchVal, setSearchVal] = useState(filters.searchQuery);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNavFilter, setShowNavFilter] = useState(false);

  const toggleFullscreen = () => {
    const docEl = document.documentElement as any;
    const doc = document as any;
    
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      const requestFullScreen = docEl.requestFullscreen || docEl.msRequestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen;
      if (requestFullScreen) {
        requestFullScreen.call(docEl).then(() => setIsFullscreen(true)).catch(() => {});
      }
    } else {
      const exitFullScreen = doc.exitFullscreen || doc.msExitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;
      if (exitFullScreen) {
        exitFullScreen.call(doc).then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Sync state if user presses Esc to exit fullscreen
  useEffect(() => {
    const handler = () => {
      const doc = document as any;
      const isFull = !!(doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement);
      setIsFullscreen(isFull);
    };
    
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    document.addEventListener("mozfullscreenchange", handler);
    document.addEventListener("MSFullscreenChange", handler);
    
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      document.removeEventListener("mozfullscreenchange", handler);
      document.removeEventListener("MSFullscreenChange", handler);
    };
  }, []);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navFilterRef = useRef<HTMLDivElement>(null);

  // Sync internal search state with context searchQuery
  useEffect(() => {
    setSearchVal(filters.searchQuery);
  }, [filters.searchQuery]);

  // Click outside menus to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (navFilterRef.current && !navFilterRef.current.contains(event.target as Node)) {
        setShowNavFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchVal }));
    handleViewChange("rankings"); // Direct user to rankings to see results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    // Instant search filtering
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--aur-border)] bg-[var(--aur-surface)]/95 backdrop-blur-xl" style={{ willChange: "transform", transform: "translateZ(0)" }}>
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          
          {/* Logo / Editorial Brand */}
<div
  onClick={() => handleViewChange("home")}
  className="flex h-16 items-center cursor-pointer shrink-0"
>
  <Image
    src="/logo.png"
    alt="Asia University Rankings"
    width={458}
    height={135}
    priority
    className="max-h-10 w-auto object-contain"
  />
</div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-1 h-full items-center">
            {TOP_NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;
              const isRankings = link.view === "rankings";
              return (
                <div key={link.label} className="relative group flex items-center">
                  <button
                    onClick={() => handleViewChange(link.view)}
                    className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 rounded-md ${
                      isActive
                        ? "text-[var(--aur-text)]"
                        : "text-[var(--aur-text-muted)] hover:text-[var(--aur-text)]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--aur-text)]"
                      />
                    )}
                  </button>
                  {/* Filter shortcut beside Rankings Engine */}
                  {isRankings && (
                    <div className="relative ml-0.5" ref={navFilterRef}>
                      <button
                        type="button"
                        onClick={() => setShowNavFilter(!showNavFilter)}
                        title="Open Quick Filters"
                        className={`p-1.5 rounded-md transition-colors duration-150 ${showNavFilter ? "bg-[var(--aur-surface-hover)] text-[var(--aur-text)]" : "text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] hover:bg-[var(--aur-hover)]"}`}
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                      </button>
                      
                      {showNavFilter && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-xl shadow-[var(--aur-shadow-lg)] p-4 z-50">
                          <h4 className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)] mb-3">Quick Filters</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-bold text-[var(--aur-text)] mb-1 block">Region/Country</label>
                              <select 
                                value={filters.country}
                                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                                className="w-full text-xs p-2 rounded-lg border border-[var(--aur-border)] bg-[var(--aur-surface-2)] text-[var(--aur-text)] focus:outline-none focus:border-[var(--aur-border-strong)]"
                              >
                                <option value="">All Regions</option>
                                <option value="Singapore">Singapore</option>
                                <option value="China">China</option>
                                <option value="Japan">Japan</option>
                                <option value="Uzbekistan">Uzbekistan</option>
                                <option value="India">India</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="text-[10px] font-bold text-[var(--aur-text)] mb-1 block">Max Tuition ($)</label>
                              <input 
                                type="range" 
                                min="0" max="50000" step="1000"
                                value={filters.tuitionRange[1]}
                                onChange={(e) => setFilters(prev => ({ ...prev, tuitionRange: [prev.tuitionRange[0], parseInt(e.target.value)] }))}
                                className="w-full accent-[var(--aur-text)]"
                              />
                              <div className="text-right text-[10px] font-mono text-[var(--aur-text-muted)] mt-1">${filters.tuitionRange[1].toLocaleString()}</div>
                            </div>
                            
                            <button 
                              onClick={() => { setShowNavFilter(false); handleViewChange("rankings"); }}
                              className="w-full py-2 mt-4 bg-[var(--aur-text)] text-[var(--background)] text-[10px] font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Apply & View Results
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search bar in center */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-grow max-w-md hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search across index..."
                className="w-full border border-[var(--aur-border)] bg-[var(--aur-surface-2)] px-4 py-1.5 pl-10 rounded-lg text-xs text-[var(--aur-text)] placeholder-[var(--aur-text-muted)] focus:outline-none focus:border-[var(--aur-text)] transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-2 h-4 w-4 text-[var(--aur-text-muted)]" />
            </div>
          </form>

          {/* Right Section Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors hover:bg-[var(--aur-hover)] rounded-lg"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors hover:bg-[var(--aur-hover)] rounded-lg"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="Open notifications"
                className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors hover:bg-[var(--aur-hover)] rounded-lg relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
              </button>

              <>
                {showNotifMenu && (
                  <div
                    
                    
                    
                    className="absolute right-0 mt-2.5 w-80 rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface)] shadow-xl py-2 z-50 text-xs text-[var(--aur-text-secondary)]"
                  >
                    <div className="px-4 py-2 border-b border-[var(--aur-border)] flex justify-between items-center font-bold">
                      <span className="text-[var(--aur-text)] uppercase tracking-wider text-[10px]">
                        Notifications
                      </span>
                      <span className="text-[10px] text-red-500">3 New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[
                        {
                          id: 1,
                          title: "QS Rankings 2026 Released",
                          time: "10 mins ago",
                          desc: "Explore updated analytical scores and recalculation models.",
                          isNew: true,
                        },
                        {
                          id: 2,
                          title: "Uzbekistan Medical Admission Open",
                          time: "2 hours ago",
                          desc: "Samarkand & Tashkent medical academies are accepting applications.",
                          isNew: true,
                        },
                        {
                          id: 3,
                          title: "Data Audit Log Completed",
                          time: "1 day ago",
                          desc: "All regional study models have been successfully audited.",
                          isNew: false,
                        },
                      ].map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 border-b border-[var(--aur-border)] hover:bg-[var(--aur-hover)] transition-colors ${
                            n.isNew ? "bg-[var(--aur-hover)]" : ""
                          }`}
                        >
                          <div className="flex justify-between font-semibold text-[var(--aur-text)]">
                            <span>{n.title}</span>
                            <span className="text-[9px] text-[var(--aur-text-muted)] font-normal">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-[var(--aur-text-muted)] mt-0.5 leading-normal">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative border-l border-[var(--aur-border)] pl-3" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Open profile menu"
                className="flex items-center space-x-1.5 focus:outline-none group"
              >
                <div className="h-8 w-8 rounded-lg bg-[var(--aur-text)] flex items-center justify-center text-[var(--background)] text-xs font-bold overflow-hidden">
                  US
                </div>
                <ChevronDown className="h-3 w-3 text-[var(--aur-text-muted)] group-hover:text-[var(--aur-text)] transition-colors" />
              </button>

              <>
                {showProfileMenu && (
                  <div
                    
                    
                    
                    className="absolute right-0 mt-2.5 w-48 rounded-xl border border-[var(--aur-border)] bg-[var(--aur-surface)] shadow-xl py-1.5 z-50 text-xs text-[var(--aur-text-secondary)]"
                  >
                    <div className="px-4 py-2 border-b border-[var(--aur-border)]">
                      <span className="block font-bold text-[var(--aur-text)]">Dr. John Doe</span>
                      <span className="block text-[10px] text-[var(--aur-text-muted)]">
                        j.doe@university.edu
                      </span>
                    </div>

                    {[
                      { label: "My Profile", icon: User, action: () => {} },
                      { label: "Admin Console", icon: Shield, action: () => handleViewChange("admin") },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.action();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[var(--aur-hover)] flex items-center space-x-2 transition-colors"
                      >
                        <item.icon className="h-3.5 w-3.5 text-[var(--aur-text-muted)]" />
                        <span>{item.label}</span>
                      </button>
                    ))}

                    <div className="border-t border-[var(--aur-border)] my-1"></div>

                    <button
                      onClick={() => {
                        handleViewChange("login");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </div>
                )}
              </>
            </div>

            {/* Mobile Hamburger menu */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="p-2 text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors hover:bg-[var(--aur-hover)] rounded-lg md:hidden"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
