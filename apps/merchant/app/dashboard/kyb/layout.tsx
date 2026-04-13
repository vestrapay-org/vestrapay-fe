import React from "react";

import { KybWizardShell } from "@/components/kyb/kyb-wizard-shell";

export default function KybLayout({ children }: { children: React.ReactNode }) {
  return (
    <KybWizardShell>
      <div className="mx-auto max-w-6xl">{children}</div>
    </KybWizardShell>
  );
}
