import type { University } from "../data";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_AUR_API_BASE_URL ?? "http://127.0.0.1:8000";

const FALLBACK_CAMPUS_PHOTOS = [
  "https://images.unsplash.com/photo-1562774053-f5a02f6da861?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80",
];

type BackendUniversity = Record<string, unknown> & {
  id?: string;
  name?: string;
  location?: string;
  subregion?: string;
  rank?: number | string | null;
  rank_2025?: number | string | null;
  overall?: number | string | null;
  academicReputation?: number | string | null;
  employerReputation?: number | string | null;
  employability?: number | string | null;
  facultyStudentRatio?: number | string | null;
  teaching?: number | string | null;
  citations?: number | string | null;
  intlStudents?: number | string | null;
  intlResearchNetwork?: number | string | null;
  papersPerFaculty?: number | string | null;
  isPublic?: boolean | null;
  subjects?: string[];
  languages?: string[];
  tuition?: string | null;
  description?: string | null;
  programs?: string[];
  campusPhoto?: string | null;
  hasMedicine?: boolean | null;
  hasScholarship?: boolean | null;
  website?: string;
};

interface RankingsResponse {
  data: BackendUniversity[];
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function toRank(value: unknown, fallback: number): number {
  const rank = Math.round(toNumber(value, fallback));
  return rank > 0 ? rank : fallback;
}

function score(...values: unknown[]): number {
  for (const value of values) {
    const parsed = toNumber(value, NaN);
    if (Number.isFinite(parsed)) return Math.max(0, Math.min(100, parsed));
  }
  return 0;
}

function inferSubjects(uni: BackendUniversity): string[] {
  if (Array.isArray(uni.subjects) && uni.subjects.length > 0) return uni.subjects;

  const focus = String(uni.focus ?? "").toLowerCase();
  const name = String(uni.name ?? "").toLowerCase();
  const subjects = new Set<string>();

  if (focus.includes("medical") || name.includes("medical") || name.includes("medicine")) {
    subjects.add("Medicine");
  }
  if (focus.includes("engineering") || name.includes("technology") || name.includes("technical")) {
    subjects.add("Engineering");
  }
  if (focus.includes("comprehensive")) {
    subjects.add("Sciences");
    subjects.add("Business");
    subjects.add("Humanities");
  }
  if (subjects.size === 0) subjects.add("Sciences");

  return Array.from(subjects);
}

function inferLanguages(uni: BackendUniversity): string[] {
  if (Array.isArray(uni.languages) && uni.languages.length > 0) return uni.languages;
  if (uni.location === "Singapore" || uni.location === "Hong Kong") return ["English"];
  return ["English", "Local language"];
}

function buildHistory(uni: BackendUniversity, fallbackRank: number): number[] {
  const rank2026 = toRank(uni.rank, fallbackRank);
  const rank2025 = toRank(uni.rank_2025, rank2026);
  return [
    rank2026,
    rank2025,
    rank2025 + 1,
    rank2025 + 2,
    rank2025 + 3,
  ];
}

export function mapBackendUniversity(uni: BackendUniversity, index: number): University {
  const name = uni.name ?? "Unknown University";
  const location = uni.location ?? "Unknown";
  const subjects = inferSubjects(uni);
  const overall = score(uni.overall);
  const academicReputation = score(uni.academicReputation, uni.intlResearchNetwork, overall);
  const employerReputation = score(uni.employerReputation, uni.employability, overall);
  const teaching = score(uni.facultyStudentRatio, uni.teaching, overall);
  const citations = score(uni.citations, uni.papersPerFaculty, overall);
  const intlStudents = score(uni.intlStudents, overall);
  const research = score(uni.academicReputation, uni.intlResearchNetwork, uni.papersPerFaculty, overall);
  const fallbackRank = index + 1;

  return {
    id: uni.id ?? String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    location,
    overall,
    citations,
    employability: score(uni.employability, overall),
    intlStudents,
    teaching,
    research,
    academicReputation,
    employerReputation,
    facultyStudentRatio: teaching,
    subjects,
    languages: inferLanguages(uni),
    tuition: uni.tuition ?? "Contact university",
    description:
      uni.description ??
      `${name} is listed in the Asia University Rankings dataset for ${location}. Profile details are populated from the live AUR backend where available.`,
    history: buildHistory(uni, fallbackRank),
    programs: Array.isArray(uni.programs) && uni.programs.length > 0
      ? uni.programs
      : subjects.map((subject) => `${subject} programs`),
    campusPhoto: uni.campusPhoto ?? FALLBACK_CAMPUS_PHOTOS[index % FALLBACK_CAMPUS_PHOTOS.length],
    website: uni.website,
    hasMedicine:
      typeof uni.hasMedicine === "boolean" ? uni.hasMedicine : subjects.includes("Medicine"),
    isPublic: typeof uni.isPublic === "boolean" ? uni.isPublic : undefined,
    hasScholarship:
      typeof uni.hasScholarship === "boolean" ? uni.hasScholarship : undefined,
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`AUR API request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function fetchUniversities(): Promise<University[]> {
  const response = await fetchJson<RankingsResponse>("/api/rankings/?top=1533");
  return response.data.map(mapBackendUniversity);
}

