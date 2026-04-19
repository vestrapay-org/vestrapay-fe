"use client";

import { Copy, ExternalLink, Eye, Lightbulb, Link2, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WEBHOOK_EVENTS = [
  {
    id: "payment.succeeded",
    label: "payment.succeeded",
    description: "Triggered when a payment is successful.",
    defaultChecked: true,
  },
  {
    id: "payment.failed",
    label: "payment.failed",
    description: "Triggered when a payment attempt fails.",
    defaultChecked: true,
  },
  {
    id: "customer.created",
    label: "customer.created",
    description: "Triggered when a new customer is added.",
    defaultChecked: false,
  },
  {
    id: "invoice.paid",
    label: "invoice.paid",
    description: "Triggered when an invoice is fully paid.",
    defaultChecked: true,
  },
  {
    id: "payout.successful",
    label: "payout.successful",
    description: "Triggered when a payout to your bank is successful.",
    defaultChecked: false,
  },
  {
    id: "chargeback.created",
    label: "chargeback.created",
    description: "Triggered when a dispute is opened.",
    defaultChecked: false,
  },
] as const;

export function WebhooksView() {
  const [secretVisible, setSecretVisible] = useState(false);
  const [events, setEvents] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEBHOOK_EVENTS.map((e) => [e.id, e.defaultChecked])),
  );

  const allSelected = WEBHOOK_EVENTS.every((e) => events[e.id]);
  const toggleSelectAll = () => {
    const next = !allSelected;
    setEvents(Object.fromEntries(WEBHOOK_EVENTS.map((e) => [e.id, next])));
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl">
      <div className="mb-6 flex min-w-0 flex-col gap-4 rounded-lg border border-indigo-100 bg-[#E8EAF6] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p className="text-sm text-[#0f1638]">
          <span className="mr-1 font-semibold">•</span>
          Live Mode is Active. Your applications are now receiving real-time event notifications.
        </p>
        <span className="shrink-0 self-start rounded bg-[#0f1638] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white sm:self-auto">
          Production
        </span>
      </div>

      <div className="mb-8 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1638]">Webhook Endpoints</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configure where Vestrapay should send HTTP POST notifications for events in your account.
          </p>
        </div>
        <Button
          type="button"
          className="h-11 shrink-0 gap-2 rounded-lg border-0 bg-[#0f1638] px-5 text-sm font-semibold text-white hover:brightness-110"
        >
          <Plus className="size-4" strokeWidth={2.5} />
          Create New Webhook
        </Button>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-[#0f1638]">Endpoint Configuration</h3>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
              Editing live webhook
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Endpoint URL
              </label>
              <Input
                className="h-11 rounded-lg border-gray-200 bg-gray-100 font-mono text-sm"
                defaultValue="https://api.acmecorp.com/webhooks/vestrapay"
              />
              <p className="mt-1.5 text-xs text-gray-500">Must be a secure HTTPS URL.</p>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Secret Key
              </label>
              <div className="relative">
                <Input
                  type={secretVisible ? "text" : "password"}
                  readOnly
                  className="h-11 rounded-lg border-gray-200 bg-gray-100 pr-24 font-mono text-sm tracking-wider"
                  defaultValue="whsec_live_acme_obfuscated_secret_key"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-[#0f1638]"
                    aria-label="Copy secret"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSecretVisible((v) => !v)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-200 hover:text-[#0f1638]"
                    aria-label={secretVisible ? "Hide secret" : "Show secret"}
                  >
                    <Eye className="size-4" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Use this secret to verify that the webhook is sent by Vestrapay.</p>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Events to listen to</p>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Select All
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {WEBHOOK_EVENTS.map((ev) => (
                  <label
                    key={ev.id}
                    className="flex cursor-pointer gap-3 rounded-lg border border-gray-100 bg-gray-50/90 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={events[ev.id] ?? false}
                      onChange={() => setEvents((s) => ({ ...s, [ev.id]: !s[ev.id] }))}
                      className="mt-0.5 size-4 shrink-0 rounded border-gray-300"
                      style={{ accentColor: "#0f1638" }}
                    />
                    <span className="min-w-0">
                      <span className="block font-mono text-sm font-semibold text-[#0f1638]">{ev.label}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-gray-500">{ev.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="text-sm font-medium text-gray-500 hover:text-gray-800">
              Delete Endpoint
            </button>
            <Button
              type="button"
              className="h-11 w-full rounded-lg border-0 bg-[#0f1638] text-sm font-semibold text-white hover:brightness-110 sm:w-auto sm:min-w-[160px]"
            >
              Save Changes
            </Button>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <aside className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-[#0f1638]">Your Webhooks</h3>
            <ul className="space-y-2">
              <li
                className={cn(
                  "flex gap-3 rounded-lg border border-transparent bg-gray-100 p-3",
                )}
              >
                <Link2 className="mt-0.5 size-4 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium text-[#0f1638]">api.acmecorp.com/…</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">Live • 4 events</p>
                </div>
              </li>
              <li className="flex gap-3 rounded-lg border border-gray-100 p-3">
                <Link2 className="mt-0.5 size-4 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium text-gray-700">staging.acmecorp.io/…</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">Sandbox • 8 events</p>
                </div>
              </li>
            </ul>
          </aside>

          <aside className="rounded-lg bg-[#0f1638] p-5 text-white shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-md bg-white/10">
                <Lightbulb className="size-5 text-sky-300" />
              </span>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-200">Developer tip</h3>
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              Always return a{" "}
              <code className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-xs text-sky-200">200 OK</code> response
              code quickly. To prevent timeouts, perform complex processing asynchronously after acknowledging the receipt
              of the webhook.
            </p>
            <Link
              href="https://docs.vestrapay.com"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:underline"
            >
              View Documentation
              <ExternalLink className="size-3.5" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
