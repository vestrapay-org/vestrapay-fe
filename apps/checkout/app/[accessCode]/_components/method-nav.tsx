"use client";

import type { PaymentMethod } from "@/lib/types";
import type { MethodNavProps, PaymentMethodConfig } from "../_lib/types";

export function MethodNav({ methods, active, onSelect }: MethodNavProps): React.ReactNode {
  return (
    <nav className="shrink-0 border-b border-[#e3e8ee] sm:w-45 sm:border-r sm:border-b-0 sm:py-6">
      <p className="hidden px-5 pb-3 text-[10px] font-semibold tracking-wider text-[#8898aa] uppercase sm:block">
        Payment Options
      </p>
      <div className="flex overflow-x-auto px-3 py-2 sm:flex-col sm:overflow-x-visible sm:px-0 sm:py-0">
        {methods.map(({ id, label, icon: Icon }: PaymentMethodConfig): React.ReactNode => {
          const isActive: boolean = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={(): void => onSelect(id as PaymentMethod)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 sm:w-full sm:gap-3 sm:rounded-none sm:px-5 sm:py-3 ${
                isActive
                  ? "bg-primary/8 text-primary sm:bg-primary/4 sm:border-primary sm:border-r-2"
                  : "border-r-2 border-transparent text-[#8898aa] hover:bg-[#f6f9fc] hover:text-[#6b7c93]"
              }`}
            >
              <Icon className="size-5" active={isActive} />
              <span className="text-xs sm:text-[13px]">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
