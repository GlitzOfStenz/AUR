"use client";

import React, { useState } from "react";

import {
  Bookmark,
  Settings2,
  ShieldAlert,
  User,
  CreditCard,
  Bell,
  ChevronRight,
  LogOut,
  MapPin,
  Banknote,
  GraduationCap
} from "lucide-react";

// Assuming standard university type based on the project context
interface University {
  id: string;
  name: string;
  location: string;
  tuition: string;
  overall: number;
  [key: string]: any;
}

interface UserDashboardProps {
  savedUniversities: University[];
  onUniversitySelect: (id: string) => void;
  onNavigateToRankings: () => void;
  settings: {
    autoRecalc: boolean;
    realtimeSearch: boolean;
    analyticsTelemetry: boolean;
  };
  onSettingsChange: (key: keyof UserDashboardProps["settings"], val: boolean) => void;
  onResetCache: () => void;
  onSignOut: () => void;
}

type TabType = "portfolio" | "preferences" | "account" | "billing";

export default function UserDashboard({
  savedUniversities,
  onUniversitySelect,
  onNavigateToRankings,
  settings,
  onSettingsChange,
  onResetCache,
  onSignOut,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("portfolio");

  const tabs: { id: TabType; label: string; icon: React.ElementType<{ className?: string }> }[] = [
    { id: "portfolio", label: "Saved Portfolio", icon: Bookmark },
    { id: "preferences", label: "System Preferences", icon: Settings2 },
    { id: "account", label: "Account Security", icon: ShieldAlert },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 animate-fadeIn">
      {/* Dashboard Header */}
      <div className="mb-8 aur-hero-accent">
        <span className="aur-caption">Command Center</span>
        <h1 className="aur-section-title text-3xl md:text-4xl leading-tight mt-2">
          User Profile &amp; Portfolio
        </h1>
        <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-3 tracking-wide">
          Saved universities · Engine preferences · Account security
        </p>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap lg:whitespace-normal relative z-10 ${
                    isActive ? "text-[var(--background)]" : "text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] hover:bg-[var(--aur-hover)]"
                  }`}
                >
                  {isActive && (
                    <div
                      
                      className="absolute inset-0 bg-[var(--aur-text)] rounded-xl z-[-1]"
                      
                    />
                  )}
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            
            <div className="hidden lg:block h-px w-full bg-[var(--aur-border)] my-4" />
            
            <button 
              onClick={onSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="h-4.5 w-4.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <>
            <div
              key={activeTab}
              
              
              
              
              className="w-full bg-[var(--aur-surface)] border border-[var(--aur-border)] rounded-2xl p-6 lg:p-8 shadow-sm"
            >
              {/* PORTFOLIO TAB */}
              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[var(--aur-text)]">Saved Comparison Nodes</h2>
                    <p className="text-xs text-[var(--aur-text-muted)] mt-1">
                      Institutions currently pinned in your local cache for quick comparative analysis.
                    </p>
                  </div>

                  {savedUniversities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedUniversities.map((uni) => (
                        <div
                          key={uni.id}
                          onClick={() => onUniversitySelect(uni.id)}
                          className="p-5 border border-[var(--aur-border)] bg-[var(--aur-surface-2)] rounded-xl hover:border-[var(--aur-text-muted)] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-sm text-[var(--aur-text)] group-hover:underline underline-offset-4 decoration-[var(--aur-border-strong)]">
                              {uni.name}
                            </h4>
                            <div className="flex flex-col items-end">
                              <span className="font-mono text-xl font-bold text-[var(--aur-text)] leading-none">
                                {uni.overall.toFixed(1)}
                              </span>
                              <span className="text-[8px] uppercase tracking-wider text-[var(--aur-text-muted)] mt-1">Score</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-[var(--aur-text-muted)] font-medium uppercase tracking-wide">
                            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {uni.location}</div>
                            <div className="flex items-center gap-1.5"><Banknote className="h-3 w-3" /> {uni.tuition}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 flex flex-col items-center justify-center border border-dashed border-[var(--aur-border-strong)] rounded-xl text-center bg-[var(--aur-surface-2)]">
                      <div className="h-12 w-12 rounded-full bg-[var(--aur-border)] flex items-center justify-center mb-4">
                        <Bookmark className="h-5 w-5 text-[var(--aur-text-muted)]" />
                      </div>
                      <h3 className="font-bold text-sm text-[var(--aur-text)] mb-1">Portfolio Empty</h3>
                      <p className="text-xs text-[var(--aur-text-muted)] max-w-xs mb-6">
                        You have not pinned any institutions to your personal database yet.
                      </p>
                      <button
                        onClick={onNavigateToRankings}
                        className="inline-flex items-center gap-2 border border-[var(--aur-text)] bg-[var(--aur-text)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--background)] hover:opacity-80 transition-opacity rounded-lg"
                      >
                        Explore Rankings <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === "preferences" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[var(--aur-text)]">Engine Configuration</h2>
                    <p className="text-xs text-[var(--aur-text-muted)] mt-1">
                      Configure real-time arithmetic models, indexing parameters, and UI modules.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: "autoRecalc",
                        title: "Automatic Recalculations",
                        desc: "Instantly re-evaluate all institution rankings as weights variables are adjusted.",
                        state: settings.autoRecalc,
                      },
                      {
                        key: "realtimeSearch",
                        title: "Real-time Search Queries",
                        desc: "Perform dynamic matching algorithm searches as letters are keyed in.",
                        state: settings.realtimeSearch,
                      },
                      {
                        key: "analyticsTelemetry",
                        title: "Advanced Analytics Telemetry",
                        desc: "Aggregate diagnostic logging data and rendering benchmarks for support.",
                        state: settings.analyticsTelemetry,
                      },
                    ].map((option) => (
                      <div
                        key={option.key}
                        className="flex items-center justify-between p-4 border border-[var(--aur-border)] bg-[var(--aur-surface-2)] rounded-xl"
                      >
                        <div className="pr-8">
                          <div className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text)]">{option.title}</div>
                          <div className="text-[10px] text-[var(--aur-text-muted)] mt-1 leading-relaxed">
                            {option.desc}
                          </div>
                        </div>
                        <button
                          onClick={() => onSettingsChange(option.key as any, !option.state)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--aur-text)] focus:ring-offset-2 focus:ring-offset-[var(--background)] ${
                            option.state ? "bg-[var(--aur-text)]" : "bg-[var(--aur-border-strong)]"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[var(--background)] shadow-xs ring-0  duration-200 ease-in-out ${
                              option.state ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[var(--aur-border)]">
                    <div className="flex items-center space-x-2 text-red-500 mb-2">
                      <ShieldAlert className="h-4.5 w-4.5" />
                      <span className="font-bold text-[10px] uppercase tracking-widest">Danger Zone</span>
                    </div>
                    <button
                      onClick={onResetCache}
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:border-red-900/50 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Reset Local Storage Cache
                    </button>
                  </div>
                </div>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === "account" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[var(--aur-text)]">Account Security</h2>
                    <p className="text-xs text-[var(--aur-text-muted)] mt-1">
                      Manage your profile credentials and active sessions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-[var(--aur-border)] bg-[var(--aur-surface-2)] rounded-xl">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mb-2">Registered Email</div>
                      <div className="text-sm font-medium text-[var(--aur-text)]">scholar@institution.edu</div>
                      <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text)] underline underline-offset-4">Change Email</button>
                    </div>
                    <div className="p-4 border border-[var(--aur-border)] bg-[var(--aur-surface-2)] rounded-xl">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text-muted)] mb-2">Authentication</div>
                      <div className="text-sm font-medium text-[var(--aur-text)]">Password & 2FA Disabled</div>
                      <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[var(--aur-text)] underline underline-offset-4">Update Security</button>
                    </div>
                  </div>
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[var(--aur-text)]">Enterprise Plan</h2>
                    <p className="text-xs text-[var(--aur-text-muted)] mt-1">
                      Your institutional access tier and usage limits.
                    </p>
                  </div>

                  <div className="p-6 border border-[var(--aur-text)] bg-[var(--aur-surface-2)] rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--aur-text)] opacity-[0.03] rounded-bl-full pointer-events-none" />
                    <div className="inline-block px-2 py-1 bg-[var(--aur-text)] text-[var(--background)] text-[9px] font-bold uppercase tracking-widest rounded mb-4">
                      Pro Tier
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--aur-text)] font-serif mb-1">Institutional Access</h3>
                    <p className="text-sm text-[var(--aur-text-muted)] mb-6">Provides unlimited queries to the rankings engine and real-time analytics.</p>
                    
                    <button className="bg-[var(--aur-text)] text-[var(--background)] px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                      Manage Subscription
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </div>
  );
}
