"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useKybWizard } from "./kyb-wizard-context";

const ACCOUNT_TYPES = [
  "Business checking",
  "Business savings",
  "Other",
] as const;

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-gray-500 uppercase";

const inputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-gray-400 focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--primary)_22%,transparent)]";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function KybSettlementForm() {
  const router = useRouter();
  const { settlement, setSettlement } = useKybWizard();

  const routingDigits = digitsOnly(settlement.routingNumber);
  const accountDigits = digitsOnly(settlement.accountNumber);

  const canSubmit = useMemo(() => {
    return (
      settlement.bankName.trim().length > 1 &&
      settlement.accountType.length > 0 &&
      accountDigits.length >= 8 &&
      routingDigits.length === 9
    );
  }, [settlement.bankName, settlement.accountType, accountDigits, routingDigits]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/dashboard/kyb/documents");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Settlement details</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Add the business bank account used for payouts and settlements.
        </p>
      </header>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bankName" className={labelClass}>
            Bank name
          </label>
          <input
            id="bankName"
            name="bankName"
            required
            placeholder="e.g., Global Trust Bank"
            autoComplete="organization"
            className={inputClass}
            value={settlement.bankName}
            onChange={(e) => setSettlement((prev) => ({ ...prev, bankName: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="accountType" className={labelClass}>
            Account type
          </label>
          <div className="relative">
            <select
              id="accountType"
              name="accountType"
              required
              value={settlement.accountType}
              onChange={(e) => setSettlement((prev) => ({ ...prev, accountType: e.target.value }))}
              className={cn(
                inputClass,
                "h-11 appearance-none pr-10",
                settlement.accountType ? "text-gray-900" : "text-gray-400",
              )}
            >
              <option value="">Select account type…</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label htmlFor="accountNumber" className={labelClass}>
            Account number
          </label>
          <input
            id="accountNumber"
            name="accountNumber"
            required
            inputMode="numeric"
            autoComplete="off"
            placeholder="Account number"
            className={inputClass}
            value={settlement.accountNumber}
            onChange={(e) =>
              setSettlement((prev) => ({ ...prev, accountNumber: digitsOnly(e.target.value) }))
            }
          />
        </div>

        <div>
          <label htmlFor="routingNumber" className={labelClass}>
            Routing number
          </label>
          <input
            id="routingNumber"
            name="routingNumber"
            required
            inputMode="numeric"
            maxLength={9}
            autoComplete="off"
            placeholder="9-digit routing number"
            className={inputClass}
            value={settlement.routingNumber}
            onChange={(e) =>
              setSettlement((prev) => ({ ...prev, routingNumber: digitsOnly(e.target.value).slice(0, 9) }))
            }
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/kyb/identity"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-11 min-w-[10rem] rounded-lg border-0 bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save &amp; continue
          </Button>
        </div>
      </form>
    </section>
  );
}

export { KybSettlementForm };
