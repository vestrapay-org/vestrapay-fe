import Link from "next/link";
import React from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Code2,
  CreditCard,
  Key,
  Shield,
} from "lucide-react";

function SandboxBanner() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border border-amber-200/80 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden />
        <p className="m-0 text-sm leading-relaxed text-amber-950 md:text-[0.9375rem]">
          You&apos;re in Sandbox Mode. Complete your KYB verification to start accepting real payments.
        </p>
      </div>
      <Link
        href="/dashboard/kyb"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white no-underline transition-[filter] hover:brightness-110"
      >
        Start KYB verification
      </Link>
    </div>
  );
}

function StatCards() {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">Total collections</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">₦0.00</span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-gray-600">
            Test
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-500">This month</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">Transaction volume</p>
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">0</p>
        <p className="mt-2 text-xs text-gray-500">All time</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">Success rate</p>
        <p className="mt-2 text-2xl font-bold text-slate-400">—</p>
        <p className="mt-2 text-xs text-gray-500">No data yet</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-gray-500">Active channels</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
          <span className="text-sm font-semibold text-slate-900">Sandbox active</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">API version 2.1</p>
      </div>
    </div>
  );
}

function StatusBadge({ children, variant }: { children: React.ReactNode; variant: "pending" | "muted" }) {
  const styles =
    variant === "pending"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : "border-gray-200 bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
}

function RecentTransactions() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="m-0 text-base font-semibold text-slate-900">Recent transactions</h2>
        <Link
          href="/dashboard/transactions"
          className="text-sm font-semibold text-[var(--primary)] no-underline hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[0.65rem] font-bold uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Channel</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            <tr className="border-b border-gray-50">
              <td className="px-5 py-3 font-mono text-xs">VP-SBX-001</td>
              <td className="px-5 py-3 font-medium">₦12,500.00</td>
              <td className="px-5 py-3 text-gray-600">Card</td>
              <td className="px-5 py-3">
                <StatusBadge variant="pending">Pending</StatusBadge>
              </td>
              <td className="px-5 py-3 text-gray-600">Apr 10, 2026</td>
            </tr>
            <tr className="border-b border-gray-50">
              <td className="px-5 py-3 font-mono text-xs">VP-SBX-002</td>
              <td className="px-5 py-3 font-medium">₦4,000.00</td>
              <td className="px-5 py-3 text-gray-600">Transfer</td>
              <td className="px-5 py-3">
                <StatusBadge variant="muted">Simulated</StatusBadge>
              </td>
              <td className="px-5 py-3 text-gray-600">Apr 9, 2026</td>
            </tr>
            <tr>
              <td className="px-5 py-3 font-mono text-xs">VP-SBX-003</td>
              <td className="px-5 py-3 font-medium">₦1,200.00</td>
              <td className="px-5 py-3 text-gray-600">USSD</td>
              <td className="px-5 py-3">
                <StatusBadge variant="muted">Abandoned</StatusBadge>
              </td>
              <td className="px-5 py-3 text-gray-600">Apr 8, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center gap-2 border-t border-gray-100 px-5 py-10 text-center text-sm text-gray-500">
        <CreditCard className="size-10 text-gray-300" aria-hidden />
        <p className="m-0 max-w-sm">
          No live transactions yet. Your sandbox transactions appear here.
        </p>
      </div>
    </section>
  );
}

function QuickActions() {
  const items = [
    { href: "/dashboard/api-keys", label: "View API Keys", desc: "Manage keys & scopes", icon: Key },
    { href: "#", label: "Open docs", desc: "Integration guides", icon: BookOpen },
    { href: "/dashboard/payment-initializer", label: "Test payment", desc: "Run a sandbox charge", icon: CreditCard },
    { href: "/dashboard/kyb", label: "Start KYB", desc: "Unlock live mode", icon: Shield },
  ] as const;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="m-0 text-base font-semibold text-slate-900">Quick actions</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                <span className="block text-xs text-gray-500">{item.desc}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-gray-400" aria-hidden />
            </>
          );

          return (
            <li key={item.label}>
              {item.href === "#" ? (
                <span className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5 opacity-70">
                  {inner}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
                >
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function DeveloperSnapshot() {
  return (
    <section className="mt-4 rounded-xl border border-[color:color-mix(in_oklch,var(--primary)_35%,#1e1b4b)] bg-[var(--primary)] p-5 text-white shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70">
        <Code2 className="size-4" aria-hidden />
        Developer snapshot
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-black/25 p-3 font-mono text-[0.7rem] leading-relaxed text-emerald-100/95 md:text-xs">
        <code>
          {`POST /v1/initialize\n`}
          {`{ "status": "200 OK" }\n`}
          {`{ "gateway": "sandbox" }`}
        </code>
      </pre>
    </section>
  );
}

function DashboardHome() {
  return (
    <>
      <SandboxBanner />
      <StatCards />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <RecentTransactions />
        <div className="flex flex-col">
          <QuickActions />
          <DeveloperSnapshot />
        </div>
      </div>
    </>
  );
}

export { DashboardHome };
