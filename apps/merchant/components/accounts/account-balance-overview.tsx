"use client";

import { ArrowUpRight, Copy } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import type { AccountOverview, LedgerCurrency } from "./accounts-types";

const CURRENCIES: LedgerCurrency[] = ["NGN", "USD", "GBP"];

type AccountBalanceOverviewProps = {
  overview: AccountOverview;
  currency: LedgerCurrency;
  onCurrencyChange: (c: LedgerCurrency) => void;
  onFundAccount?: () => void;
  onWithdraw?: () => void;
};

export function AccountBalanceOverview({
  overview,
  currency,
  onCurrencyChange,
  onFundAccount,
  onWithdraw,
}: AccountBalanceOverviewProps) {
  const [copied, setCopied] = React.useState(false);

  const copyNuban = () => {
    void navigator.clipboard.writeText(overview.nuban);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f9fafb] p-1"
          role="tablist"
          aria-label="Currency"
        >
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={currency === c}
              onClick={() => onCurrencyChange(c)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-colors",
                currency === c
                  ? "bg-[#0c0c3a] text-white shadow-sm"
                  : "text-gray-500 hover:text-[#0c0c3a]",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => onFundAccount?.()}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0c0c3a] px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            + Fund Account
          </button>
          <button
            type="button"
            onClick={() => onWithdraw?.()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] px-4 text-sm font-semibold text-[#0c0c3a] transition-colors hover:bg-[#eceef2]"
          >
            Withdraw
            <ArrowUpRight className="size-4" aria-hidden strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="mt-8">
        <p className="m-0 text-[0.65rem] font-semibold tracking-[0.14em] text-gray-500 uppercase">
          Available balance
        </p>
        <p className="m-0 mt-2 text-3xl font-bold tracking-tight text-[#0c0c3a] md:text-[2.125rem]">
          {overview.availableBalance}
        </p>
      </div>

      <div className="mt-8 grid gap-6 border-t border-[#e5e7eb] pt-6 sm:grid-cols-3">
        <div>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.12em] text-gray-500 uppercase">
            Nuban account
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-[#0c0c3a]">
              {overview.nuban}
            </span>
            <button
              type="button"
              onClick={copyNuban}
              className="inline-flex size-8 items-center justify-center rounded-lg border border-transparent text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0c0c3a]"
              aria-label={copied ? "Copied" : "Copy account number"}
            >
              <Copy className="size-4" />
            </button>
          </div>
          {copied ? <p className="m-0 mt-1 text-xs font-medium text-emerald-600">Copied</p> : null}
        </div>
        <div>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.12em] text-gray-500 uppercase">
            Bank name
          </p>
          <p className="m-0 mt-2 text-sm font-bold text-[#0c0c3a]">{overview.bankName}</p>
        </div>
        <div>
          <p className="m-0 text-[0.65rem] font-semibold tracking-[0.12em] text-gray-500 uppercase">
            Account status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-sm font-bold text-[#0c0c3a]">{overview.accountStatus}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
