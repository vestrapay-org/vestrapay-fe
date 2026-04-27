"use client";

import Link from "next/link";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKybWizard } from "./kyb-wizard-context";

const SETTLEMENT_CURRENCIES = [
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
] as const;

const NGN_BANKS = [
  "Access Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "Globus Bank",
  "Guaranty Trust Bank",
  "Heritage Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Moniepoint Microfinance Bank",
  "Opay",
  "Palmpay",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank Nigeria",
  "Sterling Bank",
  "Suntrust Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
] as const;

const ACCOUNT_TYPES = ["Business Checking", "Business Savings", "Other"] as const;

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#0a0d56]";
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0a0d56] focus:ring-2 focus:ring-[#0a0d56]/15";

export function KybSettlementForm() {
  const { settlement, setSettlement } = useKybWizard();
  const isNgn = settlement.settlementCurrency === "NGN";

  const accountDigits = settlement.accountNumber.replace(/\D/g, "");
  const routingDigits = settlement.routingNumber.replace(/\D/g, "");

  const canSubmit = isNgn
    ? settlement.bankName.trim().length > 0 &&
      accountDigits.length === 10 &&
      settlement.accountHolderName.trim().length >= 2
    : settlement.bankName.trim().length > 1 &&
      settlement.accountType.length > 0 &&
      accountDigits.length >= 8 &&
      routingDigits.length === 9;

  function handleCurrencyChange(next: string) {
    setSettlement((prev) => ({
      ...prev,
      settlementCurrency: next,
      ...(next === "NGN"
        ? { accountType: "", routingNumber: "" }
        : { accountHolderName: "" }),
    }));
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-6 text-center md:mb-8">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Settlement details</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Tell us where you want payouts to be sent. This should be a business bank account in your company&apos;s name.
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-[#f5f6f8] p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-2 md:mb-6">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#0a0d56]/10 text-[#0a0d56]">
            <Banknote className="size-5" aria-hidden />
          </span>
          <h2 className="m-0 text-sm font-bold uppercase tracking-[0.12em] text-[#0a0d56] md:text-[0.8125rem]">
            Primary settlement currency
          </h2>
        </div>

        <div className="space-y-4 md:space-y-5">
          <div>
            <label className={labelClass} htmlFor="kyb-settlement-currency">
              Currency
            </label>
            <select
              id="kyb-settlement-currency"
              className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              }}
              value={settlement.settlementCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {SETTLEMENT_CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {isNgn ? (
            <>
              <div>
                <label className={labelClass} htmlFor="kyb-ngn-bank">
                  Bank name
                </label>
                <select
                  id="kyb-ngn-bank"
                  className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  }}
                  value={settlement.bankName}
                  onChange={(e) => setSettlement((prev) => ({ ...prev, bankName: e.target.value }))}
                >
                  <option value="">Select your bank</option>
                  {NGN_BANKS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <div>
                  <label className={labelClass} htmlFor="kyb-ngn-account-number">
                    Account number (NUBAN)
                  </label>
                  <input
                    id="kyb-ngn-account-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={10}
                    placeholder="10-digit NUBAN number"
                    className={inputClass}
                    value={settlement.accountNumber}
                    onChange={(e) =>
                      setSettlement((prev) => ({
                        ...prev,
                        accountNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="kyb-ngn-account-holder">
                    Account holder name
                  </label>
                  <input
                    id="kyb-ngn-account-holder"
                    type="text"
                    autoComplete="name"
                    placeholder="Automatically retrieved upon verification"
                    className={`${inputClass} bg-slate-50 text-slate-700 placeholder:text-slate-400`}
                    value={settlement.accountHolderName}
                    onChange={(e) =>
                      setSettlement((prev) => ({ ...prev, accountHolderName: e.target.value }))
                    }
                  />
                  <p className="mt-1.5 text-xs italic text-sky-700">*Verified via Bank API*</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <div>
                  <label className={labelClass} htmlFor="kyb-intl-bank">
                    Bank name
                  </label>
                  <input
                    id="kyb-intl-bank"
                    type="text"
                    autoComplete="organization"
                    placeholder="e.g. Chase Bank"
                    className={inputClass}
                    value={settlement.bankName}
                    onChange={(e) => setSettlement((prev) => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="kyb-intl-account-type">
                    Account type
                  </label>
                  <select
                    id="kyb-intl-account-type"
                    className={`${inputClass} appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    }}
                    value={settlement.accountType}
                    onChange={(e) => setSettlement((prev) => ({ ...prev, accountType: e.target.value }))}
                  >
                    <option value="">Select account type</option>
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                <div>
                  <label className={labelClass} htmlFor="kyb-intl-account-number">
                    Account number
                  </label>
                  <input
                    id="kyb-intl-account-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Business account number"
                    className={inputClass}
                    value={settlement.accountNumber}
                    onChange={(e) =>
                      setSettlement((prev) => ({
                        ...prev,
                        accountNumber: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="kyb-intl-routing">
                    Routing number
                  </label>
                  <input
                    id="kyb-intl-routing"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={9}
                    placeholder="9-digit routing number"
                    className={inputClass}
                    value={settlement.routingNumber}
                    onChange={(e) =>
                      setSettlement((prev) => ({
                        ...prev,
                        routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9),
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/kyb/identity"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
        >
          Back
        </Link>
        {canSubmit ? (
          <Button type="button" className="w-full sm:w-auto" asChild>
            <Link href="/dashboard/kyb/review">Continue</Link>
          </Button>
        ) : (
          <Button type="button" className="w-full sm:w-auto" disabled>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
