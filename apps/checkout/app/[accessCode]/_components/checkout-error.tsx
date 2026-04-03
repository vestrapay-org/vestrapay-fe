import { AlertTriangle } from "lucide-react";
import type { CheckoutErrorProps } from "../_lib/types";

export function CheckoutError({ message }: CheckoutErrorProps): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 flex flex-1 flex-col items-center justify-center gap-4 px-8 py-14 text-center duration-300">
      <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="size-5 text-red-500" strokeWidth={2} />
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-[15px] font-semibold text-[#1a1d26]">Something went wrong</p>
        <p className="max-w-xs text-[13px] leading-relaxed text-[#6b7280]">{message}</p>
      </div>

      <div className="rounded-md bg-red-50 px-4 py-2">
        <p className="text-[11px] text-red-600">Please try again or contact support.</p>
      </div>
    </div>
  );
}
