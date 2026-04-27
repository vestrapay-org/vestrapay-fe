"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, Search, Sparkles, X } from "lucide-react";
import React from "react";

const easing = [0.22, 1, 0.36, 1] as const;

type CreateLedgerAccountModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    accountName: string;
    currency: "NGN";
    reconciliationPercentage: number;
    settlementMode: "existing" | "new";
    bankName: string;
    accountNumber: string;
    accountLookupName: string;
  }) => void;
};

const banks = [
  "Access Bank",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "Opay",
  "PalmPay",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "United Bank for Africa",
  "Wema Bank",
  "Zenith Bank",
] as const;

const accountLookupBySuffix: Record<string, string> = {
  "10": "ALEXANDER VENTURES LIMITED",
  "18": "VESTRA TECH SOLUTIONS",
  "24": "SUPPLYCHAIN RETAIL HUB",
  "51": "RIVERSIDE MERCHANTS LTD",
  "90": "INVENTORY SAVINGS COLLECTIVE",
};

export function CreateLedgerAccountModal({
  open,
  onClose,
  onSubmit,
}: CreateLedgerAccountModalProps) {
  const [ledgerName, setLedgerName] = React.useState("");
  const [currency, setCurrency] = React.useState<"NGN">("NGN");
  const [reconciliationPercentage, setReconciliationPercentage] = React.useState("0");
  const [settlementMode, setSettlementMode] = React.useState<"existing" | "new">("existing");
  const [bankName, setBankName] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");
  const [isLookupPending, setIsLookupPending] = React.useState(false);
  const [accountLookupName, setAccountLookupName] = React.useState("Waiting for lookup...");
  const [lookupTag, setLookupTag] = React.useState("Auto-populated via NIP lookup");

  React.useEffect(() => {
    if (!open) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setLedgerName("");
      setCurrency("NGN");
      setReconciliationPercentage("0");
      setSettlementMode("existing");
      setBankName("");
      setAccountNumber("");
      setIsLookupPending(false);
      setAccountLookupName("Waiting for lookup...");
      setLookupTag("Auto-populated via NIP lookup");
    }
  }, [open]);

  React.useEffect(() => {
    const cleanAccountNumber = accountNumber.replace(/\D/g, "").slice(0, 10);
    if (cleanAccountNumber !== accountNumber) {
      setAccountNumber(cleanAccountNumber);
      return;
    }

    if (cleanAccountNumber.length !== 10 || bankName.length === 0) {
      setIsLookupPending(false);
      setAccountLookupName("Waiting for lookup...");
      setLookupTag("Auto-populated via NIP lookup");
      return;
    }

    setIsLookupPending(true);
    setLookupTag("Looking up account...");

    const timer = window.setTimeout(() => {
      const suffix = cleanAccountNumber.slice(-2);
      const resolvedName = accountLookupBySuffix[suffix] ?? "VESPAY COMMERCE ENTITY";
      setAccountLookupName(resolvedName);
      setLookupTag("Lookup successful");
      setIsLookupPending(false);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [accountNumber, bankName]);

  const accountNameValid = ledgerName.trim().length >= 3;
  const reconciliationNumber = Number(reconciliationPercentage);
  const reconciliationValid =
    Number.isFinite(reconciliationNumber) &&
    reconciliationNumber >= 0 &&
    reconciliationNumber <= 100;
  const bankSelected = bankName.trim().length > 0;
  const accountNumberValid = accountNumber.length === 10;
  const lookupValid = accountLookupName !== "Waiting for lookup...";

  const submitDisabled =
    !accountNameValid ||
    !reconciliationValid ||
    !bankSelected ||
    !accountNumberValid ||
    !lookupValid ||
    isLookupPending;

  const handleSubmit = () => {
    if (submitDisabled) return;
    onSubmit?.({
      accountName: ledgerName.trim(),
      currency,
      reconciliationPercentage: reconciliationNumber,
      settlementMode,
      bankName,
      accountNumber,
      accountLookupName,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-ledger-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: easing }}
        >
          <motion.button
            type="button"
            aria-label="Close create ledger account modal"
            className="absolute inset-0 border-0 bg-[radial-gradient(circle_at_top,_rgba(52,47,113,0.72),_rgba(17,24,39,0.76))] backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          <motion.div
            className="relative z-[1] flex max-h-[90dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_30px_60px_-28px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: easing }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex size-11 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#0C0644]">
                  <Sparkles className="size-5" strokeWidth={2.1} />
                </div>
                <div>
                  <h2
                    id="create-ledger-title"
                    className="m-0 text-[32px] leading-none font-semibold tracking-[-0.02em] text-[#111827]"
                  >
                    New Sub Account
                  </h2>
                  <p className="m-0 mt-1 text-sm text-[#6B7280]">
                    Organize your revenue streams with isolated accounts.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-xl border-0 bg-transparent text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#4B5563]"
                aria-label="Close"
              >
                <X className="size-6" strokeWidth={2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ledger-account-name"
                    className="text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase"
                  >
                    Account Name
                  </label>
                  <input
                    id="ledger-account-name"
                    value={ledgerName}
                    onChange={(event) => setLedgerName(event.target.value)}
                    placeholder="e.g., Inventory Savings"
                    className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ledger-currency"
                    className="text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase"
                  >
                    Primary Currency
                  </label>
                  <select
                    id="ledger-currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value as "NGN")}
                    className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm text-[#111827] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                  >
                    <option value="NGN">Nigerian Naira (NGN)</option>
                  </select>
                </div>
              </section>

              <section className="border-t border-[#E5E7EB] pt-6">
                <h3 className="m-0 text-[18px] font-medium text-[#111827]">Reconciliation Rule</h3>
                <div className="mt-4 max-w-[320px]">
                  <label
                    htmlFor="reconciliation-percentage"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase"
                  >
                    Reconciliation Percentage
                    <Info className="size-3.5 text-[#9CA3AF]" />
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="reconciliation-percentage"
                      value={reconciliationPercentage}
                      onChange={(event) => {
                        const nextValue = event.target.value.replace(/[^\d.]/g, "");
                        setReconciliationPercentage(nextValue);
                      }}
                      inputMode="decimal"
                      className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-10 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-[#6B7280]">
                      %
                    </span>
                  </div>
                </div>
              </section>

              <section className="border-t border-[#E5E7EB] pt-6">
                <h3 className="m-0 text-[18px] font-medium text-[#111827]">
                  Settlement Configuration
                </h3>
                <p className="m-0 mt-1 text-sm text-[#6B7280]">
                  Choose where funds from this ledger will be settled.
                </p>

                <div className="mt-4 inline-flex rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                  <button
                    type="button"
                    onClick={() => setSettlementMode("existing")}
                    className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
                      settlementMode === "existing"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    Use existing account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettlementMode("new")}
                    className={`h-10 rounded-lg px-4 text-sm font-semibold transition-colors ${
                      settlementMode === "new"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6B7280] hover:text-[#111827]"
                    }`}
                  >
                    Add new settlement account
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="bank-name"
                      className="text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase"
                    >
                      Bank Name
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="bank-name"
                        value={bankName}
                        onChange={(event) => setBankName(event.target.value)}
                        className="h-12 w-full appearance-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 pr-10 text-sm text-[#111827] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                      >
                        <option value="">Select a Nigerian Bank</option>
                        {banks.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                      <Search className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#6B7280]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="account-number"
                        className="text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase"
                      >
                        Account Number
                      </label>
                      <input
                        id="account-number"
                        value={accountNumber}
                        onChange={(event) => setAccountNumber(event.target.value)}
                        placeholder="10-digit number"
                        inputMode="numeric"
                        maxLength={10}
                        className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label className="text-[11px] font-bold tracking-[0.14em] text-[#4B5563] uppercase">
                          Account Name
                        </label>
                        <span className="rounded bg-[#EEF2FF] px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-[#312E81] uppercase">
                          {lookupTag}
                        </span>
                      </div>
                      <div className="flex h-12 items-center rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] px-4 text-sm text-[#374151]">
                        {isLookupPending ? "Verifying account details..." : accountLookupName}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
                <p className="m-0 flex items-start gap-2.5 text-sm leading-relaxed text-[#4B5563]">
                  <Info className="mt-0.5 size-4 shrink-0 text-[#0C0644]" />
                  Generating a new ledger account creates a dedicated NUBAN for direct bank
                  transfers in NGN. Settlement occurs according to your dashboard default schedule.
                </p>
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] bg-[#FFFFFF] px-5 py-4 sm:px-7 sm:py-5">
              <button
                type="button"
                disabled={submitDisabled}
                onClick={handleSubmit}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#0C0644] text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(12,6,68,0.75)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="size-4.5" strokeWidth={2.4} />
                Generate New Ledger Account
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 h-10 w-full rounded-lg border-0 bg-transparent text-sm font-medium text-[#6B7280] hover:text-[#111827]"
              >
                Cancel and Return to Main Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
