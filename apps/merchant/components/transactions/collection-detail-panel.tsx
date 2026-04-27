"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, CircleDollarSign, CreditCard, FileText, Info, Store, X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import type { TransactionRecord } from "./transactions-types";

const panelEase = [0.32, 0.72, 0, 1] as const;
const slideMs = 0.38;
const ink = "#1a1c4d";

type CollectionDetailPanelProps = {
  open: boolean;
  row: TransactionRecord | null;
  onClose: () => void;
  onExitComplete?: () => void;
};

function formatDateTimeWithSeconds(dateLabel: string): string {
  if (/:\d{2}:\d{2}/.test(dateLabel)) return dateLabel;
  return `${dateLabel}:45`;
}

function paymentLinkId(row: TransactionRecord): string {
  const digits = row.referenceOrRecipient.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `PL-QTR-${digits}-GEN-2023`;
}

function ledgerId(row: TransactionRecord): string {
  const seed = (row.subtitle + row.referenceOrRecipient).replace(/\D/g, "");
  const mid = seed ? Number(seed.slice(0, 6)) % 900 + 100 : 449;
  const tail = seed ? Number(seed.slice(-4)) % 99 + 1 : 1;
  return `LD-${mid}-${String(tail).padStart(2, "0")}`;
}

function displayFee(row: TransactionRecord): string {
  return row.fee ?? "₦3,750.00";
}

function reconciledAccountTitle(account?: string): string {
  if (!account) return "Primary Account";
  return account.toLowerCase().endsWith("account") ? account : `${account} Account`;
}

export function CollectionDetailPanel({ open, row, onClose, onExitComplete }: CollectionDetailPanelProps) {
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

  const displayRow = row;

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && displayRow ? (
        <motion.div
          key="collection-detail-sheet"
          className="fixed inset-y-0 right-0 z-[100] flex w-screen max-w-[100vw]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="collection-detail-title"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: slideMs, ease: panelEase }}
        >
          <button
            type="button"
            aria-label="Close panel"
            className="min-h-0 min-w-0 flex-1 cursor-default border-0 bg-black/35 backdrop-blur-[1px]"
            onClick={onClose}
          />

          <aside
            className="flex h-full w-full max-w-full shrink-0 flex-col bg-white shadow-[0_0_48px_-12px_rgba(15,23,42,0.35)] sm:max-w-[440px]"
            style={{ color: ink }}
          >
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <h2 id="collection-detail-title" className="m-0 text-lg font-bold tracking-tight" style={{ color: ink }}>
                Transaction Details
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                style={{ color: ink }}
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.25} />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <section className="rounded-xl border border-gray-200 bg-[#f9fafb] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Info className="size-4 text-gray-500" strokeWidth={2} />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Overview</span>
                </div>
                <dl className="m-0 space-y-4">
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Reference</dt>
                    <dd className="m-0 mt-1 text-sm font-bold" style={{ color: ink }}>
                      {displayRow.referenceOrRecipient}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Status</dt>
                    <dd className="m-0 mt-1">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide",
                          displayRow.status === "SUCCESSFUL" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800",
                        )}
                      >
                        {displayRow.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Amount</dt>
                    <dd className="m-0 mt-1 text-sm font-bold" style={{ color: ink }}>
                      {displayRow.amount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Currency</dt>
                    <dd className="m-0 mt-1 text-sm font-bold" style={{ color: ink }}>
                      {displayRow.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Date & time</dt>
                    <dd className="m-0 mt-1 text-sm font-bold" style={{ color: ink }}>
                      {formatDateTimeWithSeconds(displayRow.date)}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard className="size-4 text-gray-500" strokeWidth={2} />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Payment details</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <span className="font-medium text-gray-600">Channel</span>
                    <span className="text-right font-bold" style={{ color: ink }}>
                      {displayRow.channelOrBank}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                    <span className="font-medium text-gray-600">Customer email</span>
                    <span className="max-w-[55%] truncate text-right font-bold" style={{ color: ink }} title={displayRow.subtitle}>
                      {displayRow.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-gray-600">Payment link used</span>
                    <span className="text-right font-bold" style={{ color: ink }}>
                      {paymentLinkId(displayRow)}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Building2 className="size-4 text-gray-500" strokeWidth={2} />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Reconciliation</span>
                </div>
                <div className="rounded-xl bg-gray-100 p-4">
                  <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Account reconciled</p>
                  <div className="mt-3 flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1c4d] text-white">
                      <Store className="size-5" strokeWidth={2} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-bold" style={{ color: ink }}>
                        {reconciledAccountTitle(displayRow.accountReconciled)}
                      </p>
                      <p className="m-0 mt-1 text-xs text-gray-500">Ledger ID: {ledgerId(displayRow)}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <CircleDollarSign className="size-4 text-gray-500" strokeWidth={2} />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Financials</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium text-gray-600">Transaction fee</span>
                  <span className="font-bold" style={{ color: ink }}>
                    {displayFee(displayRow)}
                  </span>
                </div>
              </section>
            </div>

            <footer className="shrink-0 border-t border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-[#f9fafb] text-sm font-semibold transition-colors hover:bg-gray-100"
                  style={{ color: ink }}
                >
                  <FileText className="size-4" strokeWidth={2} />
                  Download Receipt
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-xl border-0 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  style={{ backgroundColor: ink }}
                >
                  Raise Dispute
                </button>
              </div>
            </footer>
          </aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
