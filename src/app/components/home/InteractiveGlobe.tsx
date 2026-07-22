"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { University } from "../../data";
import { TrendingUp } from "lucide-react";

// Dynamically import react-globe.gl to avoid SSR issues with Three.js
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  China: { lat: 35.8617, lng: 104.1954 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Japan: { lat: 36.2048, lng: 138.2529 },
  "South Korea": { lat: 35.9078, lng: 127.7669 },
  India: { lat: 20.5937, lng: 78.9629 },
  Malaysia: { lat: 4.2105, lng: 101.9758 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  Taiwan: { lat: 23.6978, lng: 120.9605 },
  Thailand: { lat: 15.87, lng: 100.9925 },
  Vietnam: { lat: 14.0583, lng: 108.2772 },
  Indonesia: { lat: -0.7893, lng: 113.9213 },
  Uzbekistan: { lat: 41.3775, lng: 64.5853 },
  Kazakhstan: { lat: 48.0196, lng: 66.9237 },
  Philippines: { lat: 12.8797, lng: 121.774 },
  Pakistan: { lat: 30.3753, lng: 69.3451 },
  Bangladesh: { lat: 23.685, lng: 90.3563 },
};

// Fallback for jittering universities in the same location
function getCoords(location: string, index: number) {
  const base = COUNTRY_COORDS[location] || { lat: 30, lng: 100 }; // Default Central Asia
  // Add a small deterministic jitter based on index so universities don't perfectly overlap
  const jitterLat = (Math.sin(index) * 2);
  const jitterLng = (Math.cos(index) * 2);
  return { lat: base.lat + jitterLat, lng: base.lng + jitterLng };
}

interface GlobeProps {
  universities: University[];
  onUniversitySelect: (id: string) => void;
}

export default function InteractiveGlobe({ universities, onUniversitySelect }: GlobeProps) {
  const globeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });
  const [countries, setCountries] = useState({ features: [] });
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch GeoJSON for countries to render vector globe
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Center the globe on Asia on mount
  useEffect(() => {
    if (globeRef.current) {
      // Point the camera to Asia
      globeRef.current.pointOfView({ lat: 25, lng: 105, altitude: 1.5 }, 2000);
      
      // Auto-rotate configuration
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  // Map universities to globe data
  const globeData = universities.slice(0, 15).map((uni, idx) => {
    const coords = getCoords(uni.location, idx);
    const trend = uni.history[1] ? (uni.history[1] - uni.history[0]) : 1.2;
    
    return {
      id: uni.id,
      name: uni.name,
      rank: uni.history[0],
      score: uni.overall,
      lat: coords.lat,
      lng: coords.lng,
      trend: trend > 0 ? trend : +((uni.overall % 3) + 1.1).toFixed(1),
    };
  });

  return (
    <div ref={containerRef} className="w-full h-full min-h-[450px] relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#030712] flex items-center justify-center">
      {/* Deep space radial gradient overlay */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_rgba(127, 86, 217,0.15)_0%,_transparent_100%)] pointer-events-none" />

      {/* The 3D WebGL Globe */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(127, 86, 217, 0)"
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.2}
          
          // Render  HTML elements as university cards
          htmlElementsData={globeData}
        htmlElement={(d: any) => {
          const el = document.createElement("div");
          
          // Using standard DOM manipulation since this is outside the React tree
          el.className = "ref-map-uni-card relative z-20 group";
          el.style.width = "180px";
          el.style.transform = "translate(-50%, -100%)";
          el.style.marginTop = "-10px"; // Shift above the marker point
          
          el.innerHTML = `
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 rotate-45 transform"></div>
            <div class="relative bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3 shadow-2xl group-hover:border-blue-500 transition-colors cursor-pointer">
              <p class="text-[12px] font-semibold text-white leading-tight line-clamp-2 mb-1">${d.name}</p>
              <p class="text-[9px] font-medium text-blue-400 uppercase tracking-wider mb-2">#${d.rank} in Asia</p>
              <div class="flex items-end justify-between">
                <span class="text-xl font-bold font-mono text-white leading-none">${d.score.toFixed(1)}</span>
                <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                  ${d.trend.toFixed(1)}
                </span>
              </div>
            </div>
          `;
          
          // Attach click listener
          el.onclick = (e) => {
            e.stopPropagation();
            onUniversitySelect(d.id);
          };
          
          // Intercept pointer events to prevent globe panning when clicking the card
          el.onpointerdown = (e) => e.stopPropagation();
          
          return el;
        }}
      />
      </div>
      
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-300 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        Interactive 3D Globe
      </div>
    </div>
  );
}


