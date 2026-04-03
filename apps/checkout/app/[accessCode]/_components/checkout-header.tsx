"use client";

import { X } from "@/components/icons";
import type { CheckoutHeaderProps } from "../_lib/types";

export function CheckoutHeader({
  merchantName,
  email,
  formattedAmount,
  onClose,
}: Omit<CheckoutHeaderProps, "description">): React.ReactNode {
  return (
    <div className="px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
      <div className="mb-5 flex items-center justify-between pb-3">
        <img src="/vestrapay.svg" alt="Vestrapay" className="h-7 w-auto sm:h-8" />
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[#8898aa] transition-colors hover:bg-[#f6f9fc] hover:text-[#3c4257]"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>

      <div>
        <p className="text-sm font-medium text-[#3c4257] sm:text-[15px]">{merchantName}</p>
        <p className="mt-0.5 text-xs text-[#6b7c93] sm:text-sm">{email}</p>
      </div>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#3c4257] sm:mt-3 sm:text-[32px]">
        {formattedAmount}
      </p>
    </div>
  );
}
