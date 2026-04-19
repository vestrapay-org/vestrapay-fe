"use client";

import { Building2, CreditCard, Download, Filter, Link2 } from "lucide-react";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

import type { CollectionMethod, RecentCollectionRow } from "./accounts-types";

function MethodCell({ method }: { method: CollectionMethod }) {
  const config = {
    card: { Icon: CreditCard, label: "Card" },
    transfer: { Icon: Building2, label: "Transfer" },
    link: { Icon: Link2, label: "Link" },
  }[method];
  const { Icon, label } = config;
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
      <Icon className="size-4 shrink-0 text-gray-500" strokeWidth={2} />
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: RecentCollectionRow["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-3 py-1 text-xs font-bold tracking-wide",
        status === "SUCCESS" ? "bg-[#e6f4ea] text-[#1e7e34]" : "bg-[#fff4e5] text-[#b76e00]",
      )}
    >
      {status}
    </span>
  );
}

type RecentCollectionsCardProps = {
  accountName: string;
  rows: RecentCollectionRow[];
  onFilter?: () => void;
  onExport?: () => void;
};

export function RecentCollectionsCard({
  accountName,
  rows,
  onFilter,
  onExport,
}: RecentCollectionsCardProps) {
  return (
    <section className="mt-5 min-w-0 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 border-b border-[#e5e7eb] px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="m-0 text-lg font-bold tracking-tight text-[#0c0c3a]">
            Recent Collections
          </h3>
          <p className="m-0 mt-1.5 text-sm text-gray-500">
            Inbound payments specific to {accountName}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-wrap gap-2 md:w-auto">
          <button
            type="button"
            onClick={() => onFilter?.()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#0c0c3a] transition-colors hover:bg-[#f9fafb]"
          >
            <Filter className="size-4 text-gray-500" strokeWidth={2} />
            Filter
          </button>
          <button
            type="button"
            onClick={() => onExport?.()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-semibold text-[#0c0c3a] transition-colors hover:bg-[#f9fafb]"
          >
            <Download className="size-4 text-gray-500" strokeWidth={2} />
            Export
          </button>
        </div>
      </div>

      <div className="md:hidden divide-y divide-[#e5e7eb]">
        {rows.map((row) => (
          <div key={row.id} className="space-y-3 px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-bold text-[#0c0c3a]">{row.customerName}</p>
                <p className="m-0 mt-1 text-xs font-medium text-gray-500">{row.reference}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold text-[#0c0c3a]">{row.amount}</span>
              <MethodCell method={row.method} />
            </div>
            <p className="m-0 text-xs font-medium text-gray-500">{row.dateLabel}</p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="bg-[#f4f4f4]">
              {["Source / ref", "Amount", "Method", "Status", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-[0.65rem] font-bold tracking-[0.08em] text-gray-600 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#e5e7eb] last:border-0">
                <td className="px-6 py-4 align-top">
                  <p className="m-0 text-sm font-bold text-[#0c0c3a]">{row.customerName}</p>
                  <p className="m-0 mt-1 text-xs font-medium text-gray-500">{row.reference}</p>
                </td>
                <td className="px-6 py-4 align-top text-sm font-bold text-[#0c0c3a]">
                  {row.amount}
                </td>
                <td className="px-6 py-4 align-top">
                  <MethodCell method={row.method} />
                </td>
                <td className="px-6 py-4 align-top">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-6 py-4 align-top text-sm font-medium text-gray-500">
                  {row.dateLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#e5e7eb] px-4 py-4 text-center sm:px-6 sm:py-5">
        <Link
          href="/dashboard/transactions"
          className="text-sm font-bold text-[#0c0c3a] underline-offset-4 transition-colors hover:underline"
        >
          View All Collections
        </Link>
      </div>
    </section>
  );
}
