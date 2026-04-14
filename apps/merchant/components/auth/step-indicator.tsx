import { Check } from "lucide-react";

import { cn } from "../../lib/utils";
import React from "react";

type Step = {
  id: number;
  label: string;
};

type StepIndicatorProps = {
  currentStep: number;
  steps: Step[];
};

function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <ol
      style={{
        display: "grid",
        gap: "0.5rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      }}
    >
      {steps.map((step) => {
        const isComplete = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <li
            key={step.id}
            className={cn("merchant-step-item", isCurrent && "merchant-step-item-current")}
          >
            <span
              className={cn(
                "merchant-step-badge",
                isCurrent && "merchant-step-badge-active",
                isComplete && "merchant-step-badge-active",
                (isCurrent || isComplete) && "text-white",
              )}
            >
              {isComplete ? <Check className="size-3.5" /> : step.id}
            </span>
            <p className="merchant-step-label">{step.label}</p>
          </li>
        );
      })}
    </ol>
  );
}

export { StepIndicator };
