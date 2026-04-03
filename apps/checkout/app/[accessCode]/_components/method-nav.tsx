"use client";

import type { PaymentMethod } from "@/lib/types";
import type { MethodNavProps, PaymentMethodConfig } from "../_lib/types";

export function MethodNav({ methods, active, onSelect }: MethodNavProps): React.ReactNode {
  return (
    <nav className="shrink-0 border-b border-[#ebedf2] bg-[#fafbfc] sm:w-44 sm:border-r sm:border-b-0">
      <div className="hidden px-4 pt-5 pb-1 sm:block">
        <img src="/vestrapay.svg" alt="Vestrapay" className="h-4.5 w-auto opacity-70" />
      </div>

      <div className="flex overflow-x-auto sm:mt-3 sm:flex-col sm:overflow-x-visible">
        {methods.map(({ id, label, icon: Icon }: PaymentMethodConfig, i: number): React.ReactNode => {
          const isActive: boolean = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={(): void => onSelect(id as PaymentMethod)}
              className={`animate-in fade-in-0 slide-in-from-left-2 group relative flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-[12px] font-medium transition-colors duration-150 sm:w-full sm:px-4 sm:py-2.5 ${
                isActive
                  ? "text-primary bg-primary/4"
                  : "text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#374151]"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {isActive && (
                <span className="bg-primary absolute top-1 bottom-1 left-0 hidden w-0.5 rounded-r sm:block" />
              )}
              {isActive && (
                <span className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 sm:hidden" />
              )}
              <Icon className="size-5" active={isActive} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
