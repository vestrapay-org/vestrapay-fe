"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, ChevronDown, CloudUpload } from "lucide-react";

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

const BUSINESS_CATEGORIES = [
  "Retail & e-commerce",
  "Food & hospitality",
  "Professional services",
  "Technology & SaaS",
  "Healthcare",
  "Education",
  "Logistics & transport",
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

function sanitizeAlphaNumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, "");
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
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
      business.businessRegistrationNumber.trim().length > 0 &&
      business.taxIdentificationNumber.trim().length > 0 &&
      business.registeredAddress.trim().length > 0 &&
      business.city.trim().length > 0 &&
      business.state.trim().length > 0 &&
      business.phone.trim().length > 0 &&
      isValidWebsite(business.website) &&
      business.industry.length > 0 &&
      business.businessRegistrationCertificateFileName.length > 0 &&
      business.businessProofOfAddressFileName.length > 0
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
          <label htmlFor="businessRegistrationNumber" className={labelClass}>
            Business registration number
          </label>
          <input
            id="businessRegistrationNumber"
            name="businessRegistrationNumber"
            required
            placeholder="Enter registration number"
            className={inputClass}
            value={business.businessRegistrationNumber}
            onChange={(e) =>
              setBusiness((prev) => ({ ...prev, businessRegistrationNumber: sanitizeAlphaNumeric(e.target.value) }))
            }
          />
        </div>

        <div>
          <label htmlFor="taxIdentificationNumber" className={labelClass}>
            Tax identity number (TIN)
          </label>
          <input
            id="taxIdentificationNumber"
            name="taxIdentificationNumber"
            required
            placeholder="Enter TIN"
            className={inputClass}
            value={business.taxIdentificationNumber}
            onChange={(e) =>
              setBusiness((prev) => ({ ...prev, taxIdentificationNumber: sanitizeAlphaNumeric(e.target.value) }))
            }
          />
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
            Business category
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
              <option value="">Select category…</option>
              {BUSINESS_CATEGORIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <label htmlFor="businessRegistrationCertificateUpload" className={labelClass}>
            Business registration certificate
          </label>
          <label
            htmlFor="businessRegistrationCertificateUpload"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <CloudUpload className="size-5 text-gray-400" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-gray-500">PDF, JPG or PNG (max. 5MB)</p>
            {business.businessRegistrationCertificateFileName ? (
              <p className="mt-2 text-xs font-medium text-[var(--primary)]">
                {business.businessRegistrationCertificateFileName}
                {business.businessRegistrationCertificateFileSize
                  ? ` · ${business.businessRegistrationCertificateFileSize}`
                  : ""}
              </p>
            ) : null}
          </label>
          <input
            id="businessRegistrationCertificateUpload"
            type="file"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusiness((prev) => ({
                ...prev,
                businessRegistrationCertificateFileName: file.name,
                businessRegistrationCertificateFileSize: formatFileSize(file.size),
              }));
            }}
          />
        </div>

        <div>
          <label htmlFor="businessProofOfAddressUpload" className={labelClass}>
            Business proof of address
          </label>
          <label
            htmlFor="businessProofOfAddressUpload"
            className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <CloudUpload className="size-5 text-gray-400" aria-hidden />
            <p className="mt-2 text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
            <p className="mt-1 text-xs text-gray-500">Utility bill or bank statement (PDF, JPG, PNG max. 5MB)</p>
            {business.businessProofOfAddressFileName ? (
              <p className="mt-2 text-xs font-medium text-[var(--primary)]">
                {business.businessProofOfAddressFileName}
                {business.businessProofOfAddressFileSize ? ` · ${business.businessProofOfAddressFileSize}` : ""}
              </p>
            ) : null}
          </label>
          <input
            id="businessProofOfAddressUpload"
            type="file"
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusiness((prev) => ({
                ...prev,
                businessProofOfAddressFileName: file.name,
                businessProofOfAddressFileSize: formatFileSize(file.size),
              }));
            }}
          />
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
