"use client";

import React, { useCallback, useRef, useState } from "react";
import { CloudUpload, File, FileImage, FileText, MapPin, X } from "lucide-react";

import { cn } from "@/lib/utils";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

type EmptyIcon = "cloud" | "map-pin";

type KybDocumentUploadFieldProps = {
  inputId: string;
  hint: string;
  accept?: string;
  fileName: string;
  fileSize: string;
  onSelect: (file: File) => void;
  onClear: () => void;
  emptyIcon?: EmptyIcon;
  maxBytes?: number;
};

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

function FileTypeIcon({ fileName }: { fileName: string }) {
  const ext = extensionOf(fileName);
  if (ext === "pdf") {
    return <FileText className="size-7 text-red-600" strokeWidth={1.75} aria-hidden />;
  }
  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") {
    return <FileImage className="size-7 text-sky-600" strokeWidth={1.75} aria-hidden />;
  }
  return <File className="size-7 text-slate-600" strokeWidth={1.75} aria-hidden />;
}

function KybDocumentUploadField({
  inputId,
  hint,
  accept = ".pdf,.jpg,.jpeg,.png",
  fileName,
  fileSize,
  onSelect,
  onClear,
  emptyIcon = "cloud",
  maxBytes = DEFAULT_MAX_BYTES,
}: KybDocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFile = fileName.trim().length > 0;

  const applyFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      setError(null);
      if (file.size > maxBytes) {
        setError(`File must be ${Math.round(maxBytes / (1024 * 1024))}MB or smaller.`);
        return;
      }
      onSelect(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [maxBytes, onSelect],
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyFile(e.target.files?.[0]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    applyFile(e.dataTransfer.files?.[0]);
  }

  function openPicker() {
    setError(null);
    inputRef.current?.click();
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear();
  }

  const EmptyGlyph = emptyIcon === "map-pin" ? MapPin : CloudUpload;

  if (!hasFile) {
    return (
      <div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleInputChange}
        />
        <label
          htmlFor={inputId}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors",
            isDragging
              ? "border-[var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_8%,white)]"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/80",
          )}
        >
          <EmptyGlyph className="size-5 text-gray-400" aria-hidden />
          <p className="m-0 text-xs text-gray-500">{hint}</p>
        </label>
        {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept}
        onChange={handleInputChange}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors",
          isDragging
            ? "border-[var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_6%,white)]"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/80",
        )}
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white shadow-sm">
          <FileTypeIcon fileName={fileName} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{fileName}</p>
          {fileSize ? <p className="mt-0.5 text-xs text-gray-500">{fileSize}</p> : null}
          <p className="mt-1 text-[11px] text-gray-400">Click to replace</p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex size-9 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-gray-500 transition-colors hover:bg-white hover:text-red-600"
          aria-label="Remove file"
        >
          <X className="size-5" />
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

export { KybDocumentUploadField };
