import React, { type ReactNode } from "react";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopNav } from "./dashboard-top-nav";

type DashboardShellProps = {
  children: ReactNode;
};

function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <DashboardSidebar />
      <div className="ml-60 flex min-h-screen min-w-0 flex-1 flex-col md:ml-64">
        <DashboardTopNav />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

export { DashboardShell };
