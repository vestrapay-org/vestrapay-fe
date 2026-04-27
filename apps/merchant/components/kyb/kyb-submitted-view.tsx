"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, ClipboardList, Clock, Code2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const NAVY = "#08083a";
const ICON_WRAP = "#fff8e6";
const AMBER_ICON = "#d97706";
const TIMELINE_CARD = "#f4f4f4";
const BODY_GRAY = "#666666";

export function KybSubmittedView() {
  return (
    <div className="flex justify-center py-4 md:py-8">
      <section
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-[0_20px_50px_-24px_rgba(8,8,58,0.18)] md:px-10 md:py-12"
        style={{ color: NAVY }}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="relative inline-flex rounded-xl p-4"
            style={{ backgroundColor: ICON_WRAP }}
            aria-hidden
          >
            <ClipboardList className="size-10" strokeWidth={1.75} style={{ color: AMBER_ICON }} />
            <span className="absolute -right-0.5 -bottom-0.5 flex size-7 items-center justify-center rounded-lg bg-[#fff8e6] shadow-sm ring-2 ring-white">
              <Clock className="size-4" strokeWidth={2.25} style={{ color: AMBER_ICON }} />
            </span>
          </div>

          <h1
            className="mt-6 text-2xl font-bold tracking-tight md:text-[1.65rem]"
            style={{ color: NAVY }}
          >
            Verification Under Review
          </h1>
          <p
            className="mt-3 max-w-lg text-sm leading-relaxed md:text-[0.95rem]"
            style={{ color: BODY_GRAY }}
          >
            Thank you for submitting your application. Our compliance team is currently reviewing
            your documents to ensure everything is in order.
          </p>

          <div className="mt-8 grid w-full gap-4 sm:grid-cols-2 sm:gap-5">
            <div
              className="rounded-xl p-5 text-left shadow-sm ring-1 ring-gray-100"
              style={{ backgroundColor: TIMELINE_CARD }}
            >
              <Clock
                className="size-5 shrink-0"
                strokeWidth={2}
                style={{ color: NAVY }}
                aria-hidden
              />
              <h2 className="mt-3 text-base font-bold" style={{ color: NAVY }}>
                Verification Timeline
              </h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: BODY_GRAY }}>
                Verification typically takes{" "}
                <strong className="font-bold" style={{ color: BODY_GRAY }}>
                  3-5 business days
                </strong>
                . We&apos;ll email you once it&apos;s complete.
              </p>
            </div>

            <div
              className="relative overflow-hidden rounded-xl p-5 text-left shadow-md ring-1 ring-black/5"
              style={{ backgroundColor: NAVY }}
            >
              <Code2
                className="pointer-events-none absolute -right-1 -bottom-1 size-24 rotate-12 text-white/[0.07]"
                strokeWidth={1}
                aria-hidden
              />
              <h2 className="relative m-0 text-base font-bold text-white">Explore Sandbox</h2>
              <p className="relative mt-2 text-sm leading-relaxed text-white/80">
                You can already start testing our APIs in Sandbox mode while we review your live
                application.
              </p>
              <Link
                href="https://docs.vestrapay.com"
                className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white underline-offset-2 hover:underline"
              >
                Open API Docs
                <ExternalLink className="size-3.5 shrink-0 opacity-90" aria-hidden />
              </Link>
            </div>
          </div>

          <Button
            asChild
            className="mt-10 h-12 min-w-[14rem] rounded-xl border-0 px-8 text-sm font-semibold text-white shadow-[0_10px_28px_-8px_rgba(8,8,58,0.45)] hover:brightness-110"
            style={{ backgroundColor: NAVY }}
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 no-underline"
            >
              Go to Dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
