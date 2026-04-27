"use client";

import { Check, Plus } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import type { LedgerAccount } from "./accounts-types";

type AccountSelectorPanelProps = {
  accounts: LedgerAccount[];
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateAccount?: () => void;
};

export function AccountSelectorPanel({
  accounts,
  selectedId,
  onSelect,
  onCreateAccount,
}: AccountSelectorPanelProps) {
  return (
    <aside className="flex w-full flex-col lg:max-w-[320px]">
      <p className="m-0 text-[0.65rem] font-semibold tracking-[0.12em] text-gray-500 uppercase">
        Select account
      </p>
      <h2 className="m-0 mt-1 text-lg font-bold tracking-tight text-[#0c0c3a]">
        Ledger Portfolios
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        {accounts.map((account) => {
          const selected = account.id === selectedId;
          return (
            <button
              key={account.id}
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(account.id)}
              className={cn(
                "relative w-full rounded-2xl border p-5 text-left transition-shadow",
                selected
                  ? "border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                  : "border-transparent bg-[#f3f4f6] hover:bg-[#eceef2]",
              )}
            >
              {selected ? (
                <span
                  className="absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-[#0c0c3a] text-white"
                  aria-hidden
                >
                  <Check className="size-3.5 stroke-[3]" />
                </span>
              ) : null}

              <div className="mb-2 flex min-h-[1.125rem] items-center">
                {account.isPrimary ? (
                  <p className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-[#0c0c3a] uppercase">
                    Primary
                  </p>
                ) : null}
              </div>

              <p
                className={cn(
                  "m-0 pr-10 text-[0.95rem] leading-snug",
                  selected ? "font-bold text-[#0c0c3a]" : "font-semibold text-gray-700",
                )}
              >
                {account.name}
              </p>
              <p
                className={cn(
                  "m-0 mt-2 text-base font-bold tracking-tight",
                  selected ? "text-[#0c0c3a]" : "text-gray-800",
                )}
              >
                {account.balanceLabel}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onCreateAccount?.()}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#d1d5db] bg-transparent py-3.5 text-sm font-semibold text-[#0c0c3a] transition-colors hover:border-[#0c0c3a]/40 hover:bg-white/60"
      >
        <Plus className="size-4 shrink-0 stroke-[2.5]" strokeWidth={2.5} />
        Create New Account
      </button>
    </aside>
  );
}
