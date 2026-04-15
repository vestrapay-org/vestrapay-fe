"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, ChevronDown, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KybDocumentUploadField } from "./kyb-document-upload-field";
import { formatFileSize } from "./kyb-format";
import { isKybOwnerComplete } from "./kyb-owner-utils";
import { createEmptyKybOwnerFields, useKybWizard, type KybOwnerFields } from "./kyb-wizard-context";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Canada",
  "Germany",
  "Other",
] as const;

const ID_DOCUMENT_TYPES = [
  "Passport",
  "Driver's license",
  "National ID",
  "Residence permit",
  "Other",
] as const;

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-gray-500 uppercase";

const sectionHeadingClass = "mt-6 text-xs font-semibold tracking-wide text-slate-500 first:mt-0";

const inputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-gray-400 focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--primary)_22%,transparent)]";

function sanitizeName(value: string): string {
  return value.replace(/[^a-zA-Z\s'-]/g, "");
}

function sanitizeDigits(value: string, maxLen?: number): string {
  const d = value.replace(/\D/g, "");
  return maxLen !== undefined ? d.slice(0, maxLen) : d;
}

function sanitizePostal(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s-]/g, "").slice(0, 16);
}

function sanitizeAddressLine(value: string): string {
  return value.replace(/[^\w\s\-#.,/'&()]/gi, "");
}

type OwnerKey = "primary" | "additional";

function OwnerSection({
  ownerKey,
  stepNumber,
  title,
  owner,
  onPatch,
  onRemove,
}: {
  ownerKey: OwnerKey;
  stepNumber: 1 | 2;
  title: string;
  owner: KybOwnerFields;
  onPatch: (patch: Partial<KybOwnerFields>) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/40 p-4 md:p-5">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-bold text-[var(--primary)] shadow-sm"
          aria-hidden
        >
          {stepNumber}
        </span>
        <h2 className="m-0 text-base font-bold text-slate-900">{title}</h2>
        {ownerKey === "additional" && onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto text-xs font-semibold text-gray-500 hover:text-red-600"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${ownerKey}-first`} className={labelClass}>
            Legal first name
          </label>
          <input
            id={`${ownerKey}-first`}
            required
            placeholder="e.g., John"
            autoComplete="given-name"
            className={inputClass}
            value={owner.legalFirstName}
            onChange={(e) => onPatch({ legalFirstName: sanitizeName(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-last`} className={labelClass}>
            Legal last name
          </label>
          <input
            id={`${ownerKey}-last`}
            required
            placeholder="e.g., Doe"
            autoComplete="family-name"
            className={inputClass}
            value={owner.legalLastName}
            onChange={(e) => onPatch({ legalLastName: sanitizeName(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-dob`} className={labelClass}>
            Date of birth
          </label>
          <input
            id={`${ownerKey}-dob`}
            type="date"
            required
            className={inputClass}
            value={owner.dateOfBirth}
            onChange={(e) => onPatch({ dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-ssn`} className={labelClass}>
            SSN / TIN (last 4 digits)
          </label>
          <input
            id={`${ownerKey}-ssn`}
            required
            inputMode="numeric"
            maxLength={4}
            placeholder="1234"
            autoComplete="off"
            className={inputClass}
            value={owner.ssnTinLast4}
            onChange={(e) => onPatch({ ssnTinLast4: sanitizeDigits(e.target.value, 4) })}
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-email`} className={labelClass}>
            Personal email
          </label>
          <input
            id={`${ownerKey}-email`}
            type="email"
            required
            placeholder="john.doe@example.com"
            autoComplete="email"
            className={inputClass}
            value={owner.personalEmail}
            onChange={(e) => onPatch({ personalEmail: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-phone`} className={labelClass}>
            Phone number
          </label>
          <input
            id={`${ownerKey}-phone`}
            type="tel"
            inputMode="numeric"
            required
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            className={inputClass}
            value={owner.personalPhone}
            onChange={(e) => onPatch({ personalPhone: sanitizeDigits(e.target.value) })}
          />
        </div>
      </div>

      <h3 className={sectionHeadingClass}>Residential address</h3>
      <div className="mt-3 grid gap-4">
        <div>
          <label htmlFor={`${ownerKey}-street`} className={labelClass}>
            Street address
          </label>
          <input
            id={`${ownerKey}-street`}
            required
            placeholder="123 Business Way"
            autoComplete="street-address"
            className={inputClass}
            value={owner.residentialStreet}
            onChange={(e) => onPatch({ residentialStreet: sanitizeAddressLine(e.target.value) })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ownerKey}-city`} className={labelClass}>
              City
            </label>
            <input
              id={`${ownerKey}-city`}
              required
              placeholder="San Francisco"
              autoComplete="address-level2"
              className={inputClass}
              value={owner.residentialCity}
              onChange={(e) => onPatch({ residentialCity: sanitizeName(e.target.value) })}
            />
          </div>
          <div>
            <label htmlFor={`${ownerKey}-state`} className={labelClass}>
              State / province
            </label>
            <input
              id={`${ownerKey}-state`}
              required
              placeholder="CA"
              autoComplete="address-level1"
              className={inputClass}
              value={owner.residentialState}
              onChange={(e) => onPatch({ residentialState: e.target.value.toUpperCase().slice(0, 32) })}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ownerKey}-postal`} className={labelClass}>
              Postal code
            </label>
            <input
              id={`${ownerKey}-postal`}
              required
              placeholder="94105"
              autoComplete="postal-code"
              className={inputClass}
              value={owner.residentialPostalCode}
              onChange={(e) => onPatch({ residentialPostalCode: sanitizePostal(e.target.value) })}
            />
          </div>
          <div>
            <label htmlFor={`${ownerKey}-res-country`} className={labelClass}>
              Country
            </label>
            <div className="relative">
              <select
                id={`${ownerKey}-res-country`}
                required
                value={owner.residentialCountry}
                onChange={(e) => onPatch({ residentialCountry: e.target.value })}
                className={cn(
                  inputClass,
                  "h-11 appearance-none pr-10",
                  owner.residentialCountry ? "text-gray-900" : "text-gray-400",
                )}
              >
                <option value="">Select country…</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <h3 className={sectionHeadingClass}>Citizenship &amp; documents</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${ownerKey}-cit`} className={labelClass}>
            Country of citizenship
          </label>
          <div className="relative">
            <select
              id={`${ownerKey}-cit`}
              required
              value={owner.citizenshipCountry}
              onChange={(e) => onPatch({ citizenshipCountry: e.target.value })}
              className={cn(
                inputClass,
                "h-11 appearance-none pr-10",
                owner.citizenshipCountry ? "text-gray-900" : "text-gray-400",
              )}
            >
              <option value="">Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        <div>
          <label htmlFor={`${ownerKey}-idtype`} className={labelClass}>
            ID document type
          </label>
          <div className="relative">
            <select
              id={`${ownerKey}-idtype`}
              required
              value={owner.idDocumentType}
              onChange={(e) => onPatch({ idDocumentType: e.target.value })}
              className={cn(
                inputClass,
                "h-11 appearance-none pr-10",
                owner.idDocumentType ? "text-gray-900" : "text-gray-400",
              )}
            >
              <option value="">Select ID type…</option>
              {ID_DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${ownerKey}-id-upload`} className={labelClass}>
            Upload ID document
          </label>
          <KybDocumentUploadField
            inputId={`${ownerKey}-id-upload`}
            hint="Front and back (if applicable) · PNG, JPG, or PDF · max 5MB"
            fileName={owner.idDocumentFileName}
            fileSize={owner.idDocumentFileSize}
            onSelect={(file) =>
              onPatch({
                idDocumentFileName: file.name,
                idDocumentFileSize: formatFileSize(file.size),
              })
            }
            onClear={() =>
              onPatch({
                idDocumentFileName: "",
                idDocumentFileSize: "",
              })
            }
            emptyIcon="cloud"
          />
        </div>
        <div>
          <label htmlFor={`${ownerKey}-poa-upload`} className={labelClass}>
            Upload proof of address
          </label>
          <KybDocumentUploadField
            inputId={`${ownerKey}-poa-upload`}
            hint="Utility bill or bank statement · last 3 months · max 5MB"
            fileName={owner.proofOfAddressFileName}
            fileSize={owner.proofOfAddressFileSize}
            onSelect={(file) =>
              onPatch({
                proofOfAddressFileName: file.name,
                proofOfAddressFileSize: formatFileSize(file.size),
              })
            }
            onClear={() =>
              onPatch({
                proofOfAddressFileName: "",
                proofOfAddressFileSize: "",
              })
            }
            emptyIcon="map-pin"
          />
        </div>
      </div>
    </div>
  );
}

function KybIdentityForm() {
  const router = useRouter();
  const { identity, setIdentity } = useKybWizard();

  const canSubmit = useMemo(() => {
    if (!isKybOwnerComplete(identity.primary)) return false;
    if (identity.additional && !isKybOwnerComplete(identity.additional)) return false;
    return true;
  }, [identity]);

  function patchOwner(ownerKey: OwnerKey, patch: Partial<KybOwnerFields>) {
    setIdentity((prev) => {
      if (ownerKey === "primary") {
        return { ...prev, primary: { ...prev.primary, ...patch } };
      }
      if (!prev.additional) return prev;
      return { ...prev, additional: { ...prev.additional, ...patch } };
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/dashboard/kyb/settlement");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
          Owner(s) / Director(s) identity verification
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Provide personal identification and contact details for all significant owners or directors.
        </p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <OwnerSection
          ownerKey="primary"
          stepNumber={1}
          title="Primary Owner / Director"
          owner={identity.primary}
          onPatch={(patch) => patchOwner("primary", patch)}
        />

        {identity.additional ? (
          <OwnerSection
            ownerKey="additional"
            stepNumber={2}
            title="Additional Owner / Director"
            owner={identity.additional}
            onPatch={(patch) => patchOwner("additional", patch)}
            onRemove={() => setIdentity((prev) => ({ ...prev, additional: null }))}
          />
        ) : null}

        <button
          type="button"
          onClick={() => setIdentity((prev) => ({ ...prev, additional: createEmptyKybOwnerFields() }))}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--primary)] hover:bg-gray-50/80"
        >
          <UserPlus className="size-4 text-[var(--primary)]" aria-hidden />
          Add another owner / director
        </button>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/kyb"
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

export { KybIdentityForm };
