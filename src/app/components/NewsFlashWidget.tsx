"use client";

import React from "react";
import Link from "next/link";
import { useExternalNewsData } from "../hooks/useExternalNewsData";
import { ArrowRight, Zap, Clock, ExternalLink } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NewsFlashWidget() {
  const { externalNews, loading, error } = useExternalNewsData();
  const articles = externalNews.slice(0, 4);

  if (loading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1A365D] border border-[#1A365D] rounded-2xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-20"></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white text-[#1A365D] p-1 rounded-md">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
              Latest Updates
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">News Flash</h2>
        </div>
        <Link
          href="/news"
          className="bg-amber-400 text-[#1A365D] rounded-lg px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/30 hover:shadow-amber-300/40 active:scale-95 ring-2 ring-amber-300/50"
        >
          View All News
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {!loading && !error && articles.length === 0 && (
        <div className="relative z-10 bg-white/10 rounded-xl p-8 text-center text-blue-100">
          No news available right now. Check back soon.
        </div>
      )}

      {!loading && error && (
        <div className="relative z-10 bg-white/10 rounded-xl p-8 text-center text-blue-100">
          Couldn't load the latest news. Check back soon.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {articles.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between bg-white border border-transparent rounded-xl p-6 hover:border-[#1A365D]/20 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[11px] uppercase font-bold text-gray-500 tracking-wider mb-3">
                <Clock className="h-3 w-3" />
                {formatDate(item.published_at)}
                {item.source && <span className="normal-case font-medium text-gray-400">· {item.source}</span>}
              </div>
              <h4 className="font-bold text-slate-800 text-lg leading-snug mb-3 group-hover:text-[#1A365D] transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3 mb-6">
                {item.description}
              </p>
            </div>
            <span className="text-sm font-bold text-slate-800 border-b-2 border-transparent hover:border-[#1A365D] w-max pb-0.5 transition-colors inline-flex items-center gap-1 group-hover:text-[#1A365D]">
              Read full story
              <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
