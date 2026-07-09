"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export interface FilterState {
  searchQuery: string;
  country: string;
  subjects: string[];
  qsRange: [number, number];
  tuitionRange: [number, number];
  isPublic: boolean | null;
  scholarshipOnly: boolean;
}

export const initialFilters: FilterState = {
  searchQuery: "",
  country: "",
  subjects: [],
  qsRange: [1, 50],
  tuitionRange: [0, 25000],
  isPublic: null,
  scholarshipOnly: false,
};

interface SidebarContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeView: string;
  handleViewChange: (view: string) => void;
  selectedUniId: string | null;
  setSelectedUniId: (id: string | null) => void;
  selectedUniIds: string[];
  handleToggleCompare: (uniId: string) => void;
  handleRemoveCompare: (uniId: string) => void;
  handleClearCompare: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
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
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniIds, setSelectedUniIds] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Read localStorage for isCollapsed and theme (safe for SSR)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollapsed = localStorage.getItem("sidebar_collapsed");
      if (savedCollapsed !== null) {
        setIsCollapsedState(savedCollapsed === "true");
      }

      const savedCompared = localStorage.getItem("compared_uni_ids");
      if (savedCompared) {
        try {
          setSelectedUniIds(JSON.parse(savedCompared));
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, []);

  const handleToggleCompare = (uniId: string) => {
    setSelectedUniIds((prev) => {
      const next = prev.includes(uniId)
        ? prev.filter((id) => id !== uniId)
        : [...prev, uniId];

      if (next.length > 4) {
        alert("You can compare a maximum of 4 universities at a time.");
        return prev;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("compared_uni_ids", JSON.stringify(next));
      }

      return next;
    });
  };

  const handleRemoveCompare = (uniId: string) => {
    setSelectedUniIds((prev) => {
      const next = prev.filter((id) => id !== uniId);
      if (typeof window !== "undefined") {
        localStorage.setItem("compared_uni_ids", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleClearCompare = () => {
    setSelectedUniIds([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("compared_uni_ids");
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Write collapse state to localStorage
  const setIsCollapsed = (val: boolean) => {
    setIsCollapsedState(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_collapsed", String(val));
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.document.documentElement.classList.remove("dark");
    }
    }, []);

  // Synchronize  URL search query if exists
  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // View changing routing helper
  const handleViewChange = (view: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("view", view);
    if (view !== "profile") {
      current.delete("id");
    }
    
    // Auto-expand sidebar when navigating to rankings engine
    if (view === "rankings") {
      setIsCollapsed(false);
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

  return (
    <SidebarContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        searchQuery,
        setSearchQuery,
        activeView,
        handleViewChange,
        selectedUniId,
        setSelectedUniId,
        selectedUniIds,
        handleToggleCompare,
        handleRemoveCompare,
        handleClearCompare,
        isChatOpen,
        setIsChatOpen,
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
