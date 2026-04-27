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
    <div className="mb-6 flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <div className="flex min-w-0 gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[var(--warning)]" aria-hidden />
        <p className="vestra-body-md m-0 leading-relaxed text-[var(--foreground)] md:text-[0.9375rem]">
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
    <div className="mb-6 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Total collections</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">₦0.00</span>
          <span className="rounded bg-[var(--background)] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-[var(--muted-foreground)]">
            Test
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">This month</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Transaction volume</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">0</p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">All time</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Success rate</p>
        <p className="mt-2 text-2xl font-semibold text-[var(--muted-foreground)]">—</p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">No data yet</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Active channels</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="size-2 shrink-0 rounded-full bg-[var(--success)]" aria-hidden />
          <span className="text-sm font-semibold text-[var(--foreground)]">Sandbox active</span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">API version 2.1</p>
      </div>
    </div>
  );
}

function StatusBadge({ children, variant }: { children: React.ReactNode; variant: "pending" | "muted" }) {
  const styles =
    variant === "pending"
      ? "border-[var(--info)]/25 bg-[var(--info)]/10 text-[var(--info)]"
      : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]";
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${styles}`}>
      {children}
    </span>
  );
}

function RecentTransactions() {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[var(--border)] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <h2 className="m-0 text-base font-semibold text-[var(--foreground)]">Recent transactions</h2>
        <Link
          href="/dashboard/transactions"
          className="text-sm font-semibold text-[var(--primary)] no-underline hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="md:hidden divide-y divide-[var(--border)]">
        <div className="flex flex-col gap-2 px-3 py-3 sm:px-5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[var(--foreground)]">VP-SBX-001</span>
            <StatusBadge variant="pending">Pending</StatusBadge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">₦12,500.00</span>
            <span className="text-[var(--muted-foreground)]">Card</span>
          </div>
          <p className="m-0 text-xs text-[var(--muted-foreground)]">Apr 10, 2026</p>
        </div>
        <div className="flex flex-col gap-2 px-3 py-3 sm:px-5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[var(--foreground)]">VP-SBX-002</span>
            <StatusBadge variant="muted">Simulated</StatusBadge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">₦4,000.00</span>
            <span className="text-[var(--muted-foreground)]">Transfer</span>
          </div>
          <p className="m-0 text-xs text-[var(--muted-foreground)]">Apr 9, 2026</p>
        </div>
        <div className="flex flex-col gap-2 px-3 py-3 sm:px-5">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs font-semibold text-[var(--foreground)]">VP-SBX-003</span>
            <StatusBadge variant="muted">Abandoned</StatusBadge>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium text-[var(--foreground)]">₦1,200.00</span>
            <span className="text-[var(--muted-foreground)]">USSD</span>
          </div>
          <p className="m-0 text-xs text-[var(--muted-foreground)]">Apr 8, 2026</p>
        </div>
      </div>
      <div className="hidden overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] touch-pan-x md:block">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              <th className="px-3 py-3 font-semibold sm:px-5">Reference</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Amount</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Channel</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Status</th>
              <th className="px-3 py-3 font-semibold sm:px-5">Date</th>
            </tr>
          </thead>
          <tbody className="text-[var(--foreground)]">
            <tr className="border-b border-[var(--border)]/45">
              <td className="px-3 py-3 font-mono text-xs sm:px-5">VP-SBX-001</td>
              <td className="px-3 py-3 font-medium sm:px-5">₦12,500.00</td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">Card</td>
              <td className="px-3 py-3 sm:px-5">
                <StatusBadge variant="pending">Pending</StatusBadge>
              </td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">Apr 10, 2026</td>
            </tr>
            <tr className="border-b border-[var(--border)]/45">
              <td className="px-3 py-3 font-mono text-xs sm:px-5">VP-SBX-002</td>
              <td className="px-3 py-3 font-medium sm:px-5">₦4,000.00</td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">Transfer</td>
              <td className="px-3 py-3 sm:px-5">
                <StatusBadge variant="muted">Simulated</StatusBadge>
              </td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">Apr 9, 2026</td>
            </tr>
            <tr>
              <td className="px-3 py-3 font-mono text-xs sm:px-5">VP-SBX-003</td>
              <td className="px-3 py-3 font-medium sm:px-5">₦1,200.00</td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">USSD</td>
              <td className="px-3 py-3 sm:px-5">
                <StatusBadge variant="muted">Abandoned</StatusBadge>
              </td>
              <td className="px-3 py-3 text-[var(--muted-foreground)] sm:px-5">Apr 8, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center gap-2 border-t border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--muted-foreground)] sm:px-5 sm:py-10">
        <CreditCard className="size-10 text-[var(--muted-foreground)]/45" aria-hidden />
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
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <h2 className="m-0 text-base font-semibold text-[var(--foreground)]">Quick actions</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--background)] text-[var(--muted-foreground)]">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[var(--foreground)]">{item.label}</span>
                <span className="block text-xs text-[var(--muted-foreground)]">{item.desc}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-hidden />
            </>
          );

          return (
            <li key={item.label}>
              {item.href === "#" ? (
                <span className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-2.5 opacity-70">
                  {inner}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-[var(--border)] hover:bg-[var(--background)]"
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
      <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-black/25 p-3 font-mono text-[0.7rem] leading-relaxed text-emerald-100/95 md:text-xs">
        <code>
          {`POST /v1/initialize\n`}
          {`{ "status": "200 OK" }\n`}
          {`{ "gateway": "sandbox" }`}
        </code>
      </pre>
    </section>
  );
}

export function DashboardHome() {
  return (
    <>
      <SandboxBanner />
      <StatCards />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <RecentTransactions />
        <div className="flex flex-col">
          <QuickActions />
          <DeveloperSnapshot />
        </div>
      </div>
    </>
  );
}
