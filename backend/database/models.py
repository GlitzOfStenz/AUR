"""
Database models for AUR — Asia University Rankings.
 
Tables
------
  users               — registered accounts ( roles user / admin)
  universities        — master record per institution
  ranking_scores      — one row per university per year (all metric scores)
  university_metrics  — computed quality indicators per university
  courses             — programs / degrees offered by a university
  admission_details   — admission process, deadlines, eligibility per university
  saved_universities  — user ↔ university bookmarks (many-to-many via FK)
  newsletter_subscribers   — email subscriptions for newsletters and updates
  news_items               — university-related news, announcements, and ranking updates
  methodology_versions     — version history and release details of ranking methodology
 
"""

import uuid

from sqlalchemy import (Boolean, Column, Integer, Numeric, String, Float, Text,
                        Date, DateTime, ForeignKey, UniqueConstraint, text, JSON)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column


Base = declarative_base()
PortableJSON = JSON().with_variant(JSONB(), "postgresql")


# Users
# ------------------
class User(Base):
    """
    Registered user account.
 
    Roles
    -----
    - "user"  : standard access (search, bookmark, compare)
    - "admin" : full access (manage universities, trigger re-ranking)
    """

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=True)
    role = Column(String(50), nullable=False, default="user")  # "user" or "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    preferences = Column(PortableJSON, nullable=True, default=dict)
    preferences = Column(JSONB, nullable=True, default=dict)
    oauth_provider = Column(String(20), nullable=True)   # "google" or "github"
    oauth_id = Column(String(255), nullable=True, index=True)

    # relationships
    saved_universities = relationship("SavedUniversity", back_populates="user", 
                                      cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role!r}>"
    
class FacultyStudentNomination(Base):
    __tablename__ = "faculty_student_nominations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    submitted_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    nominee_name = Column(String, nullable=False)
    nominee_email = Column(String, nullable=False)
    category = Column(String, nullable=False)
    department = Column(String, nullable=False)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id"), nullable=False)
    justification = Column(Text, nullable=False)
    documents = Column(PortableJSON, nullable=True, default=list)
    status = Column(String, default="pending_review")
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    submitted_by = relationship("User")
    university = relationship("University")
 
# Universities   
# ------------------ 
class University(Base):

    __tablename__ = "universities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    slug = Column(String(100), unique=True, nullable=False) 
    name = Column(String(300), nullable=False, index=True)

    # Location
    country = Column(String(100), nullable=False, index=True)
    subregion = Column(String(100))
    state = Column(String(100))
    city = Column(String(100))

    # Classification
    size = Column(String(20))
    focus = Column(String(30))
    research_level = Column(String(30))
    is_public = Column(Boolean, default=True)

    # Institutional facts
    established_year = Column(Integer)
    total_students = Column(Integer)
    total_faculty = Column(Integer)
    avg_fees = Column(Numeric(12, 2))
    placement_percentage = Column(Numeric(5, 2))
    
    # Enrichment
    description = Column(Text)
    website_url = Column(String(300))
    campus_photo = Column(String(300))
    has_medicine = Column(Boolean)
    has_scholarship = Column(Boolean)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    ranking_scores = relationship("RankingScore", back_populates="university", cascade="all, delete-orphan", 
                                  lazy="selectin")
    metrics = relationship("UniversityMetric", back_populates="university", uselist=False, 
                           cascade="all, delete-orphan", lazy="selectin")
    courses = relationship("Course", back_populates="university", cascade="all, delete-orphan",
                           lazy="selectin")
    admission_details = relationship("AdmissionDetail", back_populates="university", uselist=False, 
                                     cascade="all, delete-orphan", lazy="selectin")
    saved_universities = relationship("SavedUniversity", back_populates="university",
                                      cascade="all, delete-orphan", lazy="selectin")
    
    news_items = relationship(
    "NewsItem",
    back_populates="university",
    cascade="all, delete-orphan",
    lazy="selectin"
)

    def __repr__(self) -> str:
        return f"<University id={self.id} slug={self.slug!r} country={self.country!r}>"


class RankingScore(Base):
    __tablename__ = "ranking_scores"
    __table_args__ = (
        UniqueConstraint("university_id", "year", name="uq_university_year"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), 
                           nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    rank = Column(Integer)
    overall_score = Column(Float(precision=2))

    ar_score       = Column(Float)   
    er_score       = Column(Float)   
    fsr_score      = Column(Float)   
    irn_score      = Column(Float)   
    cpp_score      = Column(Float)   
    ppf_score      = Column(Float)   
    swp_score      = Column(Float)   
    ifr_score      = Column(Float)   
    isr_score      = Column(Float)   
    inbound_score  = Column(Float)   
    outbound_score = Column(Float)
    research_output_score = Column(Float)
    research_impact_score = Column(Float)
    graduate_employability_score = Column(Float)
    industry_income_score = Column(Float)
    the_rank = Column(String(50))   

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    university = relationship("University", back_populates="ranking_scores")

    def __repr__(self) -> str:
        return f"<RankingScore university_id={self.university_id} year={self.year} rank={self.rank}>"


class UniversityMetric(Base):
    __tablename__ = "university_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), 
                           unique=True, nullable=False, index=True)
    
    research_score = Column(Numeric(5, 2)) 
    placement_score = Column(Numeric(5, 2))
    faculty_score = Column(Numeric(5, 2))

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    university = relationship("University", back_populates="metrics")

    def __repr__(self) -> str:
        return f"<UniversityMetric university_id={self.university_id}>"
    

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), 
                           nullable=False, index=True)
    
    name = Column(String(300), nullable=False)
    degree_type = Column(String(50), nullable=False)
    duration = Column(Integer)
    total_seats = Column(Integer)
    fees = Column(Numeric(12, 2))
    eligibility = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    university = relationship("University", back_populates="courses")

    def __repr__(self) -> str:
        return f"<Course id={self.id} name={self.name!r} degree_type={self.degree_type!r}>"


class AdmissionDetail(Base):
    __tablename__ = "admission_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), 
                           nullable=False, index=True)
    
    admission_process = Column(Text)
    entrance_exams = Column(String(200))
    application_deadline = Column(Date)
    minimum_gpa = Column(Numeric(3, 2))

    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    university = relationship("University", back_populates="admission_details")

    def __repr__(self) -> str:
        return f"<AdmissionDetail university_id={self.university_id} application_deadline={self.application_deadline}>"


class SavedUniversity(Base):
    __tablename__ = "saved_universities"
    __table_args__ = (
        UniqueConstraint("user_id", "university_id", name="uq_user_university"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), 
                           nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="saved_universities")
    university = relationship("University", back_populates="saved_universities")

    def __repr__(self) -> str:
        return f"<SavedUniversity user_id={self.user_id} university_id={self.university_id}>"
    
class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    email = Column(String(100), unique=True, nullable=False, index=True)
    subscribed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return f"<NewsletterSubscriber id={self.id} email={self.email!r} active={self.active}>"
    

class NewsItem(Base):
    __tablename__ = "news_items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )

    university_id = Column(
        UUID(as_uuid=True),
        ForeignKey("universities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    headline = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False)
    published_date = Column(DateTime(timezone=True), nullable=False)
    rank_change = Column(String(20))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    university = relationship(
        "University",
        back_populates="news_items"
    )

    def __repr__(self):
        return f"<NewsItem headline={self.headline!r}>"    
class MethodologyVersion(Base):
    __tablename__ = "methodology_versions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    version: Mapped[str] = mapped_column(String(20), nullable=False) 
    title: Mapped[str] = mapped_column(String(255), nullable=False)   
    description: Mapped[str] = mapped_column(Text, nullable=True)
    release_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    title = Column(String(300), nullable=False)
    description = Column(Text)
    type = Column(String(20), nullable=False)          # "event" or "award"
    eligibility_criteria = Column(Text)
    deadline = Column(Date)
    status = Column(String(20), default="open")        # open / closed / archived

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    applications = relationship("Application", back_populates="event",
                                cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Event id={self.id} title={self.title!r} type={self.type!r}>"


class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True)
    university_id = Column(UUID(as_uuid=True), ForeignKey("universities.id", ondelete="CASCADE"), nullable=False, index=True)
    documents = Column(PortableJSON, nullable=True, default=list)   # list of uploaded file paths
    status = Column(String(20), default="submitted")         # submitted / under_review / shortlisted / winner / rejected

    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    event = relationship("Event", back_populates="applications")
    university = relationship("University")
    judge_scores = relationship("JudgeScore", back_populates="application",
                                cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Application id={self.id} event_id={self.event_id} status={self.status!r}>"


class JudgeScore(Base):
    __tablename__ = "judge_scores"
    __table_args__ = (
        UniqueConstraint("application_id", "judge_id", name="uq_application_judge"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    judge_id = Column(String(150), nullable=False)   # judge name/email — admin enters this, no judge login yet

    academic_score = Column(Numeric(5, 2))
    research_score = Column(Numeric(5, 2))
    outcomes_score = Column(Numeric(5, 2))
    impact_score = Column(Numeric(5, 2))
    collaboration_score = Column(Numeric(5, 2))
    governance_score = Column(Numeric(5, 2))

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship("Application", back_populates="judge_scores")

    def __repr__(self) -> str:
        return f"<JudgeScore application_id={self.application_id} judge_id={self.judge_id!r}>"
class MembershipTier(Base):
    __tablename__ = "membership_tiers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    name = Column(String(50), nullable=False)          # "Basic" / "Premium"
    price = Column(Numeric(10, 2), nullable=False)
    duration_months = Column(Integer, nullable=False)
    benefits = Column(PortableJSON, nullable=False, default=list)  # list of benefit strings

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<MembershipTier id={self.id} name={self.name!r}>"


class UserMembership(Base):
    __tablename__ = "user_memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tier_id = Column(UUID(as_uuid=True), ForeignKey("membership_tiers.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="active")   # active / expired

    user = relationship("User")
    tier = relationship("MembershipTier")

    def __repr__(self) -> str:
        return f"<UserMembership user_id={self.user_id} tier_id={self.tier_id} status={self.status!r}>"

    

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )

    title = Column(String(200), nullable=False)
    description = Column(String(500), nullable=False)
    category = Column(String(50), nullable=False, default="general")
    is_read = Column(Boolean, default=False, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True
    )

    def __repr__(self) -> str:
        return f"<Notification id={self.id} title={self.title!r} is_read={self.is_read}>"

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    title = Column(String(300), nullable=False)
    slug = Column(String(300), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False)
    status = Column(String(50), default="Draft", nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    cover_image = Column(String, nullable=True)
    author = Column(String(100), nullable=True)
    read_time = Column(String(50), nullable=True)
    tags = Column(String, nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    publish_date = Column(Date, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Blog id={self.id} title={self.title!r} slug={self.slug!r} status={self.status!r}>"
