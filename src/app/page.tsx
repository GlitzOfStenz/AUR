import React, { Suspense } from "react";
import AppContent from "./AppContent";
import { SidebarProvider } from "./components/navigation/SidebarContext";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-white font-sans overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-6 flex flex-col hidden md:flex">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-10"></div>
          <div className="space-y-4 flex-grow">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-slate-100 bg-white flex items-center px-8">
            <div className="h-8 w-64 bg-slate-100 rounded-full animate-pulse"></div>
          </div>
          <div className="p-8 space-y-6">
            <div className="h-40 w-full bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </Suspense>
  );
}
