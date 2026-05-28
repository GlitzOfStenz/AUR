import React, { Suspense } from "react";
import AppContent from "./AppContent";
import { SidebarProvider } from "./components/navigation/SidebarContext";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white font-sans text-slate-400 text-xs font-bold uppercase tracking-widest">
        Initializing Engine...
      </div>
    }>
      <SidebarProvider>
        <AppContent />
      </SidebarProvider>
    </Suspense>
  );
}
