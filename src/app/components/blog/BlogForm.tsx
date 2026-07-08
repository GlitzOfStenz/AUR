"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileText, Send } from "lucide-react";
import BlogImageUpload from "./BlogImageUpload";
import { createStoredBlog } from "../../lib/blog-storage";
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
  const [values, setValues] = useState<BlogFormValues>(() => ({
    ...initialValues,
    publishDate: todayDateValue(),
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);

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

  const handleSubmit = (status: BlogStatus) => {
    setMessage(null);

    if (!validate()) {
      setMessage("Please complete the required fields before saving.");
      return;
    }

    createStoredBlog({ ...values, status }, status);

    if (status === "Published") {
      router.push("/");
      return;
    }

    setMessage("Draft saved locally in this browser.");
    setValues({ ...initialValues, publishDate: todayDateValue(), status: "Draft" });
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-6 animate-fadeIn">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-cyber-yellow transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Insights
        </Link>
      </div>

      <section className="border border-slate-200 dark:border-cyber-border bg-white dark:bg-cyber-dark/40 shadow-sm p-5 sm:p-8 space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">
              Editorial Console
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Create Blog
            </h1>
          </div>
          {message && (
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 sm:text-right">
              {message}
            </p>
          )}
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6" onSubmit={(event) => event.preventDefault()}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="blog-title" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Blog Title <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                value={values.title}
                onChange={(event) => setField("title", event.target.value)}
                className={`w-full border bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow ${
                  errors.title ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.title && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blog-category" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Category <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <select
                  id="blog-category"
                  value={values.category}
                  onChange={(event) => setField("category", event.target.value as BlogFormValues["category"])}
                  className={`w-full border bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow ${
                    errors.category ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.category}</span>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-status" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </label>
                <select
                  id="blog-status"
                  value={values.status}
                  onChange={(event) => setField("status", event.target.value as BlogStatus)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-description" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Short Description <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <textarea
                id="blog-description"
                rows={3}
                value={values.description}
                onChange={(event) => setField("description", event.target.value)}
                className={`w-full border bg-white dark:bg-cyber-gray px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow resize-y ${
                  errors.description ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.description && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.description}</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="blog-content" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Content <span className="text-red-600 dark:text-red-400">*</span>
              </label>
              <textarea
                id="blog-content"
                rows={14}
                value={values.content}
                onChange={(event) => setField("content", event.target.value)}
                className={`w-full border bg-white dark:bg-cyber-gray px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow resize-y ${
                  errors.content ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.content && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.content}</span>}
            </div>
          </div>

          <aside className="space-y-5">
            <BlogImageUpload value={values.coverImage} error={errors.coverImage} onChange={(value) => setField("coverImage", value)} />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="blog-author" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Author
                </label>
                <input
                  id="blog-author"
                  type="text"
                  value={values.author}
                  onChange={(event) => setField("author", event.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-read-time" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Read Time
                </label>
                <input
                  id="blog-read-time"
                  type="text"
                  placeholder="6 min read"
                  value={values.readTime}
                  onChange={(event) => setField("readTime", event.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-publish-date" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Publish Date
                </label>
                <input
                  id="blog-publish-date"
                  type="date"
                  value={values.publishDate}
                  onChange={(event) => setField("publishDate", event.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="blog-tags" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tags
                </label>
                <input
                  id="blog-tags"
                  type="text"
                  placeholder="Admissions, Rankings, Asia"
                  value={values.tags}
                  onChange={(event) => setField("tags", event.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-900 dark:focus:border-cyber-yellow"
                />
                {tagPreview.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tagPreview.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono border border-slate-200 dark:border-cyber-border px-2 py-0.5 text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => setField("featured", event.target.checked)}
                className="h-4 w-4 accent-slate-900"
              />
              Featured
            </label>
          </aside>

          <div className="lg:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Link
              href="/"
              className="border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-cyber-gray hover:text-slate-900 dark:hover:text-white text-xs font-semibold px-5 py-2.5 transition-colors uppercase tracking-wider inline-flex items-center justify-center"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit("Draft")}
              className="border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-cyber-gray text-xs font-bold px-5 py-2.5 transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <FileText className="h-3.5 w-3.5" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("Published")}
              className="bg-slate-900 text-white dark:bg-transparent dark:border-2 dark:border-cyber-yellow dark:text-cyber-yellow dark:hover:bg-cyber-yellow dark:hover:text-cyber-black hover:bg-slate-800 text-xs font-bold px-6 py-2.5 transition-all uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              {values.status === "Published" ? <Check className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
              Publish
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
