"use client";

import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-12 text-center shadow-sm">
      <h2 className="vestra-title-md text-[var(--foreground)]">{title}</h2>
      <p className="vestra-body-md mt-2 text-[var(--muted-foreground)]">This section will be available in a future release.</p>
    </div>
  );
}

export type SettingsViewSection = "profile" | "security";

type SettingsViewProps = {
  section: SettingsViewSection;
};

export function SettingsView({ section }: SettingsViewProps) {
  const subTabs = [
    { key: "profile" as const, href: "/dashboard/settings/profile", label: "Profile" },
    { key: "security" as const, href: "/dashboard/settings/security", label: "Security" },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl">
      <nav className="mb-6 flex flex-wrap gap-x-4 gap-y-2 border-b border-[var(--border)] pb-0 sm:mb-8 sm:gap-x-6 sm:gap-y-3">
        {subTabs.map((tabItem) => {
          const isActive = section === tabItem.key;
          return (
            <Link
              key={tabItem.key}
              href={tabItem.href}
              className={cn(
                "-mb-px border-b-2 pb-3 text-xs font-bold tracking-wide transition-colors",
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              {tabItem.label.toUpperCase()}
            </Link>
          );
        })}
      </nav>

      {section === "profile" ? <PlaceholderPanel title="Profile" /> : null}
      {section === "security" ? <PlaceholderPanel title="Security" /> : null}
    </div>
  );
}
