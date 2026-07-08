import type { Article } from "../data";
import type { BlogCategory, BlogFormValues, BlogStatus, StoredBlog } from "../types/blog";

const BLOG_STORAGE_KEY = "aur-created-blogs";

export const BLOG_CATEGORY_TABS: Record<BlogCategory, "featured" | "reports" | "insights"> = {
  "Featured Insight": "featured",
  "Latest Report": "reports",
  "Regional Briefing": "insights",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function createSlug(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-blog";
}

function parseStoredBlogs(raw: string | null): StoredBlog[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getStoredBlogs(): StoredBlog[] {
  if (!isBrowser()) return [];
  return parseStoredBlogs(window.localStorage.getItem(BLOG_STORAGE_KEY));
}

export function getStoredBlog(id: string): StoredBlog | undefined {
  return getStoredBlogs().find((blog) => blog.id === id);
}

function saveStoredBlogs(blogs: StoredBlog[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
}

export function createStoredBlog(values: BlogFormValues, status: BlogStatus): StoredBlog {
  const now = new Date().toISOString();
  const existingBlogs = getStoredBlogs();
  const baseSlug = createSlug(values.title);
  const existingIds = new Set(existingBlogs.map((blog) => blog.id));
  let id = baseSlug;
  let suffix = 2;

  while (existingIds.has(id)) {
    id = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const blog: StoredBlog = {
    id,
    title: values.title.trim(),
    category: values.category as BlogCategory,
    description: values.description.trim(),
    content: values.content.trim(),
    author: values.author.trim(),
    coverImage: values.coverImage,
    readTime: values.readTime.trim(),
    publishDate: values.publishDate,
    tags: values.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    featured: values.featured,
    status,
    createdAt: now,
    updatedAt: now,
  };

  saveStoredBlogs([blog, ...existingBlogs]);
  return blog;
}

export function getPublishedStoredBlogs(): StoredBlog[] {
  return getStoredBlogs().filter((blog) => blog.status === "Published");
}

function formatDisplayDate(value: string) {
  if (!value) return "Draft date";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function storedBlogToArticle(blog: StoredBlog): Article {
  return {
    id: blog.id,
    title: blog.title,
    subtitle: blog.description,
    source: blog.author || "AUR Editorial",
    date: formatDisplayDate(blog.publishDate),
    contentSummary: blog.description,
    image: blog.coverImage,
    readTime: blog.readTime || "5 min read",
    content: blog.content,
    category: blog.category,
    tags: blog.tags,
  };
}
