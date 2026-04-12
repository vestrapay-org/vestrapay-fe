"use client";

import Link from "next/link";
import React from "react";
import { ExternalLink } from "lucide-react";

type KybVerificationSidebarProps = {
  variant?: "default" | "review";
};

function KybVerificationSidebar({ variant = "default" }: KybVerificationSidebarProps) {
  const isReview = variant === "review";

  return (
    <aside className="flex w-full flex-col gap-4 lg:max-w-sm">
      <section className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
        <h2 className="m-0 text-[0.65rem] font-bold tracking-[0.14em] text-gray-500 uppercase">Verification tiers</h2>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 pl-3 shadow-sm">
            <div className="border-l-4 border-[var(--primary)] pl-3">
              <p className="m-0 text-xs font-bold text-[var(--primary)] uppercase">Tier 1 KYB</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Required for processing up to $10k monthly. Completion of{" "}
                <span className="font-semibold text-slate-900">Steps 1–3</span> is mandatory.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 pl-3 shadow-sm">
            <div className="border-l-4 border-gray-200 pl-3">
              <p className="m-0 text-xs font-bold text-gray-600 uppercase">Tier 2 KYB</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                Full access for unlimited processing. Completion of{" "}
                <span className="font-semibold text-slate-900">all 5 steps</span> required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isReview ? (
        <section className="rounded-xl bg-[var(--primary)] p-5 text-white shadow-md">
          <h2 className="m-0 text-base font-semibold">Final check</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Ensure uploaded documents match the legal business details you entered. Mismatches can delay approval.
          </p>
          <Link
            href="#"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-2 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Review guidelines
            <ExternalLink className="size-3.5 shrink-0 opacity-90" aria-hidden />
          </Link>
        </section>
      ) : (
        <section className="rounded-xl bg-[var(--primary)] p-5 text-white shadow-md">
          <h2 className="m-0 text-base font-semibold">Need assistance?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Our compliance team can help you complete KYB requirements and interpret document requests.
          </p>
          <Link
            href="#"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-2 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            View compliance docs
            <ExternalLink className="size-3.5 shrink-0 opacity-90" aria-hidden />
          </Link>
        </section>
      )}
    </aside>
  );
}

export { KybVerificationSidebar };
