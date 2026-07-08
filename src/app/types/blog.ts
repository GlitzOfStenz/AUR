export type BlogCategory = "Featured Insight" | "Latest Report" | "Regional Briefing";

export type BlogStatus = "Draft" | "Published";

export interface StoredBlog {
  id: string;
  title: string;
  category: BlogCategory;
  description: string;
  content: string;
  author: string;
  coverImage: string;
  readTime: string;
  publishDate: string;
  tags: string[];
  featured: boolean;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormValues {
  title: string;
  category: BlogCategory | "";
  description: string;
  content: string;
  author: string;
  coverImage: string;
  readTime: string;
  publishDate: string;
  tags: string;
  featured: boolean;
  status: BlogStatus;
}
