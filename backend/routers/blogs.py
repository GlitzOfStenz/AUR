from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List
from uuid import UUID
import re

from database.connections import get_db
from database.models import Blog
from schemas import BlogCreate, BlogUpdate, BlogResponse

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
async def create_blog(blog: BlogCreate, db: AsyncSession = Depends(get_db)):
    """
    Create a new blog post.
    """
    slug = generate_slug(blog.title)
    
    # Check if a blog with this slug already exists to prevent duplicate slugs
    existing = await db.scalar(select(Blog).where(Blog.slug == slug))
    if existing:
        # Append a unique suffix if slug exists (simple implementation)
        slug = f"{slug}-{blog.publish_date or 'draft'}"
        
    db_blog = Blog(
        **blog.model_dump(),
        slug=slug
    )
    
    db.add(db_blog)
    try:
        await db.commit()
        await db.refresh(db_blog)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error creating blog post. Possible duplicate slug.")
        
    return db_blog

@router.get("/", response_model=List[BlogResponse])
async def read_blogs(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Retrieve all blog posts.
    """
    result = await db.scalars(select(Blog).offset(skip).limit(limit))
    return result.all()

@router.get("/{blog_id}", response_model=BlogResponse)
async def read_blog(blog_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a specific blog post by its UUID.
    """
    blog = await db.get(Blog, blog_id)
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog

@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(blog_id: UUID, blog_update: BlogUpdate, db: AsyncSession = Depends(get_db)):
    """
    Update a specific blog post.
    """
    db_blog = await db.get(Blog, blog_id)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
        
    update_data = blog_update.model_dump(exclude_unset=True)
    
    # If title is updated, update slug as well
    if "title" in update_data:
        update_data["slug"] = generate_slug(update_data["title"])
        
    for key, value in update_data.items():
        setattr(db_blog, key, value)
        
    try:
        await db.commit()
        await db.refresh(db_blog)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error updating blog post.")
        
    return db_blog

@router.delete("/{blog_id}")
async def delete_blog(blog_id: UUID, db: AsyncSession = Depends(get_db)):
    """
    Delete a specific blog post.
    """
    db_blog = await db.get(Blog, blog_id)
    if db_blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
        
    await db.delete(db_blog)
    await db.commit()
    return {"ok": True, "message": "Blog deleted successfully"}
