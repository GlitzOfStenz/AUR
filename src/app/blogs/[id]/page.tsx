"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, BookOpen, Tag, Calendar, User } from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/layout/AppLayout";
import { SidebarProvider } from "../../components/navigation/SidebarContext";
import { ToastProvider } from "../../components/feedback/ToastContext";
import { UniversityDataProvider } from "../../components/data/UniversityDataProvider";
import { Article } from "../../data";
import { getStoredBlog, storedBlogToArticle } from "../../lib/blog-storage";

function BlogDetailsContent() {
  const params = useParams();
  const id = params?.id as string;

  const [blog, setBlog] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchBlog() {
      try {
        const storedBlog = getStoredBlog(id);
        if (storedBlog) {
          setBlog(storedBlogToArticle(storedBlog));
          return;
        }

        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Blog not found");
          } else {
            setError("Failed to load blog");
          }
          return;
        }
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-grow flex flex-col items-center justify-center py-24 animate-pulse">
          <BookOpen className="h-10 w-10 text-amber-700 dark:text-cyber-yellow mb-4 animate-bounce" />
          <span className="text-xs uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 font-mono">
            Decrypting Article Ledger...
          </span>
        </div>
      </AppLayout>
    );
  }

  if (error || !blog) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto my-12 p-8 border border-slate-200 dark:border-cyber-border rounded-xl bg-slate-50/50 dark:bg-cyber-dark/40 shadow-sm text-center space-y-6 animate-fadeIn">
          <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex items-center justify-center mx-auto text-red-650 dark:text-red-400 font-serif text-xl font-bold">
            !
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-red-650 dark:text-red-400">
              Error: 404
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Article Node Not Found
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              The requested article identifier could not be verified in the decentralized academic database indices. It may have been archived or removed.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-slate-900 dark:border-cyber-yellow bg-slate-900 dark:bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white dark:text-cyber-yellow hover:bg-slate-800 dark:hover:bg-cyber-yellow dark:hover:text-cyber-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Discovery Hub
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-6 animate-fadeIn">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-955 dark:hover:text-cyber-yellow transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Hub
          </Link>
        </div>

        <article className="space-y-6">
          {/* Category badge */}
          {blog.category && (
            <div>
              <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-cyber-yellow bg-amber-50 dark:bg-cyber-yellow/5 px-2.5 py-1 border border-amber-200 dark:border-cyber-yellow/20 font-mono">
                {blog.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight">
            {blog.title}
          </h1>

          {/* Subtitle */}
          {blog.subtitle && (
            <p className="font-serif text-lg italic text-slate-500 leading-relaxed border-l-2 border-slate-350 dark:border-cyber-yellow pl-4">
              {blog.subtitle}
            </p>
          )}

          {/* Author / Date / Read time metadata */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 py-4 border-y border-slate-100 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500 font-mono">
            <span className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5 text-slate-300 dark:text-slate-600" />
              {blog.source}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-300 dark:text-slate-600" />
              {blog.date}
            </span>
            <span className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-300 dark:text-slate-600" />
              {blog.readTime}
            </span>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="relative aspect-video w-full border border-slate-200 dark:border-cyber-border overflow-hidden bg-slate-100 dark:bg-cyber-gray">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          )}

          {/* Blog Rich HTML Content */}
          <div
            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6 pt-4 font-sans
              prose-headings:font-serif prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-white
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-2
              prose-p:mb-4
              prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
              prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4 prose-ul:space-y-1
              prose-li:text-slate-600 dark:prose-li:text-slate-400
              prose-pre:bg-slate-50 dark:prose-pre:bg-cyber-gray prose-pre:p-4 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-800 prose-pre:font-mono prose-pre:text-xs prose-pre:overflow-x-auto
            "
            dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.contentSummary}</p>` }}
          />

          {/* Tags list */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-cyber-gray font-mono rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </AppLayout>
  );
}

export default function BlogDetailsPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-cyber-black font-sans text-slate-400 text-xs font-bold uppercase tracking-widest">
        Initializing Engine...
      </div>
    }>
      <SidebarProvider>
        <ToastProvider>
          <UniversityDataProvider>
            <BlogDetailsContent />
          </UniversityDataProvider>
        </ToastProvider>
      </SidebarProvider>
    </React.Suspense>
  );
}
