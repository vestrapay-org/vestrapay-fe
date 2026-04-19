"use client";

import {
  Banknote,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Filter,
  Landmark,
  RotateCcw,
  Search,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { buildPaymentLinksDataset, PAYMENT_LINKS_TOTAL } from "./payment-links-mock-data";
import type { PaymentLinkCurrency, PaymentLinkFeeBearer, PaymentLinkRow, PaymentLinkStatus } from "./payment-links-types";

const PAGE_SIZE = 3;

function getPaginationRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }
  const set = new Set<number>();
  set.add(1);
  set.add(total);
  for (let d = -1; d <= 1; d++) {
    const p = current + d;
    if (p >= 1 && p <= total) set.add(p);
  }
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      out.push("ellipsis");
    }
    out.push(sorted[i]!);
  }
  return out;
}

function CurrencyCell({ currency }: { currency: PaymentLinkCurrency }) {
  const flag: Record<PaymentLinkCurrency, string> = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
  };
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[11px] leading-none shadow-[0_1px_0_rgba(15,23,42,0.04)]"
        aria-hidden
      >
        {flag[currency]}
      </span>
      <span className="text-sm font-bold text-gray-900">{currency}</span>
    </div>
  );
}

function FeeBearerBadge({ bearer }: { bearer: PaymentLinkFeeBearer }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wide uppercase",
        bearer === "MERCHANT"
          ? "bg-orange-50 text-orange-700 ring-1 ring-orange-100/80"
          : "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100/80",
      )}
    >
      {bearer}
    </span>
  );
}

function LinkStatusBadge({ status }: { status: PaymentLinkStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-bold tracking-wide uppercase ring-1",
        status === "ACTIVE"
          ? "bg-emerald-50 text-emerald-800 ring-emerald-100/90"
          : "bg-gray-100 text-gray-600 ring-gray-200/80",
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded-full", status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400")}
        aria-hidden
      />
      {status}
    </span>
  );
}

function FilterPill({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-100"
    >
      <Icon className="size-3.5 text-gray-500" strokeWidth={2} />
      {label}
      <ChevronDown className="size-3.5 text-gray-400" strokeWidth={2} />
    </button>
  );
}

function mockPaymentUrl(row: PaymentLinkRow): string {
  return `https://pay.vestrapay.com/l/${row.linkIdDisplay.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (nextPage: number) => void;
};

function PaymentLinksPagination({ page, pageSize, totalItems, onPageChange }: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);
  const range = React.useMemo(() => getPaginationRange(safePage, totalPages), [safePage, totalPages]);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="m-0 text-[0.65rem] font-bold tracking-[0.08em] text-gray-500 uppercase">
        Showing {start}-{end} of {totalItems} payment links
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className={cn(
            "rounded-md p-1.5 text-gray-500 transition-colors",
            safePage <= 1 ? "cursor-not-allowed opacity-40" : "hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        {range.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-1.5 text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                "flex min-w-[2rem] items-center justify-center rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
                item === safePage ? "bg-[#0b0c45] text-white shadow-sm" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className={cn(
            "rounded-md p-1.5 text-gray-500 transition-colors",
            safePage >= totalPages ? "cursor-not-allowed opacity-40" : "hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export function PaymentLinksView() {
  const fullRows = React.useMemo(() => buildPaymentLinksDataset(PAYMENT_LINKS_TOTAL), []);
  const [page, setPage] = React.useState(1);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(PAYMENT_LINKS_TOTAL / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = React.useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return fullRows.slice(start, start + PAGE_SIZE);
  }, [fullRows, safePage]);

  const copyLink = (row: PaymentLinkRow) => {
    void navigator.clipboard.writeText(mockPaymentUrl(row));
    setCopiedId(row.id);
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="m-0 text-2xl font-bold tracking-tight text-[#0b0c45] md:text-[1.75rem]">
            Payment Links
          </h1>
          <p className="m-0 mt-2 max-w-xl text-sm font-medium leading-relaxed text-gray-500">
            Generate and manage secure payment anchors for global settlements.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg border-0 bg-[#0b0c45] px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 sm:w-auto"
        >
          + Create Payment Link
        </button>
      </div>

      <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-4 md:gap-5">
          <div className="relative min-h-10 min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search by name or ID..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50/80 py-2 pr-3 pl-10 text-sm font-medium text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 focus:border-[#0b0c45]/35 focus:bg-white focus:ring-2 focus:ring-[#0b0c45]/15"
              aria-label="Search payment links"
            />
          </div>
          <div className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0 md:gap-2.5 [&::-webkit-scrollbar]:hidden">
            <FilterPill label="Date Range" icon={Calendar} />
            <FilterPill label="Status" icon={Filter} />
            <FilterPill label="Account" icon={Landmark} />
            <FilterPill label="Currency" icon={Banknote} />
          </div>
        </div>

        <div className="md:hidden divide-y divide-gray-100 bg-white">
          {pageRows.map((row) => (
            <div key={row.id} className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm font-bold text-gray-900">{row.linkName}</p>
                  <p className="m-0 mt-1 text-xs font-medium tracking-wide text-gray-400">{row.linkIdDisplay}</p>
                </div>
                <LinkStatusBadge status={row.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-gray-900">{row.amountDisplay}</span>
                <CurrencyCell currency={row.currency} />
              </div>
              <p className="m-0 text-xs font-semibold text-gray-600">
                <span className="font-bold text-gray-500">Account: </span>
                <span className="text-gray-800">{row.accountMapped}</span>
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <FeeBearerBadge bearer={row.feeBearer} />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    row.status === "EXPIRED" ? "text-red-600" : "text-gray-900",
                  )}
                >
                  Expires {row.expiresLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.status === "EXPIRED" ? (
                  <button
                    type="button"
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50 sm:flex-none"
                  >
                    <RotateCcw className="size-3.5 text-gray-600" strokeWidth={2.25} />
                    Re-activate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => copyLink(row)}
                    className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50 sm:flex-none"
                  >
                    <Copy className="size-3.5 text-gray-600" strokeWidth={2.25} />
                    {copiedId === row.id ? "Copied" : "Copy link"}
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50 sm:flex-none"
                >
                  <Eye className="size-3.5 text-gray-600" strokeWidth={2.25} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden min-w-0 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x md:block">
          <table className="w-full min-w-[1040px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Link name",
                  "Amount",
                  "Currency",
                  "Account mapped",
                  "Fee bearer",
                  "Expires",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-4 align-top">
                    <p className="m-0 text-sm font-bold text-gray-900">{row.linkName}</p>
                    <p className="m-0 mt-1 text-xs font-medium tracking-wide text-gray-400">{row.linkIdDisplay}</p>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span className="text-sm font-bold text-gray-900">{row.amountDisplay}</span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <CurrencyCell currency={row.currency} />
                  </td>
                  <td className="max-w-[200px] px-4 py-4 align-middle">
                    <span className="text-sm font-semibold text-gray-800">{row.accountMapped}</span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <FeeBearerBadge bearer={row.feeBearer} />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        row.status === "EXPIRED" ? "text-red-600" : "text-gray-900",
                      )}
                    >
                      {row.expiresLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <LinkStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex flex-wrap items-center gap-2">
                      {row.status === "EXPIRED" ? (
                        <button
                          type="button"
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50"
                        >
                          <RotateCcw className="size-3.5 text-gray-600" strokeWidth={2.25} />
                          Re-activate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => copyLink(row)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50"
                        >
                          <Copy className="size-3.5 text-gray-600" strokeWidth={2.25} />
                          {copiedId === row.id ? "Copied" : "Copy link"}
                        </button>
                      )}
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[0.65rem] font-bold tracking-wide text-gray-700 uppercase transition-colors hover:bg-gray-50"
                      >
                        <Eye className="size-3.5 text-gray-600" strokeWidth={2.25} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PaymentLinksPagination
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={PAYMENT_LINKS_TOTAL}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
