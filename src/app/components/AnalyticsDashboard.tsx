"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { MOCK_UNIVERSITIES } from "../data";
import { useSidebar } from "./navigation/SidebarContext";
import {
  GraduationCap,
  BarChart3,
  Award,
  TrendingUp,
} from "lucide-react";

// ── Vibrant color palette ──
const COLORS = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
  indigo: "#6366f1",
};

const COUNTRY_COLORS: Record<string, string> = {
  India: COLORS.green,
  China: COLORS.red,
  Japan: COLORS.blue,
  "South Korea": COLORS.purple,
  Singapore: COLORS.amber,
  "Hong Kong": COLORS.pink,
  Malaysia: COLORS.cyan,
  Uzbekistan: COLORS.indigo,
};

function useAnalytics() {
  return useMemo(() => {
    const unis = MOCK_UNIVERSITIES;
    const count = unis.length;

    const avgOverall = +(unis.reduce((s, u) => s + u.overall, 0) / count).toFixed(1);
    const avgCitations = +(unis.reduce((s, u) => s + u.citations, 0) / count).toFixed(1);
    const avgEmployability = +(unis.reduce((s, u) => s + u.employability, 0) / count).toFixed(1);
    const medCount = unis.filter((u) => u.hasMedicine).length;
    const medPct = +((medCount / count) * 100).toFixed(0);

    const keyCountries = ["China", "Japan", "India", "South Korea", "Singapore"];
    const regionMap: Record<string, { count: number; totalScore: number; totalCitations: number; totalResearch: number; totalTeaching: number }> = {};
    unis.forEach((u) => {
      const country = keyCountries.includes(u.location) ? u.location : null;
      if (!country) return;
      if (!regionMap[country]) regionMap[country] = { count: 0, totalScore: 0, totalCitations: 0, totalResearch: 0, totalTeaching: 0 };
      regionMap[country].count++;
      regionMap[country].totalScore += u.overall;
      regionMap[country].totalCitations += u.citations;
      regionMap[country].totalResearch += u.research;
      regionMap[country].totalTeaching += u.teaching;
    });

    const countryData = keyCountries
      .filter((c) => regionMap[c])
      .map((country) => {
        const d = regionMap[country];
        return {
          country,
          institutions: d.count,
          avgScore: +(d.totalScore / d.count).toFixed(1),
          avgResearch: +(d.totalResearch / d.count).toFixed(1),
          avgCitations: +(d.totalCitations / d.count).toFixed(1),
          fill: COUNTRY_COLORS[country] || COLORS.blue,
        };
      });

    const radarData = [
      { metric: "Teaching", value: +(unis.reduce((s, u) => s + u.teaching, 0) / count).toFixed(1) },
      { metric: "Research", value: +(unis.reduce((s, u) => s + u.research, 0) / count).toFixed(1) },
      { metric: "Citations", value: +(unis.reduce((s, u) => s + u.citations, 0) / count).toFixed(1) },
      { metric: "Employability", value: +(unis.reduce((s, u) => s + u.employability, 0) / count).toFixed(1) },
      { metric: "Int'l Students", value: +(unis.reduce((s, u) => s + u.intlStudents, 0) / count).toFixed(1) },
    ];

    const trendData = [
      { year: "2021", score: avgOverall - 8, research: avgOverall - 12 },
      { year: "2022", score: avgOverall - 5, research: avgOverall - 7 },
      { year: "2023", score: avgOverall - 3, research: avgOverall - 4 },
      { year: "2024", score: avgOverall - 1, research: avgOverall - 1 },
      { year: "2025", score: avgOverall,     research: avgOverall + 2 },
      { year: "2026", score: avgOverall + 2, research: avgOverall + 5 },
    ];

    return { count, avgOverall, avgCitations, avgEmployability, medCount, medPct, countryData, radarData, trendData };
  }, []);
}

// ── Custom tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg">
      <p className="text-[10px] font-bold text-slate-800 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[10px]" style={{ color: p.color || p.fill }}>
          {p.name}: <span className="font-bold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsDashboard() {
  const a = useAnalytics();

  // Always light mode colors for charts
  const gridColor = "rgba(203, 213, 225, 0.6)";
  const textColor = "#64748b";
  const axisColor = "#e2e8f0";

  return (
    <div className="w-full space-y-6">

      {/* ── Header ── */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Academic Intelligence
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
          Institutional Analytics Hub
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
          Real-time aggregated insights from{" "}
          <strong className="text-slate-900">{a.count} audited institutions</strong>{" "}
          across Asia — derived from QS-methodology scoring data.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Institutions",
            val: String(a.count),
            desc: "Audited & Verified",
            icon: GraduationCap,
            accent: "#3b82f6",
            border: "#bfdbfe",
            bg: "#eff6ff",
          },
          {
            title: "Avg. Score",
            val: `${a.avgOverall}%`,
            desc: `Citations: ${a.avgCitations}%`,
            icon: BarChart3,
            accent: "#10b981",
            border: "#a7f3d0",
            bg: "#f0fdf4",
          },
          {
            title: "Employability",
            val: `${a.avgEmployability}%`,
            desc: "Employer reputation",
            icon: TrendingUp,
            accent: "#f97316",
            border: "#fed7aa",
            bg: "#fff7ed",
          },
          {
            title: "Medicine",
            val: `${a.medPct}%`,
            desc: `${a.medCount} institutions`,
            icon: Award,
            accent: "#8b5cf6",
            border: "#ddd6fe",
            bg: "#f5f3ff",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ borderColor: stat.border, backgroundColor: stat.bg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.title}</span>
              <stat.icon className="h-5 w-5 opacity-70" style={{ color: stat.accent }} />
            </div>
            <span className="text-2xl font-bold text-slate-900 block">{stat.val}</span>
            <span className="text-[11px] text-slate-400 mt-1 block">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* ── Row: Country Comparison + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Country Bar Chart */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Country Performance
              </span>
              <span className="text-xs text-slate-500">Average scores by country</span>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span className="w-2 h-2 rounded-full bg-slate-400" /> Score
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Research
              </span>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={a.countryData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="country" tick={{ fontSize: 11, fill: textColor, fontWeight: 600 }} axisLine={{ stroke: axisColor }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgScore" name="Score" radius={[6, 6, 0, 0]}>
                  {a.countryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="avgResearch" name="Research" radius={[6, 6, 0, 0]} opacity={0.35}>
                  {a.countryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Average Metric Profile
          </span>
          <span className="text-xs text-slate-500 block mb-4">Five-axis institutional quality index</span>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={a.radarData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: textColor }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Average"
                  dataKey="value"
                  stroke={COLORS.blue}
                  fill={COLORS.blue}
                  fillOpacity={0.15}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COLORS.blue }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Performance Trend ── */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Performance Trend
            </span>
            <span className="text-xs text-slate-500">Year-over-year institutional quality index</span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.green }} /> Overall Score
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.blue }} /> Research Output
            </span>
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={a.trendData} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: textColor, fontWeight: 600 }} axisLine={{ stroke: axisColor }} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={COLORS.green}
                fill="url(#greenGrad)"
                strokeWidth={2.5}
                name="Score"
                dot={{ fill: COLORS.green, r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="research"
                stroke={COLORS.blue}
                fill="url(#blueGrad)"
                strokeWidth={2.5}
                name="Research"
                dot={{ fill: COLORS.blue, r: 4, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Country Summary Table ── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Country Intelligence Summary
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Country", "Universities", "Avg Score", "Avg Citations", "Avg Research"].map((h) => (
                  <th key={h} className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.countryData.map((r) => (
                <tr key={r.country} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-5 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: r.fill }} />
                      {r.country}
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.institutions}</td>
                  <td className="py-3 px-5">
                    <span
                      className="font-mono font-bold"
                      style={{ color: r.avgScore >= 80 ? "#16a34a" : r.avgScore >= 65 ? "#d97706" : "#dc2626" }}
                    >
                      {r.avgScore}%
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.avgCitations}%</td>
                  <td className="py-3 px-5 font-mono text-slate-600">{r.avgResearch}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
