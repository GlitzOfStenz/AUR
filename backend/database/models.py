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
 
"""

import uuid

from sqlalchemy import (Boolean, Column, Integer, Numeric, String, Float, Text, 
                        Date, DateTime, ForeignKey, UniqueConstraint, text, JSON)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from datetime import date, datetime
from sqlalchemy.orm import Mapped, mapped_column


Base = declarative_base()


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
    password_hash = Column(Text, nullable=False)
    role = Column(String(50), nullable=False, default="user")  # "user" or "admin"
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    preferences = Column(JSONB, nullable=True, default=dict)

    # relationships
    saved_universities = relationship("SavedUniversity", back_populates="user", 
                                      cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role!r}>"
    

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
    
class MethodologyVersion(Base):
    __tablename__ = "methodology_versions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    version: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g. "1.0"
    title: Mapped[str] = mapped_column(String(255), nullable=False)   # e.g. "Initial QS-based methodology"
    description: Mapped[str] = mapped_column(Text, nullable=True)
    release_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)