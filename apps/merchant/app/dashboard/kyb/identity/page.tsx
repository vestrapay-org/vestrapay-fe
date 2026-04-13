import React from "react";

import { KybIdentityForm } from "@/components/kyb/kyb-identity-form";
import { KybStepper } from "@/components/kyb/kyb-stepper";
import { KybVerificationSidebar } from "@/components/kyb/kyb-verification-sidebar";

export default function KybIdentityStepPage() {
  return (
    <>
      <KybStepper currentStep={2} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <KybIdentityForm />
        <KybVerificationSidebar />
      </div>
    </>
  );
}
