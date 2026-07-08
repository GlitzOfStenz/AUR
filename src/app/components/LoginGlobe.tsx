"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function LoginGlobe() {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState<any>({ features: [] });
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
      .catch(err => console.error("Globe data load error:", err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        if (w > 0 && h > 0) {
          setDimensions({ width: w, height: h });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // We wait for the globe to be fully ready before accessing controls
  const handleGlobeReady = () => {
    if (globeRef.current) {
      try {
        globeRef.current.pointOfView({ lat: 25, lng: 90, altitude: 2.5 }, 0);
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.2;
          controls.enableZoom = true;
          controls.minDistance = 100;
          controls.maxDistance = 600;
        }
      } catch (e) {
        console.error("Globe controls error:", e);
      }
    }
  };

  const colors = ["#E8A020", "#FFFFFF", "#8FBFAD", "#3D4A5A", "#F8F9FA"];
  
  const getCountryColor = (feat: any) => {
    const name = feat.properties.ADMIN || "";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] flex items-center justify-center">
      {countries.features.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#E8A020] border-t-transparent rounded-full animate-spin opacity-50"></div>
        </div>
      )}
      {dimensions.width > 0 && countries.features.length > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={false}
          showGlobe={false}
          polygonsData={countries.features}
          polygonAltitude={0.02}
          polygonCapColor={getCountryColor}
          polygonSideColor={() => "rgba(255,255,255,0.05)"}
          polygonStrokeColor={() => "#1C2531"}
          onGlobeReady={handleGlobeReady}
        />
      )}
    </div>
  );
}
