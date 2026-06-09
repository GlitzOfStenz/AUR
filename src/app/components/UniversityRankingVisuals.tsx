"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricWeight {
  name: string;
  value: number;
  color: string;
}

interface PlacementYear {
  year: string;
  placements: number;
  median: number;
}

interface RankingTrend {
  year: string;
  rank: number;
}

interface DonutTooltipPayload {
  name: string;
  value: number;
}

interface BarTooltipPayload {
  name: string;
  value: number;
  color?: string;
}

interface AreaTooltipPayload {
  value: number;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const METRIC_WEIGHTS: MetricWeight[] = [
  { name: "Academic Reputation", value: 30, color: "#d97706" },
  { name: "Citations", value: 25, color: "#f59e0b" },
  { name: "Employability", value: 20, color: "#fbbf24" },
  { name: "International Faculty", value: 15, color: "#fcd34d" },
  { name: "Teaching Quality", value: 10, color: "#fde68a" },
];

const PLACEMENT_DATA: PlacementYear[] = [
  { year: "2021", placements: 1420, median: 62 },
  { year: "2022", placements: 1680, median: 71 },
  { year: "2023", placements: 1930, median: 79 },
  { year: "2024", placements: 2210, median: 88 },
  { year: "2025", placements: 2540, median: 96 },
];

const RANKING_TREND: RankingTrend[] = [
  { year: "2021", rank: 18 },
  { year: "2022", rank: 14 },
  { year: "2023", rank: 11 },
  { year: "2024", rank: 7 },
  { year: "2025", rank: 4 },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

// Custom Donut label renderer (silent — we show metrics via state)
const RADIAN = Math.PI / 180;

interface DonutLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

function DonutLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: DonutLabelProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#0f172a"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      fontFamily="'Inter', sans-serif"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// Custom Donut Tooltip
interface DonutTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function DonutTooltipContent({ active, payload }: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0] as DonutTooltipPayload;
  return (
    <div className="urv-tooltip">
      <p className="urv-tooltip-label">{item.name}</p>
      <p className="urv-tooltip-value">{item.value}%</p>
    </div>
  );
}

// Custom Bar Tooltip
interface BarTooltipProps {
  active?: boolean;
  payload?: BarTooltipPayload[];
  label?: string;
}

function BarTooltipContent({ active, payload, label }: BarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="urv-tooltip">
      <p className="urv-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="urv-tooltip-value" style={{ color: p.color ?? "#d97706" }}>
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// Custom Area Tooltip
interface AreaTooltipProps {
  active?: boolean;
  payload?: AreaTooltipPayload[];
  label?: string;
}

function AreaTooltipContent({ active, payload, label }: AreaTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const rank = payload[0]?.value;
  return (
    <div className="urv-tooltip urv-tooltip-area">
      <p className="urv-tooltip-label">{label}</p>
      <p className="urv-tooltip-rank">#{rank}</p>
      <p className="urv-tooltip-sub">Global Ranking</p>
    </div>
  );
}

// Animated rounded-top bar shape
interface RoundedBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  radius?: number;
  animIndex?: number;
}

function RoundedBar({ x = 0, y = 0, width = 0, height = 0, fill = "#d97706", radius = 4 }: RoundedBarProps) {
  if (height <= 0 || width <= 0) return null;
  return (
    <path
      d={`
        M ${x},${y + height}
        L ${x},${y + radius}
        Q ${x},${y} ${x + radius},${y}
        L ${x + width - radius},${y}
        Q ${x + width},${y} ${x + width},${y + radius}
        L ${x + width},${y + height}
        Z
      `}
      fill={fill}
    />
  );
}

// ─── Panel Wrapper ────────────────────────────────────────────────────────────

interface PanelProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay?: number;
}

function Panel({ title, subtitle, children, delay = 0 }: PanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="urv-panel"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="urv-panel-header">
        <div>
          <h2 className="urv-panel-title">{title}</h2>
          <p className="urv-panel-subtitle">{subtitle}</p>
        </div>
        <div className="urv-panel-dot" />
      </div>
      <div className="urv-panel-body">{children}</div>
    </motion.div>
  );
}

// ─── Task 1: Donut Chart ──────────────────────────────────────────────────────

function DonutChartPanel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const totalWeight = METRIC_WEIGHTS.reduce((s, m) => s + m.value, 0);

  const handleEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
    setHoverPct(METRIC_WEIGHTS[index].value);
  };
  const handleLeave = () => {
    setActiveIndex(null);
    setHoverPct(null);
  };

  return (
    <Panel
      title="Metric Weights"
      subtitle="Academic scoring distribution"
      delay={0.0}
    >
      <div className="urv-donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={METRIC_WEIGHTS}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={(props: import("recharts").PieLabelRenderProps) => (
                <DonutLabel
                  cx={props.cx as number ?? 0}
                  cy={props.cy as number ?? 0}
                  midAngle={props.midAngle as number ?? 0}
                  innerRadius={props.innerRadius as number ?? 0}
                  outerRadius={props.outerRadius as number ?? 0}
                  percent={props.percent as number ?? 0}
                  name={props.name as string ?? ""}
                />
              )}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
              isAnimationActive
              animationBegin={200}
              animationDuration={900}
            >
              {METRIC_WEIGHTS.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                  stroke="transparent"
                  style={{
                    transform:
                      activeIndex === i
                        ? "scale(1.08)"
                        : "scale(1)",
                    transformOrigin: "center",
                    transformBox: "fill-box",
                    transition: "transform 0.2s ease",
                    filter:
                      activeIndex !== null && activeIndex !== i
                        ? "brightness(0.45)"
                        : "brightness(1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>
            <RechartsTooltip content={<DonutTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center live readout */}
        <div className="urv-donut-center">
          <AnimatePresence mode="wait">
            {hoverPct !== null ? (
              <motion.span
                key="pct"
                className="urv-donut-pct"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                {hoverPct}%
              </motion.span>
            ) : (
              <motion.span
                key="total"
                className="urv-donut-total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {totalWeight}
                <span className="urv-donut-unit">pts</span>
              </motion.span>
            )}
          </AnimatePresence>
          <p className="urv-donut-label">
            {activeIndex !== null
              ? METRIC_WEIGHTS[activeIndex].name
              : "Total Weight"}
          </p>
        </div>
      </div>

      {/* Legend */}
      <ul className="urv-legend">
        {METRIC_WEIGHTS.map((m, i) => (
          <motion.li
            key={m.name}
            className={`urv-legend-item ${activeIndex === i ? "urv-legend-active" : ""}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            onMouseEnter={() => handleEnter(null, i)}
            onMouseLeave={handleLeave}
          >
            <span className="urv-legend-dot" style={{ background: m.color }} />
            <span className="urv-legend-name">{m.name}</span>
            <span className="urv-legend-val">{m.value}%</span>
          </motion.li>
        ))}
      </ul>
    </Panel>
  );
}

// ─── Task 2: Bar Chart ────────────────────────────────────────────────────────

function PlacementBarPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (inView) setAnimKey((k) => k + 1);
  }, [inView]);

  return (
    <Panel
      title="Year-over-Year Placements"
      subtitle="Graduate employment outcomes (2021–2025)"
      delay={0.1}
    >
      <div ref={ref}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            key={animKey}
            data={PLACEMENT_DATA}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Inter, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip content={<BarTooltipContent />} cursor={{ fill: "rgba(217,119,6,0.06)" }} />
            <Bar
              dataKey="placements"
              name="Placements"
              fill="#d97706"
              shape={<RoundedBar radius={5} />}
              isAnimationActive
              animationBegin={150}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {PLACEMENT_DATA.map((_, i) => (
                <Cell
                  key={i}
                  fill={`hsl(38, ${68 + i * 4}%, ${42 + i * 4}%)`}
                />
              ))}
            </Bar>
            <Bar
              dataKey="median"
              name="Median CTC (k)"
              fill="#334155"
              shape={<RoundedBar radius={5} />}
              isAnimationActive
              animationBegin={350}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Staggered stat cards */}
      <div className="urv-bar-stats">
        {[
          { label: "Total Placed", value: "9,780", delta: "+21%" },
          { label: "Peak Year", value: "2025", delta: "Best" },
          { label: "YoY Growth", value: "14.9%", delta: "↑ avg" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="urv-stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.45 }}
          >
            <span className="urv-stat-value">{s.value}</span>
            <span className="urv-stat-label">{s.label}</span>
            <span className="urv-stat-delta">{s.delta}</span>
          </motion.div>
        ))}
      </div>
    </Panel>
  );
}

// ─── Task 3: Area Graph ───────────────────────────────────────────────────────

const AREA_GRADIENT_ID = "rankGradient";

function RankingAreaPanel() {
  // Recharts renders lower rank # as better — invert Y domain so rank 1 = top
  const minRank = Math.min(...RANKING_TREND.map((d) => d.rank));
  const maxRank = Math.max(...RANKING_TREND.map((d) => d.rank));

  return (
    <Panel
      title="5-Year Ranking Trend"
      subtitle="Global position trajectory (lower = better)"
      delay={0.2}
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={RANKING_TREND}
          margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={AREA_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Inter, sans-serif" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[maxRank + 2, minRank - 2]}
            reversed={false}
            tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Inter, sans-serif" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `#${v}`}
          />
          <RechartsTooltip
            content={<AreaTooltipContent />}
            cursor={{ stroke: "#d97706", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          <ReferenceLine
            y={RANKING_TREND[RANKING_TREND.length - 1].rank}
            stroke="#d97706"
            strokeDasharray="5 5"
            strokeOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="rank"
            stroke="#d97706"
            strokeWidth={2.5}
            fill={`url(#${AREA_GRADIENT_ID})`}
            dot={{
              r: 4,
              fill: "#d97706",
              strokeWidth: 2,
              stroke: "#0f172a",
            }}
            activeDot={{
              r: 7,
              fill: "#fbbf24",
              stroke: "#0f172a",
              strokeWidth: 2,
            }}
            isAnimationActive
            animationBegin={300}
            animationDuration={1100}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Trend badges */}
      <div className="urv-trend-badges">
        {RANKING_TREND.map((d, i) => (
          <motion.div
            key={d.year}
            className="urv-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.09, duration: 0.35 }}
          >
            <span className="urv-badge-year">{d.year}</span>
            <span className="urv-badge-rank">#{d.rank}</span>
          </motion.div>
        ))}
        <motion.div
          className="urv-badge urv-badge-delta"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
        >
          <span className="urv-badge-year">Δ Change</span>
          <span className="urv-badge-rank urv-badge-up">
            ↑ {maxRank - minRank} spots
          </span>
        </motion.div>
      </div>
    </Panel>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export default function UniversityRankingVisuals() {
  return (
    <>
      {/* Scoped styles — avoids polluting global CSS */}
      <style>{`
        /* ── Layout ─────────────────────────────── */
        .urv-root {
          width: 100%;
          padding: 28px 24px;
          background: #020617;
          font-family: 'Inter', 'Segoe UI', sans-serif;
        }

        .urv-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 12px;
          flex-wrap: wrap;
        }

        .urv-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }

        .urv-heading span {
          color: #d97706;
        }

        .urv-meta {
          font-size: 0.72rem;
          color: #475569;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .urv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .urv-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .urv-grid { grid-template-columns: 1fr; }
          .urv-heading { font-size: 1.2rem; }
        }

        /* ── Panel ──────────────────────────────── */
        .urv-panel {
          background: #0f172a;
          border: 1px solid rgba(148,163,184,0.1);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .urv-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 20px 20px 0;
        }

        .urv-panel-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: -0.01em;
          margin: 0 0 2px;
        }

        .urv-panel-subtitle {
          font-size: 0.72rem;
          color: #475569;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .urv-panel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d97706;
          box-shadow: 0 0 8px #d9770660;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .urv-panel-body {
          padding: 16px 16px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Tooltip ────────────────────────────── */
        .urv-tooltip {
          background: #1e293b;
          border: 1px solid rgba(217,119,6,0.35);
          border-radius: 8px;
          padding: 10px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          font-family: 'Inter', sans-serif;
        }

        .urv-tooltip-label {
          font-size: 0.72rem;
          color: #94a3b8;
          margin: 0 0 4px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .urv-tooltip-value {
          font-size: 1rem;
          font-weight: 700;
          color: #fbbf24;
          margin: 0 0 1px;
        }

        .urv-tooltip-area {
          text-align: center;
        }

        .urv-tooltip-rank {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fbbf24;
          margin: 4px 0 0;
          letter-spacing: -0.04em;
        }

        .urv-tooltip-sub {
          font-size: 0.68rem;
          color: #64748b;
          margin: 2px 0 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* ── Donut ──────────────────────────────── */
        .urv-donut-wrap {
          position: relative;
        }

        .urv-donut-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }

        .urv-donut-pct {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .urv-donut-total {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          color: #e2e8f0;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .urv-donut-unit {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          margin-left: 2px;
        }

        .urv-donut-label {
          font-size: 0.62rem;
          color: #64748b;
          margin: 4px 0 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          max-width: 70px;
          text-align: center;
        }

        /* ── Legend ─────────────────────────────── */
        .urv-legend {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .urv-legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
          border: 1px solid transparent;
        }

        .urv-legend-item:hover,
        .urv-legend-active {
          background: rgba(217,119,6,0.08);
          border-color: rgba(217,119,6,0.2);
        }

        .urv-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .urv-legend-name {
          flex: 1;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .urv-legend-val {
          font-size: 0.75rem;
          font-weight: 600;
          color: #e2e8f0;
          font-variant-numeric: tabular-nums;
        }

        /* ── Bar Stats ──────────────────────────── */
        .urv-bar-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .urv-stat-card {
          background: #1e293b;
          border: 1px solid rgba(148,163,184,0.1);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .urv-stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: -0.02em;
        }

        .urv-stat-label {
          font-size: 0.65rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .urv-stat-delta {
          font-size: 0.68rem;
          color: #4ade80;
          font-weight: 600;
        }

        /* ── Trend Badges ───────────────────────── */
        .urv-trend-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .urv-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #1e293b;
          border: 1px solid rgba(148,163,184,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          min-width: 52px;
        }

        .urv-badge-delta {
          border-color: rgba(217,119,6,0.3);
          background: rgba(217,119,6,0.08);
          flex: 1;
        }

        .urv-badge-year {
          font-size: 0.62rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .urv-badge-rank {
          font-size: 0.9rem;
          font-weight: 700;
          color: #e2e8f0;
          letter-spacing: -0.02em;
        }

        .urv-badge-up {
          color: #4ade80;
        }
      `}</style>

      <div className="urv-root">
        {/* Header */}
        <motion.div
          className="urv-heading-row"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="urv-heading">
            University <span>Analytics</span> Dashboard
          </h1>
          <p className="urv-meta">AUR · Academic Intelligence Suite · 2025</p>
        </motion.div>

        {/* 3-Column Grid */}
        <div className="urv-grid">
          <DonutChartPanel />
          <PlacementBarPanel />
          <RankingAreaPanel />
        </div>
      </div>
    </>
  );
}
