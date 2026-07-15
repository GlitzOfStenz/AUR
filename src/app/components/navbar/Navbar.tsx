"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, Menu, X, ChevronDown, User, Shield, LogOut } from "lucide-react";
import { BrandLogo } from "../BrandLogo";
import { useSidebar } from "../navigation/SidebarContext";
import { useToast } from "../feedback/ToastContext";
import { TOP_NAV_LINKS } from "../navigation/config";
import { API_BASE_URL } from "../../lib/universities";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  is_read: boolean;
  created_at: string;
};

export default function Navbar() {
  const { showToast } = useToast();
  const {
    isMobileOpen,
    setIsMobileOpen,
    activeView,
    handleViewChange,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
  } = useSidebar();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);

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

  // Fetch real notifications from backend
  useEffect(() => {
  async function fetchNotifications() {
    try {
      const token = sessionStorage.getItem("aur_access_token");
const res = await fetch(`${API_BASE_URL}/api/notifications`, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setNotifLoading(false);
    }
  }
  fetchNotifications();
}, [showNotifMenu]);

  function timeAgo(dateString: string) {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  async function markAsRead(id: string) {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-[#1A365D] bg-[#1A365D]"
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* ── Logo — crystal clear, merged flush into bar ── */}
          <div
            onClick={() => handleViewChange("home")}
            className="flex items-center cursor-pointer shrink-0 select-none w-[150px]"
            title="Asia University Rankings"
          >
            <div className="scale-[0.55] transform-gpu origin-left">
              <BrandLogo theme="dark" />
            </div>
          </div>

          {/* ── Vertical divider ── */}
          <div className="hidden md:block h-6 w-px bg-white/20 shrink-0 mx-2" />

          {/* ── Navigation Links - Desktop ── */}
          <nav className="hidden lg:flex space-x-1 items-center">
            {TOP_NAV_LINKS.map((link) => {
              const isActive = activeView === link.view;

              if (link.view === "news") {
                return (
                  <Link
                    key={link.label}
                    href="/news"
                    className="relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-none text-white/80 hover:text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleViewChange(link.view)}
                  className={`relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 rounded-none after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:transition-transform after:duration-300 after:origin-left ${
                    isActive
                      ? "text-white after:scale-x-100"
                      : "text-white/80 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* ── Spacer ── */}
          <div className="flex-1 hidden lg:block" />

          {/* ── Push icons to far right ── */}
          <div className="flex-1" />

          {/* ── Action icons ── */}
          <div className="flex items-center gap-1">

            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="Open notifications"
                className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-none border border-[var(--aur-border)] bg-[var(--aur-surface)] shadow-xl py-2 z-50 text-xs text-[var(--aur-text-secondary)]">
                  <div className="px-4 py-2.5 border-b border-[var(--aur-border)] flex justify-between items-center">
                    <span className="font-bold text-[var(--aur-text)] uppercase tracking-wider text-[10px]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] text-red-500 font-semibold">{unreadCount} New</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-[var(--aur-border)]">
                    {notifLoading ? (
                      <div className="px-4 py-6 text-center text-[10px] text-[var(--aur-text-muted)]">
                        Loading...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-[10px] text-[var(--aur-text-muted)]">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`px-4 py-3 hover:bg-[var(--aur-hover)] transition-colors cursor-pointer ${
                            !n.is_read ? "bg-[var(--aur-surface-2)]" : ""
                          }`}
                        >
                          <div className="flex justify-between mb-0.5">
                            <span className="font-semibold text-[var(--aur-text)] text-[11px]">{n.title}</span>
                            <span className="text-[9px] text-[var(--aur-text-muted)] shrink-0 ml-2">
                              {timeAgo(n.created_at)}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--aur-text-muted)] leading-relaxed">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

            {/* Profile avatar */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Open profile menu"
                className="flex items-center gap-1.5 focus:outline-none group"
              >
                <div className="h-8 w-8 rounded-none bg-white flex items-center justify-center text-[#1A365D] text-[11px] font-bold tracking-wide transition-transform duration-200 group-hover:scale-105">
                  US
                </div>
                <ChevronDown className="h-3 w-3 text-white/80 group-hover:text-white transition-colors hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-none border border-[var(--aur-border)] bg-[var(--aur-surface)] shadow-xl py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-[var(--aur-border)]">
                    <span className="block font-bold text-[var(--aur-text)] text-sm">Dr. John Doe</span>
                    <span className="block text-[10px] text-[var(--aur-text-muted)] mt-0.5">j.doe@university.edu</span>
                  </div>
                  {[
                    { label: "My Profile", icon: User, action: () => {} },
                    { label: "Admin Console", icon: Shield, action: () => handleViewChange("admin") },
                    { label: "Settings", icon: Shield, action: () => handleViewChange("settings") },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { item.action(); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[var(--aur-text-secondary)] hover:bg-[var(--aur-hover)] hover:text-[var(--aur-text)] flex items-center gap-2.5 transition-colors"
                    >
                      <item.icon className="h-3.5 w-3.5 text-[var(--aur-text-muted)]" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-[var(--aur-border)] my-1" />
                  <button
                    onClick={() => { handleViewChange("login"); setShowProfileMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2.5 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 md:hidden ml-1"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}