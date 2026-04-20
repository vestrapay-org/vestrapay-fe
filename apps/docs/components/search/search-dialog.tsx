"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  FileText,
  BookOpen,
  Zap,
  AlertCircle,
  History,
} from "lucide-react";
import { flatNavItems, type SearchResult } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  "Getting Started": Zap,
  Authentication: FileText,
  "API Reference": FileText,
  Guides: BookOpen,
  "Errors & Troubleshooting": AlertCircle,
  Changelog: History,
};

export function SearchDialog({
  open,
  onClose,
}: SearchDialogProps): React.ReactNode {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const allItems = flatNavItems();

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allItems.slice(0, 8));
    } else {
      const q = query.toLowerCase();
      const filtered = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.section?.toLowerCase().includes(q),
      );
      setResults(filtered.slice(0, 10));
    }
    setSelected(0);
  }, [query]);

  const navigate = (href: string): void => {
    router.push(href);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="animate-fade-in-fast absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="bg-card border-border animate-scale-in relative z-10 w-full max-w-lg overflow-hidden rounded-md border shadow-md">
        <div className="border-border flex items-center gap-3 border-b px-4 py-3.5">
          <Search className="text-muted-foreground size-4 shrink-0 opacity-60" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
          />
          <kbd className="border-border bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 font-mono text-[10px] font-medium sm:flex">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-muted-foreground text-sm">
                No results for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            results.map((item, i) => {
              const Icon = item.section
                ? (SECTION_ICONS[item.section] ?? FileText)
                : FileText;
              return (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100",
                    i === selected ? "bg-muted/60" : "hover:bg-muted/40",
                  )}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-md">
                    <Icon className="text-muted-foreground size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.section && (
                    <span className="text-muted-foreground shrink-0 text-[11px]">
                      {item.section}
                    </span>
                  )}
                  {i === selected && (
                    <ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        <div className="border-border bg-muted/30 flex items-center gap-5 border-t px-4 py-2">
          <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ↑↓
            </kbd>
            Navigate
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>
            Select
          </div>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ESC
            </kbd>
            Close
          </div>
        </div>
      </div>
    </div>
  );
}
