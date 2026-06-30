"use client";

import React, { useState } from "react";
import {
  BookOpen,
  BarChart3,
  GraduationCap,
  Globe2,
  Award,
  Database,
  FileText,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Info,
  TrendingUp,
  Users,
  FlaskConical,
  Briefcase,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface MetricDefinition {
  id: string;
  label: string;
  weight: number;
  color: string;
  icon: any;
  description: string;
  dataSource: string;
  subIndicators: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

// ── Static Data ────────────────────────────────────────────────────────────

const METRICS: MetricDefinition[] = [
  {
    id: "academic-reputation",
    label: "Academic Reputation",
    weight: 30,
    color: "#3b82f6",
    icon: Award,
    description:
      "Derived from the Global Academic Survey, which collects opinions from over 100,000 academics worldwide on which institutions they consider excellent for research and teaching in their field.",
    dataSource: "QS Global Academic Survey · Annual peer review cycle",
    subIndicators: [
      "Peer citation frequency per published paper",
      "Academic survey weighting by domain",
      "Cross-institutional citation graph analysis",
      "H-index normalisation across disciplines",
    ],
  },
  {
    id: "employer-reputation",
    label: "Employer Reputation",
    weight: 20,
    color: "#10b981",
    icon: Briefcase,
    description:
      "Sourced from the Global Employer Survey, gathering responses from over 75,000 employers across industries to identify which universities produce the most competent, innovative graduates.",
    dataSource: "QS Employer Reputation Survey · Employer panel 2024–2026",
    subIndicators: [
      "Graduate hire preference by sector",
      "Employer satisfaction index",
      "Alumni career trajectory tracking",
      "Industry partnership density score",
    ],
  },
  {
    id: "faculty-student",
    label: "Faculty–Student Ratio",
    weight: 20,
    color: "#f59e0b",
    icon: Users,
    description:
      "Measures the number of academic staff per enrolled student. A lower ratio signals more direct access to research mentors and higher quality teaching time per student.",
    dataSource: "Institutional self-reported data · UNESCO IESALC registry",
    subIndicators: [
      "Full-time equivalent academic staff count",
      "Enrolled undergraduate and postgraduate headcount",
      "Part-time faculty weighting coefficient",
      "Staff attrition adjustment factor",
    ],
  },
  {
    id: "citations",
    label: "Citations per Faculty",
    weight: 20,
    color: "#8b5cf6",
    icon: FlaskConical,
    description:
      "Calculated from Elsevier's Scopus database. Counts total citations received by all papers published by faculty over a five-year rolling window, normalised by the number of academic staff.",
    dataSource: "Elsevier Scopus · 5-year rolling citation window",
    subIndicators: [
      "Scopus-indexed publications per faculty",
      "Cross-field citation normalisation",
      "Self-citation exclusion protocol",
      "Open-access paper weighting bonus",
    ],
  },
  {
    id: "international",
    label: "International Diversity",
    weight: 10,
    color: "#ec4899",
    icon: Globe2,
    description:
      "Comprises two equally weighted sub-metrics: the proportion of international students enrolled and the proportion of international academic staff. Reflects an institution's global openness.",
    dataSource: "Institutional disclosures · Host-country immigration records",
    subIndicators: [
      "International student enrolment ratio",
      "International faculty ratio",
      "Exchange programme participation rate",
      "Bilateral agreement density index",
    ],
  },
];

const DATA_SOURCES = [
  {
    name: "Elsevier Scopus",
    category: "Citation Database",
    description: "Primary source for research impact, citation counts, and H-index calculations across all indexed institutions.",
    icon: Database,
  },
  {
    name: "QS Global Academic Survey",
    category: "Peer Review",
    description: "Annual survey of 100,000+ academics rating institutional research and teaching quality by discipline.",
    icon: BookOpen,
  },
  {
    name: "QS Employer Survey",
    category: "Industry Panel",
    description: "75,000+ employer responses across 130 countries rating graduate competency by institution and field.",
    icon: Briefcase,
  },
  {
    name: "UNESCO IESALC",
    category: "Institutional Records",
    description: "Verified enrolment figures, faculty counts, and institutional classifications from government registries.",
    icon: FileText,
  },
  {
    name: "Government Statistics",
    category: "National Data",
    description: "Official ministry-level data on student numbers, research funding, and accreditation status per country.",
    icon: BarChart3,
  },
  {
    name: "Institutional Submissions",
    category: "Self-Reported",
    description: "Direct submissions from universities, verified against third-party audits before inclusion in the index.",
    icon: GraduationCap,
  },
];

const FAQS: FaqItem[] = [
  {
    question: "How often are rankings updated?",
    answer:
      "The main index is published annually in Q2. However, citation impact scores are refreshed quarterly using rolling Scopus data, and the live recalculator on the Rankings Engine page reflects any weight change instantly using the latest snapshot.",
  },
  {
    question: "Can I customise the weighting formula?",
    answer:
      "Yes. The Rankings Engine includes a Weights Recalculator that lets you drag sliders for each of the five core metrics. Rankings are recalculated client-side in real time, so you can build a personalised index tailored to your priorities — for example, upweighting employability if you are a student focused on career outcomes.",
  },
  {
    question: "How are medical universities evaluated differently?",
    answer:
      "Medical institutions are assessed against the same five-metric framework, but citations are normalised against health-science discipline benchmarks from Scopus MeSH categories. Clinical teaching score is derived from hospital affiliation strength and residency placement rates where data is available.",
  },
  {
    question: "What is the minimum data threshold for inclusion?",
    answer:
      "An institution must have at least 400 Scopus-indexed publications over the prior five years, verified enrolment data from a national registry, and a minimum of 200 employer survey responses referencing its graduates in order to be included in the main ranking table.",
  },
  {
    question: "How do you handle universities without full data coverage?",
    answer:
      "Where a specific indicator is unavailable, that metric is excluded from the weighted average and the remaining weights are rescaled proportionally to sum to 100%. Institutions with more than two missing indicators are moved to the Emerging category rather than the main ranked table.",
  },
  {
    question: "How is the AUR index different from QS or THE?",
    answer:
      "AUR focuses exclusively on Asian institutions and includes a regional context layer — covering Central Asian medical universities, ASEAN emerging institutions, and country-level trend analytics that global rankings do not surface. The custom weights engine also enables bespoke ranking, which published global tables do not offer.",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function WeightDonut({ metrics }: { metrics: MetricDefinition[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const stroke = 28;
  const circumference = 2 * Math.PI * r;

  let cumulativeDeg = -90; // start at 12 o'clock

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Metric weight distribution donut chart">
      {metrics.map((m) => {
        const fraction = m.weight / 100;
        const dashArray = fraction * circumference;
        const dashOffset = circumference * (1 - fraction);
        const startAngle = cumulativeDeg;
        cumulativeDeg += fraction * 360;

        // Convert angle to radians for label positioning
        const midAngle = ((startAngle + cumulativeDeg) / 2) * (Math.PI / 180);
        const labelR = r + stroke / 2 + 2;
        const lx = cx + labelR * Math.cos(midAngle);
        const ly = cy + labelR * Math.sin(midAngle);

        return (
          <g key={m.id} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${startAngle + 90}deg)` }}>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={m.color}
              strokeWidth={stroke}
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={circumference * 0.25}
              opacity={0.9}
            />
          </g>
        );
      })}
      {/* Centre label */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--aur-text)" fontSize="11" fontWeight="700" fontFamily="var(--font-mono)">
        5
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--aur-text-muted)" fontSize="9" fontFamily="var(--font-sans)" letterSpacing="1">
        METRICS
      </text>
    </svg>
  );
}

function MetricBar({ metric, isExpanded, onToggle }: { metric: MetricDefinition; isExpanded: boolean; onToggle: () => void }) {
  const Icon = metric.icon;
  return (
    <div className="border border-[var(--aur-border)] rounded-2xl overflow-hidden bg-[var(--aur-surface)] transition-shadow hover:shadow-[var(--aur-shadow-sm)]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-5 text-left group"
        aria-expanded={isExpanded}
      >
        {/* Weight badge */}
        <span
          className="shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-white text-sm font-black font-mono shadow-sm"
          style={{ backgroundColor: metric.color }}
        >
          {metric.weight}%
        </span>

        {/* Label + icon */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon className="h-4 w-4 shrink-0 text-[var(--aur-text-muted)]" />
          <span className="font-bold text-sm text-[var(--aur-text)] truncate">{metric.label}</span>
        </div>

        {/* Weight bar */}
        <div className="hidden sm:flex flex-1 max-w-[180px] items-center gap-3">
          <div className="flex-1 h-2 bg-[var(--aur-surface-2)] rounded-full overflow-hidden border border-[var(--aur-border)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${metric.weight}%`, backgroundColor: metric.color }}
            />
          </div>
          <span className="text-[10px] font-mono font-bold text-[var(--aur-text-muted)] shrink-0">{metric.weight}%</span>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--aur-text-muted)] transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded detail panel */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-[var(--aur-border)] bg-[var(--aur-surface-2)]">
          <p className="text-sm text-[var(--aur-text-secondary)] leading-relaxed mt-5 mb-4">
            {metric.description}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-3.5 w-3.5 text-[var(--aur-text-muted)] shrink-0" />
            <span className="text-[10px] font-mono text-[var(--aur-text-muted)] uppercase tracking-wider">
              {metric.dataSource}
            </span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {metric.subIndicators.map((si) => (
              <li key={si} className="flex items-start gap-2 text-xs text-[var(--aur-text-secondary)]">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: metric.color }} />
                {si}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--aur-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-bold text-[var(--aur-text)] group-hover:text-[var(--aur-text-secondary)] transition-colors">
          {item.question}
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-[var(--aur-text-muted)] transition-transform duration-200 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-sm text-[var(--aur-text-secondary)] leading-relaxed pb-5">
          {item.answer}
        </p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function Methodology() {
  const [expandedMetric, setExpandedMetric] = useState<string | null>("academic-reputation");

  const toggleMetric = (id: string) => {
    setExpandedMetric((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 font-sans flex-grow animate-fadeIn space-y-16 bg-[var(--background)] max-w-5xl">

      {/* ── Page Header ── */}
      <div className="flex flex-col items-center justify-center text-center pb-6">
        <span className="aur-caption">Transparency Report</span>
        <h1 className="aur-section-title text-3xl md:text-4xl leading-tight mt-3">
          Ranking Methodology
        </h1>
        <p className="text-[11px] text-[var(--aur-text-muted)] font-mono mt-4 tracking-wide text-center">
          Five-metric framework · Globally validated data · Last audited: June 2026 · QS Aligned
        </p>
      </div>

      {/* ── Formula Overview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-2 flex flex-col items-center gap-6">
          <WeightDonut metrics={METRICS} />
          {/* Legend */}
          <ul className="space-y-2 w-full max-w-[220px]">
            {METRICS.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-[var(--aur-text-secondary)] font-medium">{m.label}</span>
                </span>
                <span className="font-mono font-bold text-[var(--aur-text)]">{m.weight}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">Score Formula</span>
          <div className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface-2)] font-mono text-sm">
            <p className="text-[var(--aur-text-secondary)] leading-loose">
              <span className="text-[var(--aur-text)] font-bold">Score</span> ={" "}
              <span style={{ color: "#3b82f6" }}>(AcadRep × 0.30)</span>
              {" + "}
              <span style={{ color: "#10b981" }}>(EmpRep × 0.20)</span>
              {" + "}
              <span style={{ color: "#f59e0b" }}>(FSR × 0.20)</span>
              {" + "}
              <span style={{ color: "#8b5cf6" }}>(Cit × 0.20)</span>
              {" + "}
              <span style={{ color: "#ec4899" }}>(Intl × 0.10)</span>
            </p>
          </div>
          <p className="text-xs text-[var(--aur-text-secondary)] leading-relaxed">
            Each metric is normalised to a 0–100 scale before weighting. Normalisation uses the{" "}
            <strong className="text-[var(--aur-text)]">z-score method</strong> within each year's dataset, anchored
            to the top-performing institution in that metric as the 100-point benchmark.
          </p>
          <p className="text-xs text-[var(--aur-text-secondary)] leading-relaxed">
            The <strong className="text-[var(--aur-text)]">Rankings Engine</strong> on this platform lets you override
            the above weights in real time — useful for students prioritising employability over research, or
            institutions benchmarking research performance specifically.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--aur-text-muted)] mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Custom weights applied instantly via client-side recalculation — no server round-trip.</span>
          </div>
        </div>
      </div>

      {/* ── Metric Deep Dives ── */}
      <div>
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">Metric Definitions</span>
          <h2 className="text-2xl font-serif font-bold text-[var(--aur-text)] mt-2">
            Five Core Indicators
          </h2>
          <p className="text-sm text-[var(--aur-text-secondary)] mt-2">
            Click any indicator to expand its full specification, data source, and sub-indicators.
          </p>
        </div>
        <div className="space-y-3">
          {METRICS.map((m) => (
            <MetricBar
              key={m.id}
              metric={m}
              isExpanded={expandedMetric === m.id}
              onToggle={() => toggleMetric(m.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Data Sources ── */}
      <div>
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">Data Provenance</span>
          <h2 className="text-2xl font-serif font-bold text-[var(--aur-text)] mt-2">
            Six Verified Source Channels
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DATA_SOURCES.map((ds) => {
            const Icon = ds.icon;
            return (
              <div
                key={ds.name}
                className="p-6 rounded-2xl border border-[var(--aur-border)] bg-[var(--aur-surface)] hover:border-[var(--aur-border-strong)] hover:shadow-[var(--aur-shadow-sm)] transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-[var(--aur-surface-2)] border border-[var(--aur-border)] flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-[var(--aur-text-secondary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--aur-text)] leading-tight">{ds.name}</p>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--aur-text-muted)]">
                      {ds.category}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--aur-text-secondary)] leading-relaxed">{ds.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Update Cadence ── */}
      <div className="rounded-3xl border border-[var(--aur-border)] bg-[var(--aur-surface)] overflow-hidden">
        <div className="px-8 py-6 border-b border-[var(--aur-border)]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">Update Schedule</span>
          <h2 className="text-xl font-serif font-bold text-[var(--aur-text)] mt-1">Publication Cadence</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--aur-border)]">
          {[
            {
              freq: "Quarterly",
              title: "Citation Refresh",
              desc: "Scopus citation counts and H-index values updated from rolling 5-year window.",
            },
            {
              freq: "Bi-Annual",
              title: "Survey Waves",
              desc: "Academic and employer survey data collected in Jan and Jul, integrated after validation.",
            },
            {
              freq: "Annual",
              title: "Full Index Release",
              desc: "Complete ranked table published in Q2 with revised weights, data audit report, and methodology changelog.",
            },
          ].map((c) => (
            <div key={c.freq} className="px-8 py-7">
              <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[var(--aur-border-strong)] bg-[var(--aur-surface-2)] text-[var(--aur-text-secondary)] mb-3">
                {c.freq}
              </span>
              <p className="text-sm font-bold text-[var(--aur-text)] mb-2">{c.title}</p>
              <p className="text-xs text-[var(--aur-text-secondary)] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div>
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">Common Questions</span>
          <h2 className="text-2xl font-serif font-bold text-[var(--aur-text)] mt-2">FAQ</h2>
        </div>
        <div className="border border-[var(--aur-border)] rounded-2xl bg-[var(--aur-surface)] px-6 divide-y divide-[var(--aur-border)]">
          {FAQS.map((faq) => (
            <FaqRow key={faq.question} item={faq} />
          ))}
        </div>
      </div>

    </div>
  );
}
