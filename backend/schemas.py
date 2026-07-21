"""Update: adding by Urvi
Response schemas for the public-facing routers
(universities, rankings, countries, compare, search).

These exist purely to give FastAPI/Swagger an accurate response_model,
so /docs shows the real shape instead of a generic placeholder, and so
FastAPI validates/filters the outgoing data.
"""

from typing import List, Optional
from datetime import date, datetime
from uuid import UUID
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field


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

class TopMover(BaseModel):
    id: str
    name: str
    country: str
    rank_2026: Optional[int] = None
    rank_2025: Optional[int] = None
    improvement: int


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

class NewsItemResponse(BaseModel):
    id: str
    university_id: str
    headline: str
    category: str
    published_date: datetime
    rank_change: Optional[str] = None

    model_config = ConfigDict(from_attributes = True)    

class NewsFlashResponse(BaseModel):
    data: List[NewsItemResponse]

class NewsListResponse(BaseModel):
    page: int
    limit: int
    total: int
    data: List[NewsItemResponse]    

class ExternalNewsItem(BaseModel):
    """
    Shape for a single article pulled live from GNews.
    Deliberately separate from NewsItemResponse (internal AUR news) —
    external articles don't have university_id/rank_change etc.
    """
    title: str
    description: Optional[str] = None
    url: str
    source: Optional[str] = None
    published_at: Optional[datetime] = None
    image: Optional[str] = None

class ExternalNewsResponse(BaseModel):
    data: List[ExternalNewsItem]

class MethodologyVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    version: str
    title: str
    description: str | None = None
    release_date: date
    is_current: bool
    created_at: datetime
    
class MethodologyVersionCreate(BaseModel):
    version: str
    title: str
    description: Optional[str] = None
    release_date: date
    is_current: bool = False

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)

class ChatResponse(BaseModel):
    reply: str
      
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: str                       # "event" or "award"
    eligibility_criteria: Optional[str] = None
    deadline: Optional[date] = None


class EventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    type: str
    eligibility_criteria: Optional[str] = None
    deadline: Optional[date] = None
    status: str
    created_at: datetime


class ApplicationCreate(BaseModel):
    event_id: uuid.UUID
    university_id: uuid.UUID
    documents: List[str] = []


class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    event_id: uuid.UUID
    university_id: uuid.UUID
    documents: List[str] = []
    status: str
    submitted_at: datetime


class JudgeScoreCreate(BaseModel):
    judge_id: str
    academic_score: float
    research_score: float
    outcomes_score: float
    impact_score: float
    collaboration_score: float
    governance_score: float


class FinalScoreResponse(BaseModel):
    application_id: uuid.UUID
    final_score: float
    judges_count: int



class NominationCreate(BaseModel):
    nominee_name: str
    nominee_email: str
    category: str
    department: str
    university_id: uuid.UUID
    justification: str


class NominationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    submitted_by_user_id: uuid.UUID
    nominee_name: str
    nominee_email: str
    category: str
    department: str
    university_id: uuid.UUID
    justification: str
    documents: List[str] = []
    status: str
    submitted_at: datetime


class NotificationResponse(BaseModel):
    id: UUID
    title: str
    description: str
    category: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Blog Schemas ---
class BlogBase(BaseModel):
    title: str
    category: str
    status: str = "Draft"
    description: str
    content: str
    cover_image: Optional[str] = None
    author: Optional[str] = None
    read_time: Optional[str] = None
    tags: Optional[str] = None
    featured: bool = False
    publish_date: Optional[datetime] = None

class BlogCreate(BlogBase):
    slug: Optional[str] = None

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    author: Optional[str] = None
    read_time: Optional[str] = None
    tags: Optional[str] = None
    featured: Optional[bool] = None
    publish_date: Optional[datetime] = None
    slug: Optional[str] = None

class BlogResponse(BlogBase):
    id: UUID
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True