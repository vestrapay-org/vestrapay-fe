"use client";

import React from "react";
import { Download, ExternalLink, Filter, Funnel, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { CreateLedgerAccountModal } from "./create-ledger-account-modal";
import { RequestAccountUpdateModal } from "./request-account-update-modal";

export function AccountsDashboardView() {
  const [selectedAccountId, setSelectedAccountId] = React.useState("business");
  const [currency, setCurrency] = React.useState<"NGN" | "USD" | "GBP">("NGN");
  const [updateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [createLedgerModalOpen, setCreateLedgerModalOpen] = React.useState(false);

  const portfolios = [
    { id: "main", tag: "Primary", name: "Main Account", amount: "₦1,240,500.00" },
    { id: "business", tag: "High Yield", name: "Business Savings", amount: "₦2,100,000.00" },
    { id: "bag", tag: "Retail", name: "Bag Sales Account", amount: "₦850,200.00" },
    { id: "shoe", tag: "Retail", name: "Shoe Sales Account", amount: "₦420,000.00" },
  ] as const;

  const activityRows = [
    {
      title: "Weekly Settlement",
      reference: "STL-SET-99021",
      amount: "-₦1,250,000.00",
      amountTone: "debit",
      type: "SETTLEMENT",
      status: "COMPLETED",
      date: "Nov 12, 2023 · 10:30",
    },
    {
      title: "Payment: Alexander V.",
      reference: "VP-COL-22198",
      amount: "+₦500,000.00",
      amountTone: "credit",
      type: "COLLECTION",
      status: "SUCCESS",
      date: "Nov 11, 2023 · 15:45",
    },
    {
      title: "Bulk Settlement",
      reference: "STL-SET-11092",
      amount: "-₦400,000.00",
      amountTone: "debit",
      type: "SETTLEMENT",
      status: "COMPLETED",
      date: "Nov 10, 2023 · 09:00",
    },
  ] as const;

  return (
    <div className="-mx-3 -mt-1 min-w-0 bg-[#f6f7fb] px-3 pt-4 pb-8 sm:-mx-4 sm:px-4 md:-mx-6 md:px-6 md:pt-5">
      <RequestAccountUpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSubmit={() => {
          toast.success("Request raised. Support will contact you within 24 hours.");
        }}
      />
      <CreateLedgerAccountModal
        open={createLedgerModalOpen}
        onClose={() => setCreateLedgerModalOpen(false)}
        onSubmit={(payload) => {
          toast.success(`Ledger account created for ${payload.accountName}.`);
        }}
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside>
            <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#98a0b3] uppercase">
              Select Account
            </p>
            <h2 className="m-0 mt-1 text-base leading-tight font-bold tracking-tight text-[#1c1e4d]">
              Ledger Portfolios
            </h2>
            <div className="mt-5 space-y-3">
              {portfolios.map((portfolio) => {
                const selected = selectedAccountId === portfolio.id;
                return (
                  <button
                    key={portfolio.id}
                    type="button"
                    onClick={() => setSelectedAccountId(portfolio.id)}
                    className={cn(
                      "w-full rounded-[14px] border px-3 py-3 text-left transition-all",
                      selected
                        ? "border-[#1f1d63] bg-[#1f1d63] text-white shadow-[0_8px_18px_-10px_rgba(31,29,99,0.8)]"
                        : "border-[#e3e5ec] bg-[#f9fafc] text-[#272c47] hover:bg-white",
                    )}
                  >
                    <p
                      className={cn(
                        "m-0 text-[10px] font-bold tracking-[0.18em] uppercase",
                        selected ? "text-[#c9ccef]" : "text-[#9aa0b2]",
                      )}
                    >
                      {portfolio.tag}
                    </p>
                    <p className="m-0 mt-1 text-sm leading-tight font-semibold">{portfolio.name}</p>
                    <p
                      className={cn(
                        "m-0 mt-1 text-base font-bold",
                        selected ? "text-white" : "text-[#2b3152]",
                      )}
                    >
                      {portfolio.amount}
                    </p>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setCreateLedgerModalOpen(true)}
              className="mt-4 flex h-[58px] w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#d3d8e4] bg-[#f9fafd] text-xs font-semibold tracking-[0.08em] text-[#7f879a] uppercase hover:bg-white"
            >
              <PlusCircle className="size-4" strokeWidth={2.5} />
              Create New Account
            </button>
          </aside>

          <div className="space-y-5">
            <section className="overflow-hidden rounded-[16px] border border-[#e3e6ef] bg-white">
              <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#eceff6] px-5 pt-5 pb-6 sm:px-6">
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-10">
                  <div>
                    <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#a1a7ba] uppercase">
                      Pending Payout
                    </p>
                    <p className="m-0 mt-1 text-2xl leading-none font-bold tracking-tight text-[#1e2251] sm:text-3xl">
                      ₦450,000.00
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#a1a7ba] uppercase">
                      Total Amount Settled
                    </p>
                    <p className="m-0 mt-1 text-2xl leading-none font-bold tracking-tight text-[#1e2251] sm:text-3xl">
                      ₦1,650,000.00
                    </p>
                  </div>
                </div>

                <div className="inline-flex rounded-full border border-[#e5e8f0] bg-[#f8f9fc] p-1">
                  {(["NGN", "USD", "GBP"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCurrency(c)}
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.08em] transition-colors",
                        currency === c
                          ? "bg-[#211f65] text-white"
                          : "text-[#8b91a3] hover:text-[#2f3560]",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-5 py-5 sm:px-6">
                <p className="m-0 text-[15px] text-[#5f667a]">
                  This is where your funds will be sent during settlement.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center">
                  <div>
                    <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#a1a7ba] uppercase">
                      Account Number
                    </p>
                    <p className="m-0 mt-1 text-lg leading-none font-bold text-[#2b3153]">
                      9876543210
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#a1a7ba] uppercase">
                      Account Name
                    </p>
                    <p className="m-0 mt-1 text-lg leading-none font-bold text-[#2b3153]">
                      VESTRA TECH SOLUTIONS
                    </p>
                  </div>
                  <div>
                    <p className="m-0 text-[10px] font-bold tracking-[0.2em] text-[#a1a7ba] uppercase">
                      Bank Name
                    </p>
                    <p className="m-0 mt-1 text-lg leading-none font-bold text-[#2b3153]">
                      Standard Trust Bank
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpdateModalOpen(true)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-0 bg-[#211f65] px-5 text-sm font-semibold text-white shadow-[0_12px_20px_-12px_rgba(33,31,101,0.8)] transition-all hover:brightness-110"
                  >
                    <ExternalLink className="size-4" />
                    Update Account
                  </button>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[16px] border border-[#e3e6ef] bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#eceff6] px-5 pt-5 pb-4 sm:px-6">
                <div>
                  <h3 className="m-0 text-xl leading-none font-bold text-[#1f2452]">
                    Settlement &amp; Activity
                  </h3>
                  <p className="m-0 mt-1 text-[14px] text-[#7a8094]">
                    Combined overview of incoming payments and settlements
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#dce0e9] bg-white px-4 text-sm font-semibold text-[#2f3559] hover:bg-[#f8f9fc]"
                  >
                    <Funnel className="size-4 text-[#8a90a4]" />
                    Filter
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#dce0e9] bg-white px-4 text-sm font-semibold text-[#2f3559] hover:bg-[#f8f9fc]"
                  >
                    <Download className="size-4 text-[#8a90a4]" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="bg-[#f9fafd]">
                      {["Transaction / Ref", "Amount", "Type", "Status", "Date"].map((header) => (
                        <th
                          key={header}
                          className="px-5 py-3 text-left text-[10px] font-bold tracking-[0.2em] text-[#9ea5ba] uppercase sm:px-6"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row, index) => (
                      <tr
                        key={row.reference}
                        className={cn(
                          index !== activityRows.length - 1 && "border-b border-[#eceff6]",
                        )}
                      >
                        <td className="px-5 py-4 sm:px-6">
                          <p className="m-0 text-base leading-none font-bold text-[#222855]">
                            {row.title}
                          </p>
                          <p className="m-0 mt-1 text-[11px] font-medium text-[#9da4b8]">
                            {row.reference}
                          </p>
                        </td>
                        <td
                          className={cn(
                            "px-5 py-4 text-base leading-none font-bold sm:px-6",
                            row.amountTone === "credit" ? "text-[#22a881]" : "text-[#252a54]",
                          )}
                        >
                          {row.amount}
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <span className="inline-flex items-center gap-2 text-[14px] font-bold text-[#333963]">
                            <span className="size-2 rounded-full bg-[#272767]" />
                            {row.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6">
                          <span className="inline-flex rounded-md bg-[#ebf8ef] px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-[#2e8b66] uppercase">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-medium text-[#9097ab] sm:px-6">
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-[#eceff6] px-5 py-4 text-center sm:px-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-[15px] font-bold text-[#20265c] hover:underline"
                >
                  View all financial records
                  <Filter className="size-4 rotate-90" />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
