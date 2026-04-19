"use client";

import React, { type ReactNode } from "react";

import { DashboardLayoutProvider, useDashboardLayout } from "./dashboard-layout-context";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopNav } from "./dashboard-top-nav";

type DashboardShellProps = {
  children: ReactNode;
};

function MobileNavBackdrop() {
  const { mobileNavOpen, setMobileNavOpen } = useDashboardLayout();

  if (!mobileNavOpen) return null;

  return (
    <button
      type="button"
      aria-label="Close navigation menu"
      className="fixed inset-x-0 top-16 bottom-0 z-30 bg-black/40 md:hidden"
      onClick={() => setMobileNavOpen(false)}
    />
  );
}

function DashboardShellInner({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <DashboardSidebar />
      <div className="relative z-0 flex min-h-screen min-w-0 flex-1 flex-col md:ml-64">
        <MobileNavBackdrop />
        <DashboardTopNav />
        <div className="min-w-0 max-w-full flex-1 overflow-x-clip overflow-y-auto px-3 py-4 sm:px-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <DashboardLayoutProvider>
      <DashboardShellInner>{children}</DashboardShellInner>
    </DashboardLayoutProvider>
  );
}
