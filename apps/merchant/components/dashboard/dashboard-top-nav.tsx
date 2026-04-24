"use client";

import { Bell, HelpCircle, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { useDashboardLayout } from "./dashboard-layout-context";
import { getDashboardPageTitle } from "./nav-config";

export function DashboardTopNav() {
  const pathname = usePathname();
  const title = getDashboardPageTitle(pathname);
  const [environment, setEnvironment] = useState<"sandbox" | "live">("sandbox");
  const { mobileNavOpen, setMobileNavOpen } = useDashboardLayout();

  return (
    <header className="sticky top-0 z-20 flex h-16 min-w-0 shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] bg-white px-3 sm:gap-4 sm:px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:gap-4">
        <button
          type="button"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--foreground)] shadow-sm md:hidden"
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((o) => !o)}
        >
          {mobileNavOpen ? (
            <X className="size-5" strokeWidth={2.25} />
          ) : (
            <Menu className="size-5" strokeWidth={2.25} />
          )}
        </button>

        <h1 className="m-0 min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-[var(--foreground)] md:hidden">
          {title}
        </h1>

        <div
          className="flex shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--background)] p-0.5"
          role="group"
          aria-label="Environment"
        >
          <button
            type="button"
            onClick={() => setEnvironment("sandbox")}
            className={cn(
              "rounded-full px-2 py-1.5 text-[0.65rem] font-semibold transition-colors sm:px-3 sm:text-xs",
              environment === "sandbox"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            Sandbox
          </button>
          <button
            type="button"
            onClick={() => setEnvironment("live")}
            className={cn(
              "rounded-full px-2 py-1.5 text-[0.65rem] font-semibold transition-colors sm:px-3 sm:text-xs",
              environment === "live"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            Live
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 md:gap-2">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg border-0 bg-transparent text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <button
          type="button"
          className="hidden items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)] sm:flex"
        >
          <HelpCircle className="size-5 shrink-0" aria-hidden />
          Support
        </button>
        <div
          className="ml-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--primary)_85%,white)] text-xs font-bold text-[var(--primary)]"
          aria-hidden
        >
          VP
        </div>
      </div>
    </header>
  );
}
