"""Update: adding by Urvi
Response schemas for the public-facing routers
(universities, rankings, countries, compare, search).

These exist purely to give FastAPI/Swagger an accurate response_model,
so /docs shows the real shape instead of a generic placeholder, and so
FastAPI validates/filters the outgoing data.
"""

from typing import List, Optional
from pydantic import BaseModel


class University(BaseModel):
    id: str
    name: str
    location: str
    subregion: str
    rank: Optional[int] = None
    rank_2025: Optional[int] = None
    history: List[Optional[int]] = []
    size: str
    focus: str
    research: str
    isPublic: bool
    overall: Optional[float] = None
    academicReputation: Optional[float] = None
    employerReputation: Optional[float] = None
    employability: Optional[float] = None
    facultyStudentRatio: Optional[float] = None
    teaching: Optional[float] = None
    citations: Optional[float] = None
    intlStudents: Optional[float] = None
    intlFaculty: Optional[float] = None
    papersPerFaculty: Optional[float] = None
    staffWithPhd: Optional[float] = None
    intlResearchNetwork: Optional[float] = None
    inboundExchange: Optional[float] = None
    outboundExchange: Optional[float] = None
    subjects: List[str] = []
    languages: List[str] = []
    tuition: Optional[float] = None
    description: Optional[str] = None
    programs: List[str] = []
    campusPhoto: Optional[str] = None
    hasMedicine: Optional[bool] = None
    hasScholarship: Optional[bool] = None


class UniversityListResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[University]


class RankingsResponse(BaseModel):
    metric: str
    total: int
    data: List[University]


class CountrySummary(BaseModel):
    country: str
    university_count: int
    subregion: str


class CountryUniversitiesResponse(BaseModel):
    country: str
    total: int
    data: List[University]


class CompareResponse(BaseModel):
    count: int
    universities: List[University]


class SearchResponse(BaseModel):
    query: str
    total: int
    data: List[University]

class SummaryResponse(BaseModel):
    total_universities: int


class CountryCount(BaseModel):
    country: str
    count: int


class TopUniversity(BaseModel):
    rank: Optional[int] = None
    name: str
    country: str
    overall: Optional[float] = None


class SubregionCount(BaseModel):
    subregion: str
    count: int


class CountryAverageScore(BaseModel):
    country: str
    average_score: float    

from pydantic import BaseModel, EmailStr
from datetime import datetime
import uuid


class NewsletterSubscribeRequest(BaseModel):
    email: EmailStr


class NewsletterUnsubscribeRequest(BaseModel):
    email: EmailStr


class NewsletterSubscriberResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    subscribed_at: datetime
    active: bool

    class Config:
        from_attributes = True  