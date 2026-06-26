"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Menu, X, ChevronDown, User, Shield, LogOut } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import { useToast } from "../feedback/ToastContext";
import { TOP_NAV_LINKS } from "../navigation/config";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  showSidebar?: boolean;
}

export default function Navbar({ showSidebar = true }: NavbarProps) {
  const { showToast } = useToast();
  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-cyber-yellow dark:focus-visible:ring-offset-cyber-black";
  const {
    theme,
    toggleTheme,
    isMobileOpen,
    setIsMobileOpen,
    activeView,
    handleViewChange,
    searchQuery,
    setSearchQuery,
  } = useSidebar();

  const [searchVal, setSearchVal] = useState(searchQuery);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync internal search state with context searchQuery
  useEffect(() => {
    setSearchVal(searchQuery);
  }, [searchQuery]);

  // Click outside menus to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchVal);
    handleViewChange("rankings"); // Direct user to rankings to see results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    // Instant search filtering
    setSearchQuery(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-cyber-border bg-white/90 dark:bg-cyber-dark/90 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:shadow-[0_1px_0_rgba(234,179,8,0.08)] transition-all duration-300">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo / Editorial Brand */}
          <div
            onClick={() => handleViewChange("home")}
            className="flex cursor-pointer items-center space-x-3 text-slate-900 dark:text-white shrink-0 group"
          >
            <div className="flex h-10 w-10 items-center justify-center border-2 border-slate-900 bg-slate-900 text-white font-serif text-xl font-bold dark:border-cyber-yellow dark:bg-transparent dark:text-cyber-yellow dark:shadow-[0_0_10px_rgba(234,179,8,0.2)] group-hover:scale-105 transition-transform duration-200">
              A
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-md font-bold leading-tight tracking-tight dark:font-sans dark:tracking-wider">
                ASIA UNIVERSITY{" "}
                <span className="text-amber-700 dark:text-cyber-yellow font-sans text-xs font-semibold tracking-widest uppercase ml-0.5">
                  RANKINGS
                </span>
              </h1>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-medium">
                Futuristic Analytics Engine
              </p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-1 h-full items-center">
            {TOP_NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleViewChange(link.view)}
                  className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 rounded-md ${
                    isActive
                      ? "text-slate-900 dark:text-cyber-yellow"
                      : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 dark:bg-cyber-yellow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
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
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray/50 px-4 py-1.5 pl-10 rounded-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-800 dark:focus:border-cyber-yellow transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-2 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* Right Section Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className={`p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-full ${focusRing}`}
              title={theme === "dark" ? "Light Editorial Theme" : "Dark Futuristic Theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="Open notifications"
                className={`p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-full relative ${focusRing}`}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 dark:bg-cyber-yellow opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-700 dark:bg-cyber-yellow-bright"></span>
                </span>
              </button>

              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-80 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray shadow-xl py-2 z-50 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center font-bold">
                      <span className="text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                        Notifications
                      </span>
                      <span className="text-[10px] text-amber-700 dark:text-cyber-yellow">3 New</span>
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
                          className={`p-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-cyber-dark/40 transition-colors ${
                            n.isNew ? "bg-amber-50/20 dark:bg-cyber-yellow/5" : ""
                          }`}
                        >
                          <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                            <span>{n.title}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                            {n.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar Dropdown */}
            <div className="relative border-l border-slate-200 dark:border-slate-800 pl-3" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Open profile menu"
                className={`flex items-center space-x-1.5 focus:outline-none group ${focusRing}`}
              >
                <div className="h-8 w-8 rounded-full border border-slate-350 dark:border-cyber-yellow bg-slate-900 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm dark:shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                  {/* Mock user initial or image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-950 to-slate-800 text-cyber-yellow font-bold text-xs uppercase">
                    US
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-cyber-yellow transition-colors" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-48 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray shadow-xl py-1.5 z-50 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="block font-bold text-slate-900 dark:text-white">Dr. John Doe</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                        j.doe@university.edu
                      </span>
                    </div>

                    {[
                      { label: "My Profile", icon: User, action: () => {} },
                      { label: "Admin Console", icon: Shield, action: () => {} },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.action();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-cyber-dark/40 flex items-center space-x-2 transition-colors"
                      >
                        <item.icon className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    ))}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={() => {
                        showToast("Signing out of your session…", "info");
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="font-semibold">Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger menu */}
            {showSidebar && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className={`p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-md md:hidden ${focusRing}`}
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
