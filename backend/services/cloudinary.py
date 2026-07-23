"""
Handles:
  - University logo uploads  → stored under aur/logos/{slug}
  - University campus photo  → stored under aur/campus/{slug}
"""

import os
from pathlib import Path
import cloudinary
import cloudinary.uploader


cloudinary.config(
    cloudinary_url=os.getenv("CLOUDINARY_URL")
)


def upload_university_logo(file_bytes: bytes, slug: str, filename: str) -> str:
    
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=f"aur/logos",
        public_id=slug,
        overwrite=True,
        resource_type="image",
        transformation=[
            {"width": 400, "height": 400, "crop": "limit"},   # max 400x400, no upscale
            {"quality": "auto", "fetch_format": "auto"},        # auto WebP/AVIF
        ],
    )
    return result["secure_url"]
 
 
def upload_campus_photo(file_bytes: bytes, slug: str) -> str:
    
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="aur/campus",
        public_id=slug,
        overwrite=True,
        resource_type="image",
        transformation=[
            {"width": 1200, "height": 800, "crop": "fill", "gravity": "auto"},
            {"quality": "auto", "fetch_format": "auto"},
        ],
    )
    return result["secure_url"]
 
 
def delete_image(public_id: str) -> None:
    cloudinary.uploader.destroy(public_id)
 
 
def get_logo_url(slug: str) -> str:
    cloud_name = cloudinary.config().cloud_name
    return f"https://res.cloudinary.com/{cloud_name}/image/upload/aur/logos/{slug}"