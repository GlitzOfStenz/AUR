"use client";

import React from "react";
import { Award, Compass, BarChart2, HelpCircle } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white font-sans">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Editorial Brand */}
          <div 
            onClick={() => onViewChange("home")}
            className="flex cursor-pointer items-center space-x-3 text-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center border border-slate-900 bg-slate-900 text-white font-serif text-xl font-semibold">
              A
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold leading-tight tracking-tight">
                ASIA UNIVERSITY <span className="text-amber-700 font-sans text-sm font-semibold tracking-wider uppercase ml-1">RANKINGS</span>
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                Official Institutional Portal & Analysis
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-8 h-full">
            <button
              onClick={() => onViewChange("home")}
              className={`inline-flex items-center border-b-2 px-1 pt-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                currentView === "home"
                  ? "border-amber-700 text-slate-900 font-bold"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Compass className="mr-2 h-4 w-4" />
              Home
            </button>

            <button
              onClick={() => onViewChange("rankings")}
              className={`inline-flex items-center border-b-2 px-1 pt-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                currentView === "rankings"
                  ? "border-amber-700 text-slate-900 font-bold"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Rankings Engine
            </button>

            <button
              onClick={() => onViewChange("home")} // scroll to editorial articles
              className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors duration-150"
            >
              <Award className="mr-2 h-4 w-4" />
              Regional Spotlights
            </button>
          </nav>

          {/* Desktop Right Info */}
          <div className="flex items-center space-x-4">
            <span className="hidden lg:inline-flex items-center rounded border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-500 uppercase tracking-widest bg-slate-50">
              Data: 2026 AUDITED
            </span>
            <div className="border-l border-slate-200 pl-4 flex items-center space-x-4">
              <a 
                href="/admin/login" 
                className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
              >
                Admin Console
              </a>
              <button 
                onClick={() => onViewChange("rankings")}
                className="inline-flex items-center justify-center border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-slate-800 transition-all duration-150"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex justify-around border-t border-slate-100 bg-slate-50 py-2">
        <button
          onClick={() => onViewChange("home")}
          className={`flex flex-col items-center text-[10px] uppercase tracking-wider font-semibold ${
            currentView === "home" ? "text-amber-700" : "text-slate-500"
          }`}
        >
          <Compass className="h-4 w-4 mb-0.5" />
          Discovery
        </button>
        <button
          onClick={() => onViewChange("rankings")}
          className={`flex flex-col items-center text-[10px] uppercase tracking-wider font-semibold ${
            currentView === "rankings" ? "text-amber-700" : "text-slate-500"
          }`}
        >
          <BarChart2 className="h-4 w-4 mb-0.5" />
          Rankings
        </button>
        <a
          href="/admin/login"
          className="flex flex-col items-center text-[10px] uppercase tracking-wider font-semibold text-slate-500"
        >
          <HelpCircle className="h-4 w-4 mb-0.5" />
          Admin
        </a>
      </div>
    </header>
  );
}
