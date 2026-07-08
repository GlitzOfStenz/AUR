"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";

interface BlogImageUploadProps {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function BlogImageUpload({ value, error, onChange }: BlogImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const readFile = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Cover Image <span className="text-red-600 dark:text-red-400">*</span>
      </label>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          readFile(event.dataTransfer.files?.[0]);
        }}
        className={`border-2 border-dashed p-6 text-center transition-colors flex flex-col justify-center items-center gap-2 min-h-36 ${
          dragOver
            ? "border-slate-900 dark:border-cyber-yellow bg-slate-50 dark:bg-cyber-yellow/5"
            : error
              ? "border-red-400 bg-red-50/40 dark:bg-red-950/10"
              : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-transparent hover:border-slate-400 dark:hover:border-cyber-yellow/40"
        }`}
      >
        <input
          type="file"
          id="blog-cover-image"
          accept="image/*"
          onChange={(event) => readFile(event.target.files?.[0])}
          className="hidden"
        />
        <label htmlFor="blog-cover-image" className="cursor-pointer flex flex-col items-center">
          <Upload className="h-6 w-6 text-slate-400 dark:text-slate-500 mb-2" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload cover image</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Drag and drop or browse files</span>
        </label>
      </div>

      {error && <span className="block text-[10px] text-red-600 dark:text-red-400 font-medium">{error}</span>}

      {value && (
        <div className="relative aspect-video w-full overflow-hidden border border-slate-200 dark:border-cyber-border bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Cover preview" className="h-full w-full object-cover object-center" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove cover image"
            className="absolute top-2 right-2 bg-slate-950/85 hover:bg-slate-950 border border-white/10 p-1.5 text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
