"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export interface FilterState {
  country: string;
  qsRange: [number, number]; // Rank range: 1 to 50
  tuitionRange: [number, number]; // Tuition range: 0 to 25000 (USD/year equivalent)
  isPublic: boolean | null; // null = both, true = public, false = private
  subjects: string[];
  scholarshipOnly: boolean;
  searchQuery: string;
}

const initialFilters: FilterState = {
  country: "",
  qsRange: [1, 100],
  tuitionRange: [0, 50000],
  isPublic: null,
  subjects: [],
  scholarshipOnly: false,
  searchQuery: "",
};

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  activeView: string;
  handleViewChange: (view: string) => void;
  selectedUniId: string | null;
  setSelectedUniId: (id: string | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active view sync from URL
  const activeView = searchParams.get("view") || "home";
  const selectedUniId = searchParams.get("id");

  // State initialization
  const [isCollapsed, setIsCollapsedState] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light"); // Default to clean light theme
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Read localStorage for isCollapsed and theme (safe for SSR)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebar_collapsed");
      if (savedCollapsed !== null) {
        setIsCollapsedState(savedCollapsed === "true");
      }

      const savedTheme = localStorage.getItem("aur_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      } else {
        // Default to clean light
        setTheme("light");
      }
    }
  }, []);

  // Write collapse state to localStorage
  const setIsCollapsed = (val: boolean) => {
    setIsCollapsedState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_collapsed", String(val));
    }
  };

  // Toggle theme and update localStorage & DOM root class
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("aur_theme", nextTheme);
    }
  };

  // Sync theme status on HTML document class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  // Synchronize initial URL search query if exists
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setFilters(prev => ({ ...prev, searchQuery: q }));
    }
  }, [searchParams]);

  // View changing routing helper
  const handleViewChange = (view: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("view", view);
    if (view !== "profile") {
      current.delete("id");
    }
    router.push(`?${current.toString()}`);
    setIsMobileOpen(false); // Close mobile drawer when navigating
  };

  const setSelectedUniId = (id: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (id) {
      current.set("view", "profile");
      current.set("id", id);
    } else {
      current.set("view", "rankings");
      current.delete("id");
    }
    router.push(`?${current.toString()}`);
  };

  // Reset filters helper
  const clearFilters = () => {
    setFilters({
      ...initialFilters,
      // Retain the query unless it was cleared
      searchQuery: "",
    });
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        theme,
        toggleTheme,
        filters,
        setFilters,
        clearFilters,
        activeView,
        handleViewChange,
        selectedUniId,
        setSelectedUniId,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
