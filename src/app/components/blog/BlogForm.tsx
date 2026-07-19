"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileText, Send } from "lucide-react";
import { useSidebar } from "../navigation/SidebarContext";
import BlogImageUpload from "./BlogImageUpload";
import { API_BASE_URL } from "../../lib/universities";
import type { BlogFormValues, BlogStatus } from "../../types/blog";

type FormErrors = Partial<Record<keyof BlogFormValues, string>>;

const categories = ["Featured Insight", "Latest Report", "Regional Briefing"] as const;

const initialValues: BlogFormValues = {
  title: "",
  category: "",
  description: "",
  content: "",
  author: "",
  coverImage: "",
  readTime: "",
  publishDate: "",
  tags: "",
  featured: false,
  status: "Draft",
};

function todayDateValue() {
  return new Date().toISOString().slice(0, 10);
}

export default function BlogForm() {
  const router = useRouter();
  const { handleViewChange } = useSidebar();
  const [values, setValues] = useState<BlogFormValues>(() => ({
    ...initialValues,
    publishDate: todayDateValue(),
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tagPreview = useMemo(
    () =>
      values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [values.tags]
  );

  const setField = <K extends keyof BlogFormValues>(field: K, value: BlogFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.title.trim()) nextErrors.title = "Title is required.";
    if (!values.category) nextErrors.category = "Category is required.";
    if (!values.description.trim()) nextErrors.description = "Description is required.";
    if (!values.content.trim()) nextErrors.content = "Content is required.";
    if (!values.coverImage) nextErrors.coverImage = "Cover image is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (status: BlogStatus) => {
    setMessage(null);

    if (!validate()) {
      setMessage("Please complete the required fields before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        category: values.category,
        description: values.description,
        content: values.content,
        cover_image: values.coverImage,
        author: values.author,
        read_time: values.readTime,
        tags: values.tags,
        featured: values.featured,
        publish_date: values.publishDate || null,
        status,
      };

      const response = await fetch(`${API_BASE_URL}/blogs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save blog post");
      }

      if (status === "Published") {
        router.push("/");
        return;
      }

      setMessage("Draft saved successfully.");
      setValues({ ...initialValues, publishDate: todayDateValue(), status: "Draft" });
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while saving the blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-6 animate-fadeIn">
      <div className="mb-6">
        <button
          onClick={() => handleViewChange("home")}
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)] hover:text-[var(--aur-text)] transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Insights
        </button>
      </div>

      <section className="aur-card p-5 sm:p-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--aur-text-muted)]">
              Editorial Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--aur-text)] mt-1">
              Create Blog
            </h1>
          </div>
          {message && (
            <p className="text-xs font-semibold text-red-600 sm:text-right">
              {message}
            </p>
          )}
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="blog-title" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                value={values.title}
                onChange={(event) => setField("title", event.target.value)}
                className={`aur-input ${errors.title ? "border-red-400" : ""}`}
              />
              {errors.title && <span className="block text-[10px] text-red-500 font-medium">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blog-category" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="blog-category"
                  value={values.category}
                  onChange={(event) => setField("category", event.target.value as BlogFormValues["category"])}
                  className={`aur-input ${errors.category ? "border-red-400" : ""}`}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="block text-[10px] text-red-500 font-medium">{errors.category}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-status" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Status
                </label>
                <select
                  id="blog-status"
                  value={values.status}
                  onChange={(event) => setField("status", event.target.value as BlogStatus)}
                  className="aur-input"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-description" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="blog-description"
                rows={3}
                value={values.description}
                onChange={(event) => setField("description", event.target.value)}
                className={`aur-input resize-y ${errors.description ? "border-red-400" : ""}`}
              />
              {errors.description && <span className="block text-[10px] text-red-500 font-medium">{errors.description}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-content" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="blog-content"
                rows={14}
                value={values.content}
                onChange={(event) => setField("content", event.target.value)}
                className={`aur-input resize-y ${errors.content ? "border-red-400" : ""}`}
              />
              {errors.content && <span className="block text-[10px] text-red-500 font-medium">{errors.content}</span>}
            </div>
          </div>

          <aside className="space-y-5">
            <BlogImageUpload value={values.coverImage} error={errors.coverImage} onChange={(value) => setField("coverImage", value)} />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blog-author" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Author
                </label>
                <input
                  id="blog-author"
                  type="text"
                  value={values.author}
                  onChange={(event) => setField("author", event.target.value)}
                  className="aur-input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-read-time" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Read Time
                </label>
                <input
                  id="blog-read-time"
                  type="text"
                  placeholder="6 min read"
                  value={values.readTime}
                  onChange={(event) => setField("readTime", event.target.value)}
                  className="aur-input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-publish-date" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Publish Date
                </label>
                <input
                  id="blog-publish-date"
                  type="date"
                  value={values.publishDate}
                  onChange={(event) => setField("publishDate", event.target.value)}
                  className="aur-input"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-tags" className="block text-xs font-bold uppercase tracking-wider text-[var(--aur-text-muted)]">
                  Tags
                </label>
                <input
                  id="blog-tags"
                  type="text"
                  placeholder="Admissions, Rankings, Asia"
                  value={values.tags}
                  onChange={(event) => setField("tags", event.target.value)}
                  className="aur-input"
                />
                {tagPreview.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tagPreview.map((tag) => (
                      <span key={tag} className="aur-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 border border-[var(--aur-border)] px-4 py-3 rounded-xl bg-[var(--aur-surface-2)] text-xs font-semibold text-[var(--aur-text)] cursor-pointer hover:bg-[var(--aur-surface-hover)] transition-colors">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => setField("featured", event.target.checked)}
                className="h-4 w-4 accent-[var(--aur-text)] cursor-pointer"
              />
              Featured
            </label>
          </aside>

          <div className="lg:col-span-2 pt-6 border-t border-[var(--aur-border)] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link
              href="/"
              className="aur-btn-ghost text-xs font-bold px-5 py-2.5 inline-flex items-center justify-center uppercase tracking-wider"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit("Draft")}
              className="aur-btn-ghost text-xs font-bold px-5 py-2.5 inline-flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <FileText className="h-4 w-4" />
              Save Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Published")}
              className="aur-btn-primary text-xs font-bold px-6 py-2.5 inline-flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : values.status === "Published" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
