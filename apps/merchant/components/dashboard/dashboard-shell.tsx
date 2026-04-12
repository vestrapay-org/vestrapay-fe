import React, { type ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopNav } from "./dashboard-top-nav";

type DashboardShellProps = {
  children: ReactNode;
};

function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-[#f4f4f5]">
      <DashboardSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <DashboardTopNav />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

export { DashboardShell };
