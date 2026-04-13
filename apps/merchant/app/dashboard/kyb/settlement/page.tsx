import React from "react";

import { KybSettlementForm } from "@/components/kyb/kyb-settlement-form";
import { KybStepper } from "@/components/kyb/kyb-stepper";
import { KybVerificationSidebar } from "@/components/kyb/kyb-verification-sidebar";

export default function KybSettlementStepPage() {
  return (
    <>
      <KybStepper currentStep={3} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <KybSettlementForm />
        <KybVerificationSidebar />
      </div>
    </>
  );
}
