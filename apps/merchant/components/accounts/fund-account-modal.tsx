"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy, Info, X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import type { LedgerCurrency } from "./accounts-types";

const modalEase = [0.32, 0.72, 0, 1] as const;
const transitionMs = 0.28;
const ink = "#0a0a30";

export type FundAccountModalDetails = {
  accountName: string;
  currency: LedgerCurrency;
  bankName: string;
  accountNumber: string;
};

type FundAccountModalProps = {
  open: boolean;
  details: FundAccountModalDetails | null;
  onClose: () => void;
};

function buildCopyAllText(d: FundAccountModalDetails): string {
  return [
    `Account name: ${d.accountName}`,
    `Currency: ${d.currency}`,
    `Bank: ${d.bankName}`,
    `Account number: ${d.accountNumber}`,
  ].join("\n");
}

export function FundAccountModal({ open, details, onClose }: FundAccountModalProps) {
  const [copiedField, setCopiedField] = React.useState<"number" | "all" | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) setCopiedField(null);
  }, [open]);

  const copyNumber = () => {
    if (!details) return;
    void navigator.clipboard.writeText(details.accountNumber);
    setCopiedField("number");
    window.setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAll = () => {
    if (!details) return;
    void navigator.clipboard.writeText(buildCopyAllText(details));
    setCopiedField("all");
    window.setTimeout(() => setCopiedField(null), 2000);
  };

  const currencyLabel = details?.currency ?? "NGN";

  return (
    <AnimatePresence>
      {open && details ? (
        <motion.div
          key="fund-account-modal"
          className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="fund-account-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionMs, ease: modalEase }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default border-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionMs * 0.85, ease: modalEase }}
          />

          <motion.div
            className="relative z-[1] flex max-h-[min(92dvh,640px)] w-full max-w-[min(100%,28rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.35)] sm:max-h-[90dvh]"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: transitionMs, ease: modalEase }}
            style={{ color: ink }}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-5">
              <div className="min-w-0">
                <h2 id="fund-account-title" className="m-0 text-lg font-bold tracking-tight sm:text-xl">
                  Fund this Account
                </h2>
                <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">
                  Transfer funds to this account using the details below:
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.25} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:space-y-6 sm:px-8 sm:py-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-slate-500 uppercase">Account name</p>
                  <p className="m-0 mt-1.5 text-sm font-bold sm:text-base">{details.accountName}</p>
                </div>
                <div className="sm:text-right">
                  <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-slate-500 uppercase">Currency</p>
                  <p className="m-0 mt-1.5 text-sm font-bold sm:text-base sm:ml-auto sm:inline-block">{details.currency}</p>
                </div>
              </div>
              <div>
                <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-slate-500 uppercase">Bank</p>
                <p className="m-0 mt-1.5 text-sm font-bold sm:text-base">{details.bankName}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 sm:p-5">
                <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-slate-500 uppercase">Account number</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p
                    className="m-0 min-w-0 flex-1 font-mono text-2xl font-bold tracking-tight sm:text-3xl"
                    style={{ color: ink }}
                  >
                    {details.accountNumber}
                  </p>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-2 text-xs font-bold tracking-wide text-[#0c0c3a] uppercase transition-colors hover:bg-white/80"
                  >
                    <Copy className="size-4" strokeWidth={2.25} />
                    {copiedField === "number" ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl bg-sky-50/80 px-4 py-3 sm:px-4 sm:py-3.5">
                <Info className="mt-0.5 size-4 shrink-0 text-[#0c0c3a]" strokeWidth={2.25} aria-hidden />
                <p className="m-0 text-xs font-medium leading-relaxed text-[#0c0c3a] sm:text-sm">
                  Only transfer {currencyLabel} to this account number. Transfers in a different currency will not be
                  credited.
                </p>
              </div>
            </div>

            <div className="shrink-0 space-y-3 border-t border-gray-100 bg-white px-5 py-4 sm:px-8 sm:py-6">
              <button
                type="button"
                onClick={copyAll}
                className={cn(
                  "flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0c0c3a] bg-white text-sm font-semibold text-[#0c0c3a] transition-colors hover:bg-slate-50",
                  copiedField === "all" && "border-emerald-600 text-emerald-700",
                )}
              >
                <Copy className="size-4" strokeWidth={2.25} />
                {copiedField === "all" ? "Copied to clipboard" : "Copy Account Details"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 w-full rounded-xl border-0 bg-[#0c0c3a] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
