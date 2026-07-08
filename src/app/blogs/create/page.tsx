import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import BlogForm from "../../components/blog/BlogForm";
import { ToastProvider } from "../../components/feedback/ToastContext";
import { SidebarProvider } from "../../components/navigation/SidebarContext";
import { UniversityDataProvider } from "../../components/data/UniversityDataProvider";

export default function CreateBlogPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-cyber-black font-sans text-slate-400 text-xs font-bold uppercase tracking-widest">
        Loading Editor...
      </div>
    }>
      <SidebarProvider>
        <ToastProvider>
          <UniversityDataProvider>
            <AppLayout>
              <BlogForm />
            </AppLayout>
          </UniversityDataProvider>
        </ToastProvider>
      </SidebarProvider>
    </React.Suspense>
  );
}
