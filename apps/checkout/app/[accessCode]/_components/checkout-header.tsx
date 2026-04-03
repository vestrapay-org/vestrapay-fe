"use client";

import { X } from "@/components/icons";
import type { CheckoutHeaderProps } from "../_lib/types";

function MerchantAvatar({ name }: { readonly name: string }): React.ReactNode {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md text-[11px] font-bold tracking-wide">
      {initials}
    </div>
  );
}

export function CheckoutHeader({
  merchantName,
  email,
  formattedAmount,
  onClose,
}: Omit<CheckoutHeaderProps, "description">): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 border-b border-[#ebedf2] px-5 pt-4 pb-4 duration-300 sm:px-6 sm:pt-5 sm:pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MerchantAvatar name={merchantName} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#1a1d26]">
              {merchantName}
            </p>
            <p className="truncate text-[11px] text-[#6b7280]">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-[#9ca3af] transition-colors hover:bg-[#f3f4f6] hover:text-[#6b7280]"
          aria-label="Close"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-[#1a1d26] sm:text-[28px]">
        {formattedAmount}
      </p>
    </div>
  );
}
