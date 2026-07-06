import React, { useState, useEffect } from "react";
import { useSidebar } from "./navigation/SidebarContext";

import { 
  Activity, Database, Shield, Users, Sliders, Globe, 
  ChevronRight, Lock, Eye, LogOut, Search, Settings, CheckCircle2, AlertCircle, Edit3
} from "lucide-react";
import { useUniversityData } from "./data/UniversityDataProvider";

// Premium Enterprise Mock Data
const MOCK_EVENTS = [
  { id: 1, user: "Dr. Kenji Sato", action: "Accessed Restricted Global Rankings", time: "2 mins ago", status: "success" },
  { id: 2, user: "Prof. Li Wei", action: "Exported Institutional Data (PDF)", time: "14 mins ago", status: "success" },
  { id: 3, user: "Navadeep Yadav", action: "Modified Algorithm Weights", time: "1 hr ago", status: "warning" },
  { id: 4, user: "System Daemon", action: "Failed Authentication Attempt", time: "2 hrs ago", status: "error" },
];

const MOCK_USERS = [
  { id: "U-101", name: "Navadeep Yadav", role: "SuperAdmin", email: "navadeep@aur.edu", status: "Active", lastIp: "192.168.1.1", session: "Valid" },
  { id: "U-102", name: "Dr. Kenji Sato", role: "Analyst", email: "ksato@tokyo-u.ac.jp", status: "Active", lastIp: "130.158.0.45", session: "Valid" },
  { id: "U-103", name: "Prof. Li Wei", role: "Editor", email: "li.wei@tsinghua.edu.cn", status: "Offline", lastIp: "166.111.4.19", session: "Expired" },
  { id: "U-104", name: "Sarah Jenkins", role: "Viewer", email: "s.jenkins@nus.edu.sg", status: "Suspended", lastIp: "137.132.20.12", session: "Revoked" },
  { id: "U-105", name: "Dr. Priya Sharma", role: "Editor", email: "psharma@iitb.ac.in", status: "Active", lastIp: "103.21.12.1", session: "Valid" }
];

export default function AdminConsole() {
  const { handleViewChange } = useSidebar();
  const { universities } = useUniversityData();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "data_engine" | "security">("overview");

  // Live Metrics State
  const [activeUsers, setActiveUsers] = useState(124);
  const [systemLoad, setSystemLoad] = useState(32);
  const [apiRequests, setApiRequests] = useState(8420);

  // Data Engine State
  const [selectedUniId, setSelectedUniId] = useState("tsinghua");
  const [overrideScore, setOverrideScore] = useState<number | string>("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (universities.length > 0 && !universities.some((u) => u.id === selectedUniId)) {
      setSelectedUniId(universities[0].id);
    }
  }, [selectedUniId, universities]);

  // Live simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.max(100, prev + Math.floor(Math.random() * 5) - 2));
      setSystemLoad(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 8) - 4)));
      setApiRequests(prev => prev + Math.floor(Math.random() * 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideScore) return;

    const target = universities.find(u => u.id === selectedUniId);
    if (target) {
      setSuccessMessage(`Prepared ${target.name} overall score override payload: ${overrideScore}.`);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-[var(--aur-surface)]/80 backdrop-blur-xl border-b border-[var(--aur-border)] px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[var(--aur-text)] text-[var(--background)] rounded-xl flex items-center justify-center shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[var(--aur-text)] leading-none tracking-tight">Intelligence Command</h1>
            <p className="text-[10px] uppercase tracking-widest text-[var(--aur-text-muted)] font-bold mt-1">SuperAdmin Access Granted</p>
          </div>
        </div>
        <button
          onClick={() => handleViewChange("home")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-secondary)] hover:text-[var(--aur-text)] transition-colors px-4 py-2 rounded-lg hover:bg-[var(--aur-surface-hover)]"
        >
          <LogOut className="h-4 w-4" />
          Exit Command Center
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 gap-8">
        
        {/* Left Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {[
              { id: "overview", label: "Live Telemetry", icon: Activity },
              { id: "users", label: "User Directory", icon: Users },
              { id: "data_engine", label: "Data Engine Override", icon: Database },
              { id: "security", label: "Security & Access", icon: Lock },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? "bg-[var(--aur-text)] text-[var(--background)] shadow-md" 
                    : "text-[var(--aur-text-secondary)] hover:bg-[var(--aur-surface-hover)] hover:text-[var(--aur-text)]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <>
            <div
              key={activeTab}
              
              
              
              
            >
              
              {/* TAB 1: Live Telemetry */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="aur-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="aur-caption">Active Sessions</span>
                      </div>
                      <div className="text-3xl font-serif text-[var(--aur-text)]">{activeUsers}</div>
                      <div className="text-xs text-[var(--aur-text-muted)] mt-2 font-medium">Currently connected nodes</div>
                    </div>
                    
                    <div className="aur-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Activity className="h-4 w-4" />
                        </div>
                        <span className="aur-caption">System Load</span>
                      </div>
                      <div className="text-3xl font-serif text-[var(--aur-text)]">{systemLoad}%</div>
                      <div className="text-xs text-[var(--aur-text-muted)] mt-2 font-medium">Computational engine usage</div>
                    </div>

                    <div className="aur-card p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                          <Globe className="h-4 w-4" />
                        </div>
                        <span className="aur-caption">Total API Requests</span>
                      </div>
                      <div className="text-3xl font-serif text-[var(--aur-text)]">{apiRequests.toLocaleString()}</div>
                      <div className="text-xs text-[var(--aur-text-muted)] mt-2 font-medium">Over the last 24 hours</div>
                    </div>
                  </div>

                  <div className="aur-card overflow-hidden">
                    <div className="px-6 py-5 border-b border-[var(--aur-border)] bg-[var(--aur-surface-2)]/50">
                      <h3 className="font-serif font-bold text-lg text-[var(--aur-text)]">Live Action Ledger</h3>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--aur-surface-hover)] border-b border-[var(--aur-border)]">
                          <tr>
                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Operator</th>
                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Action Logged</th>
                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Timestamp</th>
                            <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--aur-border)]">
                          {MOCK_EVENTS.map((event) => (
                            <tr key={event.id} className="hover:bg-[var(--aur-surface-hover)] transition-colors">
                              <td className="px-6 py-4 font-bold text-[var(--aur-text)]">{event.user}</td>
                              <td className="px-6 py-4 text-[var(--aur-text-secondary)]">{event.action}</td>
                              <td className="px-6 py-4 text-[var(--aur-text-muted)] text-xs">{event.time}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                  event.status === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' :
                                  event.status === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                                  'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                }`}>
                                  {event.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: User Database */}
              {activeTab === "users" && (
                <div className="aur-card overflow-hidden">
                  <div className="px-6 py-5 border-b border-[var(--aur-border)] bg-[var(--aur-surface-2)]/50 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-lg text-[var(--aur-text)]">Uncensored User Directory</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--aur-text-muted)]" />
                      <input 
                        type="text" 
                        placeholder="Search records..." 
                        className="aur-input pl-9 text-xs py-2 h-9 w-64"
                      />
                    </div>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-[var(--aur-surface-hover)] border-b border-[var(--aur-border)]">
                        <tr>
                          <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">User Identity</th>
                          <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Privilege Role</th>
                          <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Last Known IP</th>
                          <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Account Status</th>
                          <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--aur-border)]">
                        {MOCK_USERS.map((user) => (
                          <tr key={user.id} className="hover:bg-[var(--aur-surface-hover)] transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-bold text-[var(--aur-text)]">{user.name}</div>
                              <div className="text-xs text-[var(--aur-text-muted)] font-mono mt-0.5">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-[var(--aur-surface-2)] border border-[var(--aur-border)] px-2 py-1 rounded text-xs font-bold text-[var(--aur-text-secondary)]">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-[var(--aur-text-secondary)]">
                              {user.lastIp}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : user.status === 'Offline' ? 'bg-gray-400' : 'bg-red-500'}`}></div>
                                <span className="text-xs font-medium text-[var(--aur-text)]">{user.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors p-2">
                                <Settings className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Data Engine Override */}
              {activeTab === "data_engine" && (
                <div className="max-w-2xl">
                  <div className="aur-card p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-[var(--aur-text)] text-[var(--background)] flex items-center justify-center shadow-sm">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-[var(--aur-text)]">Data Override Engine</h2>
                        <p className="text-sm text-[var(--aur-text-secondary)] mt-1">Direct memory manipulation of university analytic scores.</p>
                      </div>
                    </div>

                    <div className="h-px w-full bg-[var(--aur-border)] mb-8"></div>

                    {successMessage && (
                      <div 
                        
                        
                        className="mb-6 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-xl text-sm flex items-center gap-3 font-medium"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        {successMessage}
                      </div>
                    )}

                    <form onSubmit={handleApplyOverride} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">Select Target Institution</label>
                        <select
                          value={selectedUniId}
                          onChange={(e) => setSelectedUniId(e.target.value)}
                          className="aur-input w-full font-medium"
                        >
                          {universities.map(u => (
                            <option key={u.id} value={u.id}>
                              {u.name} (Current Score: {u.overall})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">New Overall Score Payload</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={overrideScore}
                          onChange={(e) => setOverrideScore(e.target.value)}
                          placeholder="Enter a value between 0.0 and 100.0"
                          className="aur-input w-full font-mono text-lg"
                        />
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                          Executing this override will instantly mutate the live volatile database array in memory. Changes will be reflected globally across all rankings and discovery engines.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={!overrideScore}
                        className="w-full aur-btn-primary py-3.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        <Edit3 className="h-4 w-4" />
                        Execute Live Data Override
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: Security */}
              {activeTab === "security" && (
                <div className="space-y-6 max-w-3xl">
                  <h2 className="font-serif text-2xl font-bold text-[var(--aur-text)] mb-6">Security & Access Management</h2>
                  
                  <div className="aur-card p-6">
                    <h3 className="font-bold text-[var(--aur-text)] mb-4">Authentication Gateway</h3>
                    <div className="flex items-center justify-between py-3 border-b border-[var(--aur-border)]">
                      <div>
                        <div className="font-medium text-sm text-[var(--aur-text)]">Force Active Session Expiration</div>
                        <div className="text-xs text-[var(--aur-text-muted)] mt-1">Instantly terminate all authenticated WebSocket tokens globally.</div>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                        Purge Sessions
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium text-sm text-[var(--aur-text)]">Rotate Cryptographic Keys</div>
                        <div className="text-xs text-[var(--aur-text-muted)] mt-1">Generate new RSA signatures for JWT payloads.</div>
                      </div>
                      <button className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[var(--aur-surface-2)] border border-[var(--aur-border)] text-[var(--aur-text)] hover:bg-[var(--aur-surface-hover)] transition-colors">
                        Cycle Keys
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </>
        </main>
      </div>
    </div>
  );
}
