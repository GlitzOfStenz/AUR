"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, BookOpen, Bold, Italic, Heading, List, Code, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/layout/AppLayout";
import { SidebarProvider } from "../../components/navigation/SidebarContext";
import { ToastProvider } from "../../components/feedback/ToastContext";

function CreateBlogForm() {
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Academic Trends");
  const [source, setSource] = useState("Dr. John Doe");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Aux state for tag adding
  const [currentTag, setCurrentTag] = useState("");

  // UI States
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const categories = [
    "Academic Trends",
    "Medical Education",
    "University Rankings",
    "Transnational Study",
    "Scholarships & Grants",
    "Advisory Reports",
  ];

  // Tag helper functions
  const handleAddTag = () => {
    const trimmed = currentTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Image Upload helper functions
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image file size must be less than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Content text insert helper
  const insertText = (before: string, after: string) => {
    const textarea = document.getElementById("blog-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;
    setContent(text.substring(0, start) + replacement + text.substring(end));
    // Refocus and place cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  // Validation
  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!title.trim()) tempErrors.title = "Blog Title is required.";
    if (!category.trim()) tempErrors.category = "Category selection is required.";
    if (!content.trim()) tempErrors.content = "Blog Content body is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!validateForm()) {
      setStatusMessage({ type: "error", text: "Please correct the errors in the form fields before submitting." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          source,
          content,
          image,
          tags,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create article");
      }

      const newArticle = await res.json();
      setStatusMessage({ type: "success", text: "Article created successfully! Redirecting..." });
      
      // Clear fields
      setTitle("");
      setSubtitle("");
      setContent("");
      setImage("");
      setTags([]);

      // Redirect to newly created blog detail page after short delay
      setTimeout(() => {
        router.push(`/blogs/${newArticle.id}`);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: "error", text: err.message || "An unexpected error occurred during save." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 animate-fadeIn">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 dark:hover:text-cyber-yellow transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Form Container */}
        <div className="border border-slate-200 dark:border-cyber-border rounded-xl bg-white dark:bg-cyber-dark/40 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow">
              Editorial Console
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              Publish Research Article
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Publish editorial highlights, briefings, and advisory briefs into the academic portal engine.
            </p>
          </div>

          {/* Form Status Messages */}
          {statusMessage && (
            <div className={`p-4 text-xs font-semibold border ${
              statusMessage.type === "success" 
                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" 
                : "bg-red-50 dark:bg-red-955/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900"
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Blog Title */}
            <div className="space-y-1.5">
              <label htmlFor="blog-title" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Blog Title <span className="text-red-655 dark:text-red-500">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Why Central Asia is the New Frontier for Medicine..."
                className={`w-full border px-4 py-2 text-xs text-slate-900 bg-white dark:bg-cyber-gray focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow ${
                  errors.title ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.title && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.title}</span>}
            </div>

            {/* Blog Subtitle */}
            <div className="space-y-1.5">
              <label htmlFor="blog-subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Subtitle
              </label>
              <input
                id="blog-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Uzbekistan’s English-Medium Reforms Spark Recruitment Wave..."
                className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow"
              />
            </div>

            {/* Category / Source Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label htmlFor="blog-category" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                  Category <span className="text-red-655 dark:text-red-500">*</span>
                </label>
                <select
                  id="blog-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author / Source */}
              <div className="space-y-1.5">
                <label htmlFor="blog-source" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                  Author / Publication
                </label>
                <input
                  id="blog-source"
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Dr. John Doe"
                  className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow"
                />
              </div>
            </div>

            {/* Content editor toolbar + textarea */}
            <div className="space-y-1.5">
              <label htmlFor="blog-content-textarea" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Blog Content <span className="text-red-655 dark:text-red-500">*</span>
              </label>
              
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 border-x border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cyber-gray/70">
                <button
                  type="button"
                  title="Bold HTML"
                  onClick={() => insertText("<strong>", "</strong>")}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow hover:bg-slate-200 dark:hover:bg-cyber-dark transition-colors"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Italic HTML"
                  onClick={() => insertText("<em>", "</em>")}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow hover:bg-slate-200 dark:hover:bg-cyber-dark transition-colors"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Heading 3 HTML"
                  onClick={() => insertText("<h3>", "</h3>")}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow hover:bg-slate-200 dark:hover:bg-cyber-dark transition-colors"
                >
                  <Heading className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Bullet List HTML"
                  onClick={() => insertText("<ul>\n  <li>", "</li>\n</ul>")}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow hover:bg-slate-200 dark:hover:bg-cyber-dark transition-colors"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Code Block HTML"
                  onClick={() => insertText("<pre><code>", "</code></pre>")}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyber-yellow hover:bg-slate-200 dark:hover:bg-cyber-dark transition-colors"
                >
                  <Code className="h-3.5 w-3.5" />
                </button>
              </div>

              <textarea
                id="blog-content-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full body of the article here. You can use standard HTML markup tags or click toolbar icons above to insert bold, italics, lists, headers, and code sections..."
                rows={12}
                className={`w-full border px-4 py-3 text-xs text-slate-900 bg-white dark:bg-cyber-gray focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow font-sans ${
                  errors.content ? "border-red-400" : "border-slate-200 dark:border-slate-800"
                }`}
              />
              {errors.content && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{errors.content}</span>}
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label htmlFor="blog-tags" className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  id="blog-tags"
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type a tag and click add..."
                  className="grow border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-slate-900 text-white dark:bg-transparent dark:border dark:border-slate-800 dark:text-slate-350 dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow hover:bg-slate-800 text-xs font-semibold px-4 transition-all uppercase tracking-wider"
                >
                  Add
                </button>
              </div>

              {/* Tags bubble display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-[10px] font-mono border border-slate-250 dark:border-cyber-yellow/20 px-2 py-0.5 bg-slate-50 dark:bg-cyber-yellow/5 text-slate-700 dark:text-cyber-yellow-bright rounded-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1.5 p-0.5 hover:text-red-600 transition-colors focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload Zone & URL Fallback */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Featured Image
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex flex-col justify-center items-center gap-2 ${
                    dragOver 
                      ? "border-amber-700 dark:border-cyber-yellow bg-slate-50/50 dark:bg-cyber-yellow/5" 
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-cyber-yellow/30 bg-slate-50/20 dark:bg-transparent"
                  }`}
                >
                  <input
                    type="file"
                    id="image-file-input"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <label htmlFor="image-file-input" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500 mb-1" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Drag & Drop Image</span>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 block">or click to browse file (&lt; 2MB)</span>
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="flex flex-col justify-center space-y-1.5">
                  <label htmlFor="image-url-input" className="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Image URL Fallback:
                  </label>
                  <input
                    id="image-url-input"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-cyber-gray px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-700 dark:focus:border-cyber-yellow"
                  />
                </div>
              </div>

              {/* Image Preview Box */}
              {image && (
                <div className="mt-2 border border-slate-200 dark:border-cyber-border rounded-lg overflow-hidden relative aspect-video w-full bg-slate-100 max-h-48">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Preview"
                    className="h-full w-full object-cover object-center"
                  />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 rounded-full p-1.5 text-white transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
              <Link
                href="/"
                className="border border-slate-200 dark:border-slate-800 bg-transparent text-slate-650 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-cyber-gray hover:text-slate-900 dark:hover:text-white text-xs font-semibold px-5 py-2.5 transition-colors uppercase tracking-wider inline-flex items-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-900 text-white dark:bg-transparent dark:border-2 dark:border-cyber-yellow dark:text-cyber-yellow dark:shadow-[0_0_10px_rgba(234,179,8,0.2)] dark:hover:bg-cyber-yellow dark:hover:text-cyber-black hover:bg-slate-800 text-xs font-bold px-6 py-2.5 transition-all uppercase tracking-wider inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <BookOpen className="animate-spin h-3.5 w-3.5 mr-2" />
                    Saving Ledger...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Publish Article
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </AppLayout>
  );
}

export default function CreateBlogPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-cyber-black font-sans text-slate-400 text-xs font-bold uppercase tracking-widest">
        Initializing Engine...
      </div>
    }>
      <SidebarProvider>
        <ToastProvider>
          <CreateBlogForm />
        </ToastProvider>
      </SidebarProvider>
    </React.Suspense>
  );
}
