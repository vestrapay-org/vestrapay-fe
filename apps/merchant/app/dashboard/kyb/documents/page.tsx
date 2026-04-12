import React from "react";

import { KybDocumentsForm } from "@/components/kyb/kyb-documents-form";
import { KybStepper } from "@/components/kyb/kyb-stepper";
import { KybVerificationSidebar } from "@/components/kyb/kyb-verification-sidebar";

export default function KybDocumentsStepPage() {
  return (
    <>
      <KybStepper currentStep={4} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <KybDocumentsForm />
        <KybVerificationSidebar />
      </div>
    </>
  );
}
