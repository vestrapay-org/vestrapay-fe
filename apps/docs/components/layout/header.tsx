"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X, Github, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchDialog } from "@/components/search/search-dialog";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
  onAiToggle?: () => void;
  aiOpen?: boolean;
}

export function Header({
  onMobileMenuToggle,
  mobileMenuOpen = false,
  onAiToggle,
  aiOpen = false,
}: HeaderProps): React.ReactNode {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
        <div className="flex w-full items-center px-4">
          {/* Logo area - matches sidebar width */}
          <div className="flex w-60 shrink-0 items-center gap-2.5 pr-4 xl:w-64">
            <Link href="/" className="group flex items-center gap-2">
              <img
                src="/vestrapay.svg"
                alt="Vestrapay"
                className="h-5 w-auto transition-opacity group-hover:opacity-80"
              />
              <span className="text-[13px] font-semibold tracking-tight text-foreground">
                Vestrapay
              </span>
            </Link>
            <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground">
              docs
            </span>
          </div>

          {/* Center search */}
          <div className="absolute top-1/2 left-1/2 hidden w-full max-w-sm -translate-x-1/2 -translate-y-1/2 md:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-full items-center gap-2.5 rounded-md border border-border bg-muted/30 px-3 text-[13px] text-muted-foreground transition-colors duration-150 hover:bg-muted/50 hover:text-foreground"
            >
              <Search className="size-3.5 shrink-0 opacity-50" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium text-muted-foreground sm:flex">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              <Search className="size-4" />
            </button>

            <ThemeToggle />

            <a
              href="#"
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              title="GitHub"
            >
              <Github className="size-4" />
            </a>

            {onAiToggle && (
              <>
                <div className="mx-1.5 h-4 w-px bg-border" />
                <button
                  onClick={onAiToggle}
                  className={cn(
                    "flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12px] font-medium transition-colors duration-150",
                    aiOpen
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Sparkles className="size-3" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </>
            )}

            <div className="mx-1.5 h-4 w-px bg-border" />

            <Link
              href="https://vestrapay.com"
              className="flex h-7 items-center rounded-md bg-primary px-3 text-[12px] font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-90"
            >
              Dashboard
            </Link>

            {onMobileMenuToggle && (
              <button
                onClick={onMobileMenuToggle}
                className="ml-1 flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              >
                {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                <span className="sr-only">Toggle menu</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
