"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { University } from "../../data";
import { MOCK_UNIVERSITIES } from "../../data";
import { fetchUniversities } from "../../lib/universities";

interface UniversityDataContextValue {
  universities: University[];
}

const UniversityDataContext = createContext<UniversityDataContextValue | null>(null);

export function UniversityDataProvider({ children }: { children: React.ReactNode }) {
  const [universities, setUniversities] = useState<University[]>(MOCK_UNIVERSITIES);

  useEffect(() => {
    let isMounted = true;

    fetchUniversities()
      .then((data) => {
        if (isMounted) setUniversities(data);
      })
      .catch(() => {
        if (isMounted) setUniversities(MOCK_UNIVERSITIES);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      universities,
    }),
    [universities]
  );

  return (
    <UniversityDataContext.Provider value={value}>
      {children}
    </UniversityDataContext.Provider>
  );
}

export function useUniversityData() {
  const context = useContext(UniversityDataContext);
  if (!context) {
    throw new Error("useUniversityData must be used within UniversityDataProvider");
  }
  return context;
}
