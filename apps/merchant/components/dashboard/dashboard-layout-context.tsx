"use client";

import React from "react";

type DashboardLayoutContextValue = {
  mobileNavOpen: boolean;
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardLayoutContext = React.createContext<DashboardLayoutContextValue | null>(null);

export function DashboardLayoutProvider({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  return (
    <DashboardLayoutContext.Provider value={{ mobileNavOpen, setMobileNavOpen }}>
      {children}
    </DashboardLayoutContext.Provider>
  );
}

export function useDashboardLayout() {
  const ctx = React.useContext(DashboardLayoutContext);
  if (!ctx) {
    throw new Error("useDashboardLayout must be used within DashboardLayoutProvider");
  }
  return ctx;
}
