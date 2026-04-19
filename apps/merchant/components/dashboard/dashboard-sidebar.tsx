"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { cn } from "@/lib/utils";

import { useDashboardLayout } from "./dashboard-layout-context";
import { DASHBOARD_NAV_ENTRIES, getActiveChildHref } from "./nav-config";

const navEase = [0.4, 0, 0.2, 1] as const;
const navTransition = { duration: 0.22, ease: navEase };

export function DashboardSidebar() {
  const pathname = usePathname();
  const { mobileNavOpen, setMobileNavOpen } = useDashboardLayout();

  const [groupOpen, setGroupOpen] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname, setMobileNavOpen]);

  React.useEffect(() => {
    setGroupOpen((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const e of DASHBOARD_NAV_ENTRIES) {
        if (e.type !== "group") continue;
        const active = getActiveChildHref(pathname, e.children) !== null;
        if (active && next[e.id] === false) {
          delete next[e.id];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [pathname]);

  return (
    <aside
      className={cn(
        "fixed left-0 z-40 flex w-[min(18rem,calc(100vw-2.5rem))] max-w-[280px] shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-[#f4f5f7] md:z-20 md:w-64 md:max-w-none",
        "top-16 h-[calc(100dvh-4rem)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:top-0 md:h-screen",
        mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="border-b border-gray-200 bg-[#f4f5f7] px-4 py-5 sm:px-5">
        <p className="m-0 text-lg font-bold tracking-tight text-[var(--primary)]">Vestrapay</p>
        <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500">
          Sovereign ledger
        </p>
      </div>

      <nav
        className="flex flex-1 flex-col gap-0.5 px-2 py-3 text-gray-600 sm:px-3 sm:py-4"
        aria-label="Main"
      >
        {DASHBOARD_NAV_ENTRIES.map((entry) => {
          if (entry.type === "link") {
            const isActive =
              entry.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === entry.href || pathname.startsWith(`${entry.href}/`);
            const Icon = entry.icon;

            return (
              <Link
                key={entry.href}
                href={entry.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[color:color-mix(in_oklch,var(--primary)_12%,white)] text-[var(--primary)]"
                    : "text-gray-600 hover:bg-gray-200/80 hover:text-[#0a0d56]",
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
                <span className="pr-2">{entry.label}</span>
              </Link>
            );
          }

          const Icon = entry.icon;
          const activeChildHref = getActiveChildHref(pathname, entry.children);
          const routeActive = activeChildHref !== null;
          const expanded = entry.id in groupOpen ? groupOpen[entry.id]! : routeActive;

          const toggle = () => {
            setGroupOpen((prev) => {
              const current = entry.id in prev ? prev[entry.id]! : routeActive;
              return { ...prev, [entry.id]: !current };
            });
          };

          return (
            <div key={entry.id} className="flex flex-col">
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  routeActive
                    ? "bg-white/60 font-bold text-[#0a0d56] shadow-sm hover:bg-gray-200/70"
                    : "font-semibold hover:bg-gray-200/80 hover:text-[#0a0d56]",
                )}
                aria-expanded={expanded}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon
                    className={cn(
                      "size-5 shrink-0 transition-colors",
                      routeActive ? "text-[#0a0d56]" : "text-current group-hover:text-[#0a0d56]",
                    )}
                    aria-hidden
                    strokeWidth={2}
                  />
                  <span className="truncate">{entry.label}</span>
                </span>
                <motion.span
                  className={cn(
                    "inline-flex shrink-0 transition-colors",
                    routeActive ? "text-[#0a0d56]" : "text-current group-hover:text-[#0a0d56]",
                  )}
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={navTransition}
                  aria-hidden
                >
                  <ChevronDown className="size-4" strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expanded ? (
                  <motion.div
                    key={`${entry.id}-subnav`}
                    role="group"
                    aria-label={entry.label}
                    className="overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.26, ease: navEase }}
                  >
                    <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
                      {entry.children.map((child, index) => {
                        const isActive = activeChildHref === child.href;
                        return (
                          <motion.div
                            key={child.href}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: navEase,
                              delay: index * 0.04,
                            }}
                          >
                            <Link
                              href={child.href}
                              onClick={() => setMobileNavOpen(false)}
                              className={cn(
                                "block rounded-lg py-2 pr-3 pl-11 text-sm transition-colors",
                                isActive
                                  ? "font-bold text-[#0a0d56] hover:bg-gray-200/80"
                                  : "font-medium text-gray-500 hover:bg-gray-200/60 hover:text-[#0a0d56]",
                              )}
                            >
                              {child.label}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
