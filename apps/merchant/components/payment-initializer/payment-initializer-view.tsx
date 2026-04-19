"use client";

import {
  Building2,
  ChevronDown,
  CloudUpload,
  CreditCard,
  ExternalLink,
  Grid3x3,
  Lock,
  Smartphone,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

const INK = "#0C0644";

type ChannelId = "card" | "bank" | "ussd" | "mobile";

const CHANNELS: { id: ChannelId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] =
  [
    { id: "card", label: "Card", icon: CreditCard },
    { id: "bank", label: "Bank", icon: Building2 },
    { id: "ussd", label: "USSD", icon: Grid3x3 },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ];

type CodeTab = "javascript" | "react" | "curl";

const CODE_SNIPPETS: Record<Exclude<CodeTab, "javascript">, string> = {
  react: `import { useVestrapay } from '@vestrapay/react';

export function PayButton() {
  const { initialize } = useVestrapay({ publicKey: 'pk_test_8842...22' });
  return (
    <button onClick={() => initialize({ amount: 2500000, currency: 'NGN' })}>
      Pay now
    </button>
  );
}`,
  curl: `curl https://api.vestrapay.com/v1/initialize \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{"email":"customer@example.com","amount":2500000,"currency":"NGN"}'`,
};

function JavascriptSnippet() {
  return (
    <pre className="m-0 overflow-x-auto p-4 font-mono text-[0.7rem] leading-relaxed sm:text-[0.75rem]">
      <code>
        <span className="text-violet-300">const</span>
        <span className="text-slate-200"> payment = </span>
        <span className="text-sky-300">Vestrapay</span>
        <span className="text-slate-200">.</span>
        <span className="text-sky-300">initialize</span>
        <span className="text-slate-200">{"({\n  "}</span>
        <span className="text-slate-300">key</span>
        <span className="text-slate-200">: </span>
        <span className="text-emerald-400">&apos;pk_test_8842...22&apos;</span>
        <span className="text-slate-200">,</span>
        <span className="text-slate-200">{"\n  "}</span>
        <span className="text-slate-300">email</span>
        <span className="text-slate-200">: </span>
        <span className="text-emerald-400">&apos;customer@example.com&apos;</span>
        <span className="text-slate-200">,</span>
        <span className="text-slate-200">{"\n  "}</span>
        <span className="text-slate-300">amount</span>
        <span className="text-slate-200">: </span>
        <span className="text-amber-400">2500000</span>
        <span className="text-slate-200">, </span>
        <span className="text-slate-500">{"// amount in kobo"}</span>
        <span className="text-slate-200">{"\n  "}</span>
        <span className="text-slate-300">currency</span>
        <span className="text-slate-200">: </span>
        <span className="text-emerald-400">&apos;NGN&apos;</span>
        <span className="text-slate-200">,</span>
        <span className="text-slate-200">{"\n  "}</span>
        <span className="text-slate-300">channels</span>
        <span className="text-slate-200">: </span>
        <span className="text-slate-200">[</span>
        <span className="text-emerald-400">&apos;card&apos;</span>
        <span className="text-slate-200">, </span>
        <span className="text-emerald-400">&apos;bank&apos;</span>
        <span className="text-slate-200">],</span>
        <span className="text-slate-200">{"\n  "}</span>
        <span className="text-slate-300">onSuccess</span>
        <span className="text-slate-200">: (response) =&gt; {"{\n    "}</span>
        <span className="text-sky-300">console</span>
        <span className="text-slate-200">.</span>
        <span className="text-sky-300">log</span>
        <span className="text-slate-200">(response.reference);</span>
        <span className="text-slate-200">{"\n  }\n});"}</span>
      </code>
    </pre>
  );
}

function ChannelCard({
  id,
  label,
  Icon,
  selected,
  onToggle,
}: {
  id: ChannelId;
  label: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  selected: boolean;
  onToggle: (id: ChannelId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-lg border-2 px-3 py-4 transition-colors sm:px-4",
        selected
          ? "border-[#0C0644] bg-white text-[#0C0644] shadow-sm"
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
      )}
    >
      <Icon className={cn("size-6", selected ? "text-[#0C0644]" : "text-gray-500")} strokeWidth={2} aria-hidden />
      <span className={cn("text-xs font-bold sm:text-sm", selected ? "text-[#0C0644]" : "text-gray-500")}>{label}</span>
    </button>
  );
}

export function PaymentInitializerView() {
  const [channels, setChannels] = React.useState<Set<ChannelId>>(() => new Set(["card", "bank"]));
  const [brandColor, setBrandColor] = React.useState(INK);
  const [codeTab, setCodeTab] = React.useState<CodeTab>("javascript");
  const [currency, setCurrency] = React.useState("NGN");
  const [description, setDescription] = React.useState("");
  const [previewChannel, setPreviewChannel] = React.useState<"card" | "bank" | "ussd" | "mobile">("card");

  const toggleChannel = (id: ChannelId) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1600px]">
      <div className="mb-6 md:mb-8">
        <p className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-gray-400 uppercase">Checkout configuration</p>
        <h1 className="m-0 mt-1 text-2xl font-bold tracking-tight md:text-[1.65rem]" style={{ color: INK }}>
          Customize your interface
        </h1>
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,480px)] xl:gap-10">
        <div className="min-w-0 space-y-8">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="pi-logo-input">
                Business Logo
              </label>
              <label
                htmlFor="pi-logo-input"
                className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 transition-colors hover:border-gray-300 hover:bg-gray-50/90 md:min-h-[220px]"
              >
                <input id="pi-logo-input" type="file" accept="image/png,image/jpeg" className="sr-only" />
                <CloudUpload className="size-10 text-gray-400" strokeWidth={1.5} aria-hidden />
                <span className="mt-3 text-sm font-medium text-gray-500">PNG, JPG up to 2MB</span>
              </label>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="pi-currency">
                  Currency
                </label>
                <div className="relative">
                  <select
                    id="pi-currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-gray-100 px-4 pr-10 text-sm font-semibold text-gray-900 outline-none transition-colors focus:border-[#0C0644]/40 focus:bg-white focus:ring-2 focus:ring-[#0C0644]/15"
                  >
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500"
                    aria-hidden
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="pi-desc">
                  Payment Description
                </label>
                <textarea
                  id="pi-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="e.g. Order #8829 - Luxury Leather Goods"
                  className="min-h-[120px] w-full resize-y rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-colors focus:border-[#0C0644]/40 focus:bg-white focus:ring-2 focus:ring-[#0C0644]/15 md:min-h-[140px]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-800" htmlFor="pi-brand">
                Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="pi-brand-swatch"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="size-10 shrink-0 cursor-pointer overflow-hidden rounded-md border border-gray-200 p-0.5 md:size-11"
                  aria-label="Pick brand color"
                />
                <input
                  id="pi-brand"
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-100 px-4 font-mono text-sm font-semibold uppercase text-gray-900 outline-none transition-colors focus:border-[#0C0644]/40 focus:bg-white focus:ring-2 focus:ring-[#0C0644]/15"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <p className="mb-3 text-sm font-semibold text-gray-800">Active Channels</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {CHANNELS.map((ch) => (
                  <ChannelCard
                    key={ch.id}
                    id={ch.id}
                    label={ch.label}
                    Icon={ch.icon}
                    selected={channels.has(ch.id)}
                    onToggle={toggleChannel}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-gray-100 pt-8">
            <p className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase">Implementation</p>
            <h2 className="m-0 text-lg font-bold tracking-tight" style={{ color: INK }}>
              Web integration
            </h2>
            <div
              className="inline-flex rounded-full border border-gray-200 bg-gray-100 p-0.5"
              role="tablist"
              aria-label="Integration format"
            >
              {(
                [
                  { id: "javascript" as const, label: "JavaScript" },
                  { id: "react" as const, label: "React" },
                  { id: "curl" as const, label: "cURL" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={codeTab === t.id}
                  onClick={() => setCodeTab(t.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-bold transition-colors sm:px-5",
                    codeTab === t.id ? "bg-gray-700 text-white shadow-sm" : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#1e1e2e] shadow-md">
              {codeTab === "javascript" ? (
                <JavascriptSnippet />
              ) : (
                <pre className="m-0 overflow-x-auto p-4 font-mono text-[0.7rem] leading-relaxed text-slate-200 sm:text-[0.75rem]">
                  <code>{CODE_SNIPPETS[codeTab]}</code>
                </pre>
              )}
            </div>
          </section>
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[0.65rem] font-bold tracking-wide text-[#0C0644] uppercase">
              Live preview
            </span>
          </div>

          <div className="rounded-2xl bg-[#ececef] p-4 shadow-inner sm:p-6 lg:p-5">
            <div className="mx-auto max-w-[380px] overflow-hidden rounded-2xl border border-gray-100/80 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
              <div className="border-b border-gray-100 px-5 pb-4 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      V
                    </div>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-gray-900">Payment for Vestrapay Order</p>
                      <p className="m-0 mt-0.5 text-xs text-gray-500">Order #8829</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="m-0 text-[0.6rem] font-bold tracking-wide text-gray-400 uppercase">Amount</p>
                    <p className="m-0 text-lg font-bold tracking-tight sm:text-xl" style={{ color: brandColor }}>
                      ₦25,000.00
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="rounded-md bg-orange-500 px-2.5 py-1 text-[0.6rem] font-bold tracking-wide text-white uppercase">
                    Test mode
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-100 px-2">
                <div className="flex gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-0 [&::-webkit-scrollbar]:hidden">
                  {(
                    [
                      { id: "card" as const, label: "Card" },
                      { id: "bank" as const, label: "Bank Transfer" },
                      { id: "ussd" as const, label: "USSD" },
                      { id: "mobile" as const, label: "Mobile Money" },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPreviewChannel(tab.id)}
                      className={cn(
                        "shrink-0 border-b-2 px-3 py-3 text-xs font-bold transition-colors sm:px-4 sm:text-sm",
                        previewChannel === tab.id ? "" : "border-transparent text-gray-400 hover:text-gray-600",
                      )}
                      style={
                        previewChannel === tab.id
                          ? { borderBottomColor: brandColor, color: brandColor }
                          : undefined
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {previewChannel === "card" ? (
                <div className="space-y-4 px-5 py-5">
                  <div>
                    <label className="mb-1.5 block text-[0.6rem] font-bold tracking-wide text-gray-400 uppercase">
                      Card number
                    </label>
                    <div className="relative">
                      <input
                        readOnly
                        className="h-11 w-full rounded-lg border border-gray-200 bg-[#f4f4f6] px-3 pr-20 font-mono text-sm font-medium text-gray-800"
                        defaultValue="4242 4242 4242 4242"
                      />
                      <span className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        <span className="size-5 rounded bg-[#eb001b]" title="Mastercard" aria-hidden />
                        <span className="size-5 rounded bg-[#1434cb]" title="Visa" aria-hidden />
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[0.6rem] font-bold tracking-wide text-gray-400 uppercase">
                        Expiry date
                      </label>
                      <input
                        readOnly
                        className="h-11 w-full rounded-lg border border-gray-200 bg-[#f4f4f6] px-3 font-mono text-sm text-gray-800"
                        defaultValue="12 / 24"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.6rem] font-bold tracking-wide text-gray-400 uppercase">
                        CVV
                      </label>
                      <input
                        readOnly
                        className="h-11 w-full rounded-lg border border-gray-200 bg-[#f4f4f6] px-3 font-mono text-sm tracking-widest text-gray-800"
                        defaultValue="•••"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-10 text-center text-sm text-gray-500">
                  Preview for {previewChannel} — connect channels in configuration.
                </div>
              )}

              <div className="px-5 pb-5">
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
                  style={{ backgroundColor: brandColor }}
                >
                  Pay ₦25,000.00
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 py-3 text-[0.65rem] text-gray-400">
                <Lock className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
                <span>Secured by Vestrapay Technology</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-gray-200/80 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-gray-500">
                <span className="size-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                Rendering real-time
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 font-semibold text-[#0C0644] hover:underline"
              >
                Open in new tab
                <ExternalLink className="size-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
