from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from uuid import UUID
import re

from ..database.engine import get_db
from ..database.models import Blog
from ..schemas import BlogCreate, BlogUpdate, BlogResponse

router = APIRouter(
    prefix="/blogs",
    tags=["blogs"]
)

def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from a title."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')

@router.post("/", response_model=BlogResponse, status_code=201)
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    """
    Create a new blog post.
    """
    slug = generate_slug(blog.title)
    
    # Check if a blog with this slug already exists to prevent duplicate slugs
    existing = db.query(Blog).filter(Blog.slug == slug).first()
    if existing:
        # Append a unique suffix if slug exists (simple implementation)
        slug = f"{slug}-{blog.publish_date or 'draft'}"
        
    db_blog = Blog(
        **blog.model_dump(),
        slug=slug
    )
    
    db.add(db_blog)
    try:
        db.commit()
        db.refresh(db_blog)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error creating blog post. Possible duplicate slug.")
        
    return db_blog

@router.get("/", response_model=List[BlogResponse])
def read_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all blog posts.
    """
    blogs = db.query(Blog).offset(skip).limit(limit).all()
    return blogs

@router.get("/{blog_id}", response_model=BlogResponse)
def read_blog(blog_id: UUID, db: Session = Depends(get_db)):
    """
    Retrieve a specific blog post by its UUID.
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.put("/{blog_id}", response_model=BlogResponse)
def update_blog(blog_id: UUID, blog_update: BlogUpdate, db: Session = Depends(get_db)):
    """
    Update a specific blog post.
    """
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
        
    update_data = blog_update.model_dump(exclude_unset=True)
    
    # If title is updated, update slug as well
    if "title" in update_data:
        update_data["slug"] = generate_slug(update_data["title"])
        
    for key, value in update_data.items():
        setattr(db_blog, key, value)
        
    try:
        db.commit()
        db.refresh(db_blog)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error updating blog post.")
        
    return db_blog

@router.delete("/{blog_id}")
def delete_blog(blog_id: UUID, db: Session = Depends(get_db)):
    """
    Delete a specific blog post.
    """
    db_blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
        
    db.delete(db_blog)
    db.commit()
    return {"ok": True, "message": "Blog deleted successfully"}
