"use client";

import React, { type ReactNode } from "react";

import { KybWizardProvider } from "./kyb-wizard-context";

function KybWizardShell({ children }: { children: ReactNode }) {
  return <KybWizardProvider>{children}</KybWizardProvider>;
}

export { KybWizardShell };
