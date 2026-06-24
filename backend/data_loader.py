import pandas as pd
import re
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "qs_asia_2026.xlsx")

def slugify(name: str) -> str:
    """Convert university name to a URL-friendly ID"""
    name = name.lower()
    name = re.sub(r"[^a-z0-9\s]", "", name)
    name = re.sub(r"\s+", "-", name.strip())
    return name[:50]

def safe_float(val):
    try:
        f = float(val)
        return round(f, 1) if not pd.isna(f) else None
    except:
        return None

def load_universities():
    df = pd.read_excel(DATA_PATH, header=2, skiprows=[3])
    df = df.iloc[1:].reset_index(drop=True)

    df.columns = [
        "index", "rank_2026", "rank_2025", "institution", "country", "subregion",
        "subregional_rank", "size", "focus", "research_level", "status",
        "ar_score", "ar_rank",
        "er_score", "er_rank",
        "fsr_score", "fsr_rank",
        "irn_score", "irn_rank",
        "cpp_score", "cpp_rank",
        "ppf_score", "ppf_rank",
        "swp_score", "swp_rank",
        "ifr_score", "ifr_rank",
        "isr_score", "isr_rank",
        "inbound_score", "inbound_rank",
        "outbound_score", "outbound_rank",
        "overall_score"
    ]

    universities = []
    for _, row in df.iterrows():
        name = str(row["institution"]).strip()
        if not name or name == "nan":
            continue

        # Clean rank (remove "=" from tied ranks like "=3")
        rank_raw = str(row["rank_2026"]).replace("=", "").strip()
        rank_2025_raw = str(row["rank_2025"]).replace("=", "").strip()

        try:
            rank = int(float(rank_raw))
        except:
            rank = None

        try:
            rank_2025 = int(float(rank_2025_raw))
        except:
            rank_2025 = None

        uni = {
            "id": slugify(name),
            "name": name,
            "location": str(row["country"]).strip(),
            "subregion": str(row["subregion"]).strip(),
            "rank": rank,
            "rank_2025": rank_2025,
            "history": [rank, rank_2025],  # 2 years of data available
            "size": str(row["size"]).strip(),
            "focus": str(row["focus"]).strip(),
            "research": str(row["research_level"]).strip(),
            "isPublic": str(row["status"]).strip().lower() == "public",
            "overall": safe_float(row["overall_score"]),
            "academicReputation": safe_float(row["ar_score"]),
            "employerReputation": safe_float(row["er_score"]),
            "employability": safe_float(row["er_score"]),
            "facultyStudentRatio": safe_float(row["fsr_score"]),
            "teaching": safe_float(row["fsr_score"]),
            "citations": safe_float(row["cpp_score"]),
            "intlStudents": safe_float(row["isr_score"]),
            "intlFaculty": safe_float(row["ifr_score"]),
            "papersPerFaculty": safe_float(row["ppf_score"]),
            "staffWithPhd": safe_float(row["swp_score"]),
            "intlResearchNetwork": safe_float(row["irn_score"]),
            "inboundExchange": safe_float(row["inbound_score"]),
            "outboundExchange": safe_float(row["outbound_score"]),
            # Fields not in dataset - set as None for now
            "subjects": [],
            "languages": [],
            "tuition": None,
            "description": None,
            "programs": [],
            "campusPhoto": None,
            "hasMedicine": None,
            "hasScholarship": None,
        }
        universities.append(uni)

    return universities

# Load once when server starts - stored in memory
UNIVERSITIES = load_universities()