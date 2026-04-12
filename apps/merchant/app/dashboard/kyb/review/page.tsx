import React from "react";

import { KybReviewContent } from "@/components/kyb/kyb-review-content";
import { KybStepper } from "@/components/kyb/kyb-stepper";
import { KybVerificationSidebar } from "@/components/kyb/kyb-verification-sidebar";

export default function KybReviewStepPage() {
  return (
    <>
      <KybStepper currentStep={5} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
        <KybReviewContent />
        <KybVerificationSidebar variant="review" />
      </div>
    </>
  );
}
