"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useKybWizard } from "./kyb-wizard-context";

const BUSINESS_TYPES = [
  "Sole proprietorship",
  "Partnership",
  "LLC",
  "Private limited company",
  "Corporation",
  "Non-profit",
  "Other",
] as const;

const INDUSTRIES = [
  "Financial services",
  "Retail & e-commerce",
  "Technology & SaaS",
  "Healthcare",
  "Food & hospitality",
  "Logistics",
  "Professional services",
  "Other",
] as const;

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-gray-500 uppercase";

const inputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-gray-400 focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--primary)_22%,transparent)]";

function sanitizeLegalBusinessName(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s\-.,'&()]/g, "");
}

function sanitizeCityState(value: string): string {
  return value.replace(/[^a-zA-Z\s-]/g, "");
}

function sanitizePhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function sanitizeAddress(value: string): string {
  return value.replace(/[^\w\s\-#.,/'&()]/gi, "");
}

function isValidWebsite(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  const href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const parsed = new URL(href);
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

function KybBusinessInfoForm() {
  const router = useRouter();
  const { business, setBusiness } = useKybWizard();

  const canSubmit = useMemo(() => {
    return (
      business.legalBusinessName.trim().length > 0 &&
      business.businessType.length > 0 &&
      business.registeredAddress.trim().length > 0 &&
      business.city.trim().length > 0 &&
      business.state.trim().length > 0 &&
      business.phone.trim().length > 0 &&
      isValidWebsite(business.website) &&
      business.industry.length > 0
    );
  }, [business]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/dashboard/kyb/identity");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Business information</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Provide the foundational details of your enterprise for legal verification.
        </p>
      </header>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="legalBusinessName" className={labelClass}>
            Legal business name
          </label>
          <input
            id="legalBusinessName"
            name="legalBusinessName"
            required
            placeholder="e.g., Sovereign Ledger Ltd."
            autoComplete="organization"
            className={inputClass}
            value={business.legalBusinessName}
            onChange={(e) =>
              setBusiness((prev) => ({ ...prev, legalBusinessName: sanitizeLegalBusinessName(e.target.value) }))
            }
          />
        </div>

        <div>
          <label htmlFor="businessType" className={labelClass}>
            Business type
          </label>
          <div className="relative">
            <select
              id="businessType"
              name="businessType"
              required
              value={business.businessType}
              onChange={(e) => setBusiness((prev) => ({ ...prev, businessType: e.target.value }))}
              className={cn(
                inputClass,
                "h-11 appearance-none pr-10",
                business.businessType ? "text-gray-900" : "text-gray-400",
              )}
            >
              <option value="">Select structure…</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label htmlFor="registeredAddress" className={labelClass}>
            Registered address
          </label>
          <input
            id="registeredAddress"
            name="registeredAddress"
            required
            placeholder="Street name and suite number"
            autoComplete="street-address"
            className={inputClass}
            value={business.registeredAddress}
            onChange={(e) =>
              setBusiness((prev) => ({ ...prev, registeredAddress: sanitizeAddress(e.target.value) }))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              id="city"
              name="city"
              required
              placeholder="City"
              autoComplete="address-level2"
              className={inputClass}
              value={business.city}
              onChange={(e) => setBusiness((prev) => ({ ...prev, city: sanitizeCityState(e.target.value) }))}
            />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>
              State / province
            </label>
            <input
              id="state"
              name="state"
              required
              placeholder="State"
              autoComplete="address-level1"
              className={inputClass}
              value={business.state}
              onChange={(e) => setBusiness((prev) => ({ ...prev, state: sanitizeCityState(e.target.value) }))}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              placeholder="+1 (555) 0000000"
              autoComplete="tel"
              className={inputClass}
              value={business.phone}
              onChange={(e) =>
                setBusiness((prev) => ({ ...prev, phone: sanitizePhoneDigits(e.target.value) }))
              }
            />
          </div>
          <div>
            <label htmlFor="website" className={labelClass}>
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              required
              placeholder="https://example.com"
              autoComplete="url"
              className={inputClass}
              value={business.website}
              onChange={(e) => setBusiness((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label htmlFor="industry" className={labelClass}>
            Industry category
          </label>
          <div className="relative">
            <select
              id="industry"
              name="industry"
              required
              value={business.industry}
              onChange={(e) => setBusiness((prev) => ({ ...prev, industry: e.target.value }))}
              className={cn(
                inputClass,
                "h-11 appearance-none pr-10",
                business.industry ? "text-gray-900" : "text-gray-400",
              )}
            >
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-11 min-w-[10rem] rounded-lg border-0 bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save &amp; continue
          </Button>
        </div>
      </form>
    </section>
  );
}

export { KybBusinessInfoForm };
