"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, ClipboardList, ExternalLink, LayoutDashboard, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

function KybSubmittedView() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start">
      <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div
            className="flex size-14 items-center justify-center rounded-xl bg-indigo-50 text-[var(--primary)] shadow-sm ring-1 ring-indigo-100"
            aria-hidden
          >
            <ClipboardList className="size-7" strokeWidth={2} />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#0a0c2c] md:text-3xl">
            We&apos;ve received your verification request
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
            Thank you for submitting your details. Our team will review your application and reach out if we need
            anything else. You can keep using your dashboard while we work through this in the background.
          </p>

          <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-5 text-left shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-white text-[var(--primary)] shadow-sm ring-1 ring-gray-100">
                <LayoutDashboard className="size-5" aria-hidden />
              </div>
              <h2 className="mt-4 text-xs font-bold tracking-[0.12em] text-[#0a0c2c]">YOUR DASHBOARD</h2>
              <p className="mt-2 text-sm text-gray-600">Explore tools, transactions, and settings while we review.</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-5 text-left shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-md bg-white text-[var(--primary)] shadow-sm ring-1 ring-gray-100">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <h2 className="mt-4 text-xs font-bold tracking-[0.12em] text-[#0a0c2c]">WHAT HAPPENS NEXT</h2>
              <p className="mt-2 text-sm text-gray-600">We&apos;ll email you if we need additional documents or clarifications.</p>
            </div>
          </div>

          <Button
            asChild
            className="mt-10 h-12 min-w-[14rem] rounded-lg border-0 bg-[#0a0c2c] px-8 text-sm font-semibold text-white shadow-md hover:brightness-110"
          >
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 no-underline">
              Go to Dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      <aside className="flex w-full flex-col gap-4 lg:max-w-sm">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-gray-500 uppercase">What to expect</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Reviews are typically completed within a few business days. If you have questions about your submission, use
            Support from the dashboard header.
          </p>
        </section>

        <section className="rounded-xl bg-gradient-to-br from-[#0a0c2c] via-[#121a4a] to-[#1e2b6e] p-5 text-white shadow-md">
          <h2 className="m-0 text-base font-semibold">Prepare for go-live</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            While you wait, you can review integration guides and keep building in Sandbox. When you&apos;re ready for
            production, you&apos;ll complete the final activation steps in the dashboard.
          </p>
          <Link
            href="/dashboard/api-keys"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-2 hover:underline"
          >
            Open API keys
            <ExternalLink className="size-3.5 shrink-0 opacity-90" aria-hidden />
          </Link>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-[#102a58] via-[#1e5b8f] to-[#6fb9d8] p-0 shadow-sm">
          <div className="h-36 w-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.35),transparent_36%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(130deg,rgba(7,18,45,0.9),rgba(18,120,165,0.65))]" />
        </section>
      </aside>
    </div>
  );
}

export { KybSubmittedView };
