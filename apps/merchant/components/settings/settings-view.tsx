"use client";

import { History, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAVY = "#0f1638";

const SETTINGS_EVENTS = [
  { id: "payment.success", label: "payment.success", defaultChecked: true },
  { id: "payment.failed", label: "payment.failed", defaultChecked: true },
  { id: "refund.pending", label: "refund.pending", defaultChecked: false },
  { id: "refund.completed", label: "refund.completed", defaultChecked: false },
  { id: "settlement.paid", label: "settlement.paid", defaultChecked: false },
  { id: "payout.failed", label: "payout.failed", defaultChecked: false },
] as const;

const RECENT_LOGS = [
  { event: "payment.success", meta: "2 mins ago • pay_8k21…", status: "200 OK", ok: true },
  { event: "payment.failed", meta: "14 mins ago • pay_8kL2…", status: "200 OK", ok: true },
  { event: "payment.success", meta: "1 hour ago • pay_0fj7…", status: "503 ERR", ok: false },
  { event: "refund.pending", meta: "3 hours ago • ref_3mK9…", status: "200 OK", ok: true },
] as const;

function SettingsWebhooksPanel() {
  const [cardEnv, setCardEnv] = useState<"sandbox" | "live">("sandbox");
  const [events, setEvents] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SETTINGS_EVENTS.map((e) => [e.id, e.defaultChecked])),
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[#0f1638]">Webhooks Configuration</h2>
        <div
          className="inline-flex shrink-0 rounded-full border border-gray-200 bg-gray-100 p-0.5"
          role="group"
          aria-label="Webhook environment"
        >
          <button
            type="button"
            onClick={() => setCardEnv("sandbox")}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              cardEnv === "sandbox" ? "bg-[#0f1638] text-white shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            Sandbox
          </button>
          <button
            type="button"
            onClick={() => setCardEnv("live")}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              cardEnv === "live" ? "bg-[#0f1638] text-white shadow-sm" : "text-gray-600 hover:text-gray-900",
            )}
          >
            Live
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_min(380px,100%)]">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Webhook Endpoint URL
              </label>
              <Input
                readOnly
                className="h-11 rounded-md border-gray-200 bg-gray-100 font-mono text-sm text-gray-600"
                defaultValue="https://yourserver.com/webhook"
              />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Webhook Secret
              </label>
              <div className="relative">
                <Input
                  readOnly
                  className="h-11 rounded-md border-gray-200 bg-gray-100 pr-12 font-mono text-sm text-gray-700"
                  defaultValue="whsec_6Bf8…9rXz"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-[#0f1638]"
                  aria-label="Rotate webhook secret"
                >
                  <RefreshCw className="size-4" />
                </button>
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Events to Listen For
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SETTINGS_EVENTS.map((ev) => (
                  <label
                    key={ev.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={events[ev.id] ?? false}
                      onChange={() => setEvents((s) => ({ ...s, [ev.id]: !s[ev.id] }))}
                      className="size-4 rounded border-gray-300"
                      style={{ accentColor: NAVY }}
                    />
                    <span className="font-mono text-sm text-[#0f1638]">{ev.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-6 border-t border-gray-100 pt-6 md:flex-row md:items-end md:justify-between">
            <p className="text-xs italic text-gray-400">Configured for v2024-03 API version</p>
            <div className="flex flex-col items-stretch gap-3 sm:items-center md:items-end">
              <span className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-500 md:text-right">
                Send test payload
              </span>
              <Button
                type="button"
                className="h-11 min-w-[180px] rounded-md border-0 bg-[#0f1638] text-xs font-bold uppercase tracking-wide text-white hover:brightness-110"
              >
                Save config
              </Button>
            </div>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Recent logs</h3>
            <History className="size-4 text-gray-400" aria-hidden />
          </div>
          <ul className="space-y-4">
            {RECENT_LOGS.map((log) => (
              <li key={`${log.event}-${log.meta}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-[#0f1638]">{log.event}</p>
                    <p className="mt-1 text-xs text-gray-500">{log.meta}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded px-2 py-0.5 text-[10px] font-bold",
                      log.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600",
                    )}
                  >
                    {log.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/webhooks"
            className="mt-6 block text-center text-[11px] font-bold uppercase tracking-wider text-[#0f1638] hover:underline"
          >
            View all events
          </Link>
        </aside>
      </div>
    </>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
      <h2 className="text-lg font-bold text-[#0f1638]">{title}</h2>
      <p className="mt-2 text-sm text-gray-500">This section will be available in a future release.</p>
    </div>
  );
}

function SettingsView() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const activeSubTab: "webhooks" | "business" | "security" =
    tab === "business" ? "business" : tab === "security" ? "security" : "webhooks";

  const subTabs = [
    { key: "webhooks" as const, href: "/dashboard/settings", label: "WEBHOOKS" },
    { key: "business" as const, href: "/dashboard/settings?tab=business", label: "BUSINESS PROFILE" },
    { key: "security" as const, href: "/dashboard/settings?tab=security", label: "SECURITY" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <nav className="mb-8 flex flex-wrap gap-6 border-b border-gray-200 pb-0">
        {subTabs.map((tabItem) => {
          const isActive = activeSubTab === tabItem.key;
          return (
            <Link
              key={tabItem.key}
              href={tabItem.href}
              className={cn(
                "-mb-px border-b-2 pb-3 text-xs font-bold tracking-wide transition-colors",
                isActive ? "border-[#0f1638] text-[#0f1638]" : "border-transparent text-gray-400 hover:text-gray-600",
              )}
            >
              {tabItem.label}
            </Link>
          );
        })}
      </nav>

      {activeSubTab === "webhooks" && <SettingsWebhooksPanel />}
      {activeSubTab === "business" && <PlaceholderPanel title="Business profile" />}
      {activeSubTab === "security" && <PlaceholderPanel title="Security" />}
    </div>
  );
}

export { SettingsView };
