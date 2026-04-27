"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, Flag, X } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import type { TransactionRecord } from "./transactions-types";

const panelEase = [0.32, 0.72, 0, 1] as const;
const slideMs = 0.38;

type TransferDetailPanelProps = {
  open: boolean;
  row: TransactionRecord | null;
  onClose: () => void;
  onExitComplete?: () => void;
};

function transferReferenceId(row: TransactionRecord): string {
  const tail = row.subtitle.replace(/\D/g, "").slice(-5).padStart(5, "0");
  return `VP-TRNF-${tail}`;
}

function sessionIdPreview(row: TransactionRecord): string {
  const digits = row.subtitle.replace(/\D/g, "");
  const core = `999023231025101410${digits.slice(0, 8)}`;
  return `${core.slice(0, 22)}…`;
}

export function TransferDetailPanel({ open, row, onClose, onExitComplete }: TransferDetailPanelProps) {
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
          key="transfer-detail-sheet"
          className="fixed inset-y-0 right-0 z-[100] flex w-screen max-w-[100vw]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="transfer-detail-title"
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

          <aside className="flex h-full w-full max-w-full shrink-0 flex-col bg-white shadow-[0_0_48px_-12px_rgba(15,23,42,0.35)] sm:max-w-[420px]">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
              <div className="min-w-0">
                <h2 id="transfer-detail-title" className="m-0 text-lg font-bold tracking-tight text-[#1a1a3d]">
                  Transaction Detail
                </h2>
                <p className="m-0 mt-1 text-xs font-medium tracking-wide text-gray-500">
                  REF: {transferReferenceId(displayRow)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border-0 bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-[#1a1a3d]"
                aria-label="Close"
              >
                <X className="size-5" strokeWidth={2.25} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
              <section className="text-center">
                <p className="m-0 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gray-500">Total amount</p>
                <p className="m-0 mt-2 text-3xl font-bold tracking-tight text-[#1a1a3d]">{displayRow.amount}</p>
                <div className="mt-4 flex justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide",
                      displayRow.status === "SUCCESSFUL" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        displayRow.status === "SUCCESSFUL" ? "bg-emerald-500" : "bg-amber-500",
                      )}
                      aria-hidden
                    />
                    {displayRow.status}
                  </span>
                </div>
              </section>

              <section className="mt-10">
                <h3 className="m-0 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Activity timeline</h3>
                <ol className="relative m-0 mt-5 list-none p-0">
                  <span className="absolute top-2 bottom-2 left-[0.65rem] w-px bg-gray-200" aria-hidden />
                  {[
                    {
                      title: "Transfer Completed",
                      body: "Funds deposited successfully into recipient's account.",
                      time: "Oct 25, 2023 · 10:15:22 AM",
                    },
                    {
                      title: "Security Verified",
                      body: "Transaction passed automated risk and compliance checks.",
                      time: "Oct 25, 2023 · 10:14:08 AM",
                    },
                    {
                      title: "Transfer Initiated",
                      body: "Transfer request received via API.",
                      time: "Oct 25, 2023 · 10:12:41 AM",
                    },
                  ].map((item) => (
                    <li key={item.title} className="relative flex gap-4 pb-8 last:pb-0">
                      <span className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                        <Check className="size-3.5 stroke-[3]" aria-hidden />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="m-0 text-sm font-bold text-[#1a1a3d]">{item.title}</p>
                        <p className="m-0 mt-1 text-sm leading-snug text-gray-600">{item.body}</p>
                        <p className="m-0 mt-2 text-xs font-medium text-gray-400">{item.time}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-10">
                <h3 className="m-0 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gray-500">Transaction metadata</h3>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Sender name</dt>
                    <dd className="m-0 mt-1 text-sm font-bold text-[#1a1a3d]">Vestrapay Operating</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Recipient name</dt>
                    <dd className="m-0 mt-1 text-sm font-bold text-[#1a1a3d]">
                      {displayRow.referenceOrRecipient.replace(/\s*\(\d+\)\s*$/, "").trim()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Recipient bank</dt>
                    <dd className="m-0 mt-1 text-sm font-bold text-[#1a1a3d]">{displayRow.channelOrBank}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Account number</dt>
                    <dd className="m-0 mt-1 text-sm font-bold text-[#1a1a3d]">{displayRow.subtitle}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Transaction fee</dt>
                    <dd className="m-0 mt-1 text-sm font-bold text-[#1a1a3d]">{displayRow.fee ?? "—"}</dd>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500">Session ID</dt>
                    <dd className="m-0 mt-1 truncate text-sm font-bold text-[#1a1a3d]" title={sessionIdPreview(displayRow)}>
                      {sessionIdPreview(displayRow)}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <footer className="shrink-0 border-t border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-[#1a1a3d] text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                >
                  <FileText className="size-4" strokeWidth={2} />
                  Download Receipt
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Flag className="size-4" strokeWidth={2} />
                  Flag Transaction
                </button>
              </div>
            </footer>
          </aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
