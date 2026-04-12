import React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Business info" },
  { id: 2, label: "Identity" },
  { id: 3, label: "Settlement" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review" },
] as const;

type KybStepperProps = {
  currentStep: number;
};

function KybStepper({ currentStep }: KybStepperProps) {
  return (
    <nav aria-label="KYB progress" className="mb-8">
      <div className="relative px-2 md:px-4">
        <div
          className="absolute top-4 right-8 left-8 z-0 h-0.5 bg-gray-200 md:top-5 md:right-12 md:left-12"
          aria-hidden
        />
        <ol className="relative z-10 flex justify-between gap-1">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isComplete = step.id < currentStep;

            return (
              <li key={step.id} className="flex min-w-0 flex-1 flex-col items-center">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-colors md:size-10 md:text-base",
                    isActive || isComplete
                      ? "bg-[var(--primary)] text-white"
                      : "border border-gray-200 bg-white text-gray-400",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? <Check className="size-4 md:size-[1.125rem]" strokeWidth={2.5} aria-hidden /> : step.id}
                </span>
                <span
                  className={cn(
                    "mt-2 max-w-[4.5rem] text-center text-[0.6rem] font-bold leading-tight tracking-wide uppercase sm:max-w-[6rem] sm:text-[0.65rem]",
                    isActive ? "text-[var(--primary)]" : isComplete ? "text-slate-700" : "text-gray-400",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export { KybStepper };
