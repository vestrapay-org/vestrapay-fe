import React from "react";

import { KybBusinessInfoForm } from "@/components/kyb/kyb-business-info-form";
import { KybStepper } from "@/components/kyb/kyb-stepper";
import { KybVerificationSidebar } from "@/components/kyb/kyb-verification-sidebar";

export default function KybOnboardingPage() {
  return (
    <>
      <KybStepper currentStep={1} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <KybBusinessInfoForm />
        <KybVerificationSidebar />
      </div>
    </>
  );
}
