"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
<<<<<<< HEAD
import { Search, Bell, Sun, Moon, Menu, X, ChevronDown, User, Shield, LogOut } from "lucide-react";
=======
import { Search, Bell, Sun, Moon, Menu, X, ChevronDown, User, Shield, LogOut, Bot } from "lucide-react";
>>>>>>> navdeep/main
import { useSidebar } from "../navigation/SidebarContext";
import { TOP_NAV_LINKS } from "../navigation/config";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    isMobileOpen,
    setIsMobileOpen,
    activeView,
    handleViewChange,
    filters,
    setFilters,
    isChatOpen,
    setIsChatOpen,
  } = useSidebar();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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
    handleViewChange("rankings"); // Direct user to rankings to see results
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-cyber-border bg-white dark:bg-cyber-dark transition-all duration-300">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex py-2.5 items-center justify-between gap-4">

          {/* Logo / Editorial Brand */}
          <div
            onClick={() => handleViewChange("home")}
            className="flex cursor-pointer items-center shrink-0 bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-md px-2 py-1"
          >
<<<<<<< HEAD
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-slate-900 dark:bg-transparent group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Asia University Rankings logo"
                width={64}
                height={64}
                quality={100}
                unoptimized
                className="object-contain"
              />
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
=======
            <Image
              src="/aur-logo-cropped.png"
              alt="Asia University Rankings"
              width={458}
              height={135}
              className="h-[22px] sm:h-[26px] w-auto object-contain mix-blend-multiply dark:mix-blend-normal"
              priority
              quality={100}
              unoptimized
            />
>>>>>>> navdeep/main
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-1 h-full items-center">
            {TOP_NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleViewChange(link.view)}
                  className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors duration-200 rounded-md cursor-pointer ${isActive
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
            className="flex-grow max-w-md hidden lg:block"
          >
            <div className="relative">
              <input
                type="text"
                value={filters.searchQuery}
                onChange={handleSearchChange}
                placeholder="Search across index..."
                className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray/50 px-4 py-1.5 pl-10 rounded-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-800 dark:focus:border-cyber-yellow transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-2 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* Right Section Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Chat Toggle Button */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="cursor-pointer p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-full"
              title="Open AI Assistant"
            >
              <Bot className="h-4 w-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="cursor-pointer p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-full"
              title={theme === "dark" ? "Light Editorial Theme" : "Dark Futuristic Theme"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="cursor-pointer p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-full relative"
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
                          className={`p-3 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-cyber-dark/40 transition-colors ${n.isNew ? "bg-amber-50/20 dark:bg-cyber-yellow/5" : ""
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
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="cursor-pointer flex items-center space-x-1.5 focus:outline-none group"
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
                      { label: "My Profile", icon: User, action: () => { } },
                      { label: "Admin Console", icon: Shield, action: () => { } },
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
                        alert("Logging out...");
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
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-cyber-yellow transition-colors hover:bg-slate-100 dark:hover:bg-cyber-gray rounded-md md:hidden"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
