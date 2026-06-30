"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { University } from "../../data";

/** Pin  on the 400×280 map viewBox */
const MAP_PINS: { x: number; y: number; cardStyle: React.CSSProperties }[] = [
  { x: 118, y: 98, cardStyle: { top: "6%", left: "2%", maxWidth: "168px" } },
  { x: 198, y: 188, cardStyle: { bottom: "10%", left: "28%", maxWidth: "175px" } },
  { x: 312, y: 108, cardStyle: { top: "4%", right: "2%", maxWidth: "168px" } },
];

const NETWORK_LINES: [number, number, number, number][] = [
  [118, 98, 198, 188],
  [198, 188, 312, 108],
  [118, 98, 312, 108],
  [118, 98, 260, 160],
  [198, 188, 280, 200],
];

interface AsiaMapHeroProps {
  universities: University[];
  onUniversitySelect: (id: string) => void;
}

function mapCardTrend(uni: University) {
  const rankDelta = (uni.history[1] ?? uni.history[0]) - uni.history[0];
  if (rankDelta > 0) return rankDelta;
  return +((uni.overall % 3) + 1.1).toFixed(1);
}

export function AsiaMapNetwork() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="ref-asia-map-svg"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="asiaLand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--aur-surface-hover)" />
          <stop offset="50%" stopColor="var(--aur-surface-2)" />
          <stop offset="100%" stopColor="var(--aur-surface)" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="networkLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--aur-text-muted)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="var(--aur-text)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--aur-text-muted)" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="nodeGlow">
          <stop offset="0%" stopColor="var(--aur-text)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--aur-text)" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Stylized Asia landmass */}
      <path
        d="M 55 115 Q 95 72 155 78 L 210 62 Q 285 58 340 88 L 365 125 Q 372 168 348 198 L 310 228 Q 255 248 195 238 L 130 252 Q 78 242 62 205 L 48 165 Q 42 135 55 115 Z"
        fill="url(#asiaLand)"
        stroke="var(--aur-border-strong)"
        strokeWidth="1.5"
        opacity="0.95"
      />
      <path
        d="M 95 130 Q 130 110 175 118 L 220 105 Q 270 100 300 125"
        fill="none"
        stroke="var(--aur-border)"
        strokeWidth="0.75"
        opacity="0.5"
      />

      {/* Mesh network */}
      {NETWORK_LINES.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#networkLine)"
          strokeWidth="1"
          strokeDasharray="4 5"
          opacity="0.7"
        />
      ))}

      {/* Secondary nodes */}
      {[
        [260, 160],
        [280, 200],
        [165, 175],
        [240, 130],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--aur-text-muted)" opacity="0.3" />
      ))}

      {/* Primary hub pulses */}
      {MAP_PINS.map((pin, i) => (
        <g key={i} filter="url(#softGlow)">
          <circle cx={pin.x} cy={pin.y} r="14" fill="url(#nodeGlow)" className="ref-map-pulse" />
          <circle cx={pin.x} cy={pin.y} r="5" fill="var(--aur-text)" />
          <circle cx={pin.x} cy={pin.y} r="2" fill="var(--aur-surface)" />
        </g>
      ))}
    </svg>
  );
}

export function MapUniversityCards({
  universities,
  onUniversitySelect,
}: AsiaMapHeroProps) {
  const pins = universities.slice(0, 3);

  return (
    <>
      {pins.map((uni, i) => {
        const pin = MAP_PINS[i];
        if (!pin) return null;
        const trend = mapCardTrend(uni);
        const asiaRank = uni.history[0];

        return (
          <button
            key={uni.id}
            type="button"
            className="ref-map-uni-card"
            style={pin.cardStyle}
            onClick={() => onUniversitySelect(uni.id)}
          >
            <p className="ref-map-uni-card__name">{uni.name}</p>
            <p className="ref-map-uni-card__rank">#{asiaRank} in Asia</p>
            <div className="ref-map-uni-card__footer">
              <span className="ref-map-uni-card__score">{uni.overall.toFixed(1)}</span>
              <span className="ref-map-uni-card__trend">
                <TrendingUp className="h-3 w-3" />
                {trend.toFixed(1)}
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}
