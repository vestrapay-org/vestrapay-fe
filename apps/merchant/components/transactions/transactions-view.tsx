"use client";

import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FilterX,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";

import { CollectionDetailPanel } from "./collection-detail-panel";
import { TransferDetailPanel } from "./transfer-detail-panel";
import type { TransactionRecord, TransactionViewMode } from "./transactions-types";

const COLLECTION_TEMPLATES: TransactionRecord[] = [
  {
    referenceOrRecipient: "VP-COLL-89021",
    subtitle: "chukwudi.e@domain.com",
    amount: "₦250,000.00",
    currency: "NGN",
    channelOrBank: "Card Payment",
    accountReconciled: "Primary Account",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 14:22",
  },
  {
    referenceOrRecipient: "VP-COLL-89020",
    subtitle: "a.hassan@provider.ng",
    amount: "₦12,450.00",
    currency: "NGN",
    channelOrBank: "Bank Transfer",
    accountReconciled: "Bag Sales",
    status: "PENDING",
    date: "24 Oct 2023, 13:05",
  },
  {
    referenceOrRecipient: "VP-COLL-89019",
    subtitle: "segun88@mail.com",
    amount: "₦1,200,000.00",
    currency: "NGN",
    channelOrBank: "USSD",
    accountReconciled: "Business Savings",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 11:48",
  },
  {
    referenceOrRecipient: "VP-COLL-89018",
    subtitle: "folake@style.biz",
    amount: "₦55,000.00",
    currency: "NGN",
    channelOrBank: "Card Payment",
    accountReconciled: "Shoe Sales",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 09:12",
  },
  {
    referenceOrRecipient: "VP-COLL-89017",
    subtitle: "tunde@gmail.com",
    amount: "₦8,200.00",
    currency: "NGN",
    channelOrBank: "Bank Transfer",
    accountReconciled: "Primary Account",
    status: "PENDING",
    date: "23 Oct 2023, 18:30",
  },
];

const TRANSFER_TEMPLATES: TransactionRecord[] = [
  {
    referenceOrRecipient: "Zainab Aliyu",
    subtitle: "0123456789",
    amount: "₦45,000.00",
    fee: "₦10.00",
    currency: "NGN",
    channelOrBank: "Access Bank PLC",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 16:45",
  },
  {
    referenceOrRecipient: "Adeola George",
    subtitle: "2091872364",
    amount: "₦120,500.00",
    fee: "₦10.00",
    currency: "NGN",
    channelOrBank: "Guaranty Trust Bank",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 15:20",
  },
  {
    referenceOrRecipient: "Oluwaseun Balogun",
    subtitle: "3045986712",
    amount: "₦8,200.00",
    fee: "₦10.00",
    currency: "NGN",
    channelOrBank: "Zenith Bank",
    status: "PENDING",
    date: "24 Oct 2023, 14:10",
  },
  {
    referenceOrRecipient: "Ibrahim Musa",
    subtitle: "5540392817",
    amount: "₦500,000.00",
    fee: "₦50.00",
    currency: "NGN",
    channelOrBank: "First Bank of Nigeria",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 12:33",
  },
  {
    referenceOrRecipient: "Chioma Okeke",
    subtitle: "7066123456",
    amount: "₦15,000.00",
    fee: "₦10.00",
    currency: "NGN",
    channelOrBank: "United Bank for Africa",
    status: "SUCCESSFUL",
    date: "24 Oct 2023, 09:15",
  },
];

const COLLECTION_TOTAL = 2492;
const TRANSFER_TOTAL = 842;
const PAGE_SIZE = 10;

function buildCollectionDataset(total: number): TransactionRecord[] {
  const templates = COLLECTION_TEMPLATES;
  return Array.from({ length: total }, (_, i) => {
    const base = templates[i % templates.length]!;
    const id = 99999 - i;
    const local = i % templates.length;
    const subtitle = base.subtitle.includes("@")
      ? `${base.subtitle.split("@")[0]}+${i}@${base.subtitle.split("@")[1] ?? "example.com"}`
      : `${base.subtitle}-${i}`;
    return {
      referenceOrRecipient: `VP-COLL-${String(id).padStart(5, "0")}`,
      subtitle,
      amount: base.amount,
      currency: base.currency,
      channelOrBank: base.channelOrBank,
      accountReconciled: base.accountReconciled,
      status: local % 4 === 0 ? "PENDING" : "SUCCESSFUL",
      date: base.date,
    };
  });
}

function buildTransferDataset(total: number): TransactionRecord[] {
  const templates = TRANSFER_TEMPLATES;
  return Array.from({ length: total }, (_, i) => {
    const base = templates[i % templates.length]!;
    return {
      referenceOrRecipient: `${base.referenceOrRecipient} (${i + 1})`,
      subtitle: String(1000000000 + i),
      amount: base.amount,
      fee: base.fee,
      currency: base.currency,
      channelOrBank: base.channelOrBank,
      status: i % 5 === 2 ? "PENDING" : "SUCCESSFUL",
      date: base.date,
    };
  });
}

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

function PillFilter({
  label,
  icon: Icon,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
    >
      {Icon ? <Icon className="size-3.5 text-gray-500" /> : null}
      {label}
      <ChevronDown className="size-3.5 text-gray-400" />
    </button>
  );
}

function StatusPill({ status }: { status: "SUCCESSFUL" | "PENDING" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wide",
        status === "SUCCESSFUL" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
      )}
    >
      {status}
    </span>
  );
}

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (nextPage: number) => void;
};

function TablePagination({ page, pageSize, totalItems, onPageChange }: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);
  const range = React.useMemo(
    () => getPaginationRange(safePage, totalPages),
    [safePage, totalPages],
  );

  return (
    <>
      <p className="m-0 text-xs font-semibold text-gray-600">
        Showing {start.toLocaleString()}-{end.toLocaleString()} of {totalItems.toLocaleString()}{" "}
        results
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className={cn(
            "rounded p-1.5 text-gray-500 transition-colors",
            safePage <= 1
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <ChevronLeft className="size-4" />
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
                "flex min-w-[2rem] items-center justify-center rounded px-2 py-1.5 text-xs font-semibold transition-colors",
                item === safePage ? "bg-[#0b0c45] text-white" : "text-gray-600 hover:bg-gray-100",
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
            "rounded p-1.5 text-gray-500 transition-colors",
            safePage >= totalPages
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </>
  );
}

type TransactionTableProps = {
  mode: TransactionViewMode;
  rows: TransactionRecord[];
  page: number;
  onPageChange: (p: number) => void;
  totalItems: number;
  onTransferRowClick?: (row: TransactionRecord) => void;
  onCollectionRowClick?: (row: TransactionRecord) => void;
};

function TransactionTable({
  mode,
  rows,
  page,
  onPageChange,
  totalItems,
  onTransferRowClick,
  onCollectionRowClick,
}: TransactionTableProps) {
  const isTransfers = mode === "transfers";

  const pagination = (
    <TablePagination
      page={page}
      pageSize={PAGE_SIZE}
      totalItems={totalItems}
      onPageChange={onPageChange}
    />
  );

  if (isTransfers) {
    return (
      <div className="min-w-0 max-w-full space-y-0">
        <div className="md:hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {rows.map((row) => (
              <button
                key={`${row.referenceOrRecipient}-${row.subtitle}`}
                type="button"
                onClick={() => onTransferRowClick?.(row)}
                className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-gray-50/90 focus-visible:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b0c45]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-semibold text-slate-800">{row.referenceOrRecipient}</p>
                    <p className="m-0 mt-0.5 line-clamp-2 text-xs text-gray-500">{row.subtitle}</p>
                  </div>
                  <StatusPill status={row.status} />
                </div>
                <dl className="m-0 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                  <div className="min-w-0">
                    <dt className="font-semibold text-gray-500">Bank / provider</dt>
                    <dd className="mt-0.5 truncate font-medium text-slate-700">{row.channelOrBank}</dd>
                  </div>
                  <div className="min-w-0 text-right">
                    <dt className="font-semibold text-gray-500">Amount</dt>
                    <dd className="mt-0.5 font-bold text-[#181657]">{row.amount}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="font-semibold text-gray-500">Fee</dt>
                    <dd className="mt-0.5 font-medium text-gray-600">{row.fee}</dd>
                  </div>
                  <div className="min-w-0 text-right">
                    <dt className="font-semibold text-gray-500">Date</dt>
                    <dd className="mt-0.5 font-medium text-gray-500">{row.date}</dd>
                  </div>
                </dl>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            {pagination}
          </div>
        </div>

        <div className="hidden md:block">
          <DataTable
            headers={["Recipient", "Bank / Provider", "Amount", "Fee", "Status", "Date"]}
            minWidthClassName="min-w-[860px]"
            footer={pagination}
          >
            {rows.map((row) => (
              <tr
                key={`${row.referenceOrRecipient}-${row.subtitle}`}
                role="button"
                tabIndex={0}
                onClick={() => onTransferRowClick?.(row)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onTransferRowClick?.(row);
                  }
                }}
                className="cursor-pointer border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/90 focus-visible:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b0c45]"
              >
                <td className="px-4 py-2.5">
                  <p className="m-0 text-sm font-semibold text-slate-800">{row.referenceOrRecipient}</p>
                  <p className="m-0 mt-0.5 text-xs text-gray-500">{row.subtitle}</p>
                </td>
                <td className="px-4 py-2.5 text-sm font-medium text-slate-700">{row.channelOrBank}</td>
                <td className="px-4 py-2.5 text-sm font-bold tracking-tight text-[#181657]">
                  {row.amount}
                </td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-500">{row.fee}</td>
                <td className="px-4 py-2.5">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-500">{row.date}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 max-w-full space-y-0">
      <div className="md:hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <button
              key={`${row.referenceOrRecipient}-${row.subtitle}`}
              type="button"
              onClick={() => onCollectionRowClick?.(row)}
              className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-gray-50/90 focus-visible:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b0c45]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-sm font-semibold text-[#181657]">{row.referenceOrRecipient}</p>
                  <p className="m-0 mt-0.5 line-clamp-2 text-xs text-gray-500">{row.subtitle}</p>
                </div>
                <StatusPill status={row.status} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-[#181657]">{row.amount}</span>
                <span className="text-xs font-medium text-gray-600">{row.currency}</span>
                <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                  {row.channelOrBank}
                </span>
              </div>
              <dl className="m-0 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div className="min-w-0">
                  <dt className="font-semibold text-gray-500">Account reconciled</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{row.accountReconciled}</dd>
                </div>
                <div className="min-w-0">
                  <dt className="font-semibold text-gray-500">Date &amp; time</dt>
                  <dd className="mt-0.5 font-medium text-gray-500">{row.date}</dd>
                </div>
              </dl>
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          {pagination}
        </div>
      </div>

      <div className="hidden md:block">
        <DataTable
          headers={[
            "Reference",
            "Customer",
            "Amount",
            "Currency",
            "Channel",
            "Account Reconciled",
            "Status",
            "Date & Time",
          ]}
          minWidthClassName="min-w-[1100px]"
          footer={pagination}
        >
          {rows.map((row) => (
            <tr
              key={`${row.referenceOrRecipient}-${row.subtitle}`}
              role="button"
              tabIndex={0}
              onClick={() => onCollectionRowClick?.(row)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCollectionRowClick?.(row);
                }
              }}
              className="cursor-pointer border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/90 focus-visible:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0b0c45]"
            >
              <td className="px-4 py-2.5 text-sm font-semibold text-[#181657]">
                {row.referenceOrRecipient}
              </td>
              <td className="px-4 py-2.5">
                <p className="m-0 text-sm font-medium text-slate-700">
                  {row.subtitle.includes("@") ? row.subtitle.split("@")[0] : row.subtitle}
                </p>
                <p className="m-0 mt-0.5 text-xs text-gray-500">{row.subtitle}</p>
              </td>
              <td className="px-4 py-2.5 text-sm font-bold tracking-tight text-[#181657]">
                {row.amount}
              </td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-600">{row.currency}</td>
              <td className="px-4 py-2.5">
                <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                  {row.channelOrBank}
                </span>
              </td>
              <td className="px-4 py-2.5 text-sm font-medium text-slate-700">
                {row.accountReconciled}
              </td>
              <td className="px-4 py-2.5">
                <StatusPill status={row.status} />
              </td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-500">{row.date}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}

function TrendBars({ isTransfer }: { isTransfer: boolean }) {
  const bars = isTransfer ? [36, 50, 66, 56, 74, 62, 86] : [32, 48, 62, 54, 71, 68, 82];
  return (
    <div className="mt-3 flex h-36 items-end gap-2">
      {bars.map((h, idx) => (
        <div
          key={`${idx}-${h}`}
          className={cn(
            "w-full rounded-t-sm",
            idx === bars.length - 1
              ? "bg-[#0a0d56]"
              : idx === bars.length - 2
                ? "bg-[#3d3f75]"
                : "bg-[color:color-mix(in_oklch,#0a0d56_18%,white)]",
          )}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

type TransactionsViewProps = {
  /** Route-driven view: collections vs transfers (no in-page tabs). */
  initialTab?: TransactionViewMode;
};

export function TransactionsView({ initialTab = "collections" }: TransactionsViewProps) {
  const mode: TransactionViewMode = initialTab === "transfers" ? "transfers" : "collections";
  const isTransfers = mode === "transfers";

  const fullCollectionRows = React.useMemo(() => buildCollectionDataset(COLLECTION_TOTAL), []);
  const fullTransferRows = React.useMemo(() => buildTransferDataset(TRANSFER_TOTAL), []);

  const [page, setPage] = React.useState(1);
  const [transferDetailOpen, setTransferDetailOpen] = React.useState(false);
  const [selectedTransfer, setSelectedTransfer] = React.useState<TransactionRecord | null>(null);
  const [collectionDetailOpen, setCollectionDetailOpen] = React.useState(false);
  const [selectedCollection, setSelectedCollection] = React.useState<TransactionRecord | null>(
    null,
  );

  React.useEffect(() => {
    setPage(1);
  }, [mode]);

  React.useEffect(() => {
    setTransferDetailOpen(false);
    setSelectedTransfer(null);
    setCollectionDetailOpen(false);
    setSelectedCollection(null);
  }, [mode, page]);

  const totalItems = isTransfers ? TRANSFER_TOTAL : COLLECTION_TOTAL;
  const fullRows = isTransfers ? fullTransferRows : fullCollectionRows;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = React.useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return fullRows.slice(start, start + PAGE_SIZE);
  }, [fullRows, safePage]);

  const headline = isTransfers ? "Transactions" : "Collections";
  const ledgerLine = isTransfers ? "LEDGER OVERVIEW" : "Inbound ledger";

  const openTransferDetail = React.useCallback((row: TransactionRecord) => {
    setSelectedTransfer(row);
    setTransferDetailOpen(true);
  }, []);

  const openCollectionDetail = React.useCallback((row: TransactionRecord) => {
    setSelectedCollection(row);
    setCollectionDetailOpen(true);
  }, []);

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1500px]">
      <div
        className={cn(
          "mb-2 flex flex-col gap-4 sm:justify-between",
          isTransfers ? "sm:flex-row sm:items-end" : "sm:flex-row sm:items-start sm:gap-4",
        )}
      >
        <div className="min-w-0">
          {isTransfers ? (
            <p className="m-0 text-xs font-semibold tracking-wider text-gray-500 uppercase">{ledgerLine}</p>
          ) : (
            <p className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-gray-500 uppercase">{ledgerLine}</p>
          )}
          <h2
            className={cn(
              "m-0 mt-0.5 font-bold tracking-tight",
              isTransfers ? "text-2xl text-slate-950" : "text-xl text-[#0a0d56] md:text-2xl",
            )}
          >
            {headline}
          </h2>
        </div>
        {isTransfers ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border-0 bg-[#0b0c45] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-110 sm:w-auto"
            >
              <Zap className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
              Initiate Transfer
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
            >
              <Download className="size-4 shrink-0 text-slate-600" strokeWidth={2.25} />
              Export CSV
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg border-0 bg-[#0b0c45] px-4 text-xs font-semibold text-white shadow-sm hover:brightness-110 sm:w-auto"
          >
            <Download className="size-3.5" />
            Export CSV
          </button>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <PillFilter label="Date Range" icon={Calendar} />
        <PillFilter label="Account: All Accounts" />
        <PillFilter label="Status" />
        {isTransfers ? null : <PillFilter label="Channel" />}
        <PillFilter label="Currency" />
        {isTransfers ? null : <PillFilter label="Amount Range" />}
        <button
          type="button"
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-transparent bg-transparent px-2 text-xs font-semibold text-[#0b0c45] hover:bg-gray-100 sm:ml-auto sm:w-auto"
        >
          <FilterX className="size-3.5" />
          Clear All
        </button>
      </div>

      <div className="mb-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-gray-600 uppercase">
              {isTransfers ? "Transfer volume trends" : "Collection trends"}
            </h3>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-[#0b0c45] sm:self-auto"
            >
              Last 30 Days
              <TrendingUp className="size-3.5" />
            </button>
          </div>

          <TrendBars isTransfer={isTransfers} />

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase">
                {isTransfers ? "Avg. daily outbound" : "Average value"}
              </p>
              <p className="m-0 mt-1 text-2xl font-bold tracking-tight text-[#0a0d56]">
                {isTransfers ? "₦420,000" : "₦82,400"}
              </p>
            </div>
            <div>
              <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase">
                {isTransfers ? "Top destination" : "Peak channel"}
              </p>
              <p className="m-0 mt-1 text-2xl font-bold tracking-tight text-[#0a0d56]">
                {isTransfers ? "Access Bank" : "Card"}
              </p>
            </div>
            <div>
              <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase">
                {isTransfers ? "Successful rate" : "Total volume"}
              </p>
              <p className="m-0 mt-1 text-2xl font-bold tracking-tight text-[#0a0d56]">
                {isTransfers ? "98.2%" : "2,492"}
              </p>
            </div>
          </div>
        </section>

        <aside className="rounded-xl bg-[#0a0d56] p-4 text-white shadow-md">
          <p className="m-0 text-[0.65rem] font-bold tracking-[0.2em] text-white/60 uppercase">
            {isTransfers ? "Total outbound (30d)" : "Live settlement balance"}
          </p>
          <p className="m-0 mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {isTransfers ? "₦12,410,200" : "₦42,890,500"}
          </p>
          <p className="m-0 mt-2 text-sm text-white/70">
            {isTransfers ? "From 842 total transfers" : "Updated 2 minutes ago"}
          </p>

          <button
            type="button"
            className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border-0 bg-white text-sm font-semibold text-[#0a0d56] shadow-sm"
          >
            {isTransfers ? "Payout Settings" : "View Settlement History"}
          </button>
          <p className="m-0 mt-3 text-center text-[0.65rem] text-white/45 italic">
            {isTransfers
              ? "Daily limit remaining: ₦2,589,800"
              : "Funds are ready for next-day payout"}
          </p>
        </aside>
      </div>

      <TransactionTable
        mode={mode}
        rows={pageRows}
        page={safePage}
        onPageChange={setPage}
        totalItems={totalItems}
        onTransferRowClick={isTransfers ? openTransferDetail : undefined}
        onCollectionRowClick={isTransfers ? undefined : openCollectionDetail}
      />

      {isTransfers ? (
        <TransferDetailPanel
          open={transferDetailOpen}
          row={selectedTransfer}
          onClose={() => setTransferDetailOpen(false)}
          onExitComplete={() => setSelectedTransfer(null)}
        />
      ) : (
        <CollectionDetailPanel
          open={collectionDetailOpen}
          row={selectedCollection}
          onClose={() => setCollectionDetailOpen(false)}
          onExitComplete={() => setSelectedCollection(null)}
        />
      )}
    </div>
  );
}
