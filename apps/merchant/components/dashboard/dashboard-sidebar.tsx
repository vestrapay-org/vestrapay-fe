"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

import { DASHBOARD_NAV_ITEMS } from "./nav-config";

function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white text-slate-900 md:w-64">
      <div className="border-b border-gray-200 px-5 py-6">
        <p className="m-0 text-lg font-bold tracking-tight text-[var(--primary)]">Vestrapay</p>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
          Sovereign ledger
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4" aria-label="Main">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[color:color-mix(in_oklch,var(--primary)_12%,white)] text-[var(--primary)]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-slate-900",
              )}
            >
              {isActive ? (
                <span
                  className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r bg-[var(--primary)]"
                  aria-hidden
                />
              ) : null}
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-[fill,stroke-width,color]",
                  isActive ? "text-[var(--primary)]" : "text-gray-600",
                )}
                aria-hidden
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 0 : 2}
              />
              <span className="pr-2">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { DashboardSidebar };
