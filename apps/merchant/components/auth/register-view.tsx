"use client";

import Link from "next/link";
import React from "react";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { RegisterMerchantForm } from "./register-merchant-form";
import { registrationSteps } from "./registration-steps";
import { StepIndicator } from "./step-indicator";

export function RegisterView() {
  return (
    <AuthPageLayout
      eyebrow="Step 1 of 2"
      title="Create your account"
      description="Start accepting payments in minutes with Vestrapay."
      steps={<StepIndicator currentStep={1} steps={registrationSteps} />}
      footer={
        <p className="m-0">
          Already have an account? <Link href="/login">Log in here</Link>
        </p>
      }
    >
      <RegisterMerchantForm />
    </AuthPageLayout>
  );
}
