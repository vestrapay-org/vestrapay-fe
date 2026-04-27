"use client";

import { AlertTriangle, BookOpen, Copy, Eye, EyeOff, ShieldCheck, XSquare } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ApiKeysView() {
  const [secretVisible, setSecretVisible] = useState(false);

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl">
      <div className="mb-8 flex gap-4 rounded-lg border border-amber-200/80 bg-amber-50/90 p-4 md:p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-amber-100">
          <AlertTriangle className="size-6 text-amber-600" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-amber-900">Security Warning: Keep your Secret Keys private</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/80">
            API keys grant full access to your account. Never share them in public repositories (like GitHub), client-side
            code, or with unauthorized personnel. Vestrapay staff will never ask for your secret keys. If a key is
            compromised, revoke it immediately.
          </p>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f1638]">Public API Keys</h2>
            <p className="mt-1 text-sm text-gray-500">Used for client-side authentication in the Sandbox environment.</p>
          </div>
          <Button
            type="button"
            className="h-10 shrink-0 gap-2 rounded-lg border-0 bg-[#0f1638] px-4 text-sm font-semibold text-white hover:brightness-110"
          >
            + Generate New Public Key
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sandbox public key</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Input
                readOnly
                className="h-11 flex-1 rounded-md border-gray-200 bg-gray-100 font-mono text-sm"
                defaultValue="pk_test_51MzE2SBy9QfL7hXvY8oW2pM4qN5x"
              />
              <button
                type="button"
                className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="Copy public key"
              >
                <Copy className="size-4" />
              </button>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-6 text-sm lg:border-l lg:border-gray-100 lg:pl-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Generated on</p>
                <p className="mt-1 font-medium text-[#0f1638]">Oct 12, 2023</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Last used</p>
                <p className="mt-1 font-medium text-[#0f1638]">2 hours ago</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900"
            >
              <XSquare className="size-4" />
              Revoke Public Key
            </button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0f1638]">Secret API Keys</h2>
            <p className="mt-1 text-sm text-gray-500">
              Used for server-side requests. <span className="font-semibold text-amber-700">Keep this key hidden.</span>
            </p>
          </div>
          <Button
            type="button"
            className="h-10 shrink-0 gap-2 rounded-lg border-0 bg-[#0f1638] px-4 text-sm font-semibold text-white hover:brightness-110"
          >
            + Generate New Secret Key
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Sandbox secret key</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Input
                  readOnly
                  type={secretVisible ? "text" : "password"}
                  className={cn(
                    "h-11 w-full rounded-md border-gray-200 bg-gray-100 pr-24 font-mono text-sm",
                    !secretVisible && "tracking-widest",
                  )}
                  defaultValue="sk_test_51MzE2SBy9QfL7hXvY8oW2pM4qN5x_end"
                />
                <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setSecretVisible((v) => !v)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-200"
                    aria-label={secretVisible ? "Hide secret key" : "Show secret key"}
                  >
                    {secretVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="flex size-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                aria-label="Copy secret key"
              >
                <Copy className="size-4" />
              </button>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-6 text-sm lg:border-l lg:border-gray-100 lg:pl-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Generated on</p>
                <p className="mt-1 font-medium text-[#0f1638]">Oct 12, 2023</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Last used</p>
                <p className="mt-1 font-medium text-[#0f1638]">4 minutes ago</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-end border-t border-gray-100 pt-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900"
            >
              <span className="inline-flex size-4 items-center justify-center rounded-full border-2 border-amber-600 text-[10px] leading-none">
                −
              </span>
              Revoke Secret Key
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="https://docs.vestrapay.com"
          className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-sky-100">
            <BookOpen className="size-5 text-sky-700" />
          </div>
          <div>
            <h3 className="font-bold text-[#0f1638]">API Documentation</h3>
            <p className="mt-1 text-sm text-gray-500">Detailed implementation guides and SDKs.</p>
          </div>
        </Link>
        <Link
          href="https://docs.vestrapay.com/security"
          className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-emerald-100">
            <ShieldCheck className="size-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-[#0f1638]">Security Best Practices</h3>
            <p className="mt-1 text-sm text-gray-500">Learn how to keep your integration secure.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
